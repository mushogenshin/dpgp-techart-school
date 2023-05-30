use dpgp_firestore::ModuleQuery;

use super::*;

#[command]
#[aliases("mod")]
#[sub_commands(new_module)]
pub async fn module(_ctx: &Context, _msg: &Message, _args: Args) -> CommandResult {
    Ok(())
}

#[command("new")]
// // Limit all commands to be guild-restricted.
// #[only_in(guilds)]
// // Allow only administrators to call this:
// #[required_permissions("ADMINISTRATOR")]
/// Subcommand for creating a [`Module`]. NOTE: this leaves the `Module`'s
/// description, price, and "parent classes" empty.
/// FINAL USAGE: `~module new <id> <duration> <year> <month> <day>`
async fn new_module(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let module_id = args.single::<String>()?;
    let duration = args.single::<String>()?; // in weeks
    let year = args.single::<f64>()?;
    let month = args.single::<f64>()?;
    let day = args.single::<f64>()?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data
            .get::<DpgpQuery>()
            .expect("Expected DpgpFirestore in TypeMap");

        let module = db
            .create_module(
                &module_id,
                &Module::with_duration_and_start_args(&duration, year, month, day)?,
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
