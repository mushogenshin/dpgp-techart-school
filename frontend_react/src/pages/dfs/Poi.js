import React from "react";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import styles from "./Poi.module.css";

// ![Palette A](https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/tuts%2Fpoi%2FpaletteA.jpg?alt=media&token=155a2973-7dbe-4298-867a-d15008af67cf "Palette A Screenshot")
// ![Palette B](https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/tuts%2Fpoi%2FpaletteB.jpg?alt=media&token=112bf6d6-8882-4fdc-bd2c-60a8640ed1af "Palette B Screenshot")
// ![Palette C](https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/tuts%2Fpoi%2FpaletteC.jpg?alt=media&token=34015674-3873-4d89-90d2-edea9d93cdaf "Palette C Screenshot")
// ![Palette D](https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/tuts%2Fpoi%2FpaletteD.jpg?alt=media&token=a65a5a59-27a7-4e7a-97c3-a48fc2daf2a8 "Palette D Screenshot")

export default function Poi() {
  const introContent = `
# Setup của Hoan cho ZBrush

---
  `;

  const paletteContent = `
## 🎨 Giới thiệu 4 palette (A, B, C, D)
abc  
abc  
abc  
  `;

  const hotkeysContent = `
## ⌨️ Phím tắt

Suy nghĩ chính đằng sau các lựa chọn cho phím tắt ZBrush của Hoan.

- Tính năng nào dùng thường xuyên thì combo phím nên **càng đơn giản**, đỡ gánh nặng cho cổ tay 😌.
- Phải **cực kỳ dễ dàng** chuyển giữa các loại cọ. Nếu phải B xong rồi phải nhấn thêm 1 phím khác để chuyển cọ, thì là rườm rà. Vd: có thể chỉ bấm 1, 2, 3, 4, 5... để nhảy giữa 5 loại cọ.
- Ưu tiên 4 combo phím để hiện 4 palette ở phần đầu bài 

### ⚙️ 1. Phím để Hiện Palette (floating/on-screen):

| PALETTE     | PHÍM TẮT           | GHI CHÚ                                      |
| ----------- | ------------------ | -------------------------------------------- |
| mk_**A**    | Tab                | bảng về import/export file/subtool, v.v.     |
| mk_**B**    | Shift + Tab        | bảng về màu, curve, movie, v.v.              |
| mk_**C**    | Ctrl + Tab         | bảng về masks, TPose Master, subtools        |
| mk_**D**    | Ctrl + Shift + Tab | bảng về Morph, Dynamesh, ZRemesh, Decimation |

### ⚙️ 2. Các Phím Căn Bản:

Thuận lợi:
1. Thao tác **Undo** dùng rất nhiểu, nên chỉ 1 phím Z (như trong Maya) là đủ, thay vì 2 phím Ctrl + Z. 

| TÍNH NĂNG   | PHÍM TẮT  | GHI CHÚ    | GIỐNG MAYA |
| ----------- | --------- | ---------- | ---------- |
| Undo        | Z         |            | ✓          |
| Redo        | Shift + Z |            | ✓          |
| Cỡ cọ       | B         |            | ✓          |
| Solo        | H         | "**H**ide" |            |
| Lock camera | K         | "loc**K**" |            |

### 🔂 3. Phím để Transform, Tranpose:

| TÍNH NĂNG       | PHÍM TẮT | GHI CHÚ                                        | GẦN VỚI MAYA                            |
| --------------- | -------- | ---------------------------------------------- | --------------------------------------- |
| Transform       | W        | chuyển từ sculpt qua xform                     | W gợi nhớ đến "**move**"                |
| Transpose       | Alt + W  | chuyển từ xform kiểu mới về transpose kiểu xưa |                                         |
| Thoát Transform | Q        | chuyển từ xform về lại sculpt                  | Q gợi nhớ đến "**select**" (không move) |

### 🔮 4. Phím cho Các Mode Hiển Thị:

| HIỂN THỊ              | PHÍM TẮT         | GHI CHÚ                         |
| --------------- | ---------------- | ------------------------------- |
| Bật/tắt **Opacity**   | Shift + 1                | "nhìn trong suốt", dùng khi nhiều SubTools                                |
| Bật/tắt **Wireframe**   | Shift + 2                |                                 |
| Luân phiên các mode **Polyframe**   | Shift + 3                | **macro nhà trồng**                                 |
| Bật/tắt **X-Ray** (Ghost)   | Shift + 4                | chỉ hiệu nghiệm khi Opacity đang ON |
| Bật Sculptris (force bất kể)   | Shift + 5                | **macro nhà trồng** |

### 👺 5. Phím cho Polygroups, Visibility:

| CỌ              | PHÍM TẮT         | GHI CHÚ                         |
| --------------- | ---------------- | ------------------------------- |
| Group Visible   | G                |                                 |
| Group Masked    | Ctrl + G         |                                 |
| **Auto** Groups | Ctrl + Shift + G | mỗi polygon shell sẽ là 1 group |


### 🖌️ 6. Phím cho Cọ (thuần số):

| CỌ                              | PHÍM TẮT | GHI CHÚ                                             |
| ------------------------------- | -------- | --------------------------------------------------- |
| Move                            | 1        | cọ mạnh & quan trọng nhất                           |
| Clay Buildup                    | 2        | đắp nhanh                                           |
| MAH Cut Mech                    | 3        | cắt đường mạnh, nhanh, nhưng hư lưới; **cọ custom** |
| hPolish & tự động tắt Sculptris | 4        | chà phẳng mặt, tạo cứng; **kết hợp macro nhà trồng**          |
| Trim Dynamic                    | 5        | cũng chà phẳng, profile nhẹ hơn hPolish             |
| Paint                           | 6        | tô Polypaint (color mà thôi)                        |
| Topology                        | 7        | để đi lưới                                          |

### 🖌️ 7. Phím cho Cọ (kèm Ctrl):

| CỌ              | PHÍM TẮT | GHI CHÚ                                              |
| --------------- | -------- | ---------------------------------------------------- |
| Standard        | Ctrl + 1 | đắp thêm 1 cách "quyết đoán"                         |
| Claytubes       | Ctrl + 2 | đắp lên bằng nhiều lớp dát mỏng                      |
| Curvetube       | Ctrl + 3 | tạo form ống theo curve                              |
| Snakehook       | Ctrl + 4 | "kéo sừng, kéo vảy"                                  |
| Snakesphere     | Ctrl + 5 | "đẻ form" (dùng với Sculptris) chạy lượn dài theo cọ |
| Mesh Insert Dot | Ctrl + 6 | (kết hợp với Stroke) nhét nhanh khối sphere          |
| IMM Primitives  | Ctrl + 7 |                                                      |

### 🖌️ 8. Phím cho Cọ (kèm Alt):

| CỌ              | PHÍM TẮT | GHI CHÚ                                   |
| --------------- | -------- | ----------------------------------------- |
| ZModeler        | Alt + 1  | để model polygon                          |
| Nudge           | Alt + 2  | dịch các edge trượt theo bề mặt           |
| Pinch           | Alt + 3  | nhíu form và cạnh lại gần nhau            |
| Inflat          | Alt + 4  | bơm phồng                                 |
| Morph           | Alt + 5  | trả (cục bộ) về hình dạng đã lưu trước đó |
| ZRemesher Guide | Alt + 6  | phụ trong tính toán retopo tự động        |

  `;

  const installContent = `
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
      <ReactMarkdown remarkPlugins={[gfm]}>{introContent}</ReactMarkdown>
      <ReactMarkdown remarkPlugins={[gfm]}>{paletteContent}</ReactMarkdown>
      <ReactMarkdown remarkPlugins={[gfm]}>{hotkeysContent}</ReactMarkdown>
      <ReactMarkdown remarkPlugins={[gfm]}>{installContent}</ReactMarkdown>
    </div>
  );
}
