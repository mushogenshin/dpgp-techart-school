use super::*;

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct User {
    pub id: u32,
    /// NOTE: if this is a field to be queried by, it shall not be renamed.
    pub mail: String,
    pub name: String,
    pub enrollment: Vec<Enrollment>,
    pub socials: Vec<Social>,
}

impl User {
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
