use dpgp_firestore::firestore::FirestoreDb;
use serenity::prelude::TypeMapKey;

pub(crate) struct DpgpFirestore {}

impl TypeMapKey for DpgpFirestore {
    type Value = FirestoreDb;
}
