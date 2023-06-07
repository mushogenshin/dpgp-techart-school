use super::*;

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
/// This can act as either a student or an instructor.
pub struct User {
    pub id: String,
    pub full_name: String,
    pub nickname: String,
    pub motto: String,
    pub enrollments: Vec<Enrollment>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub facebook: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub discord: Option<Discord>,
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
            self.discord = Some(Discord {
                user_id: discord.0.map(|id| id.to_string()),
                username,
            });
        };
        self
    }

    pub fn facebook(mut self, profile_url: Option<String>) -> Self {
        self.facebook = profile_url;
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
pub struct Discord {
    #[serde(skip_serializing_if = "Option::is_none")]
    /// Using `String` as Firestore weirdly clamps `i64`.
    user_id: Option<String>,
    username: String,
}
