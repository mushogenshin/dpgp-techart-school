use super::*;
use regex::Regex;

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
/// This can act as either a student or an instructor.
pub struct User {
    pub email: String,
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

#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
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
pub enum UserLookup {
    Email(String),
    FullName(String),
    Discord(Discord),
}

impl From<&str> for UserLookup {
    fn from(input: &str) -> Self {
        let re = Regex::new(r"\w*@\w*\.\w*").unwrap();
        if re.is_match(input) {
            Self::Email(input.to_string())
        } else {
            // due to `serenity`'s `Args`'s strange interaction between `quoted()`
            // and `iter()` methods, we must remove the quotes ourselves
            Self::FullName(input.replace("\"", "").to_string())
        }
    }
}

impl std::fmt::Display for UserLookup {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            UserLookup::Email(email) => write!(f, "{}", email),
            UserLookup::FullName(full_name) => write!(f, "{}", full_name),
            UserLookup::Discord(discord) => write!(f, "{}", discord),
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize, PartialEq, Eq)]
pub struct Discord {
    #[serde(skip_serializing_if = "Option::is_none")]
    /// Using `String` as Firestore weirdly clamps `i64`.
    pub user_id: Option<String>,
    pub username: String,
}

impl Discord {
    pub fn username_only(username: String) -> Self {
        Self {
            user_id: None,
            username,
        }
    }
}

impl std::fmt::Display for Discord {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if let Some(user_id) = &self.user_id {
            write!(f, "Discord user {} <@{}>", self.username, user_id)
        } else {
            write!(f, "Discord user {}", self.username)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn lookup_from_str() {
        let email = "abc@def.com";
        assert_eq!(UserLookup::Email(email.to_string()), email.into());

        let name = "abc def";
        assert_eq!(UserLookup::FullName(name.to_string()), name.into());

        let name = "abc@def";
        assert_eq!(UserLookup::FullName(name.to_string()), name.into());

        let name = "abc def.com";
        assert_eq!(UserLookup::FullName(name.to_string()), name.into());
    }
}
