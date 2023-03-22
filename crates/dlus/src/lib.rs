pub extern crate log;
pub extern crate serenity;

mod bot;

use serenity::{client::Client, prelude::*};

pub async fn init_bot(token: &str) -> Result<Client, SerenityError> {
    // Set gateway intents, which decides what events the bot will be notified about
    let intents = GatewayIntents::GUILD_MESSAGES
        | GatewayIntents::DIRECT_MESSAGES
        | GatewayIntents::MESSAGE_CONTENT;

    // Create a new instance of the Client, logging in as a bot. This will
    // automatically prepend your bot token with "Bot ", which is a requirement
    // by Discord for bot users.
    let mut client = Client::builder(&token, intents)
        .event_handler(bot::Handler)
        .await;

    // // Finally, start a single shard, and start listening to events.
    // //
    // // Shards will automatically attempt to reconnect, and will perform
    // // exponential backoff until it reconnects.
    // if let Ok(cl) = &mut client {
    //     cl.start().await.ok();
    // };

    client
}
