use dpgp_firestore::ModuleQuery;

use super::*;

#[command]
// // Limit all commands to be guild-restricted.
// #[only_in(guilds)]
// // Allow only administrators to call this:
// #[required_permissions("ADMINISTRATOR")]
#[aliases("m", "mod")]
#[sub_commands(new, link)]
/// Upper command queries the [`Module`] by ID.
pub async fn module(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let module_id = args.single::<String>()?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data
            .get::<DpgpQuery>()
            .expect("Expected DpgpFirestore in TypeMap");

        let module = db.module_by_id(&module_id).await;

        msg.reply(
            &ctx.http,
            match module {
                Ok(Some(module)) => {
                    format!("Found: {:?}", module)
                }
                Ok(None) => format!("No module found with ID: {}", module_id),
                Err(e) => format!("Query error: {:?}", e),
            },
        )
        .await?;
    }

    Ok(())
}

#[command("new")]
#[aliases("n")]
/// Subcommand for creating a [`Module`]. NOTE: this leaves the `Module`'s
/// description, price, and "parent classes" empty.
/// USAGE: `~module new <id> <duration> <year> <month> <day>`
async fn new(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let module_id = args.single::<String>()?;
    let duration = args.single::<String>()?;
    let year = args.single::<u16>()?;
    let month = args.single::<u8>()?;
    let day = args.single::<u8>()?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data
            .get::<DpgpQuery>()
            .expect("Expected DpgpFirestore in TypeMap");

        let module = db
            .create_module(
                &module_id,
                &LearningModule::with_duration_and_start_args(&duration, year, month, day)?,
            )
            .await;

        msg.reply(
            &ctx.http,
            match module {
                Ok(module) => {
                    format!("Created: {:?}", module)
                }
                Err(e) => format!("Creation error: {:?}", e),
            },
        )
        .await?;
    }

    Ok(())
}

#[command("place")]
#[aliases("p")]
/// USAGE: `~module place <module_id> <class_id> <order>`
async fn link(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let module_id = args.single::<String>()?;
    let class_id = args.single::<String>()?;
    let order = args.single::<u8>()?;

    msg.reply(
        &ctx.http,
        format!(
            "TODO: link module {} to class {} at order {}",
            module_id, class_id, order
        ),
    )
    .await?;

    Ok(())
}
