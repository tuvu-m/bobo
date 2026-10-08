# Tiệm Trà Bobơ

Game quản lý tiệm trà sữa trên web, một file `tiem-tra-sua.html` (HTML + CSS + JS, không cần build). Trả lời người dùng bằng tiếng Việt.

## Yêu cầu chung
- Cả game phải vừa một màn hình điện thoại. Các tab được phép cuộn bên trong.
- Phong cách pastel vẽ tay. Hình là ảnh do người dùng vẽ bằng AI, nhúng thẳng vào file dưới dạng base64 trong `SPRSRC`. Món nào chưa có ảnh thì game tự vẽ bằng code thay thế.
- Đồ trên quầy chỉ di chuyển được lúc chuẩn bị. Quầy là lưới tự do: món nào cũng đặt được ở bất kỳ chỗ trống nào, kể cả bàn pha và máy đóng gói.
- Không cho phóng to khi chơi (viewport `user-scalable=no`, `touch-action`, chặn cử chỉ `gesturestart`).
- Lúc bán: pha xong thì chạm máy đóng gói, ly tự chạy vào máy và giao. Không kéo ly.
- Máy đóng gói chỉ giao ly khớp đơn (`cupMiss`). Sai không sửa được (sai size, rót quá vạch, thừa đồ, dư đường/đá) thì phải bỏ ly; còn thiếu (chưa tới vạch, thiếu nước/siro/topping/kem/đường/đá) thì bỏ thêm là giao được. Ly hỏng (`cup.broken`: nhân viên pha sai hoặc tràn ly) cũng bị từ chối. Ly hỏng chỉ báo bằng thông báo; người chơi phải bỏ ly và tự làm lại (`it.redo`, nhân viên không phụ ly làm lại).
- Mỗi món trên quầy có khung viền xám. Lúc bán, đồ còn thiếu cho đơn đang phục vụ có viền cam đậm, nền cam nhạt, không nhấp nháy (`orderNeeds`). Khi phải bỏ ly thì thùng rác viền đỏ. Phiếu order tô cam các mục chưa làm.
- Nhân viên Pha chế không pha ly riêng mà phụ cùng ly trên bàn pha (`staffTick`, trạng thái `D.as`), làm theo trình tự `ASTEPS`: lấy ly > nước > đường > đá > topping > kem. Một ly khoảng 3 giây (`cupTime`), càng nhiều Pha chế càng nhanh. Bước người chơi đã làm đủ thì bỏ qua; đường/đá chưa đủ thì bù cho đủ. Mỗi bước có xác suất pha hỏng `errP` theo Khéo tay. Càng nhiều nhân viên đi làm càng đông khách.
- Chữ hướng dẫn mặc định ẩn. Nút (?) bật lên (class `sub`/`hint`, `body.help`).

## Cấu trúc code (tìm theo tên)
- Dữ liệu nguyên liệu thô:
  - `BASES` gồm trà và sữa (`kind` là `tea` hoặc `milk`); `SYRUPS` gồm siro và bột; `TOPS`; `FOAMS`.
  - `f` là vector vị [béo, thanh, đậm, trái cây, bùi]. `rare` là hàng nhập hiếm.
- Độ hợp vị:
  - `pairScore` = cosine của hai vector vị + `ruleScore` + `SPECIAL`.
  - `inspect()` kiểm định món và tính hệ số. Giá trị món tính bằng `recValue`.
