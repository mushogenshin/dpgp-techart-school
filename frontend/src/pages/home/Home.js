import Vimeo from "../../components/vimeo";
import logo from "../../logo.svg";

import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.featured}>
        <Vimeo id="339689303" />
      </div>
      <header className="App-header">
        <div className="App-logo-row">
          <img src={logo} className="App-logo" alt="logo" />
          <img src={logo} className="App-logo" alt="logo" />
          <img src={logo} className="App-logo" alt="logo" />
        </div>
      </header>
      <div className={styles.manifesto}>
        <p>
          Bắt đầu nguyên thuỷ với các lớp dạy Anatomy về cơ thể người, đến nay
          "Dẫu Phải Giải Phẫu" đã mở rộng sang rất nhiều bộ môn khác nhau, và
          tuy gom chung dưới cái tên bao trùm "Technical Art", các bạn học viên
          đều có thể vững chãi tin rằng những lớp Art của DPGP xưa nay và trong
          tương lai vẫn tập trung vào khía cạnh thẩm mỹ và kỹ năng hội hoạ căn
          bản, nội dung được xây dựng bởi Artists và dành cho Artists, không
          khác gì các chương trình mỹ thuật chính thống.
        </p>
        <p>
          DPGP tin rằng bên cạnh việc vẽ là đam mê, là sở thích, thì vẽ còn có
          thể là giao tiếp: trao đổi giữa tác giả và khán giả, và trên hết, vẽ
          là tư duy: là tổng kết những gì ta hiểu về sự vật, hiện tượng, và thế
          giới. Cũng từ đó, DPGP tin rằng khát khao lẫn tiềm tàng sáng tạo của
          một người hoạ sĩ thời hiện đại còn có thể biểu đạt qua rất nhiều hình
          thái khác: bao gồm những bộ môn nằm trong chữ "Tech" bên trong
          "TechArt".
        </p>
        <p>
          Đó là lý do mà xuất thân từ bộ môn giải phẫu, cũng như cách nhân loại
          từ đó đã có thời kỳ Phục Hưng và Cách mạng Khoa học và Công nghiệp,
          nay "Dẫu Phải Giải Phẫu" cảm thấy một sự phát triển vô cùng tự nhiên:
          sau hành trình 8 năm với hơn 500 học viên, chúng ta sẽ không chỉ dừng
          lại ở Anatomy, mà sau khi hiểu rõ trước tiên về bộ máy cơ thể con
          người, cả một chân trời nay đã mở ra: không chỉ là Animation, Rigging,
          lập trình, nhưng còn là khả năng và nỗ lực tìm hiểu tường tận những
          thứ mà chúng ta mong muốn, là óc tư duy phân tích, là kỹ năng tổng hợp
          vấn đề.
        </p>
        <p>
          "Dẫu Phải Giải Phẫu" từ đó thân mời các bạn cùng dấn bước, vẫn thoải
          mái hăng say với nghề vẽ, nhưng cũng không hề sợ hãi những bộ môn kỹ
          thuật khác, bởi vì vẽ từ đầu đã là một cách để thông qua đó ta hiểu
          thế giới, và người đam mê vẽ là người đã được "thiên phú" với trí tò
          mò, lòng say mê tìm hiểu, là những phẩm chất càng quý báu trong thời
          đại hôm nay.
        </p>
        <p>
          Chúng ta không cần sợ mang danh "Artist không ra Artist" ngay cả khi
          theo đuổi TechArt. Cũng như ta không việc gì phải xấu hổ khi chọn theo
          học "những lớp có cảm giác quá kỹ thuật" để phục vụ cho hành trình
          nghệ thuật của mình cả. Trái lại, những người còn giữ ám ảnh "battle
          of Tech versus Art" (cuộc chiến của nghệ thuật đối lập với kỹ thuật
          hay công nghệ) mới chính là những người dễ có tư duy hạn hẹp đó chứ:
          Sử dụng nhuần nhuyễn kỹ thuật để chuyên chở cảm xúc, đó chẳng phải là
          điều các bậc thầy trong ẩm thực, thời trang, hội hoạ, điêu khắc, kiến
          trúc, thơ ca, âm nhạc, kịch nghệ, nhiếp ảnh, điện ảnh, VFX, comics,
          v.v. đã làm từ bấy lâu trong lịch sử nhân loại hay sao?
        </p>
        <p>
          "Dẫu Phải Giải Phẫu" hy vọng gợi ra cho các bạn những hành trình tuy
          cam go nhưng nhiều phần thưởng và lợi ích cho những ai bền chí kiên
          định. Đó là chuyến phiêu lưu mà đứa trẻ nhỏ bên trong từng người chúng
          ta luôn hào hứng đòi hỏi được đi: vẽ, sáng tạo, tìm hiểu thế giới, là
          những sự phấn khởi và lòng vui thú thiên bẩm nếu không bị đè bẹp bởi
          các thế lực khác.
        </p>
      </div>
    </div>
  );
}
