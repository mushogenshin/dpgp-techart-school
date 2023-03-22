use super::*;

#[command]
pub async fn make_category(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let class = args.single::<String>()?;
    let module = args.single::<String>()?;

    msg.channel_id
        .say(
            &ctx.http,
            format!(
                "Received MAKE_CATEGORY command for module `{}` of `{}` class",
                module, class,
            ),
        )
        .await?;

    Ok(())
}
