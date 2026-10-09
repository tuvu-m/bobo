# Tiệm Trà Bobơ

Game quản lý tiệm trà sữa trên web, một file `tiem-tra-sua.html` (HTML + CSS + JS, không cần build). Trả lời người dùng bằng tiếng Việt.

## Yêu cầu chung
- Cả game phải vừa một màn hình điện thoại. Các tab được phép cuộn bên trong.
- Phong cách pastel vẽ tay. Hình là ảnh do người dùng vẽ bằng AI, nhúng thẳng vào file dưới dạng base64 trong `SPRSRC`. Món nào chưa có ảnh thì game tự vẽ bằng code thay thế.
- Đồ trên quầy chỉ di chuyển được lúc chuẩn bị. Quầy là lưới tự do: món nào cũng đặt được ở bất kỳ chỗ trống nào, kể cả máy đóng gói.
- Không cho phóng to khi chơi: viewport `user-scalable=no` (iPhone bỏ qua), mọi phần tử `touch-action:manipulation` để chặn chạm hai lần phóng to (canvas thì `none`), chặn cử chỉ `gesturestart`, và dự phòng chặn hai lần `touchend` liền nhau ngoài nút/ô nhập.
- Lúc bán có hai màn (`syncMode`, cờ `MK`; có ly hoặc đang đóng gói thì là màn pha):
  - Màn quán: cảnh tiệm hiện đủ; hàng thẻ order cuộn ngang (`#qrow`, class `oq`, `renderQ`/`qCard`): mỗi thẻ là một ly (khách, món, size, topping, thanh kiên nhẫn, ai đang pha + tiến độ; thẻ "Tiếp theo" viền cam). Chạm thẻ: chờ thì lấy order đó, nhân viên đang pha thì vào phụ, hỏng thì bỏ ly, thiếu hàng thì mở bảng đổi món; ✕ trên thẻ đang chờ để từ chối khách (`refuseCust`). Bên dưới là thẻ nhân viên một dòng và nút to "Lấy order tiếp theo" (`nextIt`, `takeOrder`: ly đúng size tự tạo, không còn chọn Ly M/L). Phiếu `#tk` ở màn quán chỉ hiện khi có sự kiện hoặc mặc cả/ghi nợ (class `tkon`). Toast màn quán nằm trên nút. Tiến độ, bước đang làm, kiên nhẫn ghi thẳng vào thẻ mỗi khung hình; thẻ chỉ dựng lại khi đổi trạng thái.
  - Lấy order thì hình ly bay lên (`flyCup`) và sang màn pha: khung trên (`drawStage`, canvas `#stg`) có ly to bên phải và đơn của khách bên trái (`renderOrd`, `#ordp`, chỉ ghi những gì còn phải làm, sai thì tô đỏ, không chữ giải thích). Phiếu `#tk` ẩn đi, chỉ hiện đè lên khung ly khi có sự kiện, mặc cả/ghi nợ hoặc gợi ý đổi món (class `tkov`). Trên khung ly vẫn có một dải cảnh tiệm mỏng (52–80px, cắt quanh tầm đầu khách, `band` trong `layoutShop`) để thấy khách đi vào, nói chuyện, vuốt mèo; cảnh tiệm vẽ ở cả hai màn. Quầy nguyên liệu bám đáy màn hình; quầy lấy chỗ trước, khung ly cao 140–200px. Nút "← Quán" và thẻ nhân viên cần bạn nằm ở góc trên bên phải khung ly (`#mkbar`), đơn hàng ở nửa trái.
  - Pha xong chạm máy đóng gói trên quầy (không có nút Đóng gói riêng): ly rơi từ trên xuống máy, giao xong thì về màn quán. Không kéo ly.
