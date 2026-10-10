#!/bin/zsh
# Test sau mỗi lần sửa game:
#   tests/t.sh               cú pháp + mọi test logic (vài giây) + test giao diện liên quan tới phần vừa sửa (so với commit gần nhất)
#   tests/t.sh qpick walkin  cú pháp + test logic + đúng mấy test giao diện đó
#   tests/t.sh full          toàn bộ (trước khi push, khoảng 3 phút)
# Lần đầu: cd tests && npm install. Test giao diện dùng Chrome đã cài trên máy.
T="$(cd "$(dirname "$0")" && pwd)"
H="$(dirname "$T")/tiem-tra-sua.html"
S0=$(date +%s)
mkdir -p "$T/out"; cd "$T/out"
# tách 2 khối <script> ra để kiểm tra cú pháp và chạy test logic
python3 - "$H" <<'PY'
import re,sys
h=open(sys.argv[1]).read()
b=re.findall(r'<script>(.*?)</script>',h,re.S);b.sort(key=len)
open('boot.js','w').write(b[0]);open('game.js','w').write(b[-1])
PY
node --check game.js && node --check boot.js || { echo "❌ LỖI CÚ PHÁP"; exit 1; }
R=$(mktemp -d)
# test logic: mỗi bài khoảng 0,1 giây, chạy cùng lúc
for t in "$T"/logic/test*.js; do (node "$t" game.js 2>&1 | tail -1 > "$R/${t:t}") & done; wait
nf=0; for f in "$R"/test*.js; do if ! grep -q "ALL PASSED" "$f"; then echo "❌ ${f:t}: $(cat "$f")"; nf=$((nf+1)); fi; done
echo "test logic: $(ls "$R" | wc -l | tr -d ' ') bài, $nf bài lỗi"
# test giao diện: Chrome tắt tiếng (nhiều Chrome cùng phát âm thanh thì chậm nhau gấp 10 lần), 6 bài cùng lúc
export NODE_OPTIONS="--require \"$T/pw/pwpatch.js\"" PW_ARGS="--mute-audio" R H T
ALL="sub fun pause reply gridtest nick sleeve newchars lost qnames askset staff8 sumlate qscroll2 qpick walkin logexp gemshot stalegrab verify_ux exam"
if [ "$1" = full ]; then PW=$ALL; elif [ $# -gt 0 ]; then PW="$*"; else PW=$(python3 "$T/pick_pw.py"); fi
if [ -n "$PW" ]; then
  echo "test giao diện: $PW"
  print -l ${=PW} | xargs -P 6 -I{} zsh -c 'node "$T/pw/{}.js" "$H" shots 2>&1 | grep -E "FAIL|PASSED|lỗi JS" | tr "\n" " " > "$R/pw_{}"'
  for f in "$R"/pw_*; do n=${f:t}; n=${n#pw_}; if [ ! -s "$f" ] || grep -q "FAIL\|lỗi JS: [^k]" "$f"; then echo "❌ $n: $(cut -c1-300 "$f")"; nf=$((nf+1)); else echo "✓ $n"; fi; done
else echo "test giao diện: không có bài nào liên quan"; fi
echo "⏱ $(( $(date +%s)-S0 ))s · ${nf} bài lỗi"
[ $nf -eq 0 ]
