pub mod category;
pub mod meta;

pub(crate) const CMD_PREFIX: &str = "~";

use serenity::{
    framework::standard::{macros::command, Args, CommandResult},
    model::prelude::*,
    prelude::*,
};
