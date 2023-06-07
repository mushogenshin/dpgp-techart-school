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
    }

    async fn connect_to_file() -> AnyResult<SqlitePool> {
        let pool =
            SqlitePool::connect("/Users/mushogenshin/projects/dlus-py-bot/db/DPGP_Registration.db")
                .await?;

        Ok(pool)
    }

    async fn list_students(pool: &SqlitePool) -> AnyResult<Vec<User>> {
        let recs = sqlx::query_as::<_, Student>(
            r#"
SELECT Name, Email
FROM Students
    "#,
        )
        .fetch_all(pool)
        .await?;

        eprintln!("{:?}", recs);
        Ok(vec![])
    }

    #[tokio::test]
    async fn make_students() -> AnyResult<()> {
        let db = connect_to_file().await?;

        let students = list_students(&db).await?;

        Ok(())
    }
}