- Công thức: `{bs, ss, ts, fs}` ứng với trà/sữa, siro/bột, topping, kem. `basic:true` là món cơ bản, do `syncBasics()` tạo.
- Topping là món thêm, không nằm trong công thức: `r.ts` của công thức luôn rỗng. Khi gọi món, khách tự chọn topping đang bày trên quầy (`pickTops`, lưu vào `o.ts` của đơn) và trả thêm `topPrice`.
- Quầy:
  - Toạ độ trong khung logic `SW` × `SH`, chia lưới `COLS` × `ROWS` (8×10) ô. `SH` cố định 237; `SW` co giãn 180–300 theo màn hình (`setSW`, tính trong `layoutShop`, nhớ ở localStorage `tt_sw`) để quầy lấp đầy bề ngang. Ô vì vậy có thể rộng hơn cao, nên đừng giả định `CW` = 22.5; vẽ trong bàn pha dùng tỉ lệ theo `WORK.w` (ví dụ `cupX()`).
  - `S.grid=[{id,c,r}]` lưu đồ đang bày (ô góc trái trên). `id` là mã nguyên liệu, `M`/`L` (chồng ly), `sugar`/`ice`/`trash`, `work` (bàn pha), `seal` (máy đóng gói).
  - Kích thước tính bằng ô trong `FP`: trà, sữa, siro, kem, ly, dụng cụ là 1×2; khay topping và máy đóng gói 2×2; bàn pha 3×2. Máy đóng gói chỉ vẽ hình máy và đèn trạng thái, không có chữ; chỗ ly chui vào máy lấy theo hình (`sealSlot`).
  - `WORK`/`SEAL` là hình chữ nhật hiện tại của bàn pha và máy, do `placeFixed()` cập nhật.
  - `S.stored` lưu đồ cất trong kho, `S.lastPos` nhớ chỗ cũ của món bị gỡ. Ly, dụng cụ, bàn pha và máy (`FIXED`) không cất được.
  - Ô Kho (`#khoBox`) ở tab Quầy luôn hiện và dính ở đầu tab; kéo đồ từ quầy thả vào đó để cất.
  - `dropPlan()` quyết định dời hay đổi chỗ (chỉ đổi chỗ với món cùng cỡ), `placeAt()` bày từ kho, `storeObj()` cất.
  - `syncLayout()` giữ lưới hợp lệ và chuyển save cũ có `S.layout` (quầy chia khu) sang lưới bằng `defaultGrid()`. `LAYG()` là quầy dùng lúc bán (ngày khẩn cấp chỉ có trà mạn).
  - Đồ hết hàng không được bày lên quầy.
- Khách quen: lưu trong `S.regs` (tối đa `REG_MAX`), loại khách `quen`. `regAfter()` tạo khách quen mới (khách cho 5★, xác suất 30%) và xử lý lúc họ rời tiệm. `spawn()` thỉnh thoảng gọi một khách quen ghé lại (tối đa 1 lần/ngày). Hào quang vẽ trong `drawCust`.
- Sự kiện vui: danh sách `EVS`. Mỗi sự kiện có `yes()`/`no()` trả về câu thông báo, và dùng các hàm hiệu ứng `ev*` (ví dụ `evAway` ra ngoài, `evSlow` pha chậm, `evGain`/`evPay` thu chi). Lịch sự kiện của ngày nằm ở `D.evPlan` (từ ngày 2), thẻ sự kiện hiện trong phiếu order (`renderTicket`). Thu từ sự kiện ghi vào `ev` trong sổ, chi ghi vào mục `sukien`.
- Cảnh tiệm có kích thước 160×62. Hàm vẽ là `drawScene`, đồ trang trí vẽ qua `drawDecor` với các vị trí trong `DSLOT`.
- Lưu game: biến state `S` lưu vào localStorage `tiemtra3`. Hàm `migrate()` chuyển save cũ sang dạng mới, trong đó `toRaw()` chuyển công thức cũ sang nguyên liệu thô, còn khối `s.addon` bỏ topping khỏi công thức cũ.
- Lưu đám mây dùng `window.claude.use('db')`. Tính năng này chỉ chạy khi file được mở như artifact trên claude.ai.

## Host
Game được host trên GitHub Pages ở https://tuvu-m.github.io/bobo/ (repo `tuvu-m/bobo`, nhánh `main`). `index.html` chỉ chuyển hướng sang `tiem-tra-sua.html`. File game phải giữ `<!doctype>` và thẻ `<meta name="viewport">` ở đầu, nếu không điện thoại sẽ hiển thị game như trang desktop.

## Hiệu năng (đỡ tốn pin)
- Vòng lặp `frame`: cảnh tiệm 20 hình/giây, quầy 30 khi đang rót/kéo/đóng gói; màn hình không có hình động thì ngủ (kiểm tra 4 lần/giây). `ECO` (tiết kiệm pin, localStorage `tt_eco`) hạ hình/giây và độ nét.
- Quầy chỉ vẽ lại khi `stationSig` đổi; lớp tĩnh (mặt quầy, các món, viền) lưu trong `C.st` qua `stationStatic`, mỗi khung chỉ vẽ lớp động (ly, dòng nước, món đang kéo). Thêm thứ gì vẽ trên quầy thì nhớ đưa trạng thái của nó vào chữ ký tương ứng.
- Cảnh tiệm: tường, sàn, thảm lưu sẵn ở `C.bg`; đèn và bảng neon tỏa sáng vẽ sẵn (`offLayer`), tránh `shadowBlur` mỗi khung hình.
- `layoutShop` chỉ chạy lại khi kích thước đổi; chữ trên thanh trên cùng ghi qua `setText` (chỉ ghi khi đổi).

