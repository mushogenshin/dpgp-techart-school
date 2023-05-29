use super::*;
#[cfg(feature = "firebase")]
use dpgp_firestore::firestore::FirestoreResult;

#[command]
#[sub_commands(hihi)]
pub async fn meta(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let query = args.single::<String>()?;

    #[cfg(feature = "firebase")]
    {
        use bricks_n_mortar::{Class, CLASS_COLLECTION_NAME};

        let mut data = ctx.data.write().await;
        let db = data
            .get_mut::<DpgpFirestore>()
            .expect("Expected DpgpFirestore in TypeMap");

        let class = Class::wih_id(query);

        // Get by id
        let result: FirestoreResult<Option<Class>> = db
            .fluent()
            .select()
            .by_id_in(CLASS_COLLECTION_NAME)
            .obj()
            .one(&class.id)
            .await;

        msg.channel_id
            .say(
                &ctx.http,
                match result {
                    Ok(Some(class)) => {
                        format!("Found: {:?}", class)
                    }
                    Ok(None) => "Not found".to_string(),
                    Err(e) => format!("Query error: {:?}", e),
                },
            )
            .await?;
    }

    Ok(())
}

#[command]
pub async fn hihi(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let query = args.single::<String>()?;
    msg.reply(&ctx.http, format!("Sub function with arg: {}", query))
        .await?;

    Ok(())
}
