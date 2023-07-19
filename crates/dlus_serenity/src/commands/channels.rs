use super::*;

use serde_json::json;
use serenity::model::channel::{PermissionOverwrite, PermissionOverwriteType};
use serenity::model::id::RoleId;
use serenity::model::permissions::Permissions;

#[command]
#[aliases("chan")]
#[sub_commands(create_module_channels)]
/// Upper command queries a Discord channel within the current guild by its name.
/// USAGE: `~channel <name>`
pub async fn channel(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let channel_name = args.single::<String>()?;
    let guild = current_guild(ctx, msg).await?;

    let channel = guild
        .channels(&ctx.http)
        .await
        .map_err(|e| anyhow!("Error getting channels: {}", e))
        .and_then(|channels| {
            channels
                .into_values()
                .find(|channel| channel.name == channel_name)
                .ok_or_else(|| anyhow!("No channel found with name: {}", channel_name))
        });

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
    let guild = current_guild(ctx, msg).await?;

    let everyone = guild
        .roles
        .get(&RoleId(guild.id.0))
        .context(format!(
            "@everyone role ({}) missing in {}",
            guild.id, guild.name,
        ))
        .map_err(|e| {
            error!("{}", e);
            e
        })?;

    // first we create a dedicated role for the category
    let new_role = guild
        .create_role(&ctx.http, |r| {
            r.name(format!("{}-{}", class, module))
                .hoist(true)
                .mentionable(true)
                .permissions(Permissions::empty())
                .colour(15277667) // LuminousVividPink
        })
        .await?;

    let mut allow = PRESET_TEXT
        | Permissions::SEND_MESSAGES_IN_THREADS
        | Permissions::CREATE_PUBLIC_THREADS
        | Permissions::CREATE_PRIVATE_THREADS
        | Permissions::USE_EXTERNAL_STICKERS;
    allow.toggle(Permissions::CREATE_INSTANT_INVITE);
    allow.toggle(Permissions::MENTION_EVERYONE);
    allow.toggle(Permissions::SEND_TTS_MESSAGES);

    let permissions = vec![
        PermissionOverwrite {
            allow: Permissions::empty(),
            deny: Permissions::VIEW_CHANNEL,
            kind: PermissionOverwriteType::Role(everyone.id),
        },
        PermissionOverwrite {
            allow: allow,
            deny: PRESET_VOICE,
            kind: PermissionOverwriteType::Role(new_role.id),
        },
    ];

    // then we must create a common category for the channels
    let category = guild
        .create_channel(&ctx.http, |c| {
            c.name(format!("{}-{}", class, module).to_uppercase())
                .kind(ChannelType::Category)
                .permissions(permissions)
                .position(0)
        })
        .await;

    if let Err(e) = &category {
        error!("Error creating category: {}", e);
    };

    let category = category?;

    let channels = vec![
        (format!("📺{}-{}-general", class, module), "Link Google Meet lớp học :computer: + các thông báo chung :loudspeaker:... sẽ được post ở đây"),
        (format!("💢{}-{}-wip-sharing", class, module), "Post WIPs lên đây nghen bà con :art:! Sôi nổi lên nào :relieved:"),
        (format!("📬{}-{}-ta-recap", class, module), "Tóm tắt bài học :scroll: từ người trợ giảng tài ba :man_mage:"),
        (format!("👾{}-{}-bot", class, module), "Tương tác với bot :robot:, nên tắt hết notification cho kênh này :eyes:"),
    ];

    let mut create = vec![];
    channels
        .iter()
        .enumerate()
        .for_each(|(idx, (name, topic))| {
            create.push(guild.create_channel(&ctx.http, move |c| {
                c.name(name)
                    .topic(topic)
                    .kind(ChannelType::Text)
                    .category(category.id)
                    .position(idx as u32)
            }));
        });

    let _results = futures::future::join_all(create).await;

    Ok(())
}

async fn current_guild(ctx: &Context, msg: &Message) -> AnyResult<PartialGuild> {
    ctx.http
        .get_guild(
            msg.guild_id
                .ok_or_else(|| anyhow!("No Guild ID found"))
                .map_err(|e| {
                    error!("This command must be sent within a guild: {}", e);
                    e
                })?
                .0,
        )
        .await
        .map_err(|e| anyhow!("Error getting guild: {}", e))
}
