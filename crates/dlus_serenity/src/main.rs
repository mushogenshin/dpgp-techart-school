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
    let firestore_auth = env::var("FIRESTORE_AUTH");

    dlus_serenity::init_bot(
        &bot_token,
        #[cfg(feature = "firebase")]
        firestore_auth.ok(),
    )
    .await
}
