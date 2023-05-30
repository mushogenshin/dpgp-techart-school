use dpgp_firestore::ModuleQuery;

use super::*;

#[command]
#[sub_commands(module)]
pub async fn create(_ctx: &Context, _msg: &Message, _args: Args) -> CommandResult {
    Ok(())
}

#[command]
/// Subcommand for creating a [`Module`].
async fn module(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let name = args.single::<String>()?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data
            .get::<DpgpQuery>()
            .expect("Expected DpgpFirestore in TypeMap");

        let module = db.create_module(&name, &Module::default()).await;

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
