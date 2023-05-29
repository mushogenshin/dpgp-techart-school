#[cfg(feature = "firebase")]
use std::path::PathBuf;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    run_dlus(
        #[cfg(feature = "firebase")]
        PathBuf::from("/Users/mushogenshin/projects/dpgp-techart-school/tmp/key.json"),
    )
    .await
    .expect("Failed to start đầu-lâu u-sầu Discord client");
}

pub async fn run_dlus(
    #[cfg(feature = "firebase")] firestore_key_file: PathBuf,
) -> Result<serenity::Client, serenity::Error> {
    use dotenv::dotenv;
    use std::env;

    #[cfg(feature = "firebase")]
    use dlus_serenity::TokenSourceType;

    // This will load the environment variables located at `./.env`, relative to the CWD.
    dotenv().expect("Failed to load .env file");
    let bot_token =
        env::var("DISCORD_TOKEN").expect("Expected a Discord bot token in the environment");

    #[cfg(feature = "firebase")]
    let google_project_id =
        env::var("GOOGLE_PROJECT_ID").expect("Expected Google project ID in the environment");

    #[cfg(feature = "firebase")]
    // NOTE: `TokenSourceType::Json(String)` seems to expect a JWT, not a regular serialized string
    let firestore_token = TokenSourceType::File(firestore_key_file);

    dlus_serenity::init_bot(
        &bot_token,
        #[cfg(feature = "firebase")]
        google_project_id,
        #[cfg(feature = "firebase")]
        firestore_token,
    )
    .await
}
