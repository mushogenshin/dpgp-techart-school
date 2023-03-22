use super::*;

#[command]
pub async fn meta(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let scope = args.single::<String>()?;

    // msg.channel_id
    //     .say(
    //         &ctx.http,
    //         format!(
    //             "Received MAKE_CATEGORY command for module `{}` of `{}` class",
    //             module, class,
    //         ),
    //     )
    //     .await?;

    Ok(())
}
