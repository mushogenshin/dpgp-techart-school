use super::*;

#[command]
// #[sub_commands(new)]
pub async fn class(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let query = args.single::<String>()?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data.get::<DpgpQuery>().context(NO_DPGP_FIRESTORE_ERR)?;

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