- Máy đóng gói chỉ giao ly khớp đơn (`cupMiss`). Sai không sửa được (sai size, rót quá vạch, thừa đồ, dư đường/đá) thì phải bỏ ly; còn thiếu (chưa tới vạch, thiếu nước/siro/topping/kem/đường/đá) thì bỏ thêm là giao được. Ly hỏng (`cup.broken`: tràn ly) cũng bị từ chối.
- Mỗi món trên quầy có khung viền xám. Lúc bán, đồ còn thiếu cho đơn đang phục vụ có viền cam đậm, nền cam nhạt, không nhấp nháy (`orderNeeds`). Khi phải bỏ ly thì thùng rác viền đỏ. Phiếu order tô cam các mục chưa làm.
- Mỗi người lo 1 ly (`staffTick`): mỗi Pha chế tự nhận ly kế tiếp chưa ai làm theo thứ tự khách (`staffPick`, đánh dấu `it.sj` trên từng ly của đơn, việc đang làm ở `s.w`), pha theo trình tự `ASTEPS` (lấy ly > nước > đường > đá > topping > kem > đóng gói) rồi tự giao (`staffDone` → `serveCup`). Một ly khoảng `STAFF_T` = 6 giây (`soloTime`: Tốc độ, mệt thì chậm hơn). Khách gọi nhiều ly thì mỗi người làm một ly.
  - Người chơi pha ly kế tiếp còn trống: `target()` trả về khách của ly đang cầm (ly gắn với khách qua `cup.cid`/`cup.ix`, `bindCup`), không thì khách có ly đầu tiên chưa ai làm (`freeIt`, đặt `c.cur`). Nhân viên không lấy ly người chơi đang cầm. Khách đang được nhân viên pha mất kiên nhẫn chậm hơn một nửa.
  - Mỗi bước có xác suất pha hỏng `errP` theo Khéo tay: thẻ nhân viên đỏ, nhân viên đứng chờ người chơi chạm Bỏ ly (`staffDrop`) rồi làm lại từ đầu (tốn nguyên liệu lần nữa). Đang ra ngoài thì họ tự bỏ. Hết hàng giữa chừng thì trả ly lại cho người chơi đổi món (`staffRelease`).
  - Nhân viên mệt (tinh thần < 30, `tired`): pha chậm, dễ hỏng. Lúc bán có thể cho nghỉ giải lao một lần mỗi ngày (`staffRest`: xong ly đang pha thì nghỉ `BRK_T` giây, tinh thần +`BRK_MOOD`).
  - Nhảy vào phụ: ly nhân viên đang pha là ly thật (`w.cup`, có `staff`/`cid`/`ix`). Chạm thẻ của họ (`staffHelp`, chỉ khi không cầm ly của mình) thì vào màn pha với ly đó; bước nào bạn làm đủ thì họ bỏ qua (`stepNeed`), họ đang rót thì bạn chờ. Ai đóng gói trước thì giao; bạn bỏ ly thì họ làm lại với ly mới; "← Quán" thì rời ly, họ làm tiếp. Lúc đóng gói, ly sai không sửa được (ví dụ bạn bỏ dư đường) thì họ báo hỏng. `staffOf(cup)` cho biết ly đang cầm là của ai.
  - Thẻ nhân viên (`stfChip`, `renderStf`): màn quán có một dòng mỗi người (rảnh, đang pha, nghỉ, 😩 Cho nghỉ, hỏng · Bỏ ly), ai không phải Pha chế thì ghi một dòng "… là Phục vụ, không pha" (`#stfo`); màn pha có dải nhỏ trên cùng (`#mkbar`, cùng nút "← Quán") chỉ hiện người cần bạn (ly hỏng, mệt có thể cho nghỉ). Thẻ chỉ thay từng cái khi đổi trạng thái, tiến độ ghi thẳng vào thanh, để cú chạm không bị nuốt.
  - Nhịp khách (`arrivalGap`) tính theo sức cả đội cộng phần người chơi pha. Càng nhiều nhân viên đi làm càng đông khách.
