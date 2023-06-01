mod query;
pub use query::DpgpFirestore;

#[allow(unused_imports)]
use anyhow::Context as AnyhowContext;
use async_trait::async_trait;
use bricks_n_mortar::*;
use firestore::{FirestoreDb, FirestoreDbOptions, FirestoreResult};
use gcloud_sdk::TokenSourceType;

pub extern crate firestore;
pub extern crate gcloud_sdk;

const CLASS_COLLECTION_NAME: &str = "classes";
const STUDENT_COLLECTION_NAME: &str = "students";
// const PAYMENT_COLLECTION_NAME: &str = "rawPayments";
const MODULE_COLLECTION_NAME: &str = "modules";

#[async_trait]
pub trait ModuleQuery {
    /// Add a new [`LearningModule`] to the database.
    async fn create_module(
        &self,
        id: &str,
        module: &LearningModule,
    ) -> FirestoreResult<LearningModule>;

    /// Get a [`LearningModule`] by its ID.
    async fn module_by_id(&self, id: &str) -> FirestoreResult<Option<LearningModule>>;

    /// Set a parent [`Class`] to a [`LearningModule`].
    async fn link_module_to_class(
        &self,
        module_id: &str,
        class_id: &str,
        order: u8,
    ) -> FirestoreResult<LearningModule>;
}

#[async_trait]
pub trait ClassQuery {
    /// Add a new [`Class`] to the database.
    async fn create_class(&self, id: &str, class: &Class) -> FirestoreResult<Class>;

    /// Get a [`Class`] by its ID.
    async fn class_by_id(&self, id: &str) -> FirestoreResult<Option<Class>>;
}

#[async_trait]
pub trait UserQuery {
    /// Get a [`User`] by its name.
    async fn user_by_exact_name(&self, email: &str) -> FirestoreResult<Option<User>>;
}

pub struct GCPProjectAndToken {
    pub google_project_id: String,
    pub firestore_token: TokenSourceType,
}

pub async fn client_from_token(auth: GCPProjectAndToken) -> FirestoreResult<FirestoreDb> {
    FirestoreDb::with_options_token_source(
        FirestoreDbOptions::new(auth.google_project_id),
        gcloud_sdk::GCP_DEFAULT_SCOPES.clone(),
        auth.firestore_token,
    )
    .await
}

#[cfg(test)]
mod tests {
    use super::*;
    use bricks_n_mortar::Class;

    const TOKEN_FILE_PATH: &str = "/Users/mushogenshin/projects/dpgp-techart-school/tmp/key.json";
    const PROJECT_ID: &str = "musho-genshin";

    #[tokio::test]
    async fn connect() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        // Create an instance
        let db = client_from_token(GCPProjectAndToken {
            google_project_id: PROJECT_ID.to_string(),
            firestore_token: TokenSourceType::File(TOKEN_FILE_PATH.into()),
        })
        .await?;

        {
            // Get by id
            let obj_by_id: Option<Class> = db
                .fluent()
                .select()
                .by_id_in(CLASS_COLLECTION_NAME)
                .obj()
                .one("HAA19")
                .await?;

            assert!(obj_by_id.is_some());

            println!("Get by id {:?}", obj_by_id);
        }

        Ok(())
    }
}
