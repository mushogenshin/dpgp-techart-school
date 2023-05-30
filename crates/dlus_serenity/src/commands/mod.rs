pub mod channel;
pub mod inspect;
pub mod module;

use super::*;
use anyhow::Context as AnyhowContext;
use bricks_n_mortar::*;

use serenity::{
    framework::standard::{macros::command, Args, CommandResult},
    model::prelude::*,
    prelude::*,
};

pub(crate) const CMD_PREFIX: &str = "~";
const NO_DPGP_FIRESTORE_ERR: &str = "Expected DpgpFirestore in TypeMap";
