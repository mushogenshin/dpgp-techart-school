use serde::{Deserialize, Serialize};

// Example structure to play with
#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[allow(non_snake_case)]
struct MyTestStructure {
    classId: String,
    format: String,
    location: String,
}
