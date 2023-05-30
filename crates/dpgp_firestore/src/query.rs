use super::*;

use bricks_n_mortar::{Class, Student};
use firestore::*;
use futures::stream::BoxStream;
use futures::StreamExt;

#[derive(Debug, Clone)]
pub struct DpgpFirestore {
    inner: FirestoreDb,
}

impl DpgpFirestore {
    pub fn with_db(db: FirestoreDb) -> Self {
        Self { inner: db }
    }

    /// Get a class by ID.
    pub async fn class_by_id(&self, id: &str) -> FirestoreResult<Option<Class>> {
        let class = Class::wih_id(id);

        self.inner
            .fluent()
            .select()
            .by_id_in(CLASS_COLLECTION_NAME)
            .obj()
            .one(&class.id)
            .await
    }

    /// Get a student by email.
    pub async fn student_by_email(&self, email: &str) -> FirestoreResult<Vec<Student>> {
        // Query as a stream our data
        let object_stream: BoxStream<Student> = self
            .inner
            .fluent()
            .select()
            // field `id` is mandatory
            .fields(paths!(Student::{id, name, mail, registration, socials})) // Optionally select the fields needed
            .from(STUDENT_COLLECTION_NAME)
            .filter(|q| {
                q.for_all([
                    // q.field(path!(Student::some_num)).is_not_null(),
                    q.field(path!(Student::mail)).eq(email),
                    // // Sometimes you have optional filters
                    // Some("Test2")
                    //     .and_then(|value| q.field(path!(Student::one_more_string)).eq(value)),
                ])
            })
            // .order_by([(
            //     path!(Student::some_num),
            //     FirestoreQueryDirection::Descending,
            // )])
            .obj() // Reading documents as structures using Serde gRPC deserializer
            .stream_query()
            .await?;

        Ok(object_stream.collect().await)
    }
}
