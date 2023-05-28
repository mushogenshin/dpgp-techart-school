use super::*;

#[command]
pub async fn meta(ctx: &Context, msg: &Message, mut args: Args) -> CommandResult {
    let scope = args.single::<String>()?;

    msg.channel_id
        .say(
            &ctx.http,
            format!(
                "Received META command about \"{}\" by user {}",
                scope, msg.author.name
            ),
        )
        .await?;

    #[cfg(feature = "firebase")]
    {
        let mut data = ctx.data.write().await;
        let _db = data
            .get_mut::<DpgpFirestore>()
            .expect("Expected DpgpFirestore in TypeMap");

        // const TEST_COLLECTION_NAME: &'static str = "classes";

        // let my_struct = MyTestStructure {
        //     classId: "ZBL3_2020".to_string(),
        //     ..Default::default()
        // };

        // // Get by id
        // let obj_by_id: Option<MyTestStructure> = db
        //     .fluent()
        //     .select()
        //     .by_id_in(TEST_COLLECTION_NAME)
        //     .obj()
        //     .one(&my_struct.classId)
        //     .await?;

        // assert!(obj_by_id.is_some());

        // info!("Get by id {:?}", obj_by_id);
    }

    Ok(())
}
