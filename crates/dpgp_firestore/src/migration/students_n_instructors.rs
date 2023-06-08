#[cfg(test)]
mod tests {
    use super::super::*;

    use anyhow::Result as AnyResult;
    use sqlx::sqlite::SqlitePool;

    const STUDENT_COLLECTION_NAME: &str = "students";

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

    fn class_id_to_module_id(class_id: String) -> String {
        let module_id = match class_id.as_str() {
            "haa01" => "HAA01_all",
            "haa02" => "HAA02_all",
            "haa03" => "HAA03_all",
            "haa04" => "HAA04_all",
            "haa05" => "HAA05_all",
            "haa06" => "HAA06_all",
            "haa07" => "HAA07_all",
            "haa08" => "HAA08_all",
            "haa09" => "HAA09_all",
            "dprg_2018" => "DPRG_2018_all",
            "haa10" => "HAA10_all",
            "dfs01" => "DFS01_all",
            "haa11" => "HAA11_all",
            "haa12" => "HAA12_all",
            "zbl3_2019" => "ZBL3_2019_all",
            "mapy2019" => "MAPY2019_all",
            "haa13" => "HAA13_all",
            "zbl3_2020" => "ZBL3_2020_all",
            "haa14" => "HAA14_all",
            "mapy2020" => "MAPY2020_all",
            "haa15" => "HAA15_all",
            "haa16" => "HAA16_all",
            "haa17" => "HAA17_all",
            "haa18" => "HAA18_all",
            "haa19" => "HAA19_all",
            "dprg_2023" => "DPRG_2023_all",
            "py101_2023" => "PY101_2023_all",
            "haa20" => "HAA20_mod1",   // skips "HAA20" module 2-3-4
            "fap01" => "FAP01_trackA", // skips "FAP01" track B
            _ => "",
        };
        module_id.to_string()
    }

    impl Into<User> for Student {
        fn into(self) -> User {
            let enrolled_modules = self
                .class_str
                .split(",")
                .into_iter()
                .map(|s| s.trim().to_lowercase())
                .map(|s| class_id_to_module_id(s))
                // skips anomaly classes
                .filter(|s| !s.is_empty())
                .collect::<Vec<String>>();

            User {
                email: self.email.to_lowercase(),
                full_name: self.name.trim().to_string(),
                ..Default::default()
            }
            .enrollments_empty_payment(enrolled_modules)
            .discord(if self.discord_username.is_empty() {
                (self.discord_id, None)
            } else {
                (self.discord_id, Some(self.discord_username))
            })
            .facebook(if self.facebook.trim().is_empty() {
                None
            } else {
                Some(self.facebook.trim().to_string())
            })
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
    async fn make_all_students() -> AnyResult<()> {
        // SQLite DB
        let from = connect_to_file().await?;

        let users: Vec<User> = list_students(&from)
            .await?
            .into_iter()
            // .filter(|s| s.discord_id.is_some())
            .map(|s| s.into())
            // .take(5)
            .collect();

        // Firestore DB
        let to = connect().await?;
        let mut create = vec![];

        users.iter().enumerate().for_each(|(idx, student)| {
            eprintln!("Got student #{}: {:#?}", idx + 1, student.full_name);
            create.push(to.create_user(&student.email, student, STUDENT_COLLECTION_NAME));
        });

        futures::future::join_all(create).await;

        Ok(())
    }

    #[tokio::test]
    async fn update_discord() -> AnyResult<()> {
        let db = connect().await?;

        let result = db
            .update_discord(
                "Nguyễn Đức Anh",
                Discord {
                    user_id: Some("12345".to_string()),
                    username: "unknown".to_string(),
                },
                STUDENT_COLLECTION_NAME,
            )
            .await;

        assert!(result.is_ok());

        Ok(())
    }
}

// 9223372036854776000
// 402125417273622528
// 402125417273622500
