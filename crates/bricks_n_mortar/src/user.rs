use super::*;

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
/// This can act as either a student or an instructor.
pub struct User {
    pub full_name: String,
    pub nickname: String,
    pub motto: String,
    pub enrollments: Vec<Enrollment>,
    pub socials: Vec<Social>,
}

impl User {
    pub fn enrollments_empty_payment(mut self, modules: Vec<String>) -> Self {
        self.enrollments.extend(
            modules
                .into_iter()
                .map(|module| Enrollment::no_payment_id(module)),
        );
        self
    }

    pub fn discord(mut self, discord: (Option<i64>, Option<String>)) -> Self {
        if let Some(username) = discord.1 {
            self.socials.push(Social::Discord {
                user_id: discord.0.map(|id| id.to_string()),
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

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct Enrollment {
    /// The `String` refers to the [`LearningModule`] ID.
    module: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    payment_id: Option<i64>,
}

impl Enrollment {
    pub fn no_payment_id(module: String) -> Self {
        Self {
            module,
            ..Default::default()
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, Eq)]
pub enum Social {
    Facebook {
        profile_url: String,
    },
    Discord {
        #[serde(skip_serializing_if = "Option::is_none")]
        /// Using `String` as Firestore weirdly clamps `i64`.
        user_id: Option<String>,
        username: String,
    },
}
