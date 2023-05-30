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
    parent_classes: Vec<OrderInClass>,
    #[serde(with = "firestore::serialize_as_timestamp")]
    starts_at: DateTime<Utc>,
    #[serde(with = "firestore::serialize_as_timestamp")]
    ends_at: DateTime<Utc>,
}

impl Module {
    /// Converts a string of the form `(\d+)` to a `u8`.
    pub fn to_weeks(arg: &str) -> AnyResult<u8> {
        const PATTERN: &str = r"(\d+)";
        let re = Regex::new(PATTERN)?;
        let caps = re
            .captures(&arg)
            .context(format!("Found no capture groups of {} in {}", PATTERN, arg))?;
        caps.get(1)
            .context("Expected first capture group")?
            .as_str()
            .parse::<u8>()
            .map_err(|e| e.into())
    }

    pub fn with_date_range(start: NaiveDate, end: NaiveDate) -> Self {
        Self {
            starts_at: DateTime::from_utc(start.and_hms_opt(0, 0, 0).unwrap(), Utc),
            ends_at: DateTime::from_utc(end.and_hms_opt(23, 59, 59).unwrap(), Utc),
            ..Default::default()
        }
    }

    pub fn weeks_from(start: NaiveDate, weeks: u8) -> Self {
        let start = DateTime::from_utc(start.and_hms_opt(0, 0, 0).unwrap(), Utc);
        Self {
            ends_at: start + chrono::Duration::weeks(weeks as i64),
            starts_at: start,
            ..Default::default()
        }
    }

    pub fn with_duration_and_start_args(
        duration: &str,
        year: f64,
        month: f64,
        day: f64,
    ) -> AnyResult<Self> {
        Ok(Module::weeks_from(
            NaiveDate::from_ymd_opt(year as i32, month as u32, day as u32)
                .context("Invalid start date, expected year month day within proper range")?,
            Module::to_weeks(&duration)?,
        ))
    }
}

impl Default for Module {
    /// Makes a module with its end date 4 weeks from today.
    fn default() -> Self {
        Self {
            description: String::new(),
            listed_price: 0.,
            parent_classes: vec![],
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
