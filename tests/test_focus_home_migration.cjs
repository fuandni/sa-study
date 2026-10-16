const fs=require('node:fs'),assert=require('node:assert/strict');
const deploy=fs.readFileSync('.github/workflows/deploy.yml','utf8');
const app=fs.readFileSync('assets/js/app.js','utf8');
const runtime=fs.readFileSync('focus/assets/focus.js','utf8');
for(const text of ['HOME_FOCUS=/var/www/ichirikutoku/home/focus','sudo rsync -a --delete "$STAGING/focus/" "$HOME_FOCUS/"','/home/focus/']){
 assert.ok(deploy.includes(text),'Missing safe public release rule: '+text);
}
assert.ok(deploy.includes('sudo test -f /var/www/ichirikutoku/home/index.html'));
assert.ok(!deploy.includes('rsync -a --delete "$STAGING/focus/" /var/www/ichirikutoku/home/'));
assert.ok(app.includes('href="/home/focus/"'));
assert.ok(runtime.includes('href="/home/"'));
assert.ok(runtime.includes('href="/sa/"'));
assert.ok(runtime.includes('href="uml/"'),'UML navigation missing from focus menu');
assert.ok(app.includes('href="/home/focus/uml/"'),'UML navigation missing from SA main menu');
assert.ok(fs.existsSync('focus/uml/index.html'),'UML standalone page missing');
assert.ok(runtime.includes("sa_focus_progress_v1"),'local progress storage key must remain unchanged');
assert.ok(runtime.includes("sa_focus_session_v1"),'unfinished sessions must remain available');
for(const n of ['index','theory','architecture','performance','modeling','lifecycle','database']){
 const page=fs.readFileSync('focus/'+n+'.html','utf8');
 assert.ok(/assets\/focus\.js\?v=[^"']+/.test(page),n+' versioned runtime');
 for(const asset of ['assets/focus.css','data/questions.js','data/applied.js','data/applied_extra.js','data/scenario_cases.js','data/numeric.js','assets/focus.js'])assert.ok(page.includes(asset),n+' missing '+asset);
}
console.log('PASS: home/focus migration preserves home hub, SA550 links, source assets and local progress');