- Chữ hướng dẫn mặc định ẩn. Nút (?) bật lên (class `sub`/`hint`, `body.help`).
- Rót trà/sữa: phải giữ bình. Mỗi ly chỉ tốn 1 phần cho mỗi loại trà/sữa dù bấm bao nhiêu lần (`cup.used`); bỏ ly làm ly khác thì tốn thêm. Phần đó chỉ bị trừ khi nước thật sự chảy vào ly; chạm nhanh thì nhắc "Giữ bình để rót". Ly đã tới vạch mà còn thiếu một loại trà/sữa thì loại đó chỉ rót thêm được một chút (`pourCap`).
- Phiếu order: lỗi phải bỏ ly (ly hỏng, sai size, quá vạch, thừa đồ) luôn là nhãn đỏ đầu tiên; topping gộp một nhãn; "Không topping" là nhãn xám (`checks`). Ly hỏng có nhãn đỏ ở khung ly.
- Toast có mức ưu tiên (`toast(m,ms,p)`): kết quả sự kiện (2) không bị điểm sao (0) đè. Chuyển màn thì tắt toast cũ (`toastOff` trong `show`). Lúc bán toast không được che cảnh tiệm (bong bóng khách nói): màn quán thì nằm ngay trên nút Lấy order, màn pha thì ngay trên quầy (biến CSS `--qbot` đặt trong `layoutShop`).
- Thông báo: thông báo xấu (`bad`) luôn lên đầu và còn lại khi chuyển tab; quá 2 cái thì có nút "+N thông báo khác".
- Thanh tab: tab mới mở có chấm hồng (`S.newTabs`) và được cuộn vào tầm nhìn; mờ mép khi còn tab bị che (`tabFade`, class `tfl`/`tfr`). Đừng đặt class `fl`: trùng với biểu tượng ngọn lửa.

## Cấu trúc code (tìm theo tên)
- Dữ liệu nguyên liệu thô:
  - `BASES` gồm trà và sữa (`kind` là `tea` hoặc `milk`); `SYRUPS` gồm siro và bột; `TOPS`; `FOAMS`.
  - `f` là vector vị [béo, thanh, đậm, trái cây, bùi]. `rare` là hàng nhập hiếm.
- Độ hợp vị:
  - `pairScore` = cosine của hai vector vị + `ruleScore` + `SPECIAL`.
  - `inspect()` kiểm định món và tính hệ số. Giá trị món tính bằng `recValue`.
- Công thức: `{bs, ss, ts, fs}` ứng với trà/sữa, siro/bột, topping, kem. `basic:true` là món cơ bản, do `syncBasics()` tạo.
- Topping là món thêm, không nằm trong công thức: `r.ts` của công thức luôn rỗng. Khi gọi món, khách tự chọn topping đang bày trên quầy (`pickTops`, lưu vào `o.ts` của đơn) và trả thêm `topPrice`.
  - Mỗi ly tối đa `topCap()` topping: 2, tiệm từ cấp 3 thì 3.
  - Số topping mỗi ly: mỗi topping trên quầy có xác suất riêng `topP` (hợp vị, hot, hiếm), gộp thành phân phối `topDist`.
  - Thay vì bốc ngẫu nhiên thuần, game bốc số `u` từ túi 20 lượt (`topBag`, lưu ở `D.tbag`). Túi chia đều 0..1 nên giữ đúng tỉ lệ, rồi xếp xen kẽ nửa thấp và nửa cao để đơn dễ và đơn nhiều topping luân phiên.
  - Chọn topping nào thì topping hot được ưu tiên khoảng 2,5 lần.
