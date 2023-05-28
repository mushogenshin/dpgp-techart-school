use firestore::{FirestoreDb, FirestoreDbOptions, FirestoreResult};
use gcloud_sdk::TokenSourceType;

pub extern crate firestore;
pub extern crate gcloud_sdk;

pub async fn client_from_token(
    project_id: String,
    token: TokenSourceType,
) -> FirestoreResult<FirestoreDb> {
    FirestoreDb::with_options_token_source(
        FirestoreDbOptions::new(project_id),
        gcloud_sdk::GCP_DEFAULT_SCOPES.clone(),
        token,
    )
    .await
}

#[cfg(test)]
mod tests {
    use firestore::*;
    use serde::{Deserialize, Serialize};

    fn config_env_var(name: &str) -> Result<String, String> {
        std::env::var(name).map_err(|e| format!("{}: {}", name, e))
    }

    // Example structure to play with
    #[derive(Debug, Clone, Default, Deserialize, Serialize)]
    #[allow(non_snake_case)]
    struct MyTestStructure {
        classId: String,
        format: String,
        location: String,
    }

    #[tokio::test]
    async fn connect() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        // Create an instance
        let db = FirestoreDb::with_options_token_source(
            FirestoreDbOptions::new(config_env_var("PROJECT_ID")?.to_string()),
            gcloud_sdk::GCP_DEFAULT_SCOPES.clone(),
            gcloud_sdk::TokenSourceType::File(
                "/Users/mushogenshin/projects/dlus-rs-bot/tmp/key.json".into(),
            ),
        )
        .await?;

        {
            const TEST_COLLECTION_NAME: &'static str = "classes";

            let my_struct = MyTestStructure {
                classId: "ZBL3_2020".to_string(),
                ..Default::default()
            };

            // Get by id
            let obj_by_id: Option<MyTestStructure> = db
                .fluent()
                .select()
                .by_id_in(TEST_COLLECTION_NAME)
                .obj()
                .one(&my_struct.classId)
                .await?;

            assert!(obj_by_id.is_some());

            println!("Get by id {:?}", obj_by_id);
        }

        Ok(())
    }
}
