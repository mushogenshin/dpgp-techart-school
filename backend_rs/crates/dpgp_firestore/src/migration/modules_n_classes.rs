#[cfg(test)]
mod tests {
    use super::super::*;

    #[tokio::test]
    async fn make_all_modules() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let modules = [
            LearningModule::new("HAA01_all")
                .duration_and_start("8w", 2016, 12, 15)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA01", 1)),
            LearningModule::new("HAA02_all")
                .duration_and_start("8w", 2017, 4, 15)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA02", 1)),
            LearningModule::new("HAA03_all")
                .duration_and_start("12w", 2017, 5, 30)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA03", 1)),
            LearningModule::new("HAA04_all")
                .duration_and_start("8w", 2017, 7, 1)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA04", 1)),
            LearningModule::new("HAA05_all")
                .duration_and_start("2w", 2017, 10, 15)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Human Anatomy for Artists"),
            // .parent_class(("HAA05", 1)),
            LearningModule::new("HAA06_all")
                .duration_and_start("8w", 2017, 11, 10)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA06", 1)),
            LearningModule::new("HAA07_all")
                .duration_and_start("8w", 2018, 3, 1)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA07", 1)),
            LearningModule::new("HAA08_all")
                .duration_and_start("4w", 2018, 7, 1)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Basics of Human Anatomy"),
            // .parent_class(("HAA08", 1)),
            LearningModule::new("HAA09_all")
                .duration_and_start("2w", 2018, 9, 29)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA09", 1)),
            LearningModule::new("DPRG_2018_all")
                .duration_and_start("8w", 2018, 9, 15)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Introduction to Rigging in Maya"),
            // .parent_class(("DPRG_2018", 1)),
            LearningModule::new("HAA10_all")
                .duration_and_start("8w", 2018, 10, 15)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA10", 1)),
            LearningModule::new("DFS01_all")
                .duration_and_start("12w", 2019, 3, 20)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Figure Sculpting in ZBrush"),
            // .parent_class(("DFS01", 1)),
            LearningModule::new("HAA11_all")
                .duration_and_start("8w", 2019, 6, 1)
                .unwrap()
                // online
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA11", 1)),
            LearningModule::new("HAA12_all")
                .duration_and_start("4w", 2019, 10, 15)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA12", 1)),
            LearningModule::new("ZBL3_2019_all")
                .duration_and_start("12w", 2019, 11, 30)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Introduction to ZBrush"),
            // .parent_class(("ZBL3_2019", 1)),
            LearningModule::new("MAPY_2019_all")
                .duration_and_start("6w", 2019, 12, 1)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Introduction to Python Scripting in Maya"),
            // .parent_class(("MAPY_2019", 1)),
            LearningModule::new("HAA13_all")
                .duration_and_start("16w", 2020, 5, 20)
                .unwrap()
                .format(LearningFormat::Hybrid)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA13", 1)),
            LearningModule::new("ZBL3_2020_all")
                .duration_and_start("10w", 2020, 7, 1)
                .unwrap()
                // online
                .description("Introduction to ZBrush"),
            // .parent_class(("ZBL3_2020", 1)),
            LearningModule::new("HAA14_all")
                .duration_and_start("16w", 2020, 10, 1)
                .unwrap()
                .format(LearningFormat::Hybrid)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA14", 1)),
            LearningModule::new("MAPY_2020_all")
                .duration_and_start("10w", 2020, 10, 1)
                .unwrap()
                // online
                .description("In-Depth Python Scripting in Maya"),
            // .parent_class(("MAPY_2020", 1)),
            LearningModule::new("HAA15_all")
                .duration_and_start("3w", 2020, 12, 15)
                .unwrap()
                .format(LearningFormat::Offline)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA15", 1)),
            LearningModule::new("HAA16_all")
                .duration_and_start("12w", 2021, 3, 10)
                .unwrap()
                // online
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA16", 1)),
            LearningModule::new("HAA17_all")
                .duration_and_start("16w", 2021, 10, 1)
                .unwrap()
                .format(LearningFormat::Hybrid)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA17", 1)),
            LearningModule::new("HAA18_all")
                .duration_and_start("16w", 2022, 3, 1)
                .unwrap()
                .format(LearningFormat::Hybrid)
                .description("Human Anatomy In-Depth"),
            // .parent_class(("HAA18", 1)),
            LearningModule::new("HAA19_all")
                .duration_and_start("4w", 2022, 12, 2)
                .unwrap()
                .format(LearningFormat::Hybrid)
                .description("Human Anatomy for Artists"),
            // .parent_class(("HAA19", 1)),
            LearningModule::new("PY101_2023_all")
                .duration_and_start("12w", 2023, 3, 19)
                .unwrap()
                // online
                .description("Python Programming 101"),
            // .parent_class(("PY101_2023", 1)),
            LearningModule::new("DPRG_2023_all")
                .duration_and_start("12w", 2023, 3, 18)
                .unwrap()
                // online
                .description("Introduction to Rigging in Maya"),
            // .parent_class(("DPRG_2023", 1)),
            LearningModule::new("HAA20_mod1")
                .duration_and_start("4w", 2023, 2, 18)
                .unwrap()
                .format(LearningFormat::Hybrid)
                .description("Human Skeleton & Bony Landmarks")
                // .parent_class(("HAA20", 1))
                .folder_label("MOD 1"),
            LearningModule::new("HAA20_mod2")
                .duration_and_start("4w", 2023, 3, 24)
                .unwrap()
                // online
                .weeks_offset(4)
                .description("Muscles of the Torso, Upper Arms & Upper Legs")
                // .parent_class(("HAA20", 2))
                .folder_label("MOD 2"),
            LearningModule::new("HAA20_mod3")
                .duration_and_start("4w", 2023, 5, 13)
                .unwrap()
                // online
                .weeks_offset(8)
                .description("Gesture Drawing")
                // .parent_class(("HAA20", 3))
                .folder_label("MOD 3"),
            LearningModule::new("HAA20_mod4")
                .duration_and_start("4w", 2023, 6, 17)
                .unwrap()
                // online
                .weeks_offset(12)
                .description("Muscles of the Lower Arms & Lower Legs")
                // .parent_class(("HAA20", 4))
                .folder_label("MOD 4"),
            LearningModule::new("FAP01_trackA")
                .duration_and_start("6w", 2023, 3, 5)
                .unwrap()
                .format(LearningFormat::Hybrid)
                .description("Skull Structure & Facial Features")
                // .parent_class(("FAP01", 1))
                .folder_label("TRACK A"),
            LearningModule::new("FAP01_trackB")
                .duration_and_start("8w", 2023, 7, 9)
                .unwrap()
                // online
                .weeks_offset(6)
                .description("Fundamentals of Portraiture")
                // .parent_class(("FAP01", 2))
                .folder_label("TRACK B"),
            LearningModule::new("FAP01_trackC")
                .duration_and_start("8w", 2023, 8, 20)
                .unwrap()
                // online
                .weeks_offset(14)
                .description("Facial Expression")
                // .parent_class(("FAP01", 3))
                .folder_label("TRACK C"),
        ];

        let db = connect().await?;
        let mut create = vec![];

        modules.iter().for_each(|module| {
            eprintln!("Got module: {:?}", module.id);
            create.push(db.create_module(&module.id, module));
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
