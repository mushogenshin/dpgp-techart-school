use super::*;

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
/// This can act as either a student or an instructor.
pub struct User {
    pub full_name: String,
    pub nickname: String,
    pub motto: String,
    /// Each `String` refers to the [`LearningModule`] ID.
    pub enrollment: Vec<String>,
    pub socials: Vec<Social>,
}

impl User {
    pub fn enrollment(mut self, modules: Vec<String>) -> Self {
        self.enrollment.extend(modules);
        self
    }

    pub fn discord(mut self, discord: (Option<i64>, Option<String>)) -> Self {
        if let Some(username) = discord.1 {
            self.socials.push(Social::Discord {
                user_id: discord.0,
                username,
            });
        };
        self
    }

    pub fn facebook(mut self, url: Option<String>) -> Self {
        if let Some(profile_url) = url {
            self.socials.push(Social::Facebook { profile_url }.into());
        };
        self
    }
}

// #[derive(Debug, Clone, Default, Deserialize, Serialize)]
// pub struct Enrollment {
//     #[serde(rename = "classId")]
//     class: String,
//     #[serde(rename = "moduleId")]
//     module: u8,
// }

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, Eq)]
pub enum Social {
    Facebook {
        profile_url: String,
    },
    Discord {
        #[serde(skip_serializing_if = "Option::is_none")]
        user_id: Option<i64>,
        username: String,
    },
}
