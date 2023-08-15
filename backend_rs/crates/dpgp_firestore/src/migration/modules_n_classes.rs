#[cfg(test)]
mod tests {
    use super::super::*;

    #[tokio::test]
    async fn make_all_modules() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let modules = [
            // (
            //     "HAA01_all",
            //     LearningModule::default()
            //         .duration_and_start("8w", 2016, 12, 15)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "HAA02_all",
            //     LearningModule::default()
            //         .duration_and_start("8w", 2017, 4, 15)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "HAA03_all",
            //     LearningModule::default()
            //         .duration_and_start("12w", 2017, 5, 30)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "HAA04_all",
            //     LearningModule::default()
            //         .duration_and_start("8w", 2017, 7, 1)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "HAA05_all",
            //     LearningModule::default()
            //         .duration_and_start("2w", 2017, 10, 15)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Human Anatomy for Artists"),
            // ),
            // (
            //     "HAA06_all",
            //     LearningModule::default()
            //         .duration_and_start("8w", 2017, 11, 10)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "HAA07_all",
            //     LearningModule::default()
            //         .duration_and_start("8w", 2018, 3, 1)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "HAA08_all",
            //     LearningModule::default()
            //         .duration_and_start("4w", 2018, 7, 1)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Basics of Human Anatomy"),
            // ),
            // (
            //     "HAA09_all",
            //     LearningModule::default()
            //         .duration_and_start("2w", 2018, 9, 29)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "DPRG_2018_all",
            //     LearningModule::default()
            //         .duration_and_start("8w", 2018, 9, 15)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Introduction to Rigging in Maya"),
            // ),
            // (
            //     "HAA10_all",
            //     LearningModule::default()
            //         .duration_and_start("8w", 2018, 10, 15)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "DFS01_all",
            //     LearningModule::default()
            //         .duration_and_start("12w", 2019, 3, 20)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Figure Sculpting in ZBrush"),
            // ),
            // (
            //     "HAA11_all",
            //     LearningModule::default()
            //         .duration_and_start("8w", 2019, 6, 1)
            //         .unwrap()
            //         // online
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "HAA12_all",
            //     LearningModule::default()
            //         .duration_and_start("4w", 2019, 10, 15)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "ZBL3_2019_all",
            //     LearningModule::default()
            //         .duration_and_start("12w", 2019, 11, 30)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Introduction to ZBrush"),
            // ),
            // (
            //     "MAPY_2019_all",
            //     LearningModule::default()
            //         .duration_and_start("6w", 2019, 12, 1)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Introduction to Python Scripting in Maya"),
            // ),
            // (
            //     "HAA13_all",
            //     LearningModule::default()
            //         .duration_and_start("16w", 2020, 5, 20)
            //         .unwrap()
            //         .format(LearningFormat::Hybrid)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "ZBL3_2020_all",
            //     LearningModule::default()
            //         .duration_and_start("10w", 2020, 7, 1)
            //         .unwrap()
            //         // online
            //         .description("Introduction to ZBrush"),
            // ),
            // (
            //     "HAA14_all",
            //     LearningModule::default()
            //         .duration_and_start("16w", 2020, 10, 1)
            //         .unwrap()
            //         .format(LearningFormat::Hybrid)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "MAPY_2020_all",
            //     LearningModule::default()
            //         .duration_and_start("10w", 2020, 10, 1)
            //         .unwrap()
            //         // online
            //         .description("In-Depth Python Scripting in Maya"),
            // ),
            // (
            //     "HAA15_all",
            //     LearningModule::default()
            //         .duration_and_start("3w", 2020, 12, 15)
            //         .unwrap()
            //         .format(LearningFormat::Offline)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "HAA16_all",
            //     LearningModule::default()
            //         .duration_and_start("12w", 2021, 3, 10)
            //         .unwrap()
            //         // online
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "HAA17_all",
            //     LearningModule::default()
            //         .duration_and_start("16w", 2021, 10, 1)
            //         .unwrap()
            //         .format(LearningFormat::Hybrid)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "HAA18_all",
            //     LearningModule::default()
            //         .duration_and_start("16w", 2022, 3, 1)
            //         .unwrap()
            //         .format(LearningFormat::Hybrid)
            //         .description("Human Anatomy In-Depth"),
            // ),
            // (
            //     "HAA19_all",
            //     LearningModule::default()
            //         .duration_and_start("4w", 2022, 12, 2)
            //         .unwrap()
            //         .format(LearningFormat::Hybrid)
            //         .description("Human Anatomy for Artists"),
            // ),
            // (
            //     "PY101_2023_all",
            //     LearningModule::default()
            //         .duration_and_start("12w", 2023, 3, 19)
            //         .unwrap()
            //         // online
            //         .description("Python Programming 101"),
            // ),
            // (
            //     "DPRG_2023_all",
            //     LearningModule::default()
            //         .duration_and_start("12w", 2023, 3, 18)
            //         .unwrap()
            //         // online
            //         .description("Introduction to Rigging in Maya"),
            // ),
            // (
            //     "HAA20_mod1",
            //     LearningModule::default()
            //         .duration_and_start("4w", 2023, 2, 18)
            //         .unwrap()
            //         .format(LearningFormat::Hybrid)
            //         .description("Human Skeleton & Bony Landmarks")
            //         .folder_label("MOD 1"),
            // ),
            // (
            //     "HAA20_mod2",
            //     LearningModule::default()
            //         .duration_and_start("4w", 2023, 3, 24)
            //         .unwrap()
            //         // online
            //         .weeks_offset(4)
            //         .description("Muscles of the Torso, Upper Arms & Upper Legs")
            //         .folder_label("MOD 2"),
            // ),
            // (
            //     "HAA20_mod3",
            //     LearningModule::default()
            //         .duration_and_start("4w", 2023, 5, 13)
            //         .unwrap()
            //         // online
            //         .weeks_offset(8)
            //         .description("Gesture Drawing")
            //         .folder_label("MOD 3"),
            // ),
            // (
            //     "HAA20_mod4",
            //     LearningModule::default()
            //         .duration_and_start("4w", 2023, 6, 17)
            //         .unwrap()
            //         // online
            //         .weeks_offset(12)
            //         .description("Muscles of the Lower Arms & Lower Legs")
            //         .folder_label("MOD 4"),
            // ),
            // (
            //     "FAP01_trackA",
            //     LearningModule::default()
            //         .duration_and_start("6w", 2023, 3, 5)
            //         .unwrap()
            //         .format(LearningFormat::Hybrid)
            //         .description("Skull Structure & Facial Features")
            //         .folder_label("TRACK A"),
            // ),
            // (
            //     "FAP01_trackB",
            //     LearningModule::default()
            //         .duration_and_start("8w", 2023, 7, 9)
            //         .unwrap()
            //         // online
            //         .weeks_offset(6)
            //         .description("Fundamentals of Portraiture")
            //         .folder_label("TRACK B"),
            // ),
            // (
            //     "FAP01_trackC",
            //     LearningModule::default()
            //         .duration_and_start("8w", 2023, 8, 20)
            //         .unwrap()
            //         // online
            //         .weeks_offset(14)
            //         .description("Facial Expression")
            //         .folder_label("TRACK C"),
            // ),
            (
                "HAA21_mod1",
                LearningModule::default()
                    .duration_and_start("4w", 2023, 8, 26)
                    .unwrap()
                    // online
                    .description("Human Skeleton & Bony Landmarks")
                    .folder_label("MOD 1"),
            ),
            (
                "HAA21_mod2",
                LearningModule::default()
                    .duration_and_start("4w", 2023, 9, 30)
                    .unwrap()
                    // online
                    .weeks_offset(4)
                    .description("Muscles of the Torso, Upper Arms & Upper Legs")
                    .folder_label("MOD 2"),
            ),
            (
                "HAA21_mod3",
                LearningModule::default()
                    .duration_and_start("4w", 2023, 11, 4)
                    .unwrap()
                    // online
                    .weeks_offset(8)
                    .description("Gesture Drawing")
                    .folder_label("MOD 3"),
            ),
            (
                "HAA21_mod4",
                LearningModule::default()
                    .duration_and_start("4w", 2023, 12, 9)
                    .unwrap()
                    // online
                    .weeks_offset(12)
                    .description("Muscles of the Lower Arms & Lower Legs")
                    .folder_label("MOD 4"),
            ),
        ];

