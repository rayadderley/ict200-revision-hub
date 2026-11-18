(() => {
  "use strict";
  const DATA = window.ICT200_CONTENT;
  const erd = window.ICT200_ERD;
  const app = document.getElementById("app");
  const chapterNav = document.getElementById("chapter-nav");
  const moduleNav = document.getElementById("module-nav");
  const KEY = "ict200-hub-progress-v1";
  const state = readState();
  const flash = {};

  function readState() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      return { correct: saved.correct && typeof saved.correct === "object" ? saved.correct : {}, viewed: saved.viewed && typeof saved.viewed === "object" ? saved.viewed : {} };
    } catch (_) { return {correct:{}, viewed:{}}; }
  }
  function saveState() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* private browsing may disable storage */ } }
  function el(tag, className, textValue) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (textValue !== undefined) node.textContent = textValue;
    return node;
  }
  function heading(parent, label, title, intro) {
    parent.append(el("p","section-eyebrow",label),el("h2","page-title",title),el("p","page-intro",intro));
  }
  function card(className="") { return el("section",`card ${className}`.trim()); }
  function button(label, className="button") { const b=el("button",className,label); b.type="button"; return b; }
  function linkCard(route, kicker, title, summary, count, className) {
    const a=el("a",`card ${className}`); a.href=`#${route}`;
    a.append(el("span","tile-kicker",kicker),el("strong","tile-title",title),el("span","tile-summary",summary));
    if(count) a.append(el("span","tile-count",count));
    return a;
  }
  function questionCount(ch) { return ch.questions.filter((_,i)=>state.correct[`${ch.id}:q${i}`]).length; }
  function erdCompleted(id) { return Boolean(state.correct[`erd:diagram:${id}`]); }
  function erdCount() { return erd.exercises.filter(exercise => erdCompleted(exercise.id)).length; }
  function progressCounts() {
    const totalQuestions = DATA.chapters.reduce((n,ch)=>n+ch.questions.length,0)+DATA.modules.reduce((n,m)=>n+m.exercises.length,0)+erd.exercises.length;
    const correctQuestions = DATA.chapters.reduce((n,ch)=>n+questionCount(ch),0)+DATA.modules.reduce((n,m)=>n+m.exercises.filter((_,i)=>state.correct[`${m.id}:exercise${i}`]).length,0)+erdCount();
    const cards = DATA.chapters.reduce((n,ch)=>n+ch.cards.length,0);
    const viewed = DATA.chapters.reduce((n,ch)=>n+ch.cards.filter((_,i)=>state.viewed[`${ch.id}:card${i}`]).length,0);
    return {totalQuestions,correctQuestions,cards,viewed};
  }
  function renderHome() {
    heading(app,"Your learning space","Choose a chapter, then practise","Work through the six lecture chapters in any order. The studios give you a more hands-on route through ERD, SQL and normalization.");
    const counts=progressCounts();
    const top=el("div","overview-top");
    const intro=card("card-pad callout");
    intro.append(el("h2",null,"A simple study loop"));
    const ol=el("ol","learn-list");
    ["Read the short chapter reminders.","Try the questions and read the feedback.","Turn the flashcards over; come back to the ones you missed."].forEach(t=>ol.append(el("li",null,t)));
    intro.append(ol); top.append(intro);
    const progress=card("card-pad"); progress.append(el("h2",null,"Your progress"),el("div","progress-big",`${counts.correctQuestions}/${counts.totalQuestions}`));
    progress.append(el("div","muted tiny","practice checks answered correctly"));
    const track=el("div","progress-track"), fill=el("div","progress-fill"); fill.style.width=`${Math.round(100*counts.correctQuestions/counts.totalQuestions)}%`; track.append(fill); progress.append(track);
    progress.append(el("p","progress-note",`${counts.viewed}/${counts.cards} flashcards reviewed · saved only in this browser.`)); top.append(progress); app.append(top);
    const chhead=el("div","section-head"); chhead.append(el("h2",null,"Lecture chapters"),el("span","muted tiny","Four original questions per chapter")); app.append(chhead);
    const grid=el("div","grid");
    DATA.chapters.forEach(ch=>grid.append(linkCard(ch.id,ch.kicker,ch.title,ch.summary,`${questionCount(ch)}/${ch.questions.length} checks correct`,"chapter-tile")));
    app.append(grid);
    const mh=el("div","section-head"); mh.append(el("h2",null,"Practice studios")); app.append(mh);
    const modules=el("div","grid"); DATA.modules.forEach(m=>{const done=m.exercises.filter((_,i)=>state.correct[`${m.id}:exercise${i}`]).length;const diagrams=m.id==="erd"?` · ${erdCount()}/${erd.exercises.length} diagrams complete`:"";modules.append(linkCard(m.id,"Interactive note + exercise",m.title,m.summary,`${done}/${m.exercises.length} checkpoints correct${diagrams}`,"module-tile"));}); app.append(modules);
    const scope=el("div","note-strip"); scope.append(el("strong",null,"What this covers: "),document.createTextNode("Final-exam concept revision follows Chapters 1–6. SQL is included as a separate lab practice stream, not represented as a current final-exam topic. These are newly written exercises, not past-paper questions.")); app.append(scope);
    const reset=button("Clear my saved progress","button ghost");
    reset.addEventListener("click",()=>{if(window.confirm("Clear this browser's ICT200 question and flashcard progress?")){state.correct={};state.viewed={};saveState();render();}});
    app.append(reset);
  }
  function renderChapter(ch) {
    heading(app,ch.kicker,ch.title,ch.summary);
    const learn=card("card-pad"); learn.append(el("h2",null,"What to remember"));
    const ul=el("ul","learn-list");ch.focus.forEach(point=>ul.append(el("li",null,point)));learn.append(ul);app.append(learn);
    const strip=el("div","note-strip");strip.append(el("strong",null,"Study boundary: "),document.createTextNode("Use your ICT200 lecture notes first. The supplied textbook supports the same topic; this short hub does not replace either source."));app.append(strip);
    const split=el("div","split");
    const flashPanel=card("card-pad"), quizSummary=card("card-pad");flashPanel.append(el("h2",null,"Flashcards"));
    const cardArea=el("div");flashPanel.append(cardArea);
    flash[ch.id] ||= {index:0,flipped:false};
    function paintFlash() {
      cardArea.replaceChildren();const f=flash[ch.id], item=ch.cards[f.index];
      const b=button("","flashcard"+(f.flipped?" is-flipped":""));b.setAttribute("aria-label",f.flipped?"Show flashcard term":"Show flashcard answer");
      b.append(el("span","small-label",f.flipped?"Answer · click to see term":"Term · click to see answer"),el("span","face",f.flipped?item[1]:item[0]));
      b.addEventListener("click",()=>{f.flipped=!f.flipped;if(f.flipped){state.viewed[`${ch.id}:card${f.index}`]=true;saveState();}paintFlash();});cardArea.append(b);
      const controls=el("div","flash-controls");const prev=button("← Previous","button secondary"),next=button("Next →","button secondary");
      prev.disabled=f.index===0;next.disabled=f.index===ch.cards.length-1;
      prev.addEventListener("click",()=>{f.index--;f.flipped=false;paintFlash();});next.addEventListener("click",()=>{f.index++;f.flipped=false;paintFlash();});
      controls.append(prev,el("span",null,`${f.index+1} of ${ch.cards.length}`),next);cardArea.append(controls);
    }
    paintFlash();quizSummary.append(el("h2",null,"Quick check"),el("p","muted","Try all four questions. You can retry whenever you like; only correct answers count toward progress."));
    quizSummary.append(el("div","progress-big",`${questionCount(ch)}/${ch.questions.length}`));
    split.append(flashPanel,quizSummary);app.append(split);
    const qhead=el("div","section-head");qhead.append(el("h2",null,"Practice questions"));app.append(qhead);
    ch.questions.forEach((q,i)=>app.append(renderQuestion(q,`${ch.id}:q${i}`,i+1)));
    const back=el("div","button-row");const a=el("a","button secondary","← All chapters");a.href="#home";back.append(a);app.append(back);
  }
  function normalizeAnswer(value) {return String(value).toLowerCase().normalize("NFKC").replace(/[^a-z0-9]+/g," ").trim();}
  function renderQuestion(q,id,number) {
    const outer=card("quiz-card");outer.append(el("span","question-type",q.type==="mcq"?"Choose one":q.type==="tf"?"True or false":"Fill in the blank"));
    outer.append(el("h3",null,`${number}. ${q.prompt}`));
    let inputs=[];
    if(q.type==="mcq"||q.type==="tf"){
      const options=q.type==="tf"?["True","False"]:q.options;const group=el("div","choices");
      options.forEach((option,i)=>{const label=el("label","choice");const input=el("input");input.type="radio";input.name=id;input.value=String(i);label.append(input,el("span",null,option));group.append(label);inputs.push(input);});outer.append(group);
    } else {const input=el("input","fill-answer");input.type="text";input.autocomplete="off";input.placeholder="Type a short answer";input.setAttribute("aria-label",q.prompt);outer.append(input);inputs.push(input);}
    const check=button("Check answer"),feedback=el("div","feedback");feedback.hidden=true;feedback.setAttribute("role","status");
    function evaluate(){
      const selected=inputs.find(input=>input.checked);
      if(q.type!=="fill"&&!selected){feedback.hidden=false;feedback.className="feedback bad";feedback.textContent="Choose an answer first.";return;}
      if(q.type==="fill"&&!inputs[0].value.trim()){feedback.hidden=false;feedback.className="feedback bad";feedback.textContent="Type an answer first.";return;}
      const correct=q.type==="fill"?q.answers.some(a=>normalizeAnswer(a)===normalizeAnswer(inputs[0].value)):q.type==="tf"?Number(selected.value)===(q.answer?0:1):Number(selected.value)===q.answer;
      feedback.hidden=false;feedback.className=`feedback ${correct?"good":"bad"}`;
      feedback.textContent=`${correct?"Correct.":"Not yet. Try again."} ${q.why}`;
      if(correct){state.correct[id]=true;saveState();const score=app.querySelector(".split .progress-big");if(score&&id.includes(":q")){const ch=DATA.chapters.find(c=>id.startsWith(`${c.id}:`));score.textContent=`${questionCount(ch)}/${ch.questions.length}`;}}
    }
    check.addEventListener("click",evaluate);
    if(q.type==="fill")inputs[0].addEventListener("keydown",event=>{if(event.key==="Enter")evaluate();});
    outer.append(check,feedback);if(state.correct[id])outer.append(el("span","tiny muted","  ✓ Previously answered correctly"));
    return outer;
  }
  function renderModule(m){
    heading(app,"Practice studio",m.title,m.summary);
    if(m.id==="erd"){
      erd.mount(app,{completed:erdCompleted,saveComplete(id){state.correct[`erd:diagram:${id}`]=true;saveState();}});
    }
    const note=el("div","note-strip");note.append(el("strong",null,"How to use this: "),document.createTextNode("Read each short step, then try the checkpoint. For full worked examples, use the matching ICT200 lab/lecture handout."));app.append(note);
    m.steps.forEach((s,i)=>{const box=card("step");box.append(el("span","step-number",String(i+1)),el("h2",null,s.heading),el("p",null,s.body));app.append(box);});
    if(m.code){const title=el("h2",null,"One statement, one clear layout");title.style.marginTop="27px";app.append(title);const code=el("pre","codebox");const lines=m.code.split("\n");lines.forEach((line,i)=>{if(i)code.append(document.createTextNode("\n"));let last=0;const tokens=/\bORDER BY\b|\bSELECT\b|\bFROM\b|\bDESC\b|\bTICKET_PRICE\b|\bTICKET_NO\b|\bTICKET\b/g;for(const hit of line.matchAll(tokens)){code.append(document.createTextNode(line.slice(last,hit.index)));const word=hit[0],cls=word==="DESC"?"order":/^(SELECT|FROM|ORDER BY)$/.test(word)?"kw":"name";code.append(el("span",cls,word));last=hit.index+word.length;}code.append(document.createTextNode(line.slice(last)));});app.append(code);app.append(el("p","muted tiny","Run this only after THEMEPARKDB has been created and selected in MySQL Workbench. Read the Result Grid and Action Output; this page does not execute SQL."));}
    const head=el("div","section-head");head.append(el("h2",null,"Try it yourself"),el("span","muted tiny","Three checkpoints · retry as needed"));app.append(head);
    m.exercises.forEach((p,j)=>{
      const id=`${m.id}:exercise${j}`,box=card("card-pad module-practice");box.append(el("span","question-type",`Checkpoint ${j+1}`),el("h2",null,p.prompt));
      const group=el("div","choices"),inputs=[];
      p.choices.forEach((choice,i)=>{const label=el("label","choice"),input=el("input");input.type="radio";input.name=id;input.value=String(i);label.append(input,el("span",null,choice));group.append(label);inputs.push(input);});box.append(group);
      const check=button("Check answer"),feedback=el("div","feedback");feedback.hidden=true;feedback.setAttribute("role","status");
      check.addEventListener("click",()=>{const pick=inputs.find(input=>input.checked);feedback.hidden=false;if(!pick){feedback.className="feedback bad";feedback.textContent="Choose an answer first.";return;}const good=Number(pick.value)===p.correct;feedback.className=`feedback ${good?"good":"bad"}`;feedback.textContent=`${good?"Correct.":"Not yet. Try again."} ${p.explanation}`;if(good){state.correct[id]=true;saveState();}});
      box.append(check,feedback);if(state.correct[id])box.append(el("p","tiny muted","✓ Previously completed"));app.append(box);
    });
    const a=el("a","button secondary","← Overview");a.href="#home";const row=el("div","button-row");row.append(a);app.append(row);
  }
  function renderNav(){
    DATA.chapters.forEach(ch=>{const a=el("a",null,`${ch.kicker} · ${ch.title}`);a.href=`#${ch.id}`;a.dataset.route=ch.id;chapterNav.append(a);});
    DATA.modules.forEach(m=>{const a=el("a",null,m.title);a.href=`#${m.id}`;a.dataset.route=m.id;moduleNav.append(a);});
  }
  function render(){
    const route=location.hash.replace(/^#/,"")||"home";app.replaceChildren();
    document.querySelectorAll("[data-route]").forEach(a=>{if(a.dataset.route===route)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");});
    const ch=DATA.chapters.find(c=>c.id===route),module=DATA.modules.find(m=>m.id===route);
    if(ch)renderChapter(ch);else if(module)renderModule(module);else renderHome();
    document.title=`${ch?ch.title:module?module.title:"Revision hub"} · ICT200`;
    window.scrollTo({top:0,behavior:"auto"});
  }
  renderNav();window.addEventListener("hashchange",render);render();
  if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
})();
