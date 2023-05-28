use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

// Example structure to play with
#[derive(Debug, Clone, Default, Deserialize, Serialize)]
// #[allow(non_snake_case)]
pub struct Class {
    #[serde(rename = "classId")]
    pub id: String,
    format: Format,
    location: String,
    category: Vec<Category>,
    modules: Vec<Module>,
}

impl Class {
    pub fn wih_id(id: String) -> Self {
        Self {
            id,
            ..Default::default()
        }
    }
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub enum Format {
    #[default]
    Online,
    Offline,
    #[serde(rename = "Hybrid (Online + Offline)")]
    Hybrid,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
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

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Module {
    #[serde(rename = "moduleId")]
    id: u8,
    name: String,
    price: f32,
    #[serde(rename = "startAt")]
    start: DateTime<Utc>,
    #[serde(rename = "endAt")]
    end: DateTime<Utc>,
}
