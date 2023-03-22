use dlus::init_bot;

use dotenv::dotenv;
use std::env;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let token = env::var("DISCORD_TOKEN").expect("Expected a token in the environment");

    // Configure the client with your Discord bot token in the environment.
    init_bot(&token).await
}
