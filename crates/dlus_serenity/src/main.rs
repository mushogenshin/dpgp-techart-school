use std::env;

#[cfg(feature = "firebase")]
use dpgp_firestore::GCPProjectAndToken;
use log::{error, info};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    run_dlus()
        .await
        .map_err(|e| error!("Failed to start đầu-lâu u-sầu Discord client: {}", e))
        .unwrap();
}

pub async fn run_dlus() -> Result<serenity::Client, serenity::Error> {
    env::var("RUN_MODE")
        .map(|mode| {
            if mode.to_lowercase() != "production" {
                // This will load the environment variables located at `./.env`, relative to the CWD.
                dotenv::dotenv().expect("Failed to load .env file");
            } else {
                info!("Running in PRODUCTION mode");
            }
        })
        .ok();

    let bot_token = env::var("DISCORD_TOKEN").unwrap_or_else(|err| {
        error!("Expected a Discord bot token in the environment: {}", err);
        String::new()
    });

    #[cfg(feature = "firebase")]
    let firestore = {
        use dlus_serenity::TokenSourceType;

        let firestore_key_file = env::var("FIRESTORE_KEY_FILE")
            .map(|path| std::path::PathBuf::from(path))
            .map_err(|e| {
                error!("Expected Firestore key file path in the environment: {}", e);
                e
            })
            .ok();

        let google_project_id = env::var("GOOGLE_PROJECT_ID").unwrap_or_else(|e| {
            error!("Expected Google project ID in the environment: {}", e);
            String::new()
        });

        firestore_key_file.map(|key| {
            GCPProjectAndToken {
                google_project_id,
                // NOTE: `TokenSourceType::Json(String)` seems to expect a JWT, not a regular serialized string
                firestore_token: TokenSourceType::File(key),
            }
        })
    };

    dlus_serenity::init_bot(
        &bot_token,
        #[cfg(feature = "firebase")]
        firestore,
    )
    .await
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn run_dlus_without_firestore() {
        tracing_subscriber::fmt::init();
        // TODO: pass `None` to test without Firestore
        run_dlus().await.unwrap();
    }
}