- Món được khách chọn theo `recW` (hợp vị, hot, hiếm, bán có hạn, giá hợp lý). Số khách mỗi ngày tính trong `dayRaw()`, dùng chung cho `startDay` và nút nhập hàng.
- Giảm độ khó cho người mới:
  - Số món bán cùng lúc theo cấp tiệm: `MENU_CAP`/`menuCap()`. Save cũ bán quá giới hạn vẫn giữ món, chỉ chặn thêm món mới.
  - Tab mở dần theo ngày (`TAB_DAY`, `tabOpen`). Lưu game luôn hiện; Tài chính hiện sớm khi sắp hết tiền hoặc đang vay; mở khóa tất cả (`S.allOpen`) hiện đủ. Mục Kem ở tab Nguyên liệu hiện từ ngày 5.
  - Nút "Bày theo thực đơn" (`layPlan`/`autoLay`) ở tab Quầy: giữ chỗ cũ, bày đủ đồ thực đơn cần, cất đồ không dùng, còn chỗ thì bày thêm topping.
  - Nút "Nhập đủ cho hôm nay" (`buyPlan`/`autoBuy`) ở tab Nguyên liệu: ước lượng số ly (`dayCups`) rồi nhập phần còn thiếu, thiếu tiền thì nhập được tới đâu hay tới đó.
  - `migrate()` báo một lần cho người chơi cũ (cờ `s.capV`).
- Tab Thực đơn là lưới 3 cột (`thucdonHTML`):
  - Lọc bằng `menuFilter` (`MFILT`), xếp bằng `menuSort` (`MSORT`: lãi/ly `recProfit`, giá, mới nhất).
  - Mặc định hiện `MENU_SHOW` món, bấm "Xem thêm" mới hiện hết.
  - Chạm món (`menuSel`) thì khung đặt giá (`recCard(r,'menu')`) mở ngay dưới hàng của món đó.
- Quầy:
  - Toạ độ trong khung logic `SW` × `SH`, chia lưới 6 cột × `ROWS` hàng. Số hàng mở dần: người mới 6×6, mua "Nới quầy +2 hàng" ở tab Quầy (`growCounter`, giá `QROW_COST` 80k/250k/600k, tối đa 6×12, lưu ở `S.qrows`, `setRows`). Hàng mới thêm ở phía trên, mọi món dời xuống 2 hàng nên đồ ở đáy giữ nguyên chỗ. Save cũ mở sẵn 6×12. Ô cao ~23.7 (`CH`), `SH`=`ROWS`×`CH`; `SW` co giãn 135–224 theo màn hình (ô rộng/cao .95–1.58) (`setSW`, tính trong `layoutShop`, nhớ ở localStorage `tt_sw`) để quầy lấp đầy bề ngang. Ô vì vậy có thể rộng hơn cao, nên đừng giả định `CW` = 22.5.
  - `S.grid=[{id,c,r}]` lưu đồ đang bày (ô góc trái trên). `id` là mã nguyên liệu, `sugar`/`ice`/`trash`, `seal` (máy đóng gói). Bàn pha và chồng ly M/L không còn trên quầy. Save lưới 8×10 cũ được `migrate()` xếp lại theo bố cục mặc định (cờ `s.g6`), giữ thứ tự từng loại đồ. Bố cục mặc định: trà/sữa hàng trên cùng, dụng cụ và máy đóng gói hàng dưới cùng (gần ngón cái).
  - Kích thước tính bằng ô trong `FP`: trà, sữa, siro, kem, giấy bọc, dụng cụ là 1×2; khay topping và máy đóng gói 2×2. Máy đóng gói chỉ vẽ hình máy và đèn trạng thái, không có chữ; chỗ ly chui vào máy lấy theo hình (`sealSlot`).
  - `SEAL` là hình chữ nhật hiện tại của máy đóng gói, do `placeFixed()` cập nhật.
  - `S.stored` lưu đồ cất trong kho, `S.lastPos` nhớ chỗ cũ của món bị gỡ. Dụng cụ và máy đóng gói (`FIXED`) không cất được.
  - Ô Kho (`#khoBox`) ở tab Quầy luôn hiện và dính ở đầu tab; kéo đồ từ quầy thả vào đó để cất.
  - `dropPlan()` quyết định dời hay đổi chỗ (chỉ đổi chỗ với món cùng cỡ), `placeAt()` bày từ kho, `storeObj()` cất.
  - `syncLayout()` giữ lưới hợp lệ và chuyển save cũ có `S.layout` (quầy chia khu) sang lưới bằng `defaultGrid()`. `LAYG()` là quầy dùng lúc bán (ngày khẩn cấp chỉ có trà mạn).
  - Đồ hết hàng không được bày lên quầy.