## Tính năng vui (chỉ trang trí, không đổi cách chơi)
- Hai bé mèo Chub (cam) và Bim (trắng, nơ hồng; ảnh trắng tô lại từ `f_meo`) nằm trước quầy, chạm để vuốt (`drawCats`, `petCat`). Chạm khách để nghe họ nói (`CHAT`).
- Combo 5★ liên tiếp, pháo giấy (`confetti`), huy hiệu `ACH` (thống kê ở `S.stat`, đã mở ở `S.ach`, xem trong tab Đánh giá; gọi `checkAch()` sau các sự kiện liên quan).
- Chụp ảnh tiệm (`takePhoto`): điện thoại mở bảng chia sẻ, máy tính tải PNG. Thời tiết trong ô kính cửa sổ (`weatherFX`). Âm thanh tổng hợp bằng Web Audio (`sfx`, bật/tắt bằng localStorage `tt_snd`).

## Cấp tiệm và tiền
- `SHOP` có 5 cấp, mỗi cấp quy định trần số khách/ngày và số nhân viên tối đa (`staffMax()`). Cuối ngày `shopUp()` tự lên cấp khi đủ số review 5★ (`S.five`) và tổng doanh thu (`lifeRev`: tiền bán món + tip).
- Hình theo cấp: `lvSpr('k_quay')` lấy `k_quay_N` (N = cấp 1..5), cấp nào chưa có hình thì dùng hình chung. Tương tự với `k_maihien`, `k_san`; ảnh tiệm `tiem_N` hiện ở tab Trang trí. Cả 5 cấp đã có hình. Tâm và bề rộng bảng tên trống trên từng ảnh quầy nằm trong `SIGNPOS`. Prompt vẽ nằm trong `prompt-art.md`.
- Màn hình loading (`#boot`) đặt trước `#app`, trước dữ liệu ảnh nặng, để hiện ngay khi trang đang tải. Ảnh nền nhúng thẳng trong CSS của `#boot`. Thanh tải chạy giả tới 70%, sau đó tính theo số ảnh `SPRSRC` đã giải mã (`bootProgress`/`bootFinish`). Chạm để bỏ qua, tối đa 6 giây.
- File có 2 khối `<script>`: khối nhỏ của màn loading và khối chính. Khi `node --check`, kiểm tra cả hai.
- Tiền hiển thị qua `fmt`/`fk`: từ 1 triệu trở lên thì rút gọn (triệu, tỉ, nghìn tỉ).
- Mốc lên cấp trong `SHOP` được tính để người chơi giỏi lên cấp 5 vào khoảng ngày 300 (cấp 5: 37.000 review 5★ và 2,5 tỉ doanh thu).
- Tên tiệm `S.shopName` (mặc định "Bobơ"), đổi ở tab Trang trí, hiện trên bảng quầy qua `signText` (tên dài tự xuống 2 dòng).
- Sự kiện tiền lớn trong `EVS` (thuế, kiện, mặt bằng, KOL, trộm, đặt tiệc, trật tự đô thị, hội chợ): số tiền tính theo doanh thu trung bình mỗi ngày (`dayRev`, `evAmt`). Khoản phạt dùng `evLose` (không trừ quá số tiền đang có). Lựa chọn tốn tiền khai báo `cost` để khoá nút khi không đủ tiền. Thuế (`sched:true`) tự đến mỗi 30 ngày lúc 10 giờ, hết giờ chọn thì tự nộp (`def`).

## Thêm hình mới
Cắt ảnh sprite sheet (nền trong suốt) thành từng món, thu nhỏ còn khoảng 200px, đổi sang webp base64, rồi thêm vào `SPRSRC` với key là mã món, ví dụ `hongtra` hay `ly_den`.

## Kiểm tra
- Tách từng khối `<script>` ra rồi chạy `node --check` để kiểm tra cú pháp.
- Chạy Playwright với khung 390×780 và 375×667 để chụp ảnh màn hình kiểm tra.
