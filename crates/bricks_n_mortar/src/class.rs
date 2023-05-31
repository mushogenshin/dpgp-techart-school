use super::*;

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