- Nhân vật đặc biệt (`TYPES`): xe ôm `xeom`, cảnh sát chìm `chim`, đại gia sĩ gái `sigai`, shipper `shipper`, hot girl sống ảo `songao`. Đơn riêng ở `typeOrders`, tên ở `TNAMES`. Hình riêng `k_xeom`, `k_chim`, `k_shipper`, `k_sigai`, `k_bangai`, `k_songao` đã có; loại nào thiếu hình thì dùng hình khách chung kèm biểu tượng `TICON` (cảnh sát chìm không có, và hiện là "Khách thường" trừ khi có nhân viên Tinh ý). Story của hot girl cộng khách hôm sau qua `S.buzz`.
- Tên khách theo tuổi và giới (`genName`): cách gọi `XUNG` (Bé, Em/Bạn, Anh/Chị/Bạn, Cô/Dì/Chú, Ông/Bà/Bác/Cụ), tên `GNAME`, tên ở nhà của trẻ con `BENAME`, gọi theo thứ `THU` (Hai, Ba, Tư…). Mỗi loại khách có tỉ lệ tuổi và giới riêng trong `TPROF`, khớp hình riêng của loại đó (ví dụ Food reviewer là nữ). Khách có `c.age`, `c.sex`. Hình khách chung chọn theo giới và tuổi qua `KTA`/`ktFor`. `kt_ba` là bà tóc bạc (tô lại từ `kt3`), `kt7` là ông. Chú xe ôm và cảnh sát chìm là người lớn tuổi. Lời nói theo tuổi: `CHAT.gia` (xưng ông/bà, gọi chủ tiệm là "con"), `CHAT.nhi`.
- Giấy bọc ly theo mùa (`CUPSKIN`): mua một lần ở tab Trang trí (mục Giấy bọc ly). Tới mùa theo tháng thật (`inSeason`, `seasonCups`) thì xấp giấy bọc là một món 1×2 trên quầy (loại `sleeve`, `drawSleeveStack`, không hết hàng). Pha ly thường xong chạm xấp giấy để bọc, chạm lần nữa để tháo (`wrapCup`, `cup.skin`). Khách trả thêm `up` (`cupUp`, cộng vào `c.cupUp` lúc giao); học sinh và chú xe ôm chê ly mắc (−1★). Hình: `sleeve_l_<id>`/`sleeve_m_<id>` cùng khung với `ly_l`/`ly_m` (vẽ đè lên ly), `sleeve_i_<id>` cho xấp giấy; thiếu hình thì vẽ bằng code (`drawSleeve`).
- Người chơi chỉ sang màn pha khi chủ động chạm ly (`PV`). Màn pha có nút "← Quán" (`#backQ`) khi có Pha chế; đang cầm ly mà ra quán thì ô chọn ly thành thẻ "Ly của bạn", chạm để vào pha tiếp.
- Tab Nhân viên (`staffHTML`): mỗi người một hàng gọn (`staffRow`: hình, vị trí, tinh thần kèm mặt 😊😐😩, chỉ số chính theo vị trí `ROLE_ST`, lương), hàng mệt tô cam và có dòng nhắc ở đầu. Chạm hàng (`staffSel`) mở phần chỉnh ngay dưới (`staffEdit`: tính cách, đủ 4 chỉ số, kết quả hôm trước, đổi vị trí, thưởng, đào tạo, nghỉ, thôi việc). Ứng viên là hàng có nút Thuê (`candRow`).
- Nhiệm vụ trong ngày (`QTPL`, `genQuests` trong `prepDay`, `S.q`): mỗi sáng 2 nhiệm vụ, tiến độ qua `qAdd`/`qSet` (gọi trong `settle`, `qServe`), "không ai bỏ về" chấm lúc `endDay`. Xong thì thưởng tiền (ghi vào thu sự kiện `D.evIn`), nhiệm vụ khó thêm 1 review 5★. Thẻ ở đầu tab Quầy (`qHTML`).
- Nâng cấp dụng cụ (`UPG`, `S.up`, `buyUpgrade`, mục cuối tab Quầy, chi vào `dungcu`): máy đóng gói nhanh 2 cấp (`sealDur`), bình rót tự ngắt đúng vạch (giới hạn rót trong vòng lặp rót), tủ lạnh giữ hàng thêm 1 ngày (`fridgeD` trong hạn dùng).
- Tiệm đối thủ (`S.rival`, `rivalTick` trong `prepDay`, `rivalDay` trong `endDay`): từ ngày 10, cách nhau ít nhất 14 ngày, mỗi ngày 25% có tiệm mở đối diện. Trong lúc đó khách −15% (`dayRaw`). Mỗi ngày so sao trung bình với sao của họ; thắng 4 ngày thì họ dẹp tiệm (+8 khách qua `S.buzz`), thua 4 ngày hoặc hết 7 ngày thì khách −10% thêm 7 ngày (`S.rvPen`). Nhãn ở dải sự kiện đầu tab.
- Vé số:
  - Khách lớn tuổi (`isOld`, gồm cả xe ôm và cảnh sát chìm) được 4–5★ thì hay tặng vé (`veGift`).
  - Nhiều loại vé (`VE_KIND`: vé số, vé cào, thẻ cào…) nhưng chung bảng giải `VE_PRIZE`. Mỗi giải quay riêng cùng lúc, trúng nhiều thì lấy giải cao nhất (`veRoll`). Độc đắc `VE_JP` theo cấp tiệm, tỉ lệ `VE_JP_P`.
  - Cuối ngày quay số vào `S.tix`. Dò ở màn tổng kết (`veHTML`, `veOpen`); không dò thì `veFlush` tự dò khi sang ngày. Tiền trúng ghi vào mục `veso` của sổ ngày đó.
