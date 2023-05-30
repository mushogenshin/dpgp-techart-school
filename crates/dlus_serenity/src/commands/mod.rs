pub mod channel;
pub mod inspect;
pub mod module;

use super::*;
use bricks_n_mortar::*;

use serenity::{
    framework::standard::{macros::command, Args, CommandResult},
    model::prelude::*,
    prelude::*,
};

pub(crate) const CMD_PREFIX: &str = "~";
