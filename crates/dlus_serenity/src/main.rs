use std::env;

#[cfg(feature = "firebase")]
use std::path::PathBuf;

#[cfg(feature = "firebase")]
use dpgp_firestore::GCPProjectAndToken;
use log::error;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let client = if cfg!(feature = "firebase") {
        run_dlus(
            #[cfg(feature = "firebase")]
            Some(PathBuf::from("")),
        )
    } else {
        run_dlus(
            #[cfg(feature = "firebase")]
            None,
        )
    };

    client
        .await
        .map_err(|e| error!("Failed to start đầu-lâu u-sầu Discord client: {}", e))
        .unwrap();
}

pub async fn run_dlus(
    #[cfg(feature = "firebase")] firestore_key_file: Option<PathBuf>,
) -> Result<serenity::Client, serenity::Error> {
    #[cfg(feature = "firebase")]
    use dlus_serenity::TokenSourceType;

    #[cfg(not(feature = "production"))]
    // This will load the environment variables located at `./.env`, relative to the CWD.
    dotenv::dotenv().expect("Failed to load .env file");

    let bot_token = env::var("DISCORD_TOKEN").unwrap_or_else(|err| {
        error!("Expected a Discord bot token in the environment: {}", err);
        String::new()
    });

    #[cfg(feature = "firebase")]
    let firestore = {
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
        run_dlus(None).await.unwrap();
    }
}
