mod migration;
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
const MODULE_COLLECTION_NAME: &str = "modules";
// const PAYMENT_COLLECTION_NAME: &str = "rawPayments";

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

    // /// Set a parent [`Class`] to a [`LearningModule`].
    // async fn link_module_to_class(
    //     &self,
    //     module_id: &str,
    //     class_id: &str,
    //     order: u8,
    // ) -> FirestoreResult<LearningModule>;
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
    /// Add a new [`User`] to the database.
    async fn create_user(&self, id: &str, user: &User, collection: &str) -> FirestoreResult<User>;

    /// Get a [`User`] either by its ID or full name.
    async fn user(&self, lookup: &UserLookup, collection: &str) -> FirestoreResult<Option<User>>;

    /// Update a [`User`] with a Discord ID and username.
    async fn update_discord_user(
        &self,
        lookup: &UserLookup,
        updated: Discord,
        collection: &str,
    ) -> FirestoreResult<User>;

    async fn add_enrollment(
        &self,
        lookup: &UserLookup,
        add: &String,
        collection: &str,
    ) -> FirestoreResult<User>;
}
