use super::*;

use firestore::errors::{
    FirestoreDataNotFoundError, FirestoreError, FirestoreErrorPublicGenericDetails,
};
use firestore::select_builder::FirestoreSelectDocBuilder;
use firestore::*;
use futures::stream::BoxStream;
use futures::StreamExt;

#[derive(Debug, Clone)]
pub struct DpgpFirestore {
    inner: FirestoreDb,
}

impl DpgpFirestore {
    pub fn with_db(db: FirestoreDb) -> Self {
        Self { inner: db }
    }

    fn select_user_doc(&self, collection: &str) -> FirestoreSelectDocBuilder<FirestoreDb> {
        self.inner
            .fluent()
            .select()
            .fields(
                paths!(User::{full_name, email, nickname, motto, enrollments, facebook, discord }),
            ) // the API does not allow to miss any field
            .from(collection)
    }

    async fn user_by_exact_name(
        &self,
        full_name: &str,
        collection: &str,
    ) -> FirestoreResult<Option<User>> {
        // Query as a stream our data
        let object_stream: BoxStream<User> = self
            .select_user_doc(collection)
            .filter(|q| q.for_all([q.field(path!(User::full_name)).eq(full_name)]))
            .obj() // Reading documents as structures using Serde gRPC deserializer
            .stream_query()
            .await?;

        let users = object_stream.collect::<Vec<User>>().await;

        Ok(users.into_iter().next())
    }

    async fn user_by_discord(
        &self,
        discord: &Discord,
        collection: &str,
    ) -> FirestoreResult<Option<User>> {
        // Query as a stream our data
        let object_stream: BoxStream<User> = self
            .select_user_doc(collection)
            .filter(|q| q.for_all([q.field(path!(User::discord)).eq(Some(discord))]))
            .obj() // Reading documents as structures using Serde gRPC deserializer
            .stream_query()
            .await?;

        let users = object_stream.collect::<Vec<User>>().await;

        Ok(users.into_iter().next())
    }

    async fn find_user(&self, lookup: &UserLookup, collection: &str) -> FirestoreResult<User> {
        self.user(&lookup, collection)
            .await?
            .context(format!(
                "No user found with lookup: {} in collection: {}",
                lookup, collection
            ))
            .map_err(|e| data_not_found_error(e))
    }
}

#[async_trait]
impl ModuleQuery for DpgpFirestore {
    async fn create_module(
        &self,
        id: &str,
        module: &LearningModule,
    ) -> FirestoreResult<LearningModule> {
        self.inner
            .fluent()
            .insert()
            .into(MODULE_COLLECTION_NAME)
            .document_id(id)
            .object(module)
            .execute()
            .await
    }

    async fn module_by_id(&self, id: &str) -> FirestoreResult<Option<LearningModule>> {
        self.inner
            .fluent()
            .select()
            .by_id_in(MODULE_COLLECTION_NAME)
            .obj()
            .one(id)
            .await
    }

    async fn link_module_to_class(
        &self,
        module_id: &str,
        class_id: &str,
        order: u8,
    ) -> FirestoreResult<LearningModule> {
        let current = self
            .module_by_id(module_id)
            .await?
            .context(format!("No module found with ID: {}", module_id))
            .map_err(|e| data_not_found_error(e))?;
        let mut parent_classes = current.parent_classes.clone();
        parent_classes.push(ModuleOrder::new(class_id, order));

        self.inner
            .fluent()
            .update()
            .fields(paths!(LearningModule::{parent_classes})) // Update only specified fields
            .in_col(MODULE_COLLECTION_NAME)
            .document_id(module_id)
            .object(&LearningModule {
                parent_classes,
                ..current.clone()
            })
            .execute()
            .await
    }
}

#[async_trait]
impl ClassQuery for DpgpFirestore {
    async fn create_class(&self, id: &str, class: &Class) -> FirestoreResult<Class> {
        self.inner
            .fluent()
            .insert()
            .into(CLASS_COLLECTION_NAME)
            .document_id(id)
            .object(class)
            .execute()
            .await
    }

    async fn class_by_id(&self, id: &str) -> FirestoreResult<Option<Class>> {
        self.inner
            .fluent()
            .select()
            .by_id_in(CLASS_COLLECTION_NAME)
            .obj()
            .one(id)
            .await
    }
}

#[async_trait]
impl UserQuery for DpgpFirestore {
    async fn create_user(&self, id: &str, user: &User, collection: &str) -> FirestoreResult<User> {
        self.inner
            .fluent()
            .insert()
            .into(collection)
            .document_id(id)
            .object(user)
            .execute()
            .await
    }

    /// Get a [`User`] either by its email or full name.
    async fn user(&self, lookup: &UserLookup, collection: &str) -> FirestoreResult<Option<User>> {
        match lookup {
            UserLookup::Email(email) => {
                self.inner
                    .fluent()
                    .select()
                    .by_id_in(collection)
                    .obj()
                    .one(email)
                    .await
            }
            UserLookup::FullName(full_name) => self.user_by_exact_name(full_name, collection).await,
            UserLookup::Discord(discord) => self.user_by_discord(discord, collection).await,
        }
    }

    async fn update_discord_user(
        &self,
        lookup: &UserLookup,
        updated: Discord,
        collection: &str,
    ) -> FirestoreResult<User> {
        let current = self.find_user(lookup, collection).await?;

        self.inner
            .fluent()
            .update()
            .fields(paths!(User::{discord})) // Update only specified fields
            .in_col(collection)
            .document_id(&current.email)
            .object(&User {
                discord: Some(updated),
                ..current
            })
            .execute()
            .await
    }

    async fn add_enrollment(
        &self,
        lookup: &UserLookup,
        add: Enrollment,
        collection: &str,
    ) -> FirestoreResult<User> {
        let current = self.find_user(lookup, collection).await?;

        // TODO: check if the enrollment already exists **by module name**,
        // and whether an update -- i.e. with payment ID -- is needed
        if !current.enrollments.contains(&add) {
            self.inner
                .fluent()
                .update()
                .fields(paths!(User::{enrollments}))
                .in_col(collection)
                .document_id(&current.email)
                .object(&User {
                    enrollments: {
                        let mut enrollments = current.enrollments.clone();
                        enrollments.push(add);
                        enrollments
                    },
                    ..current
                })
                .execute()
                .await
        } else {
            // nothing to do
            Ok(current)
        }
    }
}

fn data_not_found_error(e: anyhow::Error) -> FirestoreError {
    FirestoreError::DataNotFoundError(FirestoreDataNotFoundError {
        public: FirestoreErrorPublicGenericDetails {
            code: "anyhow".to_string(),
        },
        data_detail_message: format!("{:?}", e),
    })
}
