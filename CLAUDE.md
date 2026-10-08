# Tiệm Trà Góc Phố

Game quản lý tiệm trà sữa trên web, một file `tiem-tra-sua.html` (HTML + CSS + JS, không cần build). Trả lời người dùng bằng tiếng Việt.

## Yêu cầu chung
- Cả game phải vừa một màn hình điện thoại. Các tab được phép cuộn bên trong.
- Phong cách pastel vẽ tay. Hình là ảnh do người dùng vẽ bằng AI, nhúng thẳng vào file dưới dạng base64 trong `SPRSRC`. Món nào chưa có ảnh thì game tự vẽ bằng code thay thế.
- Đồ trên quầy chỉ di chuyển được lúc chuẩn bị, và chỉ trong đúng khu của nó.
- Chữ hướng dẫn mặc định ẩn. Nút (?) bật lên (class `sub`/`hint`, `body.help`).

## Cấu trúc code (tìm theo tên)
- Dữ liệu nguyên liệu thô:
  - `BASES` gồm trà và sữa (`kind` là `tea` hoặc `milk`); `SYRUPS` gồm siro và bột; `TOPS`; `FOAMS`.
  - `f` là vector vị [béo, thanh, đậm, trái cây, bùi]. `rare` là hàng nhập hiếm.
- Độ hợp vị:
  - `pairScore` = cosine của hai vector vị + `ruleScore` + `SPECIAL`.
  - `inspect()` kiểm định món và tính hệ số. Giá trị món tính bằng `recValue`.
- Công thức: `{bs, ss, ts, fs}` ứng với trà/sữa, siro/bột, topping, kem. `basic:true` là món cơ bản, do `syncBasics()` tạo.
- Quầy:
  - Toạ độ trong khung logic `SW` × `SH` (180×237). Vị trí các ô nằm trong `ZONES`, bàn pha là `WORK`, máy đóng gói là `SEAL`.
  - `S.layout` lưu đồ đang bày, `S.stored` lưu đồ cất trong kho.
  - Đồ hết hàng không được bày lên quầy.
- Cảnh tiệm có kích thước 160×62. Hàm vẽ là `drawScene`, đồ trang trí vẽ qua `drawDecor` với các vị trí trong `DSLOT`.
- Lưu game: biến state `S` lưu vào localStorage `tiemtra3`. Hàm `migrate()` chuyển save cũ sang dạng mới, trong đó `toRaw()` chuyển công thức cũ sang nguyên liệu thô.
- Lưu đám mây dùng `window.claude.use('db')`. Tính năng này chỉ chạy khi file được mở như artifact trên claude.ai.

## Thêm hình mới
Cắt ảnh sprite sheet (nền trong suốt) thành từng món, thu nhỏ còn khoảng 200px, đổi sang webp base64, rồi thêm vào `SPRSRC` với key là mã món, ví dụ `hongtra` hay `ly_den`.

## Kiểm tra
- Tách phần `<script>` ra rồi chạy `node --check` để kiểm tra cú pháp.
- Chạy Playwright với khung 390×780 và 375×667 để chụp ảnh màn hình kiểm tra.
