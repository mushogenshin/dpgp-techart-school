use firestore::*;

fn main() {
    FirestoreDb::with_options_token_source(
        FirestoreDbOptions::new(config_env_var("PROJECT_ID")?.to_string()),
        gcloud_sdk::GCP_DEFAULT_SCOPES.clone(),
        gcloud_sdk::TokenSourceType::File("/tmp/key.json".into()),
    )
    .await?;
}
