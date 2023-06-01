use super::*;

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct Class {
    /// Nice name of the class.
    name: String,
    description: String,
    location: String,
    category: Vec<Category>,
    // /// Each `String` refers to a `Class` ID.
    // prerequisites: Vec<String>,
    /// This refers to the "instructors" collection.
    instructors: Vec<User>,
    study_groups: Vec<StudyGroup>,
}

impl Class {
    pub fn with_categories(cat: &[&str]) -> Self {
        Self {
            category: cat.iter().map(|c| Category::from(*c)).collect(),
            ..Default::default()
        }
    }
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct StudyGroup {
    name: String,
    order: u8,
    /// Each `String` refers to the [`User`]'s ID.
    members: Vec<String>,
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
    Other,
}

impl From<&str> for Category {
    fn from(cat: &str) -> Self {
        match cat.to_lowercase().as_str() {
            "art" => Self::Art,
            "anatomy" => Self::Anatomy,
            "sculpting" => Self::Sculpting,
            "modeling" => Self::Modeling,
            "maya" => Self::Maya,
            "zbrush" => Self::ZBrush,
            "techart" => Self::TechArt,
            "python" => Self::Python,
            _ => Self::Other,
        }
    }
}
