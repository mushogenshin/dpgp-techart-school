use super::*;
#[cfg(feature = "firebase")]
use dpgp_firestore::UserQuery;

const STUDENT_COLLECTION_NAME: &str = "students";

#[command]
// // Limit all commands to be guild-restricted.
// #[only_in(guilds)]
// // Allow only administrators to call this:
// #[required_permissions("ADMINISTRATOR")]
#[aliases("s", "stu")]
// #[sub_commands(new)]
/// Upper command queries a [`User`] as student by their full name.
/// USAGE: `~student <full_name in quotes>`
pub async fn student(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let student_full_name = args.quoted().single::<String>()?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data.get::<DpgpQuery>().context(NO_DPGP_FIRESTORE_ERR)?;

        let student = db
            .user_by_exact_name(&student_full_name, STUDENT_COLLECTION_NAME)
            .await;

        // displays the result of the query
        msg.reply(
            &ctx.http,
            match student {
                Ok(Some(student)) => {
                    format!(":crystal_ball: Found: {:?}", student)
                }
                Ok(None) => {
                    format!("No student found with full name: {}", student_full_name)
                }
                Err(e) => format!(":grey_question: Query error: {:?}", e),
            },
        )
        .await?;
    }
    Ok(())
}
