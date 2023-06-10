use super::*;
#[cfg(feature = "firebase")]
use dpgp_firestore::UserQuery;

const STUDENT_COLLECTION_NAME: &str = "students";

#[command]
// Limit all commands to be guild-restricted.
#[cfg_attr(feature = "admin_only", only_in(guilds))]
// Allow only administrators to call this.
#[cfg_attr(feature = "admin_only", required_permissions("ADMINISTRATOR"))]
#[aliases("s", "stu")]
#[sub_commands(pair_to_discord)]
/// Upper command queries a [`User`] as student by a "lookup" -- either by email or by full name.
/// USAGE: `~student <email>`, or
/// USAGE: `~student <full_name in quotes>`
pub async fn student(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let lookup = args.quoted().single::<String>()?.as_str().into();

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
/// USAGE: `~student pair <@discord_mention> <full_name in quotes>`
async fn pair_to_discord(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    // msg.mentions.iter().for_each(|mention| {
    //     info!("Mention: {:?}", mention);
    //     // User {
    //     //     id: UserId(378242536256569355),
    //     //     avatar: None,
    //     //     bot: false,
    //     //     discriminator: 1109,
    //     //     name: "tnbao91",
    //     //     public_flags: Some((empty)),
    //     //     banner: None,
    //     //     accent_colour: None,
    //     // }
    // });

    let discord_mention = msg.mentions.first().context("No user mentioned")?;

    args.advance(); // the Discord mention also constitutes itself into the args
    let lookup = args.quoted().single::<String>()?.as_str().into();

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data.get::<DpgpQuery>().context(NO_DPGP_FIRESTORE_ERR)?;

        let student = db
            .update_discord_user(
                &lookup,
                Discord {
                    user_id: Some(discord_mention.id.0.to_string()),
                    username: discord_mention.name.clone(),
                },
                STUDENT_COLLECTION_NAME,
            )
            .await;

        msg.channel_id
            .say(
                &ctx.http,
                match student {
                    Ok(_) => {
                        format!(
                            ":white_check_mark: Updated Discord UserID for: `{}`",
                            discord_mention.name
                        )
                    }
                    Err(e) => format!(":exclamation: Update error: {:?}", e),
                },
            )
            .await?;
    }

    Ok(())
}
