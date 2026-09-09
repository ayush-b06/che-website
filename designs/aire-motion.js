(() => {
  const art = document.querySelector('.aire-backdrop');
  const canvas = document.querySelector('.motion-canvas');
  const ctx = canvas.getContext('2d');
  const pauseButton = document.querySelector('.motion-toggle');
  const links = [...document.querySelectorAll('[data-motion]')];
  const description = document.querySelector('.motion-description');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const descriptions = {
    silk: 'Move your cursor to lift and bend the ribbons.',
    field: 'A quiet field of dots makes room for your cursor.',
    weave: 'A light woven mesh stretches around your cursor.',
    current: 'Tiny strokes turn and flow around your cursor.',
    contour: 'Soft contour lines shift like a living landscape.'
  };
  let mode = 'silk', width = 1, height = 1, frame = 0;
  let active = false, visible = true, paused = false, lastTime = 0, time = 0;
  let x = .7, y = .5, tx = .7, ty = .5;
  const colors = {blue:[112,181,219],pink:[218,160,173],green:[181,203,139]};
  const rgba = (color,a) => `rgba(${color.join(',')},${a})`;
  function glow(cx,cy,r,color,alpha=1,squash=1) {
    ctx.save(); ctx.translate(cx,cy); ctx.scale(1,squash);
    const gradient=ctx.createRadialGradient(0,0,0,0,0,r);
    gradient.addColorStop(0,rgba(color,.48*alpha));
    gradient.addColorStop(.35,rgba(color,.30*alpha));
    gradient.addColorStop(1,rgba(color,0));
    ctx.fillStyle=gradient; ctx.fillRect(-r,-r,r*2,r*2); ctx.restore();
  }
  function base(alpha=1) {
    glow(width*.04,height*.5,width*.34,colors.pink,.65*alpha);
    glow(width*.96,height*.35,width*.36,colors.blue,.9*alpha);
    glow(width*.53,height*.94,width*.3,colors.green,.65*alpha,.65);
  }
  function silk() {
    base(.75);
    // Thin translucent strands create a ribbon surface; the cursor bends its local profile.
    const py=y*height;
    for(let band=0;band<3;band++) {
      for(let strand=0;strand<19;strand++) {
        const offset=(strand-9)*3.1;
        ctx.beginPath();
        for(let px=-20;px<=width+20;px+=12) {
          const u=px/width;
          const falloff=Math.exp(-Math.pow((u-x)/.24,2));
          const baseline=height*(.4+band*.18);
          const wave=Math.sin(u*6.3+band*.9+time*.28)*height*.12;
          const cursorPull=(py-baseline)*.6*falloff;
          const yy=baseline+wave+cursorPull+offset*Math.sin(u*3+band+time*.15);
          if(px===-20) ctx.moveTo(px,yy); else ctx.lineTo(px,yy);
        }
        const g=ctx.createLinearGradient(0,0,width,0);
        const color=[colors.blue,colors.pink,colors.green][band];
        g.addColorStop(0,rgba(color,.1));g.addColorStop(.23,rgba(color,.42));
        g.addColorStop(.5,rgba(color,.15));g.addColorStop(.8,rgba(color,.5));g.addColorStop(1,rgba(color,.08));
        ctx.strokeStyle=g;ctx.lineWidth=1.2;ctx.stroke();
      }
    }
  }
  function warp(gx,gy,strength=1) {
    const dx=gx-x*width,dy=gy-y*height,d=Math.hypot(dx,dy);
    const influence=Math.exp(-d*d/(2*170*170));
    return [gx+dx*.3*influence*strength,gy+dy*.3*influence*strength];
  }
  function weave() {
    base(.55);
    for(let direction=0;direction<2;direction++) {
      const extent=direction?width:height;
      const length=direction?height:width;
      for(let row=-40;row<extent+40;row+=22) {
        ctx.beginPath();
        for(let step=-30;step<length+30;step+=14) {
          const flutter=Math.sin(step/210+row/160+time*.24)*13;
          const gx=direction?row+flutter:step;
          const gy=direction?step:row+flutter;
          const [px,py]=warp(gx,gy,2);
          if(step===-30)ctx.moveTo(px,py);else ctx.lineTo(px,py);
        }
        ctx.strokeStyle=direction?'rgba(116,169,194,.23)':'rgba(197,148,170,.22)';
        ctx.lineWidth=.8;ctx.stroke();
      }
    }
  }
  function current() {
    base(.65);
    const gap=28;
    for(let gx=8;gx<width;gx+=gap) {
      for(let gy=8;gy<height;gy+=gap) {
        const dx=gx-x*width,dy=gy-y*height;
        const distance=Math.hypot(dx,dy);
        const influence=Math.exp(-distance*distance/(2*200*200));
        const angle=Math.sin(gx/260+gy/300+time*.25)*.8+Math.atan2(dy,dx)*influence;
        const length=7+influence*7;
        const drift=Math.sin(time*.65+gx*.01+gy*.008)*3;
        ctx.beginPath();
        ctx.moveTo(gx-Math.cos(angle)*length/2,gy+drift-Math.sin(angle)*length/2);
        ctx.lineTo(gx+Math.cos(angle)*length/2,gy+drift+Math.sin(angle)*length/2);
        ctx.strokeStyle=`rgba(87,151,179,${.2+influence*.18})`;
        ctx.lineWidth=1.2;ctx.lineCap='round';ctx.stroke();
      }
    }
    ctx.lineCap='butt';
  }
  function contour() {
    base(.7);
    const centers=[[-.08,.35,colors.blue],[.99,.73,colors.pink]];
    for(let side=0;side<centers.length;side++) {
      const [cx,cy,color]=centers[side];
      for(let line=0;line<22;line++) {
        ctx.beginPath();
        const radius=90+line*19;
        for(let step=0;step<=140;step++) {
          const theta=step/140*Math.PI*2;
          const r=radius+Math.sin(theta*3+time*.18+side)*17+Math.cos(theta*5-time*.12)*8;
          const gx=cx*width+Math.cos(theta)*r*1.18;
          const gy=cy*height+Math.sin(theta)*r*.9;
          const [px,py]=warp(gx,gy,2.5);
          if(!step)ctx.moveTo(px,py);else ctx.lineTo(px,py);
        }
        ctx.closePath();ctx.strokeStyle=rgba(color,.42-line*.009);ctx.lineWidth=1;ctx.stroke();
      }
    }
  }
  function field() {
    base(.85);
    const gap=24, radius=Math.min(210,width*.4);
    for(let gx=12;gx<width;gx+=gap) {
      for(let gy=12;gy<height;gy+=gap) {
        const dx=gx-x*width,dy=gy-y*height,d=Math.hypot(dx,dy);
        const force=active ? Math.pow(Math.max(0,1-d/radius),2)*48 : 0;
        const px=gx+(dx/Math.max(d,1))*force;
        const py=gy+(dy/Math.max(d,1))*force;
        // Quieter behind the heading; more visible toward the perimeter.
        const center=Math.exp(-Math.pow((gx/width-.5)/.27,2)-Math.pow((gy/height-.46)/.4,2));
        const alpha=(.23-center*.15)+(force/48)*.25;
        ctx.beginPath();ctx.arc(px,py,1.1+force*.013,0,Math.PI*2);
        ctx.fillStyle=`rgba(66,130,164,${alpha})`;ctx.fill();
      }
    }
    glow(x*width,y*height,radius,colors.blue,.25);
  }
  function paint() {
    ctx.clearRect(0,0,width,height);
    ctx.save();
    ctx.translate(0,reduced.matches?0:Math.min(scrollY*.07,38));
    ({silk,field,weave,current,contour})[mode]();
    ctx.restore();
  }
  function canAnimate(){return visible&&!paused&&!reduced.matches&&!document.hidden;}
  function tick(now) {
    frame=0;
    if(!canAnimate()){lastTime=0;return;}
    if(!lastTime)lastTime=now;
    const elapsed=now-lastTime;
    if(elapsed>=30) {
      time+=Math.min(elapsed/1000,.07);lastTime=now;
      const smooth=1-Math.exp(-elapsed*.006);
      x+=(tx-x)*smooth;y+=(ty-y)*smooth;
      paint();
    }
    frame=requestAnimationFrame(tick);
  }
  function start(){if(!frame&&canAnimate())frame=requestAnimationFrame(tick);}
  function stop(){cancelAnimationFrame(frame);frame=0;lastTime=0;}
  function resize() {
    const rect=art.getBoundingClientRect();width=rect.width;height=rect.height;
    const dpr=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);paint();start();
  }
  function select(next,updateURL=true) {
    if(!Object.hasOwn(descriptions,next)) next='silk';
    document.body.classList.remove(`motion-${mode}`);mode=next;
    document.body.classList.add(`motion-${mode}`);
    document.dispatchEvent(new CustomEvent('aire:motionchange',{detail:{mode}}));
    links.forEach(link=>{if(link.dataset.motion===mode)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
    description.textContent=reduced.matches?'Motion is off to match your device preference.':descriptions[mode];
    if(updateURL){const url=new URL(location.href);url.searchParams.set('motion',mode);history.replaceState(null,'',url);}
    paint();start();
  }
  links.forEach(link=>link.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();select(link.dataset.motion);}));
  window.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||paused||reduced.matches)return;
    const rect=art.getBoundingClientRect();
    if(event.clientY<rect.top||event.clientY>rect.bottom){active=false;return;}
    active=true;
    tx=(event.clientX-rect.left)/rect.width;ty=(event.clientY-rect.top)/rect.height;
    start();
  });
  document.documentElement.addEventListener('pointerleave',()=>{active=false;tx=.7;ty=.5;});
  pauseButton.addEventListener('click',()=>{
    paused=!paused;document.body.classList.toggle('motion-paused',paused);
    pauseButton.setAttribute('aria-pressed',String(paused));
    pauseButton.innerHTML=paused?'Resume motion <span aria-hidden="true">▷</span>':'Pause motion <span aria-hidden="true">Ⅱ</span>';
    if(paused)stop();else start();
  });
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();}).observe(art);
  new ResizeObserver(resize).observe(art);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
  reduced.addEventListener('change',()=>{stop();x=tx=.7;y=ty=.5;active=false;select(mode,false);});
  window.addEventListener('popstate',()=>select(new URLSearchParams(location.search).get('motion'),false));
  resize();select(new URLSearchParams(location.search).get('motion'),false);
})();
