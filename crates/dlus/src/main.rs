use dlus::init_bot;

#[tokio::main]
async fn main() {
    use dotenv::dotenv;
    use std::env;

    // This will load the environment variables located at `./.env`, relative to the CWD.
    dotenv().expect("Failed to load .env file");
    let token = env::var("DISCORD_TOKEN").expect("Expected a token in the environment");

    init_bot(&token)
        .await
        .expect("Failed to start Discord client");
}
