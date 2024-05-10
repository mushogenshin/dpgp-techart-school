mod modules_n_classes;

#[cfg(feature = "sqlite")]
mod students_n_instructors;

#[cfg(test)]
use super::*;

#[cfg(test)]
/// Create a database instance.
async fn connect() -> FirestoreResult<DpgpFirestore> {
    const TOKEN_FILE_PATH: &str =
        "/Users/mushogenshin/projects/dpgp-techart-school/frontend_react/.keys/dpgp-techart-daulauusau.json";
    const PROJECT_ID: &str = "dpgp-techart";

    client_from_token(GCPProjectAndToken {
        google_project_id: PROJECT_ID.to_string(),
        firestore_token: TokenSourceType::File(TOKEN_FILE_PATH.into()),
    })
    .await
    .map(|db| DpgpFirestore::with_db(db))

    // // Get by id
    // let obj_by_id: Option<Class> = db.inner
    //     .fluent()
    //     .select()
    //     .by_id_in(CLASS_COLLECTION_NAME)
    //     .obj()
    //     .one("HAA19")
    //     .await?;
}
