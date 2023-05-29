pub mod category;
pub mod inspect;

#[allow(unused_imports)]
use super::*;

// #[cfg(feature = "firebase")]
// use dpgp_firestore::firestore::FirestoreResult;

use serenity::{
    framework::standard::{macros::command, Args, CommandResult},
    model::prelude::*,
    prelude::*,
};

pub(crate) const CMD_PREFIX: &str = "~";
