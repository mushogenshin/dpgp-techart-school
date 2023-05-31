use super::*;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct LearningModule {
    pub description: String,
    pub listed_fee: Fee,
    /// The [`Class`]es which this `Module` belongs to.
    pub parent_classes: Vec<ModuleOrder>,
    pub format: LearningFormat,
    #[serde(with = "firestore::serialize_as_timestamp")]
    pub starts_at: DateTime<Utc>,
    #[serde(with = "firestore::serialize_as_timestamp")]
    pub ends_at: DateTime<Utc>,
}

impl LearningModule {
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
        year: u16, // cannot be `u8`
        month: u8,
        day: u8,
    ) -> AnyResult<Self> {
        Ok(LearningModule::weeks_from(
            NaiveDate::from_ymd_opt(year as i32, month as u32, day as u32)
                .context("Invalid start date, expected year month day within proper range")?,
            LearningModule::to_weeks(&duration)?,
        ))
    }
}

impl Default for LearningModule {
    /// Makes a module with its end date 4 weeks from today.
    fn default() -> Self {
        Self {
            description: String::new(),
            listed_fee: Fee::default(),
            parent_classes: vec![],
            format: LearningFormat::default(),
            starts_at: Utc::now(),
            ends_at: Utc::now() + chrono::Duration::weeks(4),
        }
    }
}

// -------------------------------------------------------------------------------
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Fee {
    currency: String,
    amount: f32,
}

impl Default for Fee {
    fn default() -> Self {
        Self {
            currency: "VND".to_string(),
            amount: 3200000.,
        }
    }
}

// -------------------------------------------------------------------------------
#[derive(Debug, Clone, Default, Deserialize, Serialize, PartialEq, Eq)]
pub enum LearningFormat {
    #[default]
    Online,
    Offline,
    Hybrid,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
/// Place of a [`Module`] in a parent [`Class`].
pub struct ModuleOrder {
    /// ID of the parent [`Class`].
    class_id: String,
    order: u8,
}

impl ModuleOrder {
    pub fn new(class_id: &str, order: u8) -> Self {
        Self {
            class_id: class_id.to_string(),
            order,
        }
    }
}
