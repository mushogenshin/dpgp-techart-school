use super::*;
#[cfg(feature = "firebase")]
use dpgp_firestore::ModuleQuery;

#[command]
#[aliases("m", "mod")]
#[sub_commands(create_module_with_length, link_parent_class)]
/// Upper command queries a [`Module`] by its ID.
/// USAGE: `~module <id>`
/// This view/query action is allowed for non-admin users and for outside of guilds.
pub async fn module(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let module_id = args.single::<String>()?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data.get::<DpgpQuery>().context(NO_DPGP_FIRESTORE_ERR)?;

        let module = db.module_by_id(&module_id).await;

        // displays the result of the query
        msg.channel_id
            .say(
                &ctx.http,
                match module {
                    Ok(Some(module)) => {
                        format!(":crystal_ball: Found: {:?}", module)
                    }
                    Ok(None) => {
                        format!(":grey_exclamation: No module found with ID: {}", module_id)
                    }
                    Err(e) => format!(":grey_question: Query error: {:?}", e),
                },
            )
            .await?;
    }

    Ok(())
}

#[command("new")]
#[aliases("n")]
// Limit all commands to be guild-restricted.
#[cfg_attr(feature = "admin_only", only_in(guilds))]
// Allow only administrators to call this.
#[cfg_attr(feature = "admin_only", required_permissions("ADMINISTRATOR"))]
/// Subcommand for creating a [`Module`]. NOTE: this leaves the `Module::parent_classes` empty,
/// and other fields at default values.
/// USAGE: `~module new <id> <duration> <year> <month> <day>`
async fn create_module_with_length(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let module_id = args.single::<String>()?;
    let duration = args.single::<String>()?;
    let year = args.single::<u16>()?;
    let month = args.single::<u8>()?;
    let day = args.single::<u8>()?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data.get::<DpgpQuery>().context(NO_DPGP_FIRESTORE_ERR)?;

        let module = db
            .create_module(
                &module_id,
                &LearningModule::default().duration_and_start(&duration, year, month, day)?,
            )
            .await;

        // displays the result of the action
        msg.channel_id
            .say(
                &ctx.http,
                match module {
                    Ok(module) => {
                        format!(":mirror_ball: Created: {:?}", module)
                    }
                    Err(e) => format!(":x: Creation error: {:?}", e),
                },
            )
            .await?;
    }

    Ok(())
}

#[command("place")]
#[aliases("p")]
// Limit all commands to be guild-restricted.
#[cfg_attr(feature = "admin_only", only_in(guilds))]
// Allow only administrators to call this.
#[cfg_attr(feature = "admin_only", required_permissions("ADMINISTRATOR"))]
/// Subcommand for linking a [`Module`] to a [`Class`].
/// USAGE: `~module place <module_id> <class_id> <order>`
async fn link_parent_class(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let module_id = args.single::<String>()?;
    let class_id = args.single::<String>()?;
    let order = args.single::<u8>().unwrap_or(1);

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data.get::<DpgpQuery>().context(NO_DPGP_FIRESTORE_ERR)?;

        // let updated = db.link_module_to_class(&module_id, &class_id, order).await;

        // // displays the result of the action
        // msg.channel_id
        //     .say(
        //         &ctx.http,
        //         match updated {
        //             Ok(module) => {
        //                 format!(":white_check_mark: Updated: {:?}", module)
        //             }
        //             Err(e) => format!(":exclamation: Update error: {:?}", e),
        //         },
        //     )
        //     .await?;
    }

    Ok(())
}
