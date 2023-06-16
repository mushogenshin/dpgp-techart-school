use super::*;
use serde_json::json;

#[command]
#[aliases("chan")]
#[sub_commands(create_module_channels)]
/// Upper command queries a Discord channel within the current guild by its name.
/// USAGE: `~channel <name>`
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
/// USAGE: `~channel new <class> <module>`,
/// e.g., `~channel new HAA_22 mod3`
pub async fn create_module_channels(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let class = args.single::<String>()?.to_lowercase().replace("_", "-"); // should be in the form of "ABC_##"
    let module = args.single::<String>()?.to_lowercase();
    let guild_id = guild_id(msg)?;

    // first we must create a common category for the channels
    let category = create_category(
        ctx,
        &guild_id,
        &format!("{}-{}", class, module).to_uppercase(),
    )
    .await?;

    let channel_names: Vec<JsonMap> = vec![
        (format!("📺{}-{}-general", class, module), "Link Google Meet lớp học :computer: + các thông báo chung :loudspeaker:... sẽ được post ở đây"),
        (format!("💢{}-{}-wip-sharing", class, module), "Post WIPs lên đây nghen bà con :art:! Sôi nổi lên nào :relieved:"),
        (format!("📬{}-{}-ta-recap", class, module), "Tóm tắt bài học :scroll: từ người trợ giảng tài ba :man_mage:"),
        (format!("👾{}-{}-bot", class, module), "Tương tác với bot :robot:, nên tắt hết notification cho kênh này :eyes:"),
    ]
    .into_iter()
    .enumerate()
    .map(|(idx, (name, topic))| {
        serde_json::from_value(json!({ "name": name,
           "topic": topic,
           "parent_id": category.id.0,
           "position": idx + 1,
        }))
        .unwrap()
    })
    .collect();

    info!("Creating channels: {:?}", channel_names);

    let mut create = vec![];
    channel_names.iter().for_each(|map| {
        create.push(ctx.http.create_channel(guild_id.0, &map, None));
    });

    let _channels = futures::future::join_all(create).await;

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

async fn create_category(
    ctx: &Context,
    guild_id: &GuildId,
    category_name: &str,
) -> AnyResult<GuildChannel> {
    ctx.http
        .create_channel(
            guild_id.0,
            &serde_json::from_value(json!({
                "name": category_name,
                "type": 4,
                "position": 0
            }))?,
            None,
        )
        .await
        .map_err(|e| anyhow!("Error creating category: {}", e))
}
