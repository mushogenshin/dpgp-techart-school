mod commands;
mod handler;

#[cfg(feature = "firebase")]
mod db;

#[cfg(feature = "firebase")]
pub use dpgp_firestore::gcloud_sdk::TokenSourceType;

#[allow(unused_imports)]
use log::{error, info, warn};
use serenity::{
    client::Client,
    framework::{standard::macros::group, StandardFramework},
    http::Http,
    prelude::*,
};

// imports names of all custom commands
use crate::commands::{category::*, meta::*, CMD_PREFIX};

#[group]
#[commands(meta, make_category)]
/// This, along with the `group` macro, results in `GENERAL_GROUP`.
struct General;

pub async fn init_bot(
    bot_token: &str,
    #[cfg(feature = "firebase")] google_project_id: String,
    #[cfg(feature = "firebase")] firestore_token: TokenSourceType,
) -> Result<Client, SerenityError> {
    use std::collections::HashSet;

    #[cfg(feature = "firebase")]
    let firestore = dpgp_firestore::client_from_token(google_project_id, firestore_token)
        .await
        .map_err(|e| {
            error!("Firestore error: {}", e);
            SerenityError::Other("Failed to initialize Firestore client")
        });

    let http = Http::new(bot_token);

    // Fetch the bot's owners and id
    let (owners, _bot_id) = match http.get_current_application_info().await {
        Ok(info) => {
            info!("Discord application owner is {}", info.owner.name);

            let mut owners = HashSet::new();
            owners.insert(info.owner.id);

            (owners, info.id)
        }
        Err(why) => panic!("Could not access Discord application info: {:?}", why),
    };

    // Create the framework
    let framework = StandardFramework::new()
        .configure(|c| c.owners(owners).prefix(CMD_PREFIX))
        .group(&GENERAL_GROUP);

    // Set gateway intents, which decides what events the bot will be notified about
    let intents = GatewayIntents::GUILD_MESSAGES
        | GatewayIntents::DIRECT_MESSAGES
        | GatewayIntents::MESSAGE_CONTENT;

    // Create a new instance of the Client, logging in as a bot. This will
    // automatically prepend your bot token with "Bot ", which is a requirement
    // by Discord for bot users.
    #[allow(unused_mut)]
    let mut builder = Client::builder(&bot_token, intents)
        .framework(framework)
        .event_handler(handler::Handler);

    #[cfg(feature = "firebase")]
    {
        match firestore {
            Ok(firestore) => {
                builder = builder.type_map_insert::<db::DpgpFirestore>(firestore);
                info!("Discord bot data now holds access to Firestore DB");
            }
            Err(e) => {
                warn!("{}. Starting Discord bot without access to Firestore DB", e);
            }
        }
    }

    let mut client = builder.await?;

    // Finally, start a single shard, and start listening to events.
    //
    // Shards will automatically attempt to reconnect, and will perform
    // exponential backoff until it reconnects.
    client.start().await?;

    Ok(client)
}
