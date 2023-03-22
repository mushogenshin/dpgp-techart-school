use super::*;

#[command]
pub async fn make_category(ctx: &Context, msg: &Message, args: Args) -> CommandResult {
    msg.channel_id
        .say(&ctx.http, "Received MAKE_CATEGORY command")
        .await?;
    Ok(())
}
