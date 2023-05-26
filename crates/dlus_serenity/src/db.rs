use dpgp_firestore::firestore::FirestoreDb;
use typemap_rev::TypeMapKey;

pub(crate) struct DpgpFirestore {}

impl TypeMapKey for DpgpFirestore {
    type Value = FirestoreDb;
}
