use super::*;
#[cfg(feature = "firebase")]
use dpgp_firestore::UserQuery;

const STUDENT_COLLECTION_NAME: &str = "students";

/// Get the first [`Discord`] mention in a [`Message`].
fn first_mention_opt(msg: &Message, args: &mut Args) -> Option<Discord> {
    msg.mentions.first().map(|user| {
        // User {
        //     id: UserId(378242536256569355),
        //     avatar: None,
        //     bot: false,
        //     discriminator: 1109,
        //     name: "tnbao91",
        //     public_flags: Some((empty)),
        //     banner: None,
        //     accent_colour: None,
        // }

        // the Discord mention also constitutes itself into the `args`, e.g.:
        // "<@378242536256569355>"
        // therefore we must advance once
        args.advance();

        Discord {
            user_id: Some(user.id.0.to_string()),
            username: user.name.clone(),
        }
    })
}

/// Get the first [`UserLookup`] in a [`Message`].
fn first_user_lookup(msg: &Message, args: &mut Args) -> Option<UserLookup> {
    first_mention_opt(msg, args)
        .map(|user| UserLookup::Discord(user))
        .or(args
            .quoted()
            .single::<String>()
            .ok()
            .map(|s| s.as_str().into()))
}

#[command]
// Limit all commands to be guild-restricted.
#[cfg_attr(feature = "admin_only", only_in(guilds))]
// Allow only administrators to call this.
#[cfg_attr(feature = "admin_only", required_permissions("ADMINISTRATOR"))]
#[aliases("s", "stu")]
#[sub_commands(pair_to_discord, register_module)]
/// Upper command queries a [`User`] as student by a "lookup" -- either by email or by full name.
/// USAGE: `~student <email>`, or
/// USAGE: `~student <full_name in quotes>`
pub async fn student(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let lookup = first_user_lookup(msg, &mut args).context("No user lookup provided")?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data.get::<DpgpQuery>().context(NO_DPGP_FIRESTORE_ERR)?;

        let student = db.user(&lookup, STUDENT_COLLECTION_NAME).await;

        // displays the result of the query
        msg.channel_id
            .say(
                &ctx.http,
                match student {
                    Ok(Some(student)) => {
                        format!(":crystal_ball: Found: {:?}", student)
                    }
                    Ok(None) => {
                        format!("No student found with lookup: {}", lookup)
                    }
                    Err(e) => format!(":grey_question: Query error: {:?}", e),
                },
            )
            .await?;
    }
    Ok(())
}

#[command]
#[aliases("p", "pair")]
/// USAGE: `~student pair <@discord_mention> <user lookup: by email or full name>`
async fn pair_to_discord(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let mention = first_mention_opt(msg, &mut args).context("No user mentioned")?;

    // NOTE: should only support lookup from email or full name
    // TODO: prevent user from mentioning two users while using this command
    let lookup: UserLookup = args.quoted().single::<String>()?.as_str().into();

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data.get::<DpgpQuery>().context(NO_DPGP_FIRESTORE_ERR)?;

        let student = db
            .update_discord_user(&lookup, mention.clone(), STUDENT_COLLECTION_NAME)
            .await;

        msg.channel_id
            .say(
                &ctx.http,
                match student {
                    Ok(_) => {
                        format!(
                            ":white_check_mark: Updated DB pairing for: `{}`",
                            mention.username
                        )
                    }
                    Err(e) => format!(":exclamation: Update error: {:?}", e),
                },
            )
            .await?;
    }

    Ok(())
}

#[command("register")]
#[aliases("r", "reg")]
async fn register_module(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let lookup = first_user_lookup(msg, &mut args).context("No user lookup provided")?;

    info!("Registering module for: {}", lookup);

    Ok(())
}
