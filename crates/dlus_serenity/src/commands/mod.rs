pub mod category;
pub mod meta;

#[allow(unused_imports)]
use super::*;

#[cfg(feature = "firebase")]
use crate::db::DpgpFirestore;

use serenity::{
    framework::standard::{macros::command, Args, CommandResult},
    model::prelude::*,
    prelude::*,
};

pub(crate) const CMD_PREFIX: &str = "~";
