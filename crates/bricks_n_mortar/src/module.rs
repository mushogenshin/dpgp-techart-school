use super::*;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct LearningModule {
    pub id: String,
    pub description: String,
    pub listed_fee: Fee,
    /// The [`Class`]es which this `Module` belongs to.
    pub parent_classes: Vec<ModuleOrder>,
    pub format: LearningFormat,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub folder_label: Option<String>,
    pub duration: DurationInWeeks,
    #[serde(with = "firestore::serialize_as_timestamp")]
    pub starts_at: DateTime<Utc>,
    #[serde(with = "firestore::serialize_as_timestamp")]
    pub ends_at: DateTime<Utc>,
}

impl LearningModule {
    pub fn new(id: &str) -> Self {
        Self {
            id: id.to_string(),
            ..Default::default()
        }
    }

    pub fn with_date_range(start: NaiveDate, end: NaiveDate) -> Self {
        Self {
            starts_at: DateTime::from_utc(start.and_hms_opt(0, 0, 0).unwrap(), Utc),
            ends_at: DateTime::from_utc(end.and_hms_opt(23, 59, 59).unwrap(), Utc),
            ..Default::default()
        }
    }

    pub fn folder_label(mut self, label: &str) -> Self {
        self.folder_label = Some(label.to_string());
        self
    }

    /// Offset the start week with regard to all modules that came before, e.g.,
    /// if the offset (sum duration of all previous modules) = 12,
    /// then "Week 13" is the first week of this module.
    pub fn weeks_offset(mut self, offset: u8) -> Self {
        self.duration.offset = offset;
        self
    }

    fn weeks_from(mut self, start: NaiveDate, weeks: u8) -> Self {
        self.duration.weeks = weeks;

        let start = DateTime::from_utc(start.and_hms_opt(0, 0, 0).unwrap(), Utc);
        self.ends_at = start + chrono::Duration::weeks(weeks as i64);
        self.starts_at = start;
        self
    }

    /// Duration in weeks, and start date.
    pub fn duration_and_start(
        self,
        duration: &str,
        year: u16, // cannot be `u8`
        month: u8,
        day: u8,
    ) -> AnyResult<Self> {
        let start = NaiveDate::from_ymd_opt(year as i32, month as u32, day as u32)
            .context("Invalid start date, expected year month day within proper range")?;
        Ok(self.weeks_from(start, LearningModule::to_weeks(&duration)?))
    }

    pub fn format(mut self, format: LearningFormat) -> Self {
        self.format = format;
        self
    }

    pub fn parent_class(mut self, parent: (&str, u8)) -> Self {
        self.parent_classes.push(ModuleOrder::from(parent));
        self
    }

    pub fn description(mut self, desc: &str) -> Self {
        self.description = desc.to_string();
        self
    }

    /// Converts a string of the form `(\d+)` to a `u8`.
    pub fn to_weeks(arg: &str) -> AnyResult<u8> {
        const PATTERN: &str = r"(\d+)";
        let re = Regex::new(PATTERN)?;
        let caps = re.captures(&arg).context(format!(
            "Found no regex capture groups of {} in {}",
            PATTERN, arg
        ))?;
        caps.get(1)
            .context("Expected first regex capture group")?
            .as_str()
            .parse::<u8>()
            .map_err(|e| e.into())
    }
}

impl Default for LearningModule {
    /// Makes a module with its end date 4 weeks from today.
    fn default() -> Self {
        Self {
            id: String::new(),
            description: String::new(),
            listed_fee: Fee::default(),
            parent_classes: vec![],
            format: LearningFormat::default(),
            folder_label: None,
            duration: DurationInWeeks::default(),
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

impl From<(&str, u8)> for ModuleOrder {
    fn from(value: (&str, u8)) -> Self {
        Self::new(value.0, value.1)
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct DurationInWeeks {
    weeks: u8,
    /// Used to offset the start week, e.g., "Week 5" as the first week of this module.
    offset: u8,
}

impl Default for DurationInWeeks {
    fn default() -> Self {
        Self {
            weeks: 4,
            offset: 0,
        }
    }
}
