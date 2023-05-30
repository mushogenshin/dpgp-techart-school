use super::*;

#[command]
#[sub_commands(class_by_id, student_by_email)]
pub async fn inspect(_ctx: &Context, _msg: &Message, _args: Args) -> CommandResult {
    Ok(())
}

#[command("class")]
/// Subcommand for inspecting a class.
async fn class_by_id(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let query = args.single::<String>()?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data
            .get::<DpgpQuery>()
            .expect("Expected DpgpFirestore in TypeMap");

        let class = db.class_by_id(&query).await;

        msg.reply(
            &ctx.http,
            match class {
                Ok(Some(class)) => {
                    format!("Found: {:?}", class)
                }
                Ok(None) => format!("No class found with ID: {}", query),
                Err(e) => format!("Query error: {:?}", e),
            },
        )
        .await?;
    }

    Ok(())
}

#[command("student")]
/// Subcommand for inspecting a student.
async fn student_by_email(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let query = args.single::<String>()?;

    #[cfg(feature = "firebase")]
    {
        let data = ctx.data.read().await;
        let db = data
            .get::<DpgpQuery>()
            .expect("Expected DpgpFirestore in TypeMap");

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
