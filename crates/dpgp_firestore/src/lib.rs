mod query;

use firestore::{FirestoreDb, FirestoreDbOptions, FirestoreResult};
use gcloud_sdk::TokenSourceType;

pub extern crate firestore;
pub extern crate gcloud_sdk;

pub async fn client_from_token(
    google_project_id: String,
    token: TokenSourceType,
) -> FirestoreResult<FirestoreDb> {
    FirestoreDb::with_options_token_source(
        FirestoreDbOptions::new(google_project_id),
        gcloud_sdk::GCP_DEFAULT_SCOPES.clone(),
        token,
    )
    .await
}

#[cfg(test)]
mod tests {
    use super::*;
    use bricks_n_mortar::{Class, CLASS_COLLECTION_NAME};

    const TOKEN_FILE_PATH: &str = "/Users/mushogenshin/projects/dpgp-techart-school/tmp/key.json";
    const PROJECT_ID: &str = "musho-genshin";

    // fn config_env_var(name: &str) -> Result<String, String> {
    //     std::env::var(name).map_err(|e| format!("{}: {}", name, e))
    // }

    #[tokio::test]
    async fn connect() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        // Create an instance
        let db = client_from_token(
            // config_env_var("PROJECT_ID")?.to_string(),
            PROJECT_ID.to_string(),
            TokenSourceType::File(TOKEN_FILE_PATH.into()),
        )
        .await?;

        {
            let class = Class::wih_id("HAA19".to_string());

            // Get by id
            let obj_by_id: Option<Class> = db
                .fluent()
                .select()
                .by_id_in(CLASS_COLLECTION_NAME)
                .obj()
                .one(&class.id)
                .await?;

            assert!(obj_by_id.is_some());

            println!("Get by id {:?}", obj_by_id);
        }

        Ok(())
    }
}
