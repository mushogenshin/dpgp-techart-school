#[cfg(test)]
mod tests {
    use super::super::*;

    #[tokio::test]
    async fn make_all_modules() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let modules = [
            (
                "HAA01_all",
                LearningModule::with_duration_and_start_args("8w", 2016, 12, 15)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA01", 1)),
            ),
            (
                "HAA02_all",
                LearningModule::with_duration_and_start_args("8w", 2017, 4, 15)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA02", 1)),
            ),
            (
                "HAA03_all", // VNG
                LearningModule::with_duration_and_start_args("12w", 2017, 5, 30)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA03", 1)),
            ),
            (
                "HAA04_all", // BlueR
                LearningModule::with_duration_and_start_args("8w", 2017, 7, 1)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA04", 1)),
            ),
            (
                "HAA05_all", // Hanoi
                LearningModule::with_duration_and_start_args("2w", 2017, 10, 15)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Human Anatomy for Artists")
                    .parent_class(("HAA05", 1)),
            ),
            (
                "HAA06_all",
                LearningModule::with_duration_and_start_args("8w", 2017, 11, 10)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA06", 1)),
            ),
            (
                "HAA07_all",
                LearningModule::with_duration_and_start_args("8w", 2018, 3, 1)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA07", 1)),
            ),
            (
                "HAA08_all", // SPARX*
                LearningModule::with_duration_and_start_args("4w", 2018, 7, 1)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Basics of Human Anatomy")
                    .parent_class(("HAA08", 1)),
            ),
            (
                "HAA09_all", // Fast-track
                LearningModule::with_duration_and_start_args("2w", 2018, 9, 29)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA09", 1)),
            ),
            (
                "DPRG_2018_all",
                LearningModule::with_duration_and_start_args("8w", 2018, 9, 15)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Introduction to Rigging in Maya")
                    .parent_class(("DPRG_2018", 1)),
            ),
            (
                "HAA10_all",
                LearningModule::with_duration_and_start_args("8w", 2018, 10, 15)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA10", 1)),
            ),
            (
                "DFS01_all",
                LearningModule::with_duration_and_start_args("12w", 2019, 3, 20)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Figure Sculpting in ZBrush")
                    .parent_class(("DFS01", 1)),
            ),
            (
                "HAA11_all",
                LearningModule::with_duration_and_start_args("8w", 2019, 6, 1)
                    .unwrap()
                    // online
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA11", 1)),
            ),
            (
                "HAA12_all", // Fast-track
                LearningModule::with_duration_and_start_args("4w", 2019, 10, 15)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA12", 1)),
            ),
            (
                "ZBL3_2019_all",
                LearningModule::with_duration_and_start_args("12w", 2019, 11, 30)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Introduction to ZBrush")
                    .parent_class(("ZBL3_2019", 1)),
            ),
            (
                "MAPY_2019_all",
                LearningModule::with_duration_and_start_args("6w", 2019, 12, 1)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Introduction to Python Scripting in Maya")
                    .parent_class(("MAPY_2019", 1)),
            ),
            (
                "HAA13_all", // COVID-19
                LearningModule::with_duration_and_start_args("16w", 2020, 5, 20)
                    .unwrap()
                    .format(LearningFormat::Hybrid)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA13", 1)),
            ),
            (
                "ZBL3_2020_all",
                LearningModule::with_duration_and_start_args("10w", 2020, 7, 1)
                    .unwrap()
                    // online
                    .description("Introduction to ZBrush")
                    .parent_class(("ZBL3_2020", 1)),
            ),
            (
                "HAA14_all",
                LearningModule::with_duration_and_start_args("16w", 2020, 10, 1)
                    .unwrap()
                    .format(LearningFormat::Hybrid)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA14", 1)),
            ),
            (
                "MAPY_2020_all",
                LearningModule::with_duration_and_start_args("10w", 2020, 10, 1)
                    .unwrap()
                    // online
                    .description("In-Depth Python Scripting in Maya")
                    .parent_class(("MAPY_2020", 1)),
            ),
            (
                "HAA15_all", // Fast-track
                LearningModule::with_duration_and_start_args("3w", 2020, 12, 15)
                    .unwrap()
                    .format(LearningFormat::Offline)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA15", 1)),
            ),
            (
                "HAA16_all",
                LearningModule::with_duration_and_start_args("12w", 2021, 3, 10)
                    .unwrap()
                    // online
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA16", 1)),
            ),
            (
                "HAA17_all",
                LearningModule::with_duration_and_start_args("16w", 2021, 10, 1)
                    .unwrap()
                    .format(LearningFormat::Hybrid)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA17", 1)),
            ),
            (
                "HAA18_all",
                LearningModule::with_duration_and_start_args("16w", 2022, 3, 1)
                    .unwrap()
                    .format(LearningFormat::Hybrid)
                    .description("Human Anatomy In-Depth")
                    .parent_class(("HAA18", 1)),
            ),
            (
                "HAA19_all", // Fast-track
                LearningModule::with_duration_and_start_args("4w", 2022, 12, 2)
                    .unwrap()
                    .format(LearningFormat::Hybrid)
                    .description("Human Anatomy for Artists")
                    .parent_class(("HAA19", 1)),
            ),
            (
                "PY101_2023_all",
                LearningModule::with_duration_and_start_args("12w", 2023, 3, 19)
                    .unwrap()
                    // online
                    .description("Python Programming 101")
                    .parent_class(("PY101_2023", 1)),
            ),
            (
                "DPRG_2023_all",
                LearningModule::with_duration_and_start_args("12w", 2023, 3, 18)
                    .unwrap()
                    // online
                    .description("Introduction to Rigging in Maya")
                    .parent_class(("DPRG_2023", 1)),
            ),
            (
                "HAA20_mod1",
                LearningModule::with_duration_and_start_args("4w", 2023, 2, 18)
                    .unwrap()
                    .format(LearningFormat::Hybrid)
                    .description("Human Skeleton & Bony Landmarks")
                    .parent_class(("HAA20", 1)),
            ),
            (
                "HAA20_mod2",
                LearningModule::with_duration_and_start_args("4w", 2023, 3, 24)
                    .unwrap()
                    // online
                    .description("Muscles of the Torso, Upper Arms & Upper Legs")
                    .parent_class(("HAA20", 2)),
            ),
            (
                "HAA20_mod3",
                LearningModule::with_duration_and_start_args("4w", 2023, 5, 13)
                    .unwrap()
                    // online
                    .description("Gesture Drawing")
                    .parent_class(("HAA20", 3)),
            ),
            (
                "HAA20_mod4",
                LearningModule::with_duration_and_start_args("4w", 2023, 6, 17)
                    .unwrap()
                    // online
                    .description("Muscles of the Lower Arms & Lower Legs")
                    .parent_class(("HAA20", 4)),
            ),
            (
                "FAP01_trackA",
                LearningModule::with_duration_and_start_args("6w", 2023, 3, 5)
                    .unwrap()
                    .format(LearningFormat::Hybrid)
                    .description("Skull Structure & Facial Features")
                    .parent_class(("FAP01", 1)),
            ),
            (
                "FAP01_trackB",
                LearningModule::with_duration_and_start_args("8w", 2023, 7, 9)
                    .unwrap()
                    // online
                    .description("Fundamentals of Portraiture")
                    .parent_class(("FAP01", 2)),
            ),
            (
                "FAP01_trackC",
                LearningModule::with_duration_and_start_args("8w", 2023, 8, 20)
                    .unwrap()
                    // online
                    .description("Facial Expression")
                    .parent_class(("FAP01", 3)),
            ),
        ];

