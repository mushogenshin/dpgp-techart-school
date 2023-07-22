use super::*;
use serenity::prelude::TypeMapKey;

pub(crate) struct DpgpQuery {}

impl TypeMapKey for DpgpQuery {
    type Value = DpgpFirestore;
}
