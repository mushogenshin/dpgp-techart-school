use super::*;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct DumbModule {
    #[serde(rename = "moduleId")]
    id: u8,
    name: String,
    price: f32,
    #[serde(rename = "startAt", with = "firestore::serialize_as_timestamp")]
    start: DateTime<Utc>,
    #[serde(rename = "endAt", with = "firestore::serialize_as_timestamp")]
    end: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Module {
    description: String,
    listed_price: f32,
    /// The [`Class`]es which this `Module` belongs to.
    belongs_to_classes: Vec<OrderInClass>,
    #[serde(with = "firestore::serialize_as_timestamp")]
    starts_at: DateTime<Utc>,
    #[serde(with = "firestore::serialize_as_timestamp")]
    ends_at: DateTime<Utc>,
}

impl Default for Module {
    /// Makes a module with its end date 4 weeks from today.
    fn default() -> Self {
        Self {
            description: String::new(),
            listed_price: 0.,
            belongs_to_classes: vec![],
            starts_at: Utc::now(),
            ends_at: Utc::now() + chrono::Duration::weeks(4),
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
/// Place of a [`Module`] in a [`Class`].
pub struct OrderInClass {
    class_id: String,
    order: u8,
}