        let db = connect().await?;
        let mut create = vec![];

        modules.iter().for_each(|(id, module)| {
            eprintln!("Got module: {:?}", id);
            create.push(db.create_module(&id, module));
        });

        futures::future::join_all(create).await;

        Ok(())
    }

    #[tokio::test]
    async fn make_all_classes() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let classes = [
            // (
            //     "HAA01",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA01_all")
            //         .location("SNA Studio, Q.1, Sài Gòn"),
            // ),
            // (
            //     "HAA02",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA02_all")
            //         .location("SNA Studio, Q.1, Sài Gòn"),
            // ),
            // (
            //     "HAA03",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA03_all")
            //         .location("VNG, Q.11, Sài Gòn"),
            // ),
            // (
            //     "HAA04",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA04_all")
            //         .location("BlueR Studio, Q. Tân Bình, Sài Gòn"),
            // ),
            // (
            //     "HAA05",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA05_all")
            //         .location("Hanoi Hub, Q. Đống Đa, Hà Nội"),
            // ),
            // (
            //     "HAA06",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA06_all")
            //         .location("SNA Studio, Q.1, Sài Gòn"),
            // ),
            // (
            //     "HAA07",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA07_all")
            //         .location("SNA Studio, Q.1, Sài Gòn"),
            // ),
            // (
            //     "HAA08",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Introduction to Human Anatomy")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA08_all")
            //         .location("SPARX* Studio, Sài Gòn"),
            // ),
            // (
            //     "HAA09",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA09_all")
            //         .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            // ),
            // (
            //     "DPRG_2018",
            //     Class::default()
            //         .categories(&["Rigging", "Maya", "TechArt"])
            //         .name("Rigging in Maya")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("DPRG_2018_all")
            //         .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            // ),
            // (
            //     "HAA10",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA10_all")
            //         .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            // ),
            // (
            //     "DFS01",
            //     Class::default()
            //         .categories(&["Art", "Anatomy", "Sculpting", "ZBrush"])
            //         .name("Figure Sculpting in ZBrush")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("DFS01_all")
            //         .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            // ),
            // (
            //     "HAA11",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .module("HAA11_all")
            //         .instructor("Nguyễn Trọng Hoan"),
            // ),
            // (
            //     "HAA12",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA12_all")
            //         .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            // ),
            // (
            //     "ZBL3_2019",
            //     Class::default()
            //         .categories(&["Modeling", "ZBrush"])
            //         .name("ZBrush Cho Bé Lên 3D")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("ZBL3_2019_all")
            //         .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            // ),
            // (
            //     "MAPY_2019",
            //     Class::default()
            //         .categories(&["Maya", "Python", "TechArt"])
            //         .name("Python Scripting in Maya")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("MAPY_2019_all")
            //         .location("FWA Studio, Q. Tân Bình, Sài Gòn"),
            // ),
            // (
            //     "HAA13",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA13_all")
            //         .location("SNA Studio, Q.1, Sài Gòn"),
            // ),
            // (
            //     "ZBL3_2020",
            //     Class::default()
            //         .categories(&["Modeling", "ZBrush"])
            //         .name("ZBrush Cho Bé Lên 3D")
            //         .module("ZBL3_2020_all")
            //         .instructor("Nguyễn Trọng Hoan"),
            // ),
            // (
            //     "HAA14",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA14_all")
            //         .location("SNA Studio, Q.1, Sài Gòn"),
            // ),
            // (
            //     "MAPY_2020",
            //     Class::default()
            //         .categories(&["Maya", "Python", "TechArt"])
            //         .instructor("Phùng Nhật Huy")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("MAPY_2020_all")
            //         .name("Python Scripting in Maya"),
            // ),
            // (
            //     "HAA15",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Fast Track: Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA15_all")
            //         .location("SNA Studio, Q.1, Sài Gòn"),
            // ),
            // (
            //     "HAA16",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .module("HAA16_all")
            //         .instructor("Nguyễn Trọng Hoan"),
            // ),
            // (
            //     "HAA17",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .module("HAA17_all")
            //         .location("SNA Studio, Q.1, Sài Gòn"),
            // ),
            // (
            //     "HAA18",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .assistant("Nguyễn Hoàng Nguyên")
            //         .module("HAA18_all")
            //         .location("THINK Space, Q.1, Sài Gòn"),
            // ),
            // (
            //     "HAA19",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Fast Track: Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .assistant("Nguyễn Hoàng Nguyên")
            //         .module("HAA19_all")
            //         .location("CKA Studio, Q.Tân Bình, Sài Gòn"),
            // ),
            // (
            //     "HAA20",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Human Anatomy for Artists")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .assistant("Nguyễn Hoàng Nguyên")
            //         .module("HAA20_mod1")
            //         .module("HAA20_mod2")
            //         .module("HAA20_mod3")
            //         .module("HAA20_mod4")
            //         .location("CKA Studio, Q.Tân Bình, Sài Gòn"),
            // ),
            // (
            //     "DPRG_2023",
            //     Class::default()
            //         .categories(&["Rigging", "Maya", "TechArt"])
            //         .name("Introduction to Python")
            //         .instructor("Phùng Nhật Huy")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .assistant("Hoàng Đức Phúc")
            //         .assistant("Võ Chí Thành")
            //         .module("DPRG_2023_all"),
            // ),
            // (
            //     "PY101_2023",
            //     Class::default()
            //         .categories(&["Python", "TechArt"])
            //         .name("Introduction to Python")
            //         .instructor("Phùng Nhật Huy")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .assistant("Hoàng Đức Phúc")
            //         .assistant("Võ Chí Thành")
            //         .module("PY101_2023_all"),
            // ),
            // (
            //     "FAP01",
            //     Class::default()
            //         .categories(&["Art", "Anatomy"])
            //         .name("Facial Anatomy & Portraiture")
            //         .instructor("Nguyễn Trọng Hoan")
            //         .assistant("Nguyễn Hoàng Nguyên")
            //         .module("FAP01_trackA")
            //         .module("FAP01_trackB")
            //         .module("FAP01_trackC")
            //         .location("CKA Studio, Q.Tân Bình, Sài Gòn"),
            // ),
            (
                "HAA21",
                Class::default()
                    .categories(&["Art", "Anatomy"])
                    .name("Human Anatomy for Artists")
                    .instructor("Nguyễn Trọng Hoan")
                    .assistant("Nguyễn Hoàng Nguyên")
                    .module("HAA21_mod1")
                    .module("HAA21_mod2")
                    .module("HAA21_mod3")
                    .module("HAA21_mod4"),
            ),
        ];

        let db = connect().await?;
        let mut create = vec![];

        classes.iter().for_each(|(id, class)| {
            eprintln!("Got class: {:?}", id);
            create.push(db.create_class(&id, class));
        });

        futures::future::join_all(create).await;

        Ok(())
    }
}
