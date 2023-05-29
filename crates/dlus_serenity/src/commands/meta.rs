use super::*;
use bricks_n_mortar::Class;
use dpgp_firestore::firestore::FirestoreResult;

#[command]
pub async fn meta(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let query = args.single::<String>()?;

    #[cfg(feature = "firebase")]
    {
        let mut data = ctx.data.write().await;
        let db = data
            .get_mut::<DpgpFirestore>()
            .expect("Expected DpgpFirestore in TypeMap");

        const TEST_COLLECTION_NAME: &'static str = "classes";

        let class = Class::wih_id(query);

        // Get by id
        let result: FirestoreResult<Option<Class>> = db
            .fluent()
            .select()
            .by_id_in(TEST_COLLECTION_NAME)
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
