#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    run_dlus()
        .await
        .expect("Failed to start đầu-lâu u-sầu Discord client");
}

pub async fn run_dlus() -> Result<serenity::Client, serenity::Error> {
    use dotenv::dotenv;
    use std::env;

    // This will load the environment variables located at `./.env`, relative to the CWD.
    dotenv().expect("Failed to load .env file");
    let bot_token = env::var("DISCORD_TOKEN").expect("Expected a token in the environment");

    #[cfg(feature = "firebase")]
    let google_project_id =
        env::var("GOOGLE_PROJECT_ID").expect("Expected Google project ID in the environment");

    #[cfg(feature = "firebase")]
    let firestore_auth =
        env::var("FIRESTORE_AUTH").expect("Expected Firestore auth in the environment");

    dlus_serenity::init_bot(
        &bot_token,
        #[cfg(feature = "firebase")]
        google_project_id,
        #[cfg(feature = "firebase")]
        firestore_auth,
    )
    .await
}
