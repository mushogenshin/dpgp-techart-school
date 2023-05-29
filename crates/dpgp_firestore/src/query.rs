use bricks_n_mortar::Class;

use super::*;

#[derive(Debug, Clone)]
pub struct DpgpFirestore {
    inner: FirestoreDb,
}

impl DpgpFirestore {
    pub fn with_db(db: FirestoreDb) -> Self {
        Self { inner: db }
    }

    /// Get a class by ID.
    pub async fn class_by_id(&self, id: &str) -> FirestoreResult<Option<Class>> {
        let class = Class::wih_id(id);

        self.inner
            .fluent()
            .select()
            .by_id_in(CLASS_COLLECTION_NAME)
            .obj()
            .one(&class.id)
            .await
    }
}
