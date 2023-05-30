#[cfg(feature = "firebase")]
use std::path::PathBuf;

#[cfg(feature = "firebase")]
use dpgp_firestore::GCPProjectAndToken;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    run_dlus(
        #[cfg(feature = "firebase")]
        Some(PathBuf::from(
            "/Users/mushogenshin/projects/dpgp-techart-school/tmp/key.json",
        )),
    )
    .await
    .expect("Failed to start đầu-lâu u-sầu Discord client");
}

pub async fn run_dlus(
    #[cfg(feature = "firebase")] firestore_key_file: Option<PathBuf>,
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
    let firestore = firestore_key_file.map(|key| {
        GCPProjectAndToken {
            google_project_id: env::var("GOOGLE_PROJECT_ID")
                .expect("Expected Google project ID in the environment"),
            // NOTE: `TokenSourceType::Json(String)` seems to expect a JWT, not a regular serialized string
            firestore_token: TokenSourceType::File(key),
        }
    });

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
