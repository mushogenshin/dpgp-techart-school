import React from "react";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import styles from "./Poi.module.css";

export default function Poi() {
  const introContent = `
# Setup của Hoan cho ZBrush

---

Đây là kết quả setup ZBrush của Hoan sau khá nhiều chỉnh sửa từ 2018 đến 2022. Từ đó đến nay (2024) thì Hoan sử dụng những setup này khá ổn định, và nó chính là setup Hoan dùng khi demo trong các lớp dạy.

## 🌈 Nếu chỉ muốn xem cách cài và sử dụng thì scroll xuống [cuối trang 👇](#install)

Các đoạn text là để trình bày (cho những ai không ngại đọc) những chi tiết đằng sau 6 thành phần chính của setup.

Phần đầu của bài viết sẽ giới thiệu về những thành phần trong setup, phần cuối là nói về cách cài đặt và sử dụng.

6 thành phần gồm có:

- [Vật liệu, cọ custom](#mats-brushes)
- [Palette (A, B, C, D)](#palettes)
- [Macros](#macros)
- [Phím tắt](#hotkeys)
- [Plugin](#plugin)
- [Default ZScript](#default-zscript)

---

  `;

  const extrasContent = `
## 🍧 Các vật liệu, cọ custom:

Đây là phần dễ hiểu nhất của tuỳ chỉnh, vì chỉ cần copy vào đúng chỗ là sử dụng được ngay. Chúng ta sẽ có các file sau:

| LOẠI     | TÁC GIẢ     | GHI CHÚ                       |
| -------- | ----------- | ----------------------------- |
| Cọ       | MAH         | Cut Mech (A, B)               |
| Cọ       | Dylan Ekren | Hair Tubes                    |
| Vật liệu | Scott Eaton | Double Shade                  |
| Vật liệu | zbro        | Modeling_Clay, Gray_Ex, Paint |

Việc file nào phải copy vào đâu sẽ được nói đến trong phần Cài đặt (cuối trang). Ta hãy cứ nhìn tiếp đến những yếu tố khác của setup tổng.

  `;

  const paletteContent = `
## 🎨 Giới thiệu 4 palette (A, B, C, D)

Vì giao diện của ZBrush rất nhiều tầng (aka. từ chỗ này bấm để xổ xuống thêm 10 mục con, từ 1 mục con bấm xổ xuống thêm tiếp tiếp nữa, rất sâu, và chỗ nào nhìn cũng na ná như nhau 🙀), đối với ai chưa quen đi kiếm vì tháng năm dùng chưa đủ lâu, thì việc rảo mắt đi tìm lại một nút đã từng bấm nay không nhớ nằm đâu, quả là một ác mộng. Do đó, palette (các bảng gom lại những nút do mình chỉ định sắp xếp, có thể hiện "floating" bất cứ đâu) là thành phần quan trọng đầu tiên trong tuỳ chỉnh ZBrush của Hoan.

🌈 Định hướng khi setup: lý tưởng là hầu hết lúc làm việc, ta có thể ẩn hết các panel của ZBrush đi (gần như "Zen mode"), và access 4 palette A, B, C, D một cách "bao giờ cần thì bật cho hiện", thay vì pin rất nhiều nút lên màn hình.

- **Ưu điểm** của lối này: tiết kiệm được không gian màn hình, đỡ bị rối mắt; và khi thay đổi kích cỡ cửa sổ ZBrush nhỏ đi thì không bị "lạc nút".
- **Nhược điểm**: có thể không phù hợp với workflow hay các ưu tiên tiếp cận tools trong lúc làm file ZBrush của bạn.

👉 Chú thích công năng của 4 palette:

### PALETTE A

{todo: show markup}
![Palette A](https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/tuts%2Fpoi%2FpaletteA.jpg?alt=media&token=155a2973-7dbe-4298-867a-d15008af67cf "Palette A Screenshot")

### PALETTE B

{todo: show markup}
![Palette B](https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/tuts%2Fpoi%2FpaletteB.jpg?alt=media&token=112bf6d6-8882-4fdc-bd2c-60a8640ed1af "Palette B Screenshot")

### PALETTE C

{todo: show markup}
![Palette C](https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/tuts%2Fpoi%2FpaletteC.jpg?alt=media&token=34015674-3873-4d89-90d2-edea9d93cdaf "Palette C Screenshot")

### PALETTE D

{todo: show markup}
![Palette D](https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/tuts%2Fpoi%2FpaletteD.jpg?alt=media&token=a65a5a59-27a7-4e7a-97c3-a48fc2daf2a8 "Palette D Screenshot")

  `;

  const macroContent = `
## 🧬 Bộ Macros 

Là những script rất đơn giản, chúng ta chỉ thêm vào có 3 macros:

- No Sculptris hPolish
- No UH (Undo History) QuickSave
- **Setup Me Senpai**

Trong setup của Hoan, sử dụng với palette (bên trên) và phím tắt (trình bày bên dưới), thường thì ta sẽ **không cần biết tới** sự tồn tại của từng macro, mà sẽ khai thác nó thông qua nút bấm trên palette hoặc phím tắt, cả hai đều được nói đến trong bài.

  `;

  const pluginContent = `
## 🔌 Plugin 
Những gì macros không thể làm (vì đòi hỏi phức tạp hơn 1 chút), thì sẽ cần đến plugin.

Trong setup của Hoan, ta bắt đầu nhìn đến giao diện plugin khi muốn kích hoạt tất cả mọi thứ _sau khi_ cài đặt xong (mô tả ở dưới cuối bài), hoặc là để reset về lại thiết lập mặc định của ZBrush.

Plugin sẽ giúp chúng ta 5 tính năng sau (đã trình bày rải rác trong các bộ phím tắt bên trên, chỉ liệt kê lại cho đầy đủ):

| TÍNH NĂNG               | PHÍM TẮT  | GHI CHÚ                                          | LIÊN HỆ VỚI MAYA               |
| ----------------------- | --------- | ------------------------------------------------ | ------------------------------ |
| BG Cycling              | Alt + B   | đổi nhanh màu nền của canvas                     | tổ hợp màu background của Maya |
| PF Cylcing              | Shift + 3 | đổi nhanh các mode bật lưới + màu Polygroup      |                                |
| Force toggle Sculptris  | Shift + 5 | tránh không bị các warning về "Backface Masking" |                                |
| Custom Material Cycling | Ctrl + M  | đổi nhanh các vật liệu chỉ định sẵn              |                                |
| "Super Blur Mask" |   | Blur mask nhanh hơn, script của user "smilk" [trên ZBrushCentral](https://www.zbrushcentral.com/t/blur-mask-plugin/205882)              |                                |

  `;

  const hotkeysContent = `
## ⌨️ Phím tắt 

Tuy 2019-2020 Hoan đã chuyển nhiều tính năng trước kia trong phím tắt lên palette, phím tắt custom đến nay vẫn còn là một phần trụ cột trong lúc thao tác với ZBrush của Hoan.

Các suy nghĩ chính đằng sau những lựa chọn cho phím tắt custom:

- Tính năng nào dùng thường xuyên thì combo phím nên **càng đơn giản**, đỡ gánh nặng _cho cổ tay_ 😌.
- Chuyển giữa các loại cọ phải **cực kỳ dễ dàng**. Nếu phải B xong rồi phải nhấn thêm 1 phím khác để chuyển cọ, thì là rườm rà.
    - Vd: có thể chỉ bấm 1, 2, 3, 4, 5... để nhảy giữa 5 loại cọ.
- Ưu tiên 4 combo phím để hiện 4 palette ở phần đầu bài 

Với những tiêu chí trên, đây là tổng kết 10 bảng phím tắt custom.

🌈 Các bạn không nên cảm thấy cần phải học thuộc hết ngay một lúc toàn bộ 10 bảng, mà nên nghĩ rằng: ưu tiên một _số lượng nhỏ những phím dễ hiểu dễ nhớ_ (mà phù hợp nhu cầu riêng) trước nhất, rồi dần dà mở rộng thêm ra về sau tuỳ theo.

### ⚙️ 1. Phím để Hiện Palette (floating/on-screen):

| PALETTE   | PHÍM TẮT           | GHI CHÚ                                                          |
| --------- | ------------------ | ---------------------------------------------------------------- |
| mk\_**A** | Tab                | bảng về import/export file/subtool, v.v.                         |
| mk\_**B** | Shift + Tab        | bảng về màu, curve, thâu movie, v.v.                             |
| mk\_**C** | Ctrl + Tab         | bảng về masks, selection, TPose Master, subtools                 |
| mk\_**D** | Ctrl + Shift + Tab | bảng về Morph, gia công đoạn chót: Dynamesh, ZRemesh, Decimation |

### ⚙️ 2. Các Phím Căn Bản:

Thuận lợi:
1. Thao tác **Undo** dùng rất nhiểu, nên chỉ 1 phím Z (như trong Maya) là đủ, thay vì 2 phím Ctrl + Z. 

| CÔNG DỤNG   | PHÍM TẮT  | GHI CHÚ    | GIỐNG MAYA |
| ----------- | --------- | ---------- | ---------- |
| Undo        | Z         |            | ✓          |
| Redo        | Shift + Z |            | ✓          |
| Cỡ cọ       | B         |            | ✓          |
| Solo        | H         | "**H**ide" |            |
| Lock camera | K         | "loc**K**" |            |

### 🔂 3. Phím để Transform, Tranpose:

| CÔNG DỤNG       | PHÍM TẮT | GHI CHÚ                                        | LIÊN HỆ VỚI MAYA                            |
| --------------- | -------- | ---------------------------------------------- | --------------------------------------- |
| Transform       | W        | chuyển từ sculpt qua xform                     | W gợi nhớ đến "**move**"                |
| Transpose       | Alt + W  | chuyển từ xform kiểu mới về transpose kiểu xưa |                                         |
| Thoát Transform | Q        | chuyển từ xform về lại sculpt                  | Q gợi nhớ đến "**select**" (không move) |

### 🔮 4. Phím cho Các Mode Hiển Thị:

| HIỂN THỊ                          | PHÍM TẮT  | GHI CHÚ                                     |
| --------------------------------- | --------- | ------------------------------------------- |
| Bật/tắt **Opacity**               | Shift + 1 | "nhìn trong suốt", dùng khi nhiều SubTools  |
| Bật/tắt **Wireframe**             | Shift + 2 |                                             |
| Luân phiên các mode **Polyframe** | Shift + 3 | **plugin nhà trồng**                        |
| Bật/tắt **X-Ray** (Ghost)         | Shift + 4 | chỉ hiệu nghiệm khi Opacity đang ON         |
| Bật Sculptris (force bất kể)      | Shift + 5 | **plugin nhà trồng**                        |


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

  
### 🔅 9. ZSpotlight, v.v.

| CÔNG DỤNG          | PHÍM TẮT        | GHI CHÚ                                      |
| ------------------ | --------------- | -------------------------------------------- |
| Bật/tắt ZSpotlight | Alt + Z         |                                              |
| Edit ZSpotlight    | Alt + Shift + Z |                                              |
| Make Polymesh 3D   | Alt + Shift + D | Giống Delete History bên Maya                |
| AccuCurve          | Alt + C         | Tác động profile của cọ Move cho bớt "loang" |
| Switch Color       | Shift + X       | Đổi qua lại giữa 2 màu fg và bg              |
| Rename SubTool     | Alt + R         |                                              |

### 🗃️ 10. Linh tinh

| CÔNG DỤNG         | PHÍM TẮT               | GHI CHÚ       |
| ----------------- | ---------------------- | ------------- |
| Ẩn Interface      | Alt + Ctrl + F7        |               |
| Ẩn Menus          | Alt + Ctrl + F8        |               |
| "Super Blur Mask" | Alt + Ctrl + Shift + R | Custom plugin |

  `;

  const zscriptContent = `

  ## 📜 Default ZScript

  Có một số settings mà ZBrush **không chịu** lưu lại khi thoát ra, mà mỗi lần cần phải mỗi chỉnh sau khi mở ZBrush lên. Đó là lý do chúng ta cần có "Default ZScript" chạy mỗi khi mở ZBrush, để tự động thiết lập lại những settings đó.

  Default ZScript của chúng ta sẽ gọi macro **"Setup Me Senpai"**, và macro này chỉnh những settings sau:

  - Tạo ngay 1 cục dummy sphere 3D để khỏi bị thắc mắc với mode "2.5D" của ZBrush gây nhiều hoang mang cho ai không hiểu
  - Chỉnh những settings về stroke, backface masking, cho cọ
  - Chỉnh những settings của thâu timelapse 
  - Chỉnh những settings của viewport

  `;

  const installContent = `
## 🛠️ Cài đặt

Cuối cùng, sau khi đã giới thiệu đầy đủ về nội dung những tuỳ chỉnh, để bắt đầu sử dụng thì chúng ta cần cài trước đã.

# ⬇️ Tải về từ GitHub

Trước tiên nên hiểu rằng: cài kiểu nào thì cũng bao gồm 2 công đoạn: **(1)** chép vào máy, và **(2)** bật lên trong ZBrush.

- Bước chép vào máy thì Hoan có viết một desktop app nhỏ để cài nhanh, gọi là mk_POI (**P**references **O**verkill **I**nstaller). Nếu bạn không muốn dùng POI thì sẽ cần copy lần lượt các files vào đúng folder trong máy, theo chỉ dẫn bên dưới.
- Bước cài vào ZBrush thì cũng có 2 cách: thủ công hoặc sử dụng một plugin ZBrush do Hoan viết để cài nhanh.

### 🤖 1A. Cách cài vào máy (nhanh) với POI

{todo}

### 🙀 1B. Cách cài vào máy (thủ công)
{coming later}

### 🤖 2A. Cách cài vào ZBrush (nhanh) với plugin

- Vào palette Zplugin, tốt hơn nữa là pin/dock nó qua bên tay trái cửa sổ ZBrush.
- Sẽ thấy mục **ZZZ Mushogenshin Tools** ở dưới cuối, xổ ra.

![ZZZ Mushogenshin Tools (ZPlugin)](https://firebasestorage.googleapis.com/v0/b/dpgp-techart.appspot.com/o/tuts%2Fpoi%2Fplugin.jpg?alt=media&token=e75d7227-2bb6-4fe6-a763-e631dac9e147 "ZZZ Mushogenshin Tools (ZPlugin)")

- Bấm nút **Load 4 Palettes** (để hiện 4 palette A, B, C, D trên thanh menu).
- Bấm nút **Set My Hotkeys** để overwrite (ghi đè) phím tắt mặc định của ZBrush bằng phím tắt custom của Hoan.
- Lúc này bạn đã sẵn sàng để sử dụng 4 palette và toàn bộ các phím tắt custom của Hoan.

### 🙀 2B. Cách cài vào ZBrush (thủ công)
{coming later}

## 🗑️ Gỡ bỏ

- Để ngưng sử dụng phần giao diện custom (4 bộ palette): vào plugin **ZZZ Mushogenshin Tools**, bấm nút **Reset UI**, giao diện của bạn sẽ về lại mặc định ban đầu của ZBrush.
- Để ngưng sử dụng bộ phím tắt custom: vào plugin **ZZZ Mushogenshin Tools**, bấm nút **Reset HKs**, phím tắt của bạn sẽ quay về lại mặc định ban đầu của ZBrush.

  `;

  return (
    <div className={styles.poi}>
      <div id="intro">
        <ReactMarkdown remarkPlugins={[gfm]}>{introContent}</ReactMarkdown>
      </div>
      <div id="mats-brushes">
        <ReactMarkdown remarkPlugins={[gfm]}>{extrasContent}</ReactMarkdown>
      </div>
      <div id="palettes">
        <ReactMarkdown remarkPlugins={[gfm]}>{paletteContent}</ReactMarkdown>
      </div>
      <div id="macros">
        <ReactMarkdown remarkPlugins={[gfm]}>{macroContent}</ReactMarkdown>
      </div>
      <div id="hotkeys">
        <ReactMarkdown remarkPlugins={[gfm]}>{hotkeysContent}</ReactMarkdown>
      </div>
      <div id="plugin">
        <ReactMarkdown remarkPlugins={[gfm]}>{pluginContent}</ReactMarkdown>
      </div>
      <div id="default-zscript">
        <ReactMarkdown remarkPlugins={[gfm]}>{zscriptContent}</ReactMarkdown>
      </div>
      <div id="install">
        <ReactMarkdown remarkPlugins={[gfm]}>{installContent}</ReactMarkdown>
      </div>
    </div>
  );
}
