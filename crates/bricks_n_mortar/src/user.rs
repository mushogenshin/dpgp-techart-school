use super::*;

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
/// This can act as either a student or an instructor.
pub struct User {
    // pub email: String,
    pub name: String,
    /// Each `String` refers to the [`LearningModule`] ID.
    pub enrollment: Vec<String>,
    pub socials: Vec<Social>,
}

// impl User {
//     pub fn with_email(email: &str) -> Self {
//         Self {
//             email: email.to_string(),
//             ..Default::default()
//         }
//     }
// }

// #[derive(Debug, Clone, Default, Deserialize, Serialize)]
// pub struct Enrollment {
//     #[serde(rename = "classId")]
//     class: String,
//     #[serde(rename = "moduleId")]
//     module: u8,
// }

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Social {
    site: Site,
    username: Option<String>,
    user_id: Option<String>,     // DO NOT use number
    profile_url: Option<String>, // e.g., Facebook
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, Eq)]
pub enum Site {
    #[serde(rename = "facebook")]
    Facebook,
    #[serde(rename = "discord")]
    Discord,
}
