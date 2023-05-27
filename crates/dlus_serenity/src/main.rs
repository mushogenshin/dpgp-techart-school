use dlus::init_bot;

#[tokio::main]
async fn main() {
    use dotenv::dotenv;
    use std::env;

    tracing_subscriber::fmt::init();

    // This will load the environment variables located at `./.env`, relative to the CWD.
    dotenv().expect("Failed to load .env file");
    let bot_token = env::var("DISCORD_TOKEN").expect("Expected a token in the environment");

    #[cfg(feature = "firebase")]
    let firebase_auth = env::var("FIREBASE_AUTH");

    init_bot(
        &bot_token,
        #[cfg(feature = "firebase")]
        firebase_auth.ok(),
    )
    .await
    .expect("Failed to start Discord client");
}
