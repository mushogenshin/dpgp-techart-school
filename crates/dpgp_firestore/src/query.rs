use super::*;

use firestore::errors::{
    FirestoreDataNotFoundError, FirestoreError, FirestoreErrorPublicGenericDetails,
};
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

    async fn user_by_exact_name(
        &self,
        full_name: &str,
        collection: &str,
    ) -> FirestoreResult<Option<User>> {
        // Query as a stream our data
        let object_stream: BoxStream<User> = self
            .inner
            .fluent()
            .select()
            // NOTE: field `id` is mandatory
            .fields(paths!(User::{full_name, enrollments, socials})) // Optionally select the fields needed
            .from(collection)
            .filter(|q| {
                q.for_all([
                    // q.field(path!(User::some_num)).is_not_null(),
                    q.field(path!(User::full_name)).eq(full_name),
                    // // Sometimes you have optional filters
                    // Some("Test2")
                    //     .and_then(|value| q.field(path!(User::one_more_string)).eq(value)),
                ])
            })
            // .order_by([(
            //     path!(User::some_num),
            //     FirestoreQueryDirection::Descending,
            // )])
            .obj() // Reading documents as structures using Serde gRPC deserializer
            .stream_query()
            .await?;

        let users = object_stream.collect::<Vec<User>>().await;

        Ok(users.into_iter().next())
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
