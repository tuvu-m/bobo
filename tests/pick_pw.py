# Chọn test giao diện liên quan tới phần vừa sửa: đọc git diff của file game (so với commit gần nhất),
# bỏ dữ liệu ảnh base64, rồi so với từ khoá của từng test. In ra tên các test cần chạy.
import re, subprocess, sys
import os
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
diff = sys.stdin.read() if sys.argv[1:] == ['-'] else subprocess.run(['git', '-C', REPO, 'diff', '-U0', 'HEAD', '--', 'tiem-tra-sua.html'], capture_output=True, text=True).stdout
lines = [l[1:] for l in diff.split('\n') if l[:1] and l[:1] in '+-' and not l.startswith(('+++', '---'))]
txt = re.sub(r'data:[a-z]+/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+', '', '\n'.join(lines))
txt = re.sub(r'"[A-Za-z0-9+/=]{200,}"', '', txt)  # chuỗi base64 trong SPRSRC
MAP = {
  'sub': r'missingOf|renderSug|suggest\(|SUB_DISC|sugp|D\.sug',
  'fun': r'combo|confetti|checkAch|ACH\b|takePhoto|bump\(',
  'pause': r'pauseGame|resumeGame|PAUSED|closeEarly|closeArm|renderPause|pauseOv',
  'reply': r'replyReview|repHTML|toneOf|MUS\.|musicTick|MOODS|recLoad|recPlay|recNext|sfx|TRACK|bell',
  'gridtest': r'dropPlan|placeAt|storeObj|S\.grid|syncLayout|drawStation|stationStatic|khoBox|trySeal|SEAL|setRows|growCounter|defaultGrid',
  'nick': r'nick|regName|genNick|NICK|LAI\b|floorSay|renick',
  'sleeve': r'sleeve|CUPSKIN|wrapCup|orderSkin|skUp|cupExtra|qslv|SK_P',
  'newchars': r'betthu|thayboi|batam|streamer|pend|PEND_T|renderTicket0|liveT|liveTick|queDo|tamAsk|\bEN\[',
  'lost': r'lost|LOST|staffLost|lostDo|copHere|KEEP_P',
  'qnames': r'qCard|qch|qref|refuseCust|\.oq|\.qc\b|qKey',
  'askset': r'ASK_P|askp|shopHTML|caidat|volRow',
  'staff8': r'layoutShop|stfs|stfChip|renderStf|nextBtn|staffMax|frontPeople|mkbar',
  'sumlate': r'condenseLog|LOG_GROUPS|logLi|sumHTML|showSummary',
  'logexp': r'condenseLog|LOG_GROUPS|logLi|cntOf',
  'qscroll2': r'renderQ|qHold|qSL|layoutQ|staffPick|HOLD_MAX|renderPick',
  'qpick': r'renderQ|qHold|staffGrab|takeOrder|staffPick|qState|HOLD_MAX|LV_SPD|nextIt',
  'walkin': r'walkLeft|estT|stepsOf|staffTick|layoutQ|LV_SPD|stepDur|wTime',
  'stalegrab': r'staffGrab|qHold|HOLD_MAX|staffPick|renderQ',
  'gemshot': r'GEM|gemOf|gemPut|gemRow|gemImg|drawGemTop|gradeShown',
  'exam': r'exam|Exam|EXAM|licDue|licFail|certs|drawCerts|startExam|upFee',
}
# vòng lặp chính của ngày bán: sửa ở đây thì chạy nhóm test chơi thật
CORE = r'tickDay|frame0|serveCup|settle\(|served\(|spawn\(|staffDone|staffBroke|staffRedo|syncMode|playerServe'
CORE_T = ['qpick', 'walkin', 'newchars', 'sub', 'stalegrab']
# sửa CSS (dòng có bộ chọn kiểu .abc{...}) thì chạy các test bố cục
CSS = r'^\s*[.#@a-z][^{;]*\{[^}]*:[^}]*\}'
CSS_T = ['qnames', 'staff8', 'askset']
pick = set()
for t, rx in MAP.items():
    if re.search(rx, txt): pick.add(t)
if re.search(CORE, txt): pick.update(CORE_T)
if any(re.search(CSS, l) for l in txt.split('\n')): pick.update(CSS_T)
if lines: pick.add('verify_ux')  # kiểm tra giao diện chung, 6 giây
print(' '.join(sorted(pick)))
