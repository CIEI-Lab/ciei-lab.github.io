(() => {
  'use strict';
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.prepend(progress);
  let scrollQueued=false;
  const update=()=>{scrollQueued=false;const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${total>0?Math.min(1,scrollY/total):0})`;document.querySelector('.header')?.classList.toggle('is-scrolled',scrollY>12);};
  addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(update);}},{passive:true});update();
  if('IntersectionObserver' in window){
    document.documentElement.classList.add('motion-ready');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.06,rootMargin:'0px 0px -16px 0px'});
    document.querySelectorAll('[data-reveal]').forEach(element=>observer.observe(element));
  }
  const sync=()=>{document.documentElement.dataset.motion=preference.matches?'paused':'running';};
  preference.addEventListener('change',sync);sync();
})();
