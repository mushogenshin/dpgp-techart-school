use super::*;

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct Class {
    pub id: String,
    /// Nice name of the class.
    name: String,
    description: String,
    location: String,
    categories: Vec<Category>,
    // /// Each `String` refers to a `Class` ID.
    // prerequisites: Vec<String>,
    /// This refers to each [`User::full_name`] in the "instructors" collection.
    instructors: Vec<String>,
    /// This refers to each [`User::full_name`] in the "instructors" collection.
    assistants: Vec<String>,
    study_groups: Vec<StudyGroup>,
}

impl Class {
    pub fn new(id: &str) -> Self {
        Self {
            id: id.to_string(),
            ..Default::default()
        }
    }

    pub fn categories(mut self, cat: &[&str]) -> Self {
        self.categories = cat.iter().map(|c| Category::from(*c)).collect();
        self
    }

    pub fn location(mut self, loc: &str) -> Self {
        self.location = loc.to_string();
        self
    }

    pub fn name(mut self, name: &str) -> Self {
        self.name = name.to_string();
        self
    }

    pub fn instructor(mut self, name: &str) -> Self {
        self.instructors.push(name.to_string());
        self
    }

    pub fn assistant(mut self, name: &str) -> Self {
        self.assistants.push(name.to_string());
        self
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
    /// For programmatical input, use "Modeling".
    Modeling,
    Rigging,
    #[serde(rename = "Technical Art")]
    TechArt,
    Maya,
    ZBrush,
    Python,
    Other(String),
}

impl From<&str> for Category {
    fn from(cat: &str) -> Self {
        match cat.to_lowercase().as_str() {
            "art" => Self::Art,
            "anatomy" => Self::Anatomy,
            "sculpting" => Self::Sculpting,
            "modeling" => Self::Modeling,
            "rigging" => Self::Rigging,
            "techart" => Self::TechArt,
            "maya" => Self::Maya,
            "zbrush" => Self::ZBrush,
            "python" => Self::Python,
            _ => Self::Other(cat.to_string()),
        }
    }
}
