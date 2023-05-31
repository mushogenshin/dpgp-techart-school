use super::*;

#[command]
// #[sub_commands(new)]
pub async fn student(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let query = args.single::<String>()?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data.get::<DpgpQuery>().context(NO_DPGP_FIRESTORE_ERR)?;

        let students = db.student_by_email(&query).await;

        msg.reply(
            &ctx.http,
            match students {
                Ok(class) => {
                    format!("Found: {:?}", class)
                }
                Err(e) => format!("Query error: {:?}", e),
            },
        )
        .await?;
    }
    Ok(())
}
