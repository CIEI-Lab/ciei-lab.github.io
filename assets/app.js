(() => {
  'use strict';
  const C = window.LAB_CONTENT;
  const I = window.CIEI_I18N;
  const t = value => I?.t(value) || value;
  const isEN = I?.lang === 'en';
  const choose = (zh,en) => isEN ? en : zh;
  const localize = (root=document) => {
    if(!isEN)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      if(node.parentElement?.closest('script,style,svg,textarea'))continue;
      const original=node.nodeValue.trim();
      if(original){const translated=t(original);if(translated!==original)node.nodeValue=node.nodeValue.replace(original,translated);}
    }
    root.querySelectorAll?.('[aria-label],[title],[placeholder],[alt]').forEach(element=>{
      for(const name of ['aria-label','title','placeholder','alt'])if(element.hasAttribute(name))element.setAttribute(name,t(element.getAttribute(name)));
    });
  };
  const page = document.body.dataset.page || 'home';
  const base = page === 'home' ? './' : '../';
  const asset = path => window.CIEI_EMBEDDED_ASSETS?.[path] || base + path;
  const navItems = [['home','首页',''],['research','科研','research/'],['projects','项目','projects/'],['products','产品','products/'],['people','成员','people/'],['resources','资源','resources/'],['join','招聘','join/']];
  const esc = value => String(t(value ?? '')).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const editorial = value => {let count=0;return esc(value).replace(isEN?/(cognitive modelling|collaborative decision-making|cognitive assessment|digital twins|privacy protection)/gi:/(认知建模|协同决策|认知评估|跨模态语义对齐|人机混合团队|动态网络模型|数字孪生|隐私保护)/g,term=>++count<=3?`<strong class="copy-keyword">${term}</strong>`:term);};
  const href = key => window.CIEI_SINGLE_FILE ? '?page='+key+'&lang='+(isEN?'en':'zh') : base+(navItems.find(item=>item[0]===key)?.[2]||'')+'index.html?lang='+(isEN?'en':'zh');
  const safeURL = value => /^(https?:\/\/|mailto:)/i.test(value || '') ? esc(value) : '';
  const link = (url, label, className='text-link') => safeURL(url) ? `<a class="${className}" href="${safeURL(url)}" ${/^https?:/i.test(url) ? 'target="_blank" rel="noopener noreferrer"' : ''}>${esc(label)}</a>` : '';
  const githubIcon = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .9A11.1 11.1 0 0 0 8.5 22.5c.55.1.76-.24.76-.54v-2.1c-3.1.68-3.75-1.32-3.75-1.32-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.68.08-.68 1.1.08 1.7 1.14 1.7 1.14.98 1.69 2.58 1.2 3.21.92.1-.72.39-1.2.7-1.48-2.48-.28-5.08-1.24-5.08-5.5 0-1.22.44-2.21 1.14-2.99-.11-.28-.5-1.42.1-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.54 0c2.11-1.43 3.04-1.14 3.04-1.14.61 1.53.23 2.67.12 2.95.71.78 1.14 1.77 1.14 2.99 0 4.27-2.61 5.22-5.1 5.5.4.35.75 1.02.75 2.07v3.07c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>';
  const personIcon = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="24" cy="16" r="8"/><path d="M9 42v-5a15 15 0 0 1 30 0v5"/></svg>';
  const brand = `<a class="brand" href="${href('home')}" aria-label="CIEI Lab 首页"><span class="brand-icon" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span><strong>${esc(C.lab.name)}</strong></span></a>`;
  document.querySelector('#site-header').innerHTML = `<a class="skip" href="#main">跳到正文</a><div class="container header-inner">${brand}<button class="menu-toggle" type="button" aria-controls="main-nav" aria-expanded="false">菜单</button><nav class="nav" id="main-nav" aria-label="主导航">${navItems.map(([key,label])=>`<a href="${href(key)}" ${key===page?'aria-current="page"':''}>${label}</a>`).join('')}</nav><a class="header-github" href="${safeURL(C.lab.github)}" target="_blank" rel="noopener noreferrer">${githubIcon} GitHub</a><button class="language-toggle" type="button" aria-label="${choose('Switch to English','切换为中文')}" title="${choose('Switch to English','切换为中文')}">${isEN?'中文':'EN'}</button></div>`;
  document.querySelector('.language-toggle').addEventListener('click',()=>I.switchLanguage());
  document.body.dataset.language=isEN?'en':'zh';
  document.title=t(navItems.find(item=>item[0]===page)?.[1]||'首页')+' · CIEI Lab';
  const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=C.lab.description;
  const academicContact=C.people.find(item=>item.isLead);
  document.querySelector('#site-footer').innerHTML = `<div class="container"><div class="footer-top"><div><strong>${esc(C.lab.name)}</strong><p>${esc(C.lab.chineseName)}</p><p>${esc(C.lab.affiliation)}</p></div><div><span class="footer-label">探索实验室</span><div class="footer-links">${navItems.slice(1).map(([key,label])=>`<a href="${href(key)}">${label}</a>`).join('')}</div></div><div><span class="footer-label">联系与关注</span><p>${link(C.lab.github,'GitHub · CIEI-Lab','')}</p><p>${academicContact?.homepage?link(academicContact.homepage,choose('薛栋 · 教师主页','Dong Xue · Faculty profile'),''):''}</p><p>${C.lab.email?link('mailto:'+C.lab.email,C.lab.email,''):academicContact?.email?link('mailto:'+academicContact.email,academicContact.email,''):''}</p></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ${esc(C.lab.copyright)}</span><span>科研 · 合作 · 创新</span></div></div>`;
  document.body.insertAdjacentHTML('beforeend','<button type="button" class="scroll-top" data-scroll-top hidden aria-label="返回页面顶部">顶部</button>');
  const menuButton = document.querySelector('.menu-toggle');
  menuButton.addEventListener('click', () => { const open=menuButton.getAttribute('aria-expanded')!=='true'; menuButton.setAttribute('aria-expanded',String(open)); document.querySelector('.nav').classList.toggle('is-open',open); menuButton.textContent=t(open?'收起':'菜单'); });
  document.addEventListener('keydown',event=>{ if(event.key==='Escape' && menuButton.getAttribute('aria-expanded')==='true'){menuButton.click();menuButton.focus();} });
  const sectionHeader = (en,title,extra='') => `<div class="section-header"><div><p class="eyebrow">${en}</p><h2>${t(title)}</h2></div>${extra}</div>`;
  const taxonomy = item => `<div class="research-taxonomy"><div class="research-focus"><span class="taxonomy-label">${choose('研究主题','Research focus')}</span><div class="keywords">${item.keywords.map(tag=>`<span class="tag">${esc(tag)}</span>`).join('')}</div></div><div class="application-focus"><span class="taxonomy-label">${choose('应用面向','Application areas')}</span><ul>${(item.applications||[]).map(tag=>`<li>${esc(tag)}</li>`).join('')}</ul></div></div>`;
  const directionCards = () => C.directions.map((item,index)=>`<article class="direction direction-${esc(item.key)}" id="direction-${esc(item.key)}" data-reveal><div class="direction-visual theme-${index}" data-tactile><canvas data-cognition="${esc(item.key)}" aria-hidden="true"></canvas></div><div class="direction-copy"><span class="small-en">${esc(item.english)}</span><h3>${esc(item.title)}</h3><p>${editorial(item.description)}</p>${taxonomy(item)}<details><summary>${t('研究内容')}</summary><p>${editorial(item.detail||item.description)}</p></details></div></article>`).join('');
  const productCards = (preview=false) => {
    const items=preview?C.presentation.homeProducts.map(id=>C.products.find(item=>item.id===id)).filter(Boolean):C.products;
    return items.map(item=>`<article class="product-tile tone-${esc(item.tone)}" data-product-id="${esc(item.id)}" data-product-ready="${item.descriptionAvailable}" data-reveal><div class="product-tile-visual" ${item.descriptionAvailable?'data-tactile':''} aria-hidden="true">${window.LAB_VISUALS.product(item.visualKey)}</div><div class="product-tile-copy"><p class="product-tile-category">${esc(item.status)}</p><h3>${esc(item.name)}${item.chineseName&&!isEN?`<span>${esc(item.chineseName)}</span>`:''}</h3><p class="product-tile-label">${esc(item.label)}</p>${item.description?`<p class="product-tile-description">${esc(item.description)}</p>`:''}${item.features?.length?`<ul class="product-tile-features">${item.features.map(feature=>`<li>${esc(feature)}</li>`).join('')}</ul>`:''}<div class="product-controls"><button type="button" class="btn" ${item.descriptionAvailable?`data-product="${C.products.indexOf(item)}" aria-haspopup="dialog"`:'disabled'}>${choose('了解产品','Product details')}</button>${item.codeAvailable?link(item.repository,choose('开放代码','Source code')):`<button type="button" class="product-code-disabled" disabled>${choose('开放代码','Source code')}</button>`}</div></div></article>`).join('');
  };
  const sceneBackdrop = (path,kind='cognition') => `<div class="scene-backdrop backdrop-${kind}" aria-hidden="true"><img src="${esc(asset(path))}" alt="" loading="lazy" decoding="async"></div>`;
  const paperSelection = key => C.presentation[key].map(id=>C.publications.find(item=>item.id===id)).filter(Boolean);
  const paperMedia = (item,className,variant=0) => {
    if(item.thumbnail)return `<button type="button" class="${className}" data-paper-figure="${C.publications.indexOf(item)}" aria-label="${esc(choose('放大研究图：','Enlarge figure: ')+item.shortTitle)}"><img src="${esc(asset(item.thumbnail))}" alt="${esc(item.shortTitle)}" loading="lazy" width="700" height="420"><span class="home-paper-zoom" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg></span></button>`;
    return `<a class="${className} paper-concept concept-${esc(item.topicKey)}" href="${safeURL(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(choose('阅读论文：','Read paper: ')+item.title)}">${window.LAB_VISUALS.paper(item.topicKey,variant)}</a>`;
  };
  const facilitiesSection = () => !C.facilities?.length ? '' : `<section class="section facilities-section" id="facilities"><div class="container">${sectionHeader('EXPERIMENTAL ENVIRONMENTS','在<span class="type-accent">真实场景</span>里，<br>检验每一次交互。',page==='resources'?'':`<a class="text-link" href="${href('resources')}#facilities">全部实验平台</a>`)}${window.CIEI_EXHIBIT.render([...C.facilities].sort((a,b)=>a.key==='immersive'?-1:b.key==='immersive'?1:0),base)}</div></section>`;
  const paperHighlights = () => {
    const items=paperSelection('researchPapers');if(!items.length)return '';
    const paperLinks=item=>`<div class="record-links">${link(item.url,'论文原文')}${link(item.pdf,item.pdfLabel||'开放全文')}${link(item.code,'研究代码')}</div>`;
    const first=items[0];
    return `<section class="section paper-highlights" id="selected-work"><div class="container">${sectionHeader('RECENT RESEARCH',choose('近期研究','Recent research'),`<a class="text-link" href="#publications">${choose('论文与成果列表','All publications')}</a>`)}<div class="paper-shelf"><article class="paper-lead" data-paper-id="${esc(first.id)}" data-reveal>${paperMedia(first,'paper-lead-image')}<div class="paper-lead-copy"><p class="paper-meta">${esc(first.year)} · ${esc(first.venue)}</p><h3>${link(first.url,first.shortTitle,'')}</h3>${first.summary?`<p>${esc(first.summary)}</p>`:''}${paperLinks(first)}</div></article><div class="paper-others">${items.slice(1).map((item,index)=>`<article class="paper-side" data-paper-id="${esc(item.id)}" data-reveal>${paperMedia(item,'paper-side-image',index+1)}<div><p class="paper-meta">${esc(item.year)} · ${esc(item.status)}</p><h3>${link(item.url,item.shortTitle,'')}</h3><p class="paper-venue">${esc(item.venue)}</p>${item.summary?`<p>${esc(item.summary)}</p>`:''}${paperLinks(item)}</div></article>`).join('')}</div></div></div></section>`;
  };
  const homeResearchOverview = () => `<section class="section home-research-section" id="themes"><div class="container">${sectionHeader('RESEARCH AT A GLANCE',choose('四个视角，<br>探索认知与交互。','Four perspectives<br>on cognition and interaction.'))}<div class="home-research-map" data-home-research-map data-preview="hero" data-reveal><div class="home-map-visual" aria-hidden="true"><canvas data-cognition="hero"></canvas></div><div class="home-map-links">${C.directions.map(item=>`<a class="home-research-link research-link-${esc(item.key)}" data-home-direction="${esc(item.key)}" data-tactile href="${href('research')}#direction-${esc(item.key)}"><span class="home-research-name">${esc(item.short)}</span><p>${esc(item.question)}</p></a>`).join('')}</div></div></div></section>`;
  const homePublications = () => {
    const items=paperSelection('homePapers');
    return `<section class="section home-publications" id="selected-work"><div class="container">${sectionHeader('SELECTED PUBLICATIONS',choose('代表论文','Selected work'),`<a class="text-link" href="${href('research')}#publications">${choose('论文与成果列表','All publications')}</a>`)}<div class="home-paper-grid">${items.map((item,index)=>`<article class="home-paper-card paper-topic-${esc(item.topicKey)}" data-paper-id="${esc(item.id)}" data-reveal><p class="home-paper-topic">${esc(C.directions.find(direction=>direction.key===item.topicKey)?.short||'')}</p>${paperMedia(item,'home-paper-figure',index)}<div class="home-paper-copy"><p class="home-paper-meta"><span>${esc(item.year)}</span><span>${esc(item.status)}</span></p><h3>${link(item.url,item.shortTitle,'')}</h3><p class="home-paper-venue">${esc(item.venue)}</p><p class="home-paper-brief">${esc(item.homeBrief||item.summary||'')}</p></div></article>`).join('')}</div></div></section>`;
  };
  const homeUpdates = () => {
    const paperURLs=new Set(C.publications.flatMap(item=>[item.url,item.pdf]).filter(Boolean));
    const items=C.news.filter(item=>{
      if(item.kind)return item.kind!=='paper';
      return !paperURLs.has(item.url)&&!/(论文|预印本|publication|preprint|paper)/i.test(item.category||'');
    });
    if(!items.length)return '';
    return `<section class="section home-updates" id="news"><div class="container">${sectionHeader('LAB UPDATES',choose('实验室动态','Lab updates'))}<div class="news-list">${items.map(item=>`<article class="news-row"><time>${esc(item.date)}</time><span class="tag">${esc(item.category)}</span><div><h3>${safeURL(item.url)?link(item.url,item.title,''):esc(item.title)}</h3><p>${editorial(item.description)}</p></div></article>`).join('')}</div></div></section>`;
  };
  const contactBand = () => `<section class="contact-band"><div class="container"><div><h2>一起探索，创造新的可能。</h2><p>了解研究合作、加入团队与交流机会。</p></div><a class="btn" href="${href('join')}">加入我们</a></div></section>`;
  const hero = (en,title,description,subnav='') => `<section class="page-hero page-scene-${page}">${sceneBackdrop(({research:'assets/network.svg',projects:'assets/facilities/human-robot-poster.webp',products:'assets/art/cognition-field.png',people:'assets/art/cognition-field.png',resources:'assets/facilities/immersive-poster.webp',join:'assets/network.svg'})[page],page)}<div class="page-scene" aria-hidden="true"><canvas data-cognition="${({research:'social',projects:'embodied',products:'health',people:'hero',resources:'engineering',join:'hero'})[page]||'hero'}"></canvas></div><div class="container"><p class="breadcrumb"><a href="${href('home')}">${t('首页')}</a><span>/</span>${t(title)}</p><p class="eyebrow">${en}</p>${isEN?`<h1 class="page-title-single">${t(title)}</h1>`:`<h1>${title}<span class="page-title-en">${({research:'Research',projects:'Projects',products:'Products',people:'People',resources:'Resources',join:'Join us'})[page]||''}</span></h1>`}<p class="page-description">${t(description)}</p>${subnav}</div></section>`;
  const tabs = (values,label) => `<div class="tabs" role="group" aria-label="${label}">${values.map((value,index)=>`<button type="button" class="tab" data-filter="${value}" aria-pressed="${index===0}">${t(value)}</button>`).join('')}</div>`;
  let main = '';
  if(page==='home'){
    main = `<section class="home-hero experience-hero"><div class="hero-artwork" aria-hidden="true"><img class="hero-sculpture" src="${esc(asset('assets/art/cognition-field.png'))}" alt="" width="1774" height="887" fetchpriority="high"><canvas class="hero-live" data-cognition="hero"></canvas></div><div class="container hero-composition"><div class="hero-editorial"><p class="eyebrow">EAST CHINA NORMAL UNIVERSITY</p><p class="lab-chinese">${choose(esc(C.lab.chineseName),'COGNITIVE INTELLIGENCE & EMBODIED INTERACTION')}</p><h1>${choose('理解认知，<br>让智能走向<span>交互。</span>','Understand cognition.<br>Shape <span>interaction.</span>')}</h1>${isEN?'':`<p class="hero-en">${esc(C.lab.englishName)}</p>`}<p class="hero-intro">${choose('在人工智能与认知科学的交叉处，<br>探索个体、群体与智能系统之间的关系。','At the intersection of AI and cognitive science,<br>we study how people, groups and intelligent systems interact.')}</p><div class="hero-actions"><a class="btn" href="#themes" data-tactile>探索研究方向</a><a class="text-link" href="#about">认识 CIEI Lab</a></div></div><div class="hero-art-note"><span>Cognition in interaction.</span></div></div></section>
    <section class="section about-section" id="about"><div class="container about-layout"><div><p class="eyebrow">ABOUT CIEI LAB</p><h2>${choose('理解<span class="type-accent">交互</span>，<br>也理解交互中的<span class="type-accent">人</span>。','Understanding <span class="type-accent">interaction.</span><br>Understanding <span class="type-accent">people.</span>')}</h2><span class="about-signature">Cognition in action.</span></div><div><p class="about-copy">${editorial(C.lab.description)}</p><div class="discipline-cards">${[['认知科学','个体与群体的认知机制','Cognitive science','Mind and behaviour'],['人工智能','学习、推理与协同决策','Artificial intelligence','Learning and reasoning'],['具身交互','连接感知、行动与真实场景','Embodied interaction','Perception and action']].map((item,index)=>`<div class="discipline-card discipline-${index}"><strong>${esc(choose(item[0],item[2]))}</strong><span>${esc(choose(item[1],item[3]))}</span></div>`).join('')}</div></div></div></section>
    ${homeResearchOverview()}
    ${homePublications()}
    <section class="section products-section">${sceneBackdrop('assets/art/cognition-field.png','products')}<div class="container">${sectionHeader('RESEARCH INTO TOOLS','从<span class="type-accent">研究</span>出发，让工具可用',`<a class="text-link" href="${href('products')}">探索产品</a>`)}<div class="product-preview-grid">${productCards(true)}</div></div></section>
    ${facilitiesSection()}
    ${homeUpdates()}
    <section class="application-strip"><div class="container"><p class="eyebrow">APPLICATION HORIZONS</p><h2>${choose('面向真实世界的问题。','Research for a changing world.')}</h2><p class="application-intro">${choose('围绕人、社会与复杂系统，拓展智能方法的应用边界。','Exploring intelligent methods for people, society and complex systems.')}</p></div>${[C.applications.slice(0,Math.ceil(C.applications.length/2)),C.applications.slice(Math.ceil(C.applications.length/2))].map((items,row)=>`<div class="marquee-window application-row row-${row}"><div class="marquee-track">${[0,1].map(copy=>`<div class="marquee-group" ${copy?'aria-hidden="true"':''}>${items.map((item,index)=>`<span class="application-tone-${index%4}">${esc(item)}</span>`).join('')}</div>`).join('')}</div></div>`).join('')}</section>${contactBand()}`;
  } else if(page==='research'){
    main = hero('RESEARCH','科研','从个体认知到群体协同，连接理论建模、智能方法与真实场景。','<nav class="subnav" aria-label="科研页内导航"><a href="#directions">研究方向</a><a href="#selected-work">代表研究</a><a href="#publications">论文与成果</a></nav>')+
    `<section class="page-section" id="directions"><div class="container">${sectionHeader('RESEARCH THEMES','研究方向')}<div class="research-grid">${directionCards()}</div></div></section>${paperHighlights()}<section class="page-section" id="publications"><div class="container">${sectionHeader('PUBLICATIONS & OUTPUTS','论文与成果列表')}<div class="filter-bar">${tabs(['论文','著作','专利','软著','全部'],'成果类型')}<label class="visually-hidden" for="publication-search">搜索成果标题或作者</label><input class="search" id="publication-search" type="search" placeholder="搜索标题、作者或关键词"></div><div id="filtered-list" aria-live="polite"></div><div class="list-toolbar"><p class="count" id="result-count"></p><button type="button" class="list-more" id="list-more" hidden>${choose('显示更多','Show more')}</button></div></div></section>`;
  } else if(page==='projects'){
    const categories=[...new Set(C.projects.map(item=>item.category))];
    main = hero('PROJECTS & COLLABORATION','项目',choose('围绕 CIEI Lab 的研究方向，连接科研课题、产业合作与开放工具。','Connecting research grants, industrial collaboration and open tools across CIEI Lab’s research themes.'))+`<section class="page-section"><div class="container"><div class="filter-bar">${tabs(['全部',...categories],'项目类型')}</div><div id="filtered-list" class="project-list" aria-live="polite"></div><div class="list-toolbar"><p class="count" id="result-count"></p><button type="button" class="list-more" id="list-more" hidden>${choose('显示更多','Show more')}</button></div></div></section>`;
  } else if(page==='products'){
    main = hero('PRODUCTS & TOOLS','产品',choose('从领域模型到交互工具，让研究连接真实需求。','From domain models to interaction tools, connecting research with real needs.'))+`<section class="page-section product-catalogue-section">${sceneBackdrop('assets/network.svg','catalogue')}<div class="container"><div class="product-catalogue">${productCards()}</div></div></section>`;
  } else if(page==='people'){
    const core=C.people.find(item=>item.isLead);
    const coreHTML=core?`<section class="page-section lead-section" id="core-member"><div class="container"><article class="lab-lead" data-reveal><div class="lead-portrait"><img src="${esc(asset(core.photo))}" alt="${esc(core.name)}" width="245" height="310"></div><div class="lead-copy"><p class="eyebrow">${choose('核心成员','CORE MEMBER')}</p><h2>${esc(core.name)}</h2><p class="lead-summary">${editorial(core.description)}</p><p class="lead-email">${link('mailto:'+core.email,core.email,'')}</p><div class="lead-links">${link(core.homepage,choose('教师主页','Faculty profile'))}${link(core.scholar,'Google Scholar')}${link(core.url,'ORCID')}</div></div></article></div></section>`:'';
    main=hero('OUR PEOPLE','成员','不同学科背景，在共同的研究问题中相遇。')+coreHTML+`<section class="page-section members-section"><div class="container">${sectionHeader('OUR TEAM',t('团队成员'))}<div class="member-categories">${tabs(['教师','研究员','助理','学生','合作者'],'成员类别')}</div><div id="filtered-list" class="people-grid" aria-live="polite"></div></div></section>`;
  } else if(page==='resources'){
    const resourceCards=group=>C.resources.filter(item=>item.group===group).map(item=>`<article class="resource-card"><span class="resource-card-kind">${esc(item.group==='github'?(item.subgroup==='organizations'?choose('组织入口','Organization'):choose('项目资料','Project materials')):item.group==='repositories'?choose('代码仓库','Code repository'):choose('平台资源','Platform resource'))}</span><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p>${link(item.url,item.label)}</article>`).join('');
    main=hero('OPEN RESOURCES','资源',choose('连接组织、代码、模型平台与实验环境。','Explore organizations, code, model platforms and experimental environments.'),`<nav class="subnav" aria-label="${choose('资源页内导航','Resource sections')}"><a href="#github">GitHub</a><a href="#repositories">${choose('代码仓库','Code repositories')}</a><a href="#platforms">${choose('平台资源','Platforms')}</a><a href="#facilities">${choose('实验平台','Facilities')}</a></nav>`)+C.resourceGroups.map(group=>`<section class="page-section resource-group-section" id="${esc(group.id)}"><div class="container">${sectionHeader(({github:'GITHUB & PROJECT MATERIALS',repositories:'SOURCE CODE',platforms:'MODELS & PLATFORMS'})[group.id],esc(group.name))}<p class="resource-group-intro">${esc(group.description)}</p><div class="resource-grid">${resourceCards(group.id)}</div></div></section>`).join('')+facilitiesSection();
  } else if(page==='join'){
    const J=C.join;
    const mail='mailto:'+J.email+'?subject='+encodeURIComponent(J.subject);
    main=hero('JOIN CIEI LAB','招聘',choose('围绕共同的研究问题，开展跨学科探索。','Work across disciplines on shared research questions.'))+`<section class="page-section"><div class="container join-layout"><div>${sectionHeader('OPPORTUNITIES',choose('加入 CIEI Lab','Join CIEI Lab'))}<p class="join-intro">${esc(J.intro)} ${esc(J.backgrounds)}</p><div class="opportunities-grid">${C.openings.map(item=>`<article class="opportunity"><h3>${esc(item.title)}</h3><p>${editorial(item.description)}</p></article>`).join('')}</div><p class="join-process-note">${esc(J.processNote)}</p></div><aside class="application-box"><p class="eyebrow">GET IN TOUCH</p><h3>${choose('申请与联系','How to apply')}</h3><p>${esc(J.method)}</p><p>${esc(J.contactPerson)}<br>${link('mailto:'+J.email,J.email,'application-email')}</p><ul>${J.materials.map(item=>`<li>${esc(item)}</li>`).join('')}</ul><p>${choose('邮件主题','Email subject')}</p><p class="application-subject">${esc(J.subject)}</p>${link(mail,choose('邮件联系','Contact by email'),'btn')}</aside></div></section>`;
  }
  document.querySelector('#main').innerHTML=main;
  if(page==='research'){
    const select=document.createElement('select');select.className='topic-select';select.id='topic-select';select.setAttribute('aria-label','按研究方向筛选论文');select.innerHTML='<option value="all">全部研究方向</option>'+C.directions.map(item=>`<option value="${esc(item.key)}">${esc(item.short)}</option>`).join('');document.querySelector('.filter-bar').insertBefore(select,document.querySelector('#publication-search'));
  }
  let activeFilter=page==='people'?'教师':page==='research'?'论文':'全部';
  const pageSize=page==='projects'?9:12;
  let visibleLimit=pageSize;
  const renderFiltered=()=>{
    const list=document.querySelector('#filtered-list'); if(!list)return;
    const term=(document.querySelector('#publication-search')?.value||'').trim().toLowerCase();
    const source=page==='research'?C.publications:page==='projects'?C.projects:C.people.filter(item=>!item.isLead);
    const topic=document.querySelector('#topic-select')?.value||'all';
    const items=source.filter(item=>(activeFilter==='全部'||(item.type||item.category||item.role)===activeFilter)&&(topic==='all'||item.topicKey===topic)&&Object.values(item).filter(value=>typeof value==='string').join(' ').toLowerCase().includes(term));
    if(page==='research')items.sort((a,b)=>Number(b.year||0)-Number(a.year||0));
    const visible=(page==='research'||page==='projects')?items.slice(0,visibleLimit):items;
    list.innerHTML=visible.map(item=>{
      if(page==='research'){
        const output=({'著作':'book','专利':'patent','软著':'software'})[item.type]||'paper';
        const label=item.type==='论文'?choose('论文原文','Read paper'):choose('资料来源','Source record');
        const identifier=item.number?choose('公开号：','Publication no.: ')+item.number:item.registrationNumber?choose('登记号：','Registration no.: ')+item.registrationNumber:'';
        return `<article class="record" data-output="${output}"><div class="record-kind"><span class="tag">${esc(item.status==='预印本'?'预印本':item.type)}</span>${item.year?`<span class="record-year">${esc(item.year)}</span>`:''}</div><div><h3>${safeURL(item.url)?link(item.url,item.title,''):esc(item.title)}</h3>${item.authors?`<p class="paper-authors">${esc(item.authors)}</p>`:''}<p>${esc(item.venue)}</p>${identifier?`<p>${esc(identifier)}${item.publicationDate?' · '+esc(item.publicationDate):''}</p>`:''}${item.abstractOriginal?`<div class="record-abstract"><p class="abstract-label">${choose(item.abstractVersion==='preprint'?'预印本摘要':'原文摘要',item.abstractVersion==='preprint'?'Preprint abstract':'Abstract')}</p><p class="abstract-text" lang="${esc(item.abstractLanguage||'en')}" id="abstract-${C.publications.indexOf(item)}">${esc(item.abstractOriginal)}</p><div class="abstract-actions"><button type="button" class="abstract-toggle" data-abstract-toggle aria-expanded="false" aria-controls="abstract-${C.publications.indexOf(item)}">${choose('完整摘要','Full abstract')}</button>${link(item.abstractURL,choose('摘要来源','Abstract source'),'abstract-source')}${item.abstractLicense?.url?link(item.abstractLicense.url,item.abstractLicense.name,'abstract-license'):''}</div></div>`:''}<div class="record-links">${link(item.url,label)}${item.type==='论文'&&!item.abstractOriginal?link(item.abstractURL||item.url,choose('阅读原文摘要','Read abstract')):''}${item.pdf?link(item.pdf,item.pdfLabel||'开放全文'):''}${item.bibtex?`<button class="citation-button" type="button" data-cite="${C.publications.indexOf(item)}">复制引用</button>`:''}</div></div></article>`;
      }
      if(page==='projects')return `<article class="project-entry"><div class="project-entry-meta"><span class="tag project-category-${esc(item.group)}">${esc(item.category)}</span>${item.period?`<time>${esc(item.period)}</time>`:''}</div><div><h3>${esc(item.title)}</h3>${item.description?`<p>${editorial(item.description)}</p>`:''}<div class="project-entry-facts">${item.scheme?`<span>${esc(item.scheme)}</span>`:''}${item.role?`<span>${esc(item.role)}</span>`:''}${item.projectNumber?`<span>${esc(item.projectNumber)}</span>`:''}${link(item.url,'GitHub')}</div></div></article>`;
      const photo=/^assets\/[a-zA-Z0-9_./-]+\.(png|jpe?g|webp|svg)$/i.test(item.photo||'')?`<img src="${esc(asset(item.photo))}" alt="${esc(item.name)}">`:personIcon;
      return `<article class="person"><div class="avatar">${photo}</div><h3>${safeURL(item.url)?link(item.url,item.name,''):esc(item.name)}</h3><span class="tag">${esc(item.role)}</span><p class="person-title">${esc(item.title)}</p><p>${editorial(item.description)}</p></article>`;
    }).join('')||(term?'<p class="empty">暂无匹配内容。</p>':`<p class="empty">${t(page==='people'?'成员资料陆续更新。':'暂无匹配内容。')}</p>`);
    const count=document.querySelector('#result-count');if(count)count.textContent=choose(`已显示 ${visible.length} / ${items.length} 条`,`Showing ${visible.length} of ${items.length}`);
    const more=document.querySelector('#list-more');if(more)more.hidden=visible.length>=items.length;
    localize(list);
  };
  const resetList=()=>{visibleLimit=pageSize;renderFiltered();};
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    activeFilter=button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(tab=>tab.setAttribute('aria-pressed',String(tab===button)));
    const select=document.querySelector('#topic-select');
    if(select&&page==='research'){select.value='all';select.hidden=!['论文','全部'].includes(activeFilter);}
    resetList();
  }));
  document.querySelector('#publication-search')?.addEventListener('input',resetList);
  document.querySelector('#topic-select')?.addEventListener('change',resetList);
  document.querySelector('#list-more')?.addEventListener('click',()=>{visibleLimit+=pageSize;renderFiltered();});
  document.querySelector('#filtered-list')?.addEventListener('click',async event=>{
    const toggle=event.target.closest('[data-abstract-toggle]');
    if(toggle){const expanded=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(expanded));toggle.closest('.record-abstract').classList.toggle('is-expanded',expanded);toggle.textContent=expanded?choose('收起摘要','Collapse abstract'):choose('完整摘要','Full abstract');return;}
    const button=event.target.closest('[data-cite]');if(!button)return;const item=C.publications[Number(button.dataset.cite)];try{await navigator.clipboard.writeText(item.bibtex);button.textContent=t('已复制');window.CIEI_TACTILE?.notify(t('引用已复制'));setTimeout(()=>button.textContent=t('复制引用'),1800);}catch{
      const fallback=document.createElement('dialog');fallback.className='dialog citation-dialog';
      fallback.innerHTML=`<button class="dialog-close" type="button">${t('关闭')}</button><h2>${t('论文引用')}</h2><textarea aria-label="${t('引用文本')}" readonly></textarea>`;
      fallback.querySelector('textarea').value=item.bibtex;fallback.querySelector('button').addEventListener('click',()=>fallback.close());fallback.addEventListener('close',()=>fallback.remove());document.body.append(fallback);fallback.showModal();fallback.querySelector('textarea').focus();fallback.querySelector('textarea').select();
    }});
  renderFiltered();
  if(document.querySelector('[data-product]')){
    const dialog=document.createElement('dialog');dialog.className='dialog';dialog.setAttribute('aria-labelledby','product-dialog-title');document.body.append(dialog);
    document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>{
      const item=C.products[Number(button.dataset.product)];
      dialog.dataset.productTone=item.tone;
      dialog.innerHTML=`<button class="dialog-close" type="button">关闭</button><div class="product-dialog-visual">${window.LAB_VISUALS.product(item.visualKey)}</div><p class="eyebrow">PRODUCT OVERVIEW</p><h2 id="product-dialog-title">${esc(item.name)}</h2><span class="tag">${esc(item.label)}</span><p>${editorial(item.detail||item.description)}</p>${item.features?.length?`<ul class="product-features">${item.features.map(feature=>`<li>${esc(feature)}</li>`).join('')}</ul>`:''}<div class="dialog-links">${item.url?link(item.url,choose('平台入口','Platform link'),'btn'):`<button type="button" class="btn" disabled>${choose('平台入口','Platform link')}</button>`}${item.codeAvailable?link(item.repository,choose('查看源码','Source code')):`<button type="button" class="product-code-disabled" disabled>${choose('查看源码','Source code')}</button>`}${!item.codeAvailable&&item.repoURL?link(item.repoURL,choose('项目资料','Project materials')):''}</div>${item.additionalLinks?.length?`<div class="record-links">${item.additionalLinks.map(extra=>link(extra.url,extra.label)).join('')}</div>`:''}${item.boundary?`<p class="note">${esc(item.boundary)}</p>`:''}${item.license?`<p class="source-link">${t('使用条件：')}${esc(item.license)}${choose('。','. ')}${link(item.repoURL,choose('许可与说明','Terms and documentation'),'source-link')}</p>`:''}`;
      dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());localize(dialog);dialog.showModal();
      if(item.image){const image=document.createElement('img');image.className='project-logo';image.src=asset(item.image);image.alt=item.imageAlt||item.name;dialog.querySelector('#product-dialog-title').after(image);}
    }));
    dialog.addEventListener('click',event=>{if(event.target===dialog){const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();}});
  }
  localize();
})();
