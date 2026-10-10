// nạp trước mọi test giao diện: thêm cờ cho Chrome (PW_ARGS, cách nhau bằng dấu cách)
const pw=require('playwright-core');const extra=(process.env.PW_ARGS||'').split(' ').filter(Boolean);
const orig=pw.chromium.launch.bind(pw.chromium);pw.chromium.launch=(o={})=>orig({...o,args:[...(o.args||[]),...extra]});
