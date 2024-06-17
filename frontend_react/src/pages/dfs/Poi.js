import React from "react";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import styles from "./Poi.module.css";

// ![Palette A](https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/tuts%2Fpoi%2FpaletteA.jpg?alt=media&token=155a2973-7dbe-4298-867a-d15008af67cf "Palette A Screenshot")
// ![Palette B](https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/tuts%2Fpoi%2FpaletteB.jpg?alt=media&token=112bf6d6-8882-4fdc-bd2c-60a8640ed1af "Palette B Screenshot")
// ![Palette C](https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/tuts%2Fpoi%2FpaletteC.jpg?alt=media&token=34015674-3873-4d89-90d2-edea9d93cdaf "Palette C Screenshot")
// ![Palette D](https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/tuts%2Fpoi%2FpaletteD.jpg?alt=media&token=a65a5a59-27a7-4e7a-97c3-a48fc2daf2a8 "Palette D Screenshot")

export default function Poi() {
  const markdownContent = `
# Cài tuỳ chỉnh của Hoan cho ZBrush

---
## 🎨 Giới thiệu 4 palette (A, B, C, D)
abc  
abc  
abc  

## ⌨️ Phím tắt

Suy nghĩ chính đằng sau các lựa chọn cho phím tắt của Hoan.

- Tổ hợp cho những tính năng dùng thường xuyên **càng đơn giản** thì càng đỡ gánh nặng cho cổ tay 😌.
- Phải **cực kỳ dễ dàng** chuyển giữa các loại cọ. Nếu phải B xong rồi phải nhấn thêm 1 phím khác để chuyển cọ, thì là rườm rà. Vd: có thể chỉ bấm 1, 2, 3, 4, 5... để nhảy giữa 5 loại cọ.
- Ưu tiên 4 combo phím để hiện 4 palette ở phần đầu bài 

### ⚙️ Các Phím Căn bản:

Thuận lợi:
1. Thao tác **Undo** dùng rất nhiểu, nên chỉ 1 phím Z (như trong Maya) là đủ, thay vì 2 phím Ctrl + Z. 

| TÍNH NĂNG   | PHÍM TẮT  | GHI CHÚ    | GIỐNG MAYA |
| ----------- | --------- | ---------- | ---------- |
| Undo        | Z         |            | ✓          |
| Redo        | Shift + Z |            | ✓          |
| Cỡ cọ       | B         |            | ✓          |
| Solo        | H         | "**H**ide" |            |
| Lock camera | K         | "loc**K**" |            |

### 🖌️ Phím Cọ (thuần số):

| BRUSH                           | PHÍM TẮT | GHI CHÚ                                 |
| ------------------------------- | -------- | --------------------------------------- |
| Move                            | 1        | cọ mạnh & quan trọng nhất               |
| Clay Buildup                    | 2        | đắp nhanh                               |
| MAH Cut Mech                    | 3        | cắt đường mạnh, nhanh, nhưng hư lưới    |
| hPolish & tự động tắt Sculptris | 4        | chà phẳng mặt, tạo cứng                 |
| Trim Dynamic                    | 5        | cũng chà phẳng, profile nhẹ hơn hPolish |
| Paint                           | 6        | tô Polypaint (color mà thôi)            |
| Topology                        | 7        | để đi lưới                              |


## 🙀 Cách cài vào máy (thủ công)
ghi  
ghi  
ghi  

## 🤖 Cách cài vào máy (nhanh)
jkl  
jkl  
jkl  
  `;

  return (
    <div className={styles.poi}>
      <ReactMarkdown remarkPlugins={[gfm]}>{markdownContent}</ReactMarkdown>
    </div>
  );
}
