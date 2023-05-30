mod module;
pub use module::*;

pub extern crate anyhow;
pub extern crate chrono;

use anyhow::{Context as AnyContext, Result as AnyResult};
use chrono::{DateTime, NaiveDate, Utc};
use regex::Regex;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct Class {
    #[serde(rename = "classId")]
    pub id: String,
    format: OldFormat,
    location: String,
    #[serde(default)]
    category: Vec<Category>,
    #[serde(default)]
    modules: Vec<DumbModule>,
}

impl Class {
    pub fn wih_id(id: &str) -> Self {
        Self {
            id: id.to_string(),
            ..Default::default()
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, Eq)]
pub enum Category {
    Art,
    Anatomy,
    Sculpting,
    #[serde(rename = "3D Modeling")]
    Modeling,
    Maya,
    ZBrush,
    #[serde(rename = "Technical Art")]
    TechArt,
    Python,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct Student {
    pub id: u32,
    /// NOTE: if this is a field to be queried by, it shall not be renamed.
    pub mail: String,
    pub name: String,
    pub registration: Vec<Enrollment>,
    pub socials: Vec<Social>,
}

impl Student {
    pub fn with_email(email: &str) -> Self {
        Self {
            mail: email.to_string(),
            ..Default::default()
        }
    }
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct Enrollment {
    #[serde(rename = "classId")]
    class: String,
    #[serde(rename = "moduleId")]
    module: u8,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Social {
    site: Site,
    url: Option<String>,
    username: Option<String>,
    #[serde(rename = "userId")]
    /// ATTENTION: this is bad, should've used `String`
    user_id: Option<f32>,
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, Eq)]
pub enum Site {
    #[serde(rename = "facebook")]
    Facebook,
    #[serde(rename = "discord")]
    Discord,
}
