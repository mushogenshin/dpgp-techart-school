use super::*;

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct Class {
    /// Nice name of the class.
    name: String,
    description: String,
    location: String,
    category: Vec<Category>,
    // prerequisites: Vec<String>,
    // instructors: Vec<User>,
}

// -------------------------------------------------------------------------------
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