- Tab Nguyên liệu: đồ món trên thực đơn cần thì tô nổi, có nhãn "Thực đơn" và "cần ~N" (`dayNeed`); topping đang bày có nhãn "Đang bày". Các món này lên đầu mỗi mục.
- Hết hàng giữa ngày: phiếu có dải đỏ "⚠ Hết …" (`missingOf`) với nút "Đổi món"; bấm (hoặc chạm thẻ order thiếu hàng) thì bảng đổi món bật từ đáy màn hình (`renderSug`, `#sugp`, ly cần đổi ở `D.sug` + `D.sugIx`, mỗi món một thẻ có hình, giá đã giảm), chọn món gọi `suggest`: đổi sang món pha được hoặc bỏ topping hết hàng, giảm `SUB_DISC` (10%, lưu ở `o.disc`, `priceOf` tự trừ), khách chờ thêm 40%. Nhân viên chờ người chơi quyết định chứ không đuổi khách.
- Phiếu order chỉ hiện những mục còn phải làm; mục đã bỏ đúng thì ẩn, đủ hết thì hiện "✓ Đủ rồi, chạm máy đóng gói".
- Phiếu order (`#tk`) cao cố định `--tkh` để quầy bên dưới không nhảy chỗ; phần giữa `.tkmid` cuộn bên trong, còn nội dung bị che thì mờ đáy (`tkMore`).
- Khách quen: lưu trong `S.regs` (tối đa `REG_MAX`), loại khách `quen`. `regAfter()` tạo khách quen mới (khách cho 5★, xác suất 30%) và xử lý lúc họ rời tiệm. `spawn()` thỉnh thoảng gọi một khách quen ghé lại (tối đa 1 lần/ngày). Hào quang vẽ trong `drawCust`.
- Sự kiện vui: danh sách `EVS`. Mỗi sự kiện có `yes()`/`no()` trả về câu thông báo, và dùng các hàm hiệu ứng `ev*` (ví dụ `evAway` ra ngoài, `evSlow` pha chậm, `evGain`/`evPay` thu chi). Lịch sự kiện của ngày nằm ở `D.evPlan` (từ ngày 2), thẻ sự kiện hiện trong phiếu order (`renderTicket`). Thu từ sự kiện ghi vào `ev` trong sổ, chi ghi vào mục `sukien`.
- Cảnh tiệm có kích thước 160×62. Hàm vẽ là `drawScene`, đồ trang trí vẽ qua `drawDecor` với các vị trí trong `DSLOT`. Lúc bán thanh trên cùng ẩn; màn quán hiện đủ cảnh, màn pha thì khung ly cao `stageH` (màn hình thấp hơn 720px thì thấp bớt).
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
- Phục vụ không đứng sau quầy (`frontPeople` chỉ có bạn và Pha chế) mà đi lại trên sàn (`floorStaff`, `floorTick`, vị trí ở `D.flo`), chào khách mới vào và cảm ơn khách ra về theo cách xưng hô của khách (`floorSay`), có bảng tên và bong bóng màu hồng. Chữ bong bóng khách nói cỡ 4.4 (`bubbleBar`) cho dễ đọc trên điện thoại.
- Hai bé mèo Chub (cam) và Bim (trắng, nơ hồng; ảnh trắng tô lại từ `f_meo`) nằm trước quầy, chạm để vuốt (`drawCats`, `petCat`). Chạm khách để nghe họ nói (`CHAT`).
- Combo 5★ liên tiếp, pháo giấy (`confetti`), huy hiệu `ACH` (thống kê ở `S.stat`, đã mở ở `S.ach`, xem trong tab Đánh giá; gọi `checkAch()` sau các sự kiện liên quan).
- Nhạc nền tự soạn bằng Web Audio, đổi theo thời tiết của ngày (`MOODS`, `musicTick`; bật/tắt bằng localStorage `tt_bgm`); chuông cửa khi khách vào (`sfx('bell')`).
- Trả lời review (`replyReview`, `repHTML`): Cảm ơn / Xin lỗi / Cà khịa / tự viết (`toneOf` đoán giọng). Khách đáp lại; lịch sự với review chê thì có thể sửa lên 1★, cà khịa thì có thể hạ 1★ (review và điểm nổi tiếng liên kết qua `id`).
- Tạm dừng (`pauseGame`, tự tạm dừng khi chuyển app) và đóng cửa sớm (`closeEarly`; kho hết hàng thì tự hỏi qua `OOS_EV`). Thời gian game `now` chỉ chạy khi không tạm dừng.
- Ô gõ chữ trong các tab không được gọi `renderPrep()` ở sự kiện `change`, nếu không cú chạm vào nút kế tiếp sẽ bị nuốt.
- Chụp ảnh tiệm (`takePhoto`): điện thoại mở bảng chia sẻ, máy tính tải PNG. Thời tiết trong ô kính cửa sổ (`weatherFX`). Âm thanh tổng hợp bằng Web Audio (`sfx`, bật/tắt bằng localStorage `tt_snd`).

## Cấp tiệm và tiền
- `SHOP` có 5 cấp, mỗi cấp quy định trần số khách/ngày, số nhân viên tối đa (`staffMax()`) và số món bán cùng lúc (`MENU_CAP`: 4, 5, 6, 7, 9). Cuối ngày `shopUp()` tự lên cấp khi đủ số review 5★ (`S.five`) và tổng doanh thu (`lifeRev`: tiền bán món + tip).
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
