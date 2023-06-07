#[cfg(test)]
mod tests {
    use super::super::*;

    use anyhow::Result as AnyResult;
    use sqlx::sqlite::SqlitePool;

    #[derive(Debug, Clone, PartialEq, Eq, Hash, sqlx::FromRow)]
    struct Student {
        #[sqlx(rename = "Name")]
        name: String,
        #[sqlx(rename = "Email")]
        email: String,
        #[sqlx(rename = "Class")]
        class_str: String,

        #[sqlx(rename = "Discord_UserID")]
        discord_id: Option<i64>,
        #[sqlx(rename = "Discord_Username")]
        /// This can be `EMPTY` instead of `NULL`.
        discord_username: String,
        #[sqlx(rename = "Facebook")]
        /// This can be `EMPTY` instead of `NULL`.
        facebook: String,
    }

    impl Into<(String, User)> for Student {
        fn into(self) -> (String, User) {
            (
                self.email,
                User {
                    full_name: self.name,
                    ..Default::default()
                }
                .discord(if self.discord_username.is_empty() {
                    (self.discord_id, None)
                } else {
                    (self.discord_id, Some(self.discord_username))
                })
                .facebook(if self.facebook.is_empty() {
                    None
                } else {
                    Some(self.facebook)
                }),
            )
        }
    }

    async fn connect_to_file() -> AnyResult<SqlitePool> {
        let pool =
            SqlitePool::connect("/Users/mushogenshin/projects/dlus-py-bot/db/DPGP_Registration.db")
                .await?;

        Ok(pool)
    }

    /// Straight out from the database.
    async fn list_students(pool: &SqlitePool) -> AnyResult<Vec<Student>> {
        let recs = sqlx::query_as::<_, Student>(
            r#"
SELECT Name, Email, Class, Discord_UserID, Discord_Username, Facebook
FROM Students
    "#,
        )
        .fetch_all(pool)
        .await;

        Ok(recs?)
    }

    #[tokio::test]
    async fn make_students() -> AnyResult<()> {
        let db = connect_to_file().await?;

        let users: Vec<(String, User)> = list_students(&db)
            .await?
            .into_iter()
            // .filter(|s| s.discord_id.is_some())
            .map(|s| s.into())
            .collect();

        eprintln!("{:#?}", users);

        Ok(())
    }
}
