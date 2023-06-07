use super::*;
#[cfg(feature = "firebase")]
use dpgp_firestore::ClassQuery;

#[command]
// // Limit all commands to be guild-restricted.
// #[only_in(guilds)]
// // Allow only administrators to call this:
// #[required_permissions("ADMINISTRATOR")]
#[aliases("c", "cls")]
#[sub_commands(create_class_with_categories)]
pub async fn class(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let class_id = args.single::<String>()?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data.get::<DpgpQuery>().context(NO_DPGP_FIRESTORE_ERR)?;

        let class = db.class_by_id(&class_id).await;

        // displays the result of the query
        msg.reply(
            &ctx.http,
            match class {
                Ok(Some(class)) => {
                    format!(":crystal_ball: Found: {:?}", class)
                }
                Ok(None) => format!("No class found with ID: {}", class_id),
                Err(e) => format!(":grey_question: Query error: {:?}", e),
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
async fn create_class_with_categories(
    ctx: &Context,
    msg: &Message,
    mut args: Args,
) -> CommandResult {
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
                    format!(":mirror_ball: Created: {:?}", class)
                }
                Err(e) => format!(":x: Creation error: {:?}", e),
            },
        )
        .await?;
    }

    Ok(())
}