        let db = connect().await?;

        let mut create = vec![];

        modules.iter().for_each(|(id, module)| {
            create.push(db.create_module(id, module));
        });

        futures::future::join_all(create).await;

        Ok(())
    }

    #[tokio::test]
    async fn make_all_classes() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let classes = [
            Class::new("HAA01")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("SNA Studio, Q.1, Sài Gòn"),
            Class::new("HAA02")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("SNA Studio, Q.1, Sài Gòn"),
            Class::new("HAA03")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("VNG, Q.11, Sài Gòn"),
            Class::new("HAA04")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("BlueR Studio, Q. Tân Bình, Sài Gòn"),
            Class::new("HAA05")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("Hanoi Hub, Q. Đống Đa, Hà Nội"),
            Class::new("HAA06")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("SNA Studio, Q.1, Sài Gòn"),
            Class::new("HAA07")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("SNA Studio, Q.1, Sài Gòn"),
            Class::new("HAA08")
                .categories(&["Art", "Anatomy"])
                .name("Introduction to Human Anatomy")
                .instructor("Nguyễn Trọng Hoan")
                .location("SPARX* Studio, Sài Gòn"),
            Class::new("HAA09")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            Class::new("DPRG_2018")
                .categories(&["Rigging", "Maya", "TechArt"])
                .name("Rigging in Maya")
                .instructor("Nguyễn Trọng Hoan")
                .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            Class::new("HAA10")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            Class::new("DFS01")
                .categories(&["Art", "Anatomy", "Sculpting", "ZBrush"])
                .name("Figure Sculpting in ZBrush")
                .instructor("Nguyễn Trọng Hoan")
                .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            Class::new("HAA11")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan"),
            Class::new("HAA12")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            Class::new("ZBL3_2019")
                .categories(&["Modeling", "ZBrush"])
                .name("ZBrush Cho Bé Lên 3D")
                .instructor("Nguyễn Trọng Hoan")
                .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            Class::new("MAPY_2019")
                .categories(&["Maya", "Python", "TechArt"])
                .name("Python Scripting in Maya")
                .instructor("Nguyễn Trọng Hoan")
                .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            Class::new("HAA13")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("SNA Studio, Q.1, Sài Gòn"),
            Class::new("ZBL3_2020")
                .categories(&["Modeling", "ZBrush"])
                .name("ZBrush Cho Bé Lên 3D")
                .instructor("Nguyễn Trọng Hoan"),
            Class::new("HAA14")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("SNA Studio, Q.1, Sài Gòn"),
            Class::new("MAPY_2020")
                .categories(&["Maya", "Python", "TechArt"])
                .instructor("Phùng Nhật Huy")
                .instructor("Nguyễn Trọng Hoan")
                .name("Python Scripting in Maya"),
            Class::new("HAA15")
                .categories(&["Art", "Anatomy"])
                .name("Fast Track: Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("SNA Studio, Q.1, Sài Gòn"),
            Class::new("HAA16")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan"),
            Class::new("HAA17")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .location("SNA Studio, Q.1, Sài Gòn"),
            Class::new("HAA18")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .assistant("Nguyễn Hoàng Nguyên")
                .location("THINK Space, Q.1, Sài Gòn"),
            Class::new("HAA19")
                .categories(&["Art", "Anatomy"])
                .name("Fast Track: Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .assistant("Nguyễn Hoàng Nguyên")
                .location("CKA Studio, Q.Tân Bình, Sài Gòn"),
            Class::new("HAA20")
                .categories(&["Art", "Anatomy"])
                .name("Human Anatomy for Artists")
                .instructor("Nguyễn Trọng Hoan")
                .assistant("Nguyễn Hoàng Nguyên")
                .location("CKA Studio, Q.Tân Bình, Sài Gòn"),
            Class::new("DPRG_2023")
                .categories(&["Rigging", "Maya", "TechArt"])
                .name("Introduction to Python")
                .instructor("Phùng Nhật Huy")
                .instructor("Nguyễn Trọng Hoan")
                .assistant("Hoàng Đức Phúc")
                .assistant("Võ Chí Thành"),
            Class::new("PY101_2023")
                .categories(&["Python", "TechArt"])
                .name("Introduction to Python")
                .instructor("Phùng Nhật Huy")
                .instructor("Nguyễn Trọng Hoan")
                .assistant("Hoàng Đức Phúc")
                .assistant("Võ Chí Thành"),
            Class::new("FAP01")
                .categories(&["Art", "Anatomy"])
                .name("Facial Anatomy & Portraiture")
                .instructor("Nguyễn Trọng Hoan")
                .assistant("Nguyễn Hoàng Nguyên")
                .location("CKA Studio, Q.Tân Bình, Sài Gòn"),
        ];

        let db = connect().await?;

        let mut create = vec![];

        classes.iter().for_each(|class| {
            eprintln!("Got class: {:?}", class.id);
            create.push(db.create_class(&class.id, class));
        });

        futures::future::join_all(create).await;

        Ok(())
    }
}
