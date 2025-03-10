#![allow(unused_imports)]

pub mod channels;
pub mod classes;
pub mod modules;
pub mod users;

use super::*;
use anyhow::{anyhow, Context as AnyhowContext, Result as AnyResult};
use bricks_n_mortar::*;

use serenity::{
    framework::standard::{macros::command, Args, CommandResult},
    json::JsonMap,
    model::prelude::*,
    prelude::*,
};

pub(crate) const CMD_PREFIX: &str = "~";
#[cfg(feature = "firebase")]
const NO_DPGP_FIRESTORE_ERR: &str = "Expected DpgpFirestore in TypeMap";
