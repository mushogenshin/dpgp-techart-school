import Album from "../../components/album/Album";
import styles from "./LongAp.module.css";

export default function LongAp() {
  return (
    <div className={styles["long-ap"]}>
      <Album
        albumName="Phong Cách Riêng: Hoạ Sĩ Tìm Ở Đâu"
        folderName="essays/styles-n-fundamentals"
      />

      <p className={styles.announce}>
        Bài essay này khơi mào chuỗi hoạt động "Chiếc Lồng Ấp" vào tháng 1/2023.
        Sau đó trong tháng 3 tụi mình cũng đã tổ chức một buổi offline để 6
        người bạn cùng chia sẻ về hành trình vào nghề và làm nghề. Tụi mình hy
        vọng sẽ quay trở lại sớm để có thêm các thảo luận thiết thực trong 2024.
      </p>
    </div>
  );
}
