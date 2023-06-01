use super::*;
#[cfg(feature = "firebase")]
use dpgp_firestore::ClassQuery;

#[command]
// // Limit all commands to be guild-restricted.
// #[only_in(guilds)]
// // Allow only administrators to call this:
// #[required_permissions("ADMINISTRATOR")]
#[aliases("c", "cls")]
#[sub_commands(class_with_categories)]
pub async fn class(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let query = args.single::<String>()?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data.get::<DpgpQuery>().context(NO_DPGP_FIRESTORE_ERR)?;

        let class = db.class_by_id(&query).await;

        // displays the result of the query
        msg.reply(
            &ctx.http,
            match class {
                Ok(Some(class)) => {
                    format!("Found: {:?}", class)
                }
                Ok(None) => format!("No class found with ID: {}", query),
                Err(e) => format!("Query error: {:?}", e),
            },
        )
        .await?;
    }
    Ok(())
}

#[command("new")]
#[aliases("n")]
/// USAGE: `~class new <id> <categories>`
/// Subcommand for creating a [`Class`].
async fn class_with_categories(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    args.trimmed();
    let class_id = args.single::<String>()?;
    let categories = args
        .iter::<String>()
        .map(|a| a.unwrap_or_default())
        .collect::<Vec<String>>();

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data.get::<DpgpQuery>().context(NO_DPGP_FIRESTORE_ERR)?;

        let class = db
            .create_class(
                &class_id,
                &Class::with_categories(
                    &categories.iter().map(|s| s.as_str()).collect::<Vec<&str>>(),
                ),
            )
            .await;

        // displays the result of the action
        msg.reply(
            &ctx.http,
            match class {
                Ok(class) => {
                    format!("Created: {:?}", class)
                }
                Err(e) => format!("Creation error: {:?}", e),
            },
        )
        .await?;
    }

    Ok(())
}
