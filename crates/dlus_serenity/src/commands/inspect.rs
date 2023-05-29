use super::*;

#[command]
#[sub_commands(class_by_id)]
pub async fn inspect(_ctx: &Context, _msg: &Message, _args: Args) -> CommandResult {
    Ok(())
}

#[command("class")]
/// Subcommand for inspecting a class.
async fn class_by_id(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let query = args.single::<String>()?;

    #[cfg(feature = "firebase")]
    {
        let mut data = ctx.data.write().await;
        let db = data
            .get_mut::<DpgpQuery>()
            .expect("Expected DpgpFirestore in TypeMap");

        let class = db.class_by_id(&query).await;

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
