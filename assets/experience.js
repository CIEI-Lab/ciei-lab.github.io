(() => {
  'use strict';
  const C=window.LAB_CONTENT;
  const base=document.body.dataset.page==='home'?'./':'../';
  const asset=path=>window.CIEI_EMBEDDED_ASSETS?.[path]||base+path;
  const t=text=>window.CIEI_I18N?.t(text)||text;
  const fields=new Map();
  const paused=()=>document.documentElement.dataset.motion==='paused';
  const mountFields=(root=document)=>{
    for(const [canvas,handle] of fields){if(!canvas.isConnected){handle.dispose();fields.delete(canvas);}}
    root.querySelectorAll('canvas[data-cognition]').forEach(canvas=>{if(!fields.has(canvas)&&window.CIEI_FIELD){const handle=window.CIEI_FIELD.mount(canvas,{theme:canvas.dataset.cognition});handle.setPaused(paused());fields.set(canvas,handle);}});
    const panel=document.querySelector('#theme-panel');if(panel)panel.dataset.theme=panel.querySelector('canvas')?.dataset.cognition||'social';
  };
  mountFields();
  if(location.hash){requestAnimationFrame(()=>{try{document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({block:'start',behavior:'instant'});}catch{}});}
  const panel=document.querySelector('#theme-panel');
  if(panel)new MutationObserver(()=>mountFields(panel)).observe(panel,{childList:true});
  new MutationObserver(()=>{for(const handle of fields.values())handle.setPaused(paused());}).observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});
  const homeMap=document.querySelector('[data-home-research-map]');
  if(homeMap){
    const canvas=homeMap.querySelector('canvas');
    const links=[...homeMap.querySelectorAll('[data-home-direction]')];
    const preview=link=>{
      const theme=link?.dataset.homeDirection||'hero';
      if(homeMap.dataset.preview===theme)return;
      homeMap.dataset.preview=theme;
      fields.get(canvas)?.setTheme(theme);
      links.forEach(item=>item.classList.toggle('is-previewed',item===link));
    };
    links.forEach(link=>{
      link.addEventListener('pointerenter',()=>preview(link));
      link.addEventListener('focus',()=>preview(link));
    });
    homeMap.addEventListener('pointerleave',()=>{
      const focused=links.find(link=>link===document.activeElement);
      preview(focused||null);
    });
    homeMap.addEventListener('focusout',event=>{
      if(!homeMap.contains(event.relatedTarget))preview(null);
    });
  }
  window.CIEI_EXHIBIT?.init();
  document.querySelectorAll('.btn,.theme-choice,.tab').forEach(element=>element.setAttribute('data-tactile',''));
  window.CIEI_TACTILE?.refresh();
  const figureDialog=document.createElement('dialog');figureDialog.className='figure-dialog';figureDialog.setAttribute('aria-label',t('研究图示大图'));
  const close=document.createElement('button');close.type='button';close.className='figure-close';close.textContent=t('关闭图示');close.addEventListener('click',()=>figureDialog.close());
  const title=document.createElement('h2'),image=document.createElement('img'),credit=document.createElement('p'),source=document.createElement('a');
  source.target='_blank';source.rel='noopener noreferrer';source.textContent=t('阅读论文原文');source.className='text-link';figureDialog.append(close,title,image,credit,source);document.body.append(figureDialog);
  document.querySelectorAll('[data-paper-figure]').forEach(button=>button.addEventListener('click',()=>{
    const paper=C.publications[Number(button.dataset.paperFigure)];if(!paper?.thumbnail)return;
    title.textContent=paper.shortTitle;image.src=asset(paper.thumbnail);image.alt=paper.shortTitle+' — '+t('研究架构图');credit.textContent=paper.figureCredit;
    source.href=paper.url;figureDialog.showModal();
  }));
  figureDialog.addEventListener('click',event=>{if(event.target===figureDialog){const rect=figureDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)figureDialog.close();}});
  addEventListener('pagehide',()=>{for(const handle of fields.values())handle.dispose();fields.clear();});
  addEventListener('pageshow',event=>{if(event.persisted){mountFields();if(homeMap){fields.get(homeMap.querySelector('canvas'))?.setTheme(homeMap.dataset.preview||'hero');}}});
})();
