use super::*;

#[command("group")]
#[aliases("g", "grp")]
#[sub_commands(create_module_channels)]
/// Upper command queries a Discord channel within the current guild by its name.
pub async fn channel(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let channel_name = args.single::<String>()?;
    let guild = guild_id(msg)?;

    let channel = get_channel_by_name(ctx, &guild, &channel_name).await;
    msg.channel_id
        .say(
            &ctx.http,
            match channel {
                Ok(channel) => format!(":crystal_ball: Found channel: {:?}", channel),
                Err(e) => format!(":grey_exclamation: Error finding channel: {}", e),
            },
        )
        .await?;

    Ok(())
}

#[command("new")]
#[aliases("n")]
// Limit all commands to be guild-restricted.
#[cfg_attr(feature = "admin_only", only_in(guilds))]
// Allow only administrators to call this.
#[cfg_attr(feature = "admin_only", required_permissions("ADMINISTRATOR"))]
/// Subcommand for creating Discord channels necessary for a module of a class.
/// USAGE: `~group new <class> <module>`
pub async fn create_module_channels(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let class = args.single::<String>()?;
    let module = args.single::<String>()?;
    let guild = guild_id(msg)?;

    msg.channel_id
        .say(
            &ctx.http,
            format!(
                "Received NEW CHANNEL command for module `{}` of `{}` class in guild `{}`",
                module, class, guild
            ),
        )
        .await?;

    Ok(())
}

fn guild_id(msg: &Message) -> AnyResult<GuildId> {
    msg.guild_id
        .ok_or_else(|| anyhow!("No Guild ID found"))
        .map_err(|e| {
            error!("This command must be sent within a guild: {}", e);
            e
        })
}

async fn get_channel_by_name(
    ctx: &Context,
    guild_id: &GuildId,
    channel_name: &str,
) -> AnyResult<GuildChannel> {
    ctx.http
        .get_channels(guild_id.0)
        .await
        .map_err(|e| anyhow!("Error getting channels: {}", e))
        .and_then(|channels| {
            channels
                .into_iter()
                .find(|channel| channel.name == channel_name)
                .ok_or_else(|| anyhow!("No channel found with name: {}", channel_name))
        })
}
