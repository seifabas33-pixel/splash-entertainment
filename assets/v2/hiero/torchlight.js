/* Torchlight: hieroglyph wall gilded by a torch or sunbeam that follows the pointer or idles by the SEIF cartouche */
(function(){
window.SA_SCENES=window.SA_SCENES||{};
window.SA_SCENES.torchlight=function(ctx,env){
var M=Math,G,PA=[],CL={T:[],F:[],S:[],Q:[]},hero=ctx.canvas.parentNode,root=document.documentElement;
var W=0,H=0,V=0,dpr=1,WD=0,HD=0,R=120,C=40,pitch=60,n=1,mob=false,ph=false,rtl=false;
var light=false,rgb='240,199,102',nl=light,nr=rgb,dirty=true,due=0,meas=0,sig='',PL=[],cart={},TX=[],OB=[],L=[],N={};
var wall,bas,glo,dot,cc,Gw=0,Gh=0,IT=[],B,D,KG,NI=0,snap=true,rx=1,ry=1,sk=0,s0=0,s1=0;
var pos={x:0,y:0,ok:0},A={x:0,y:0},Z={lv:0,av:0,op:1,pv:0},lpx=-1,lpy=-1,lm=-1e9,start=-1;
var MO=[],WP=[],cp=false,hf=false,U=[0,0,0,0],PR=[0,0,0,0],ro,mu,EL=[],chk=0;
var fine=matchMedia('(pointer:fine)').matches;

function cv(){return document.createElement('canvas');}
function rng(a){return function(){a=a*16807%2147483647;return a/2147483647;};}
function mod(a,b){return(a%b+b)%b;}
function sm(t){t=t<0?0:t>1?1:t;return t*t*(3-2*t);}
function nx(x){return rtl?W-x:x;}
function al(a){ctx.globalAlpha=M.min(1,a);}
function prep(){
 if(G)return true;
 var g=env.glyphs();if(!g||!g.length)return false;
 for(var i=0,q;i<g.length;i++){
  q=g[i];PA[i]=new Path2D(q.d);
  CL[q.w<150&&q.h<150?'S':q.h/q.w<.5?'F':q.w/q.h<.46?'T':'Q'].push(i);
 }
 G=g;return true;
}
function gi(name){return G.indexOf(G.byName[name]);}
function fit(i,bw,bh){return M.min(bw/G[i].w,bh/G[i].h);}
function put(c,i,x,y,s,k){c.setTransform(s*k,0,0,s*k,x*k,y*k);c.fill(PA[i]);}

function quad(r){
 function pk(a){return a[(r()*a.length)|0];}
 var t=r(),it,h,a=pk(CL.T),b=pk(CL.T),c=pk(CL.S),d=pk(CL.S),e=pk(CL.F),f=pk(CL.F),s,u;
 if(t<.3){a=pk(CL.Q);s=fit(a,C,C)*(.78+.22*r());it=[a,0,0,s];h=G[a].h*s;}
 else if(t<.45){it=[a,-C*.22,0,C/G[a].h,b,C*.22,0,C/G[b].h];h=C;}
 else if(t<.55){s=C*1.12/G[a].h;it=[a,0,0,s];h=C*1.12;}
 else if(t<.73){s=fit(e,C,C*.34);u=fit(f,C*.9,C*.34);h=G[e].h*s+C*.14;it=[e,0,0,s,f,0,h,u];h+=G[f].h*u;}
 else if(t<.83){s=fit(e,C*1.04,C*.42);it=[e,0,0,s];h=G[e].h*s;}
 else if(t<.91){s=fit(c,C*.44,C*.5);u=fit(d,C*.44,C*.5);it=[c,-C*.25,0,s,d,C*.25,0,u];h=M.max(G[c].h*s,G[d].h*u);}
 else{it=[a,-C*.24,0,C/G[a].h,c,C*.2,0,fit(c,C*.46,C*.44),d,C*.2,C*.54,fit(d,C*.46,C*.44)];h=C;}
 return{h:h,it:it,g:C*(.2+.14*r())};
}
function column(x,y1,r){
 var q=[],tot=0,i,j,y=0,Q,ex;
 for(;;){Q=quad(r);if(tot+Q.h+Q.g>y1)break;q.push(Q);tot+=Q.h+Q.g;}
 ex=q.length?(y1-tot)/q.length:0;
 for(i=0;i<q.length;i++){
  Q=q[i];y+=(Q.g+ex)/2;
  for(j=0;j<Q.it.length;j+=4)PL.push(Q.it[j],x+Q.it[j+1]-G[Q.it[j]].w*Q.it[j+3]/2,y+Q.it[j+2],Q.it[j+3]);
  y+=Q.h+(Q.g+ex)/2;
 }
}
function measure(){
 var E=[],i;
 function q(sel){
  var l=hero.querySelectorAll(sel),a=[],i,e,x,y,w,h;
  for(i=0;i<l.length;i++){
   e=l[i];E.push(e);w=e.offsetWidth;h=e.offsetHeight;x=y=0;
   while(e&&e!==hero){x+=e.offsetLeft;y+=e.offsetTop;e=e.offsetParent;}
   if(e&&w&&h)a.push([x,y,w,h]);
  }
  return a;
 }
 N={t:q('.hero-title .split,.hero-title .reel-pill'),p:q('.hero-foot p'),b:q('.hero-cta .btn'),a:q('.hero-title .grad-text')};
 TX=N.t.concat(N.p,N.b,q('.hero-meta>span,.badge'));OB=q('#heroStack .hs');rtl=root.dir==='rtl';
 if(ro){
  for(i=E.length===EL.length?0:-1;i>=0&&i<E.length&&E[i]===EL[i];i++);
  if(i!==E.length){ro.disconnect();for(i=0;i<E.length;i++)ro.observe(E[i]);EL=E;}
 }
 var s=rtl+TX.concat(OB).join();
 if(s===sig)return false;sig=s;return true;
}
function ext(a,k,mx,d){
 for(var i=0,v=a.length?mx?-1e9:1e9:d;i<a.length;i++)v=mx?M.max(v,a[i][k]+a[i][k+2]):M.min(v,a[i][k]);
 return v;
}
function gap(x,y,w,h,l){
 for(var m=1e9,i=0,r;i<l.length;i++){r=l[i];m=M.min(m,M.max(r[0]-x-w,x-r[0]-r[2],r[1]-y-h,y-r[1]-r[3]));}
 return m;
}
function seat(px,py){
 var s,x,y,b=-1e9,v,w,h,st=W>900?8:4;
 for(s=1;s>.69&&b<-1e8;s-=.1){
  w=C*s*1.24;h=C*s*3.1;
  for(y=100;y+h<V-12;y+=st)for(x=12;x+w<W-12;x+=st){
   v=gap(x,y,w,h,L);
   if(v>9){v=M.min(v,30)-.02*M.hypot(x+w/2-px,y+h/2-py);if(v>b){b=v;cart.x=x+w/2;cart.y=y;cart.s=s;}}
  }
 }
 if(b<-1e8){cart.s=.8;cart.x=M.max(30,M.min(W-30,px));cart.y=M.max(100,py-C);}
 cart.w=C*cart.s*1.06;cart.h=C*cart.s*2.95;
}
/* idle loop; phones: the band, then the cartouche's outer side */
function plan(tb,pt){
 var m=.55*R,cx=nx(cart.x),cy=cart.y+cart.h/2,i,k,x,y,gt=(tb+pt)/2,e=ph?(light?.25:-.05)*R:m,g=light?gt:gt+.05*R,o=!ph
  ?[cx+.9*R,cy+.35*R,cx+.3*R,cy+.75*R,cx-.75*R,cy,cx-.45*R,cy-.55*R,cx+.25*R,cy-.85*R]
  :[cx+.1*R,g,W*.5,g,.3*R,g,W*.6,g,cx+.2*R,g,cx+.3*R,cy-cart.h/4];
 WP.length=0;
 for(i=0;i<o.length;i+=2){
  x=nx(o[i]);y=o[i+1];
  for(k=0;k<4&&gap(x,y,0,0,L)<-.15*R;k++){x=(x+cart.x)/2;y=(y+cy)/2;}
  WP.push(M.max(e,M.min(W-e,x)),M.max(m,110,M.min(V-m,y)));
 }
 s0=nx(ph?.3*R:M.max(m,nx(WP[0])-2.4*R));s1=ph?M.max(m,110,M.min(V-m,g)):-1;
}
function layout(){
 measure();L=TX.concat(OB);V=M.min(H,window.innerHeight||H);mob=!OB.length;ph=mob&&V>=560;
 n=M.max(4,M.round(W/M.min(80,M.max(52,W/18))));pitch=W/n;C=pitch*.64;PL.length=0;
 R=(mob?M.max(105,M.min(165,W*.36,V*.2)):M.max(105,M.min(200,W*.3,V*.21)))*(light?1.1:1);
 var tb=ext(N.t,1,1,V*.5),pt=ext(N.p,1,0,tb+40),pb=ext(N.p,1,1,pt+100),ct=ext(N.b,1,0,pb+30),r=rng(n*7919+13);
 seat(nx(mob?W*.82:(rtl?W-ext(OB,0,1,0):ext(OB,0,0,W))-C*1.4),mob?V*.55:(tb+ct)/2);plan(tb,pt);
 for(var i=0;i<n;i++)column((i+.5)*pitch,H,r);
}
function stadium(c,x,y,w,h){var r=w/2;c.moveTo(x,y+r);c.arc(x+r,y+r,r,M.PI,0);c.lineTo(x+w,y+h-r);c.arc(x+r,y+h-r,r,0,M.PI);c.closePath();}
function drawCart(c,x,y,k){
 var Q=C*cart.s,w=cart.w,h=cart.h,i,s,e=Q*.075;
 c.setTransform(k,0,0,k,0,0);c.lineWidth=M.max(.7,Q*.024);c.beginPath();
 stadium(c,x-w/2,y,w,h);stadium(c,x-w/2+e,y+e,w-2*e,h-2*e);
 c.rect(x-w*.62,y+h+Q*.02,w*1.24,Q*.1);c.stroke();
 i=gi('cloth');s=Q*.86/G[i].h;put(c,i,x-G[i].w*s/2,y+Q*.32,s,k);
 i=gi('reed');s=Q*.86/G[i].h;for(e=-1;e<2;e+=2)put(c,i,x+e*Q*.17-G[i].w*s/2,y+Q*1.28,s,k);
 i=gi('viper');s=Q*.78/G[i].w;put(c,i,x-Q*.39,y+Q*2.3,s,k);
}
function bake(cn,a,b,s,st,sh){
 cn.width=2*M.ceil(a+M.abs(s)*b);cn.height=2*M.ceil(b);
 var c=cn.getContext('2d'),g=sh?c.createLinearGradient(-1,0,1,0):c.createRadialGradient(0,0,0,0,0,1),i;
 for(i=0;i<st.length;i+=2)g.addColorStop(st[i],st[i+1]);
 c.setTransform(a,0,s*b,b,cn.width/2,cn.height/2);c.fillStyle=g;c.fillRect(-1,-1,2,2);
 if(sh){
  g=c.createLinearGradient(0,-1,0,1);st=[0,'#0000',.3,'#000',.72,'#000',1,'#0000'];
  for(i=0;i<8;i+=2)g.addColorStop(st[i],st[i+1]);
  c.globalCompositeOperation='destination-in';c.fillStyle=g;c.fillRect(-1,-1,2,2);
 }
}

function build(){
 light=nl;rgb=nr;dirty=false;due=0;
 if(!ro&&window.ResizeObserver){
  ro=new ResizeObserver(function(){chk=1;});mu=new MutationObserver(function(){chk=1;});
  mu.observe(hero,{childList:true,subtree:true,characterData:true});
 }
 layout();
 if(!wall){wall=cv();bas=cv();glo=cv();dot=cv();cc=cv();}
 wall.width=bas.width=WD;wall.height=bas.height=HD;
 var c=wall.getContext('2d'),i,g,x,y,q,gw,gh,k,sx,sy,lw=M.max(1,M.round(dpr*.75)),K=[],col='rgba('+rgb+',';
 var x0=cart.x-cart.w*.62-C*.3,x1=cart.x+cart.w*.62+C*.3,y0=cart.y-C*.35,y1=cart.y+cart.h+C*.5;
 g=c.createLinearGradient(0,0,0,170*dpr);g.addColorStop(0,col+'.1)');g.addColorStop(1,col+'.5)');c.fillStyle=g;
 for(i=0;i<=n;i++){
  x=M.min(WD-lw,M.round(i*pitch*dpr));
  if(x>x0*dpr&&x<x1*dpr){c.fillRect(x,0,lw,y0*dpr);c.fillRect(x,y1*dpr,lw,HD);}else c.fillRect(x,0,lw,HD);
 }
 c.fillStyle=c.strokeStyle=col+'1)';IT.length=0;
 for(i=0;i<PL.length;i+=4){
  q=PL[i+3];x=PL[i+1];y=PL[i+2];g=G[PL[i]];gw=g.w*q;gh=g.h*q;
  if(x<x1&&x+gw>x0&&y<y1&&y+gh>y0)continue;
  k=gap(x-8,y-8,gw+16,gh+16,TX)<0;
  c.globalAlpha=(k?.45:1)*(.35+.65*sm((y+gh/2-50)/110))*(mob?1:.55+.45*sm((nx(x+gw/2)-.25*W)/(.35*W)));
  put(c,PL[i],x,y,q,dpr);
  sx=M.max(0,M.floor(x*dpr)-1);sy=M.max(0,M.floor(y*dpr)-1);
  IT.push(x+gw/2,y+gh/2,sx,sy,M.min(WD,M.ceil((x+gw)*dpr)+1)-sx,M.min(HD,M.ceil((y+gh)*dpr)+1)-sy);
  K.push(k?mob?light?.4:.5:.8:1);
 }
 NI=K.length;B=new Float32Array(NI);D=new Uint8Array(NI);KG=new Float32Array(K);snap=true;
 c.globalAlpha=1;drawCart(c,cart.x,cart.y,dpr);
 c=bas.getContext('2d');c.globalAlpha=light?.07:.08;c.drawImage(wall,0,0);
 cart.cw=cart.w*1.4+8;cc.width=M.ceil(cart.cw*dpr);cc.height=M.ceil((cart.h+C*.4+8)*dpr);
 c=cc.getContext('2d');c.fillStyle=c.strokeStyle=light?'#603a08':'#ffe2a0';drawCart(c,cart.cw/2,4,dpr);
 rx=R*(light?.55:1.05);ry=R*(light?1.25:1.1);sk=light?(rtl?-.21:.21):0;
 if(light)bake(glo,rx*dpr,ry*dpr,sk,mob?[0,'#ffedc400',.25,'#ffedc4e0',.5,'#ffdc98f5',.75,'#ffedc4e0',1,'#ffedc400']:[0,'#fff0',.3,'#fffc',.7,'#fffc',1,'#fff0'],1);
 else{q=mob?.86:1;bake(glo,rx*dpr*q,ry*dpr*q,0,mob?[0,'#ffd696e6',.2,'#ffb468ad',.42,'#f59a4c5c',.7,'#dc803626',1,'#a05a1e00']:[0,'#ffaa586b',.38,'#f094442e',.8,'#cd76300c',1,'#a05a1e00']);}
 Gw=glo.width;Gh=glo.height;
 bake(dot,8,8,0,light?[0,'#825818e6',1,'#82581800']:[0,'#ffeec4',.4,'#fac87873',1,'#f0b45a00']);
 for(MO.length=i=0;i<(mob?12:14);i++)MO.push({age:-1});
}
function rep(x,y,w,h){
 if(x<0){w+=x;x=0;}if(y<0){h+=y;y=0;}w=M.min(w,WD-x);h=M.min(h,HD-y);
 if(w>0&&h>0){ctx.clearRect(x,y,w,h);ctx.drawImage(bas,x,y,w,h,x,y,w,h);}
}
function later(d){if(!wall||env.reduce)dirty=true;else due=-d;}
function auto(t){
 var k=WP.length/2,u=mod(t/(ph?5:8),k),i=M.floor(u),f=u-i,d,v,a,b,e,g;
 for(d=0;d<2;d++){
  a=WP[mod(i-1,k)*2+d];b=WP[i*2+d];e=WP[mod(i+1,k)*2+d];g=WP[mod(i+2,k)*2+d];
  v=.5*(2*b+(e-a)*f+(2*a-5*b+4*e-g)*f*f+(3*b-a-3*e+g)*f*f*f);
  if(d)A.y=v+M.sin(t*.21)*8;else A.x=v+M.sin(t*.17+1)*10;
 }
}

function gild(px,py,rr,ku,kd){
 var j,k,y,u,v,d,f;
 for(j=0;j<NI;j++){
  k=j*6;y=IT[k+1]-py;u=(IT[k]-px-sk*y)/rx;v=y/ry;d=(light?M.max(M.abs(u),M.abs(v)):M.sqrt(u*u+v*v))/rr;
  f=d<1?M.min(1,(1-d)*1.35):0;f=f*f*(3-2*f);
  B[j]+=(f-B[j])*(f>B[j]?ku:kd);f=B[j]>.015?1:0;
  if((f||D[j])&&!snap&&(IT[k+2]<U[0]||IT[k+3]<U[1]||IT[k+2]+IT[k+4]>U[2]||IT[k+3]+IT[k+5]>U[3]))rep(IT[k+2],IT[k+3],IT[k+4],IT[k+5]);
  D[j]=f;
 }
}

function dust(px,py,t,dt,I,red){
 var i,o,y,u,v,d,f,c=ctx,z=mob&&!light?.79:.92; /* inside the sprite, so repaints clear it */
 for(i=0;i<MO.length;i++){
  o=MO[i];y=o.y-py;u=(o.x-px-sk*y)/rx;v=y/ry;d=light?M.max(M.abs(u),M.abs(v)):M.sqrt(u*u+v*v);
  if(o.age<0||d>z){
   u=M.random()*6.283;d=M.sqrt(M.random())*(z-.12);v=M.sin(u)*d*ry*.9;
   o.x=px+M.cos(u)*d*rx+sk*v;o.y=py+v;o.age=red?2:0;o.s=1.6+M.random()*2.6;o.v=4+M.random()*9;o.ph=M.random()*6.283;
  }
  o.age+=dt;o.y-=o.v*dt;o.x+=M.sin(t*.8+o.ph)*7*dt;
  f=(1-d)*M.min(1,o.age/1.2)*(.55+.45*M.sin(t*1.7+o.ph*3))*I*(light?.4:mob?1:.8);
  if(f>.01){al(f);u=o.s*dpr*2.2;c.drawImage(dot,o.x*dpr-u/2,o.y*dpr-u/2,u,u);}
 }
}

return{
 lowRes:false,
 init:function(S){
  var wd=ctx.canvas.width,hd=ctx.canvas.height;
  if(W&&S.W){pos.x*=S.W/W;pos.y*=S.H/H;}
  if(S.W!==W||S.H!==H||wd!==WD||hd!==HD)later(150);
  W=S.W;H=S.H;WD=wd;HD=hd;dpr=W?WD/W:1;snap=true;
 },
 /* flips rebuild once, 120 ms after the last */
 theme:function(S){if(!!S.light!==nl||(S.rgb&&S.rgb!==nr)){nl=!!S.light;nr=S.rgb||nr;later(120);}},
 frame:function(S,now){
  if(!W||!prep())return;
  var c=ctx,red=env.reduce,pt=S.pointer,j,k,x,y,u,v,p,q;
  if(due<0)due=now-due;
  if(wall&&rtl!==(root.dir==='rtl')&&!due)due=now;
  if(wall&&(chk||!ro&&now-meas>3000)){chk=0;meas=now;if(measure())due=due||now+150;}
  if(dirty||(due&&now>=due))build();
  if(pt.x!==lpx||pt.y!==lpy){lpx=pt.x;lpy=pt.y;if(pt.on)lm=now;}
  var act=!red&&pt.on&&(fine||now-lm<4500);
  /* phones: half rate unless a finger moves */
  if(mob&&!(act&&now-lm<800)&&!snap&&(hf=!hf))return;
  c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='source-over';
  if(WD!==wall.width||HD!==wall.height){
   c.clearRect(0,0,WD,HD);c.drawImage(bas,0,0,WD,HD);c.setTransform(dpr,0,0,dpr,0,0);return;
  }
  var dt=M.min(.05,M.max(0,(now-Z.pv)/1000));Z.pv=now;if(start<0)start=now;
  var t=(now-start)/1000+.001,mv=+env.music()||0;
  Z.lv+=(mv-Z.lv)*(1-M.exp(-dt/(mv>Z.lv?.06:.35)));Z.av+=(Z.lv-Z.av)*(1-M.exp(-dt/1.5));
  var bt=M.min(1,M.max(0,Z.lv-Z.av)*3.5),sw=red?1:sm((t-.3)/2.5);
  auto(s1<0?t:t-2.8);
  if(sw<1){A.x=s0+(A.x-s0)*sw;if(s1>=0)A.y=s1+(A.y-s1)*sw*sw*sw;}
  if(!pos.ok){pos.x=A.x;pos.y=A.y;pos.ok=1;}
  k=1-M.exp(-dt*(act?6.5:sw<1?5:1.3));
  pos.x+=((act?pt.x:A.x)-pos.x)*k;pos.y+=((act?pt.y:A.y)-pos.y)*k;
  var px=pos.x,py=pos.y;
  var fl=red?1:light?1+.03*M.sin(t*.7):1+.045*M.sin(t*7.3)+.03*M.sin(t*17.1+1.7)+.025*M.sin(t*31+.3);
  var I=fl*(.8+.2*bt),rr=(1+.12*bt)*(mob?.82:1);
  j=light||red?0:dpr;var gx=M.round(px*dpr-Gw/2+M.sin(t*9.1)*j),gy=M.round(py*dpr-Gh/2+M.sin(t*6.3+1)*1.4*j);
  var ku=snap?1:1-M.exp(-dt*9),kd=snap?1:1-M.exp(-dt*1.5),gain=I*(mob?1.35*(.8+.2*sw):.5+.5*sw)*(light?mob?.75:.6:1);
  /* phones: dim behind copy, dimmest by the gold word */
  if(mob){
   q=(act?.65:.4)+(light&&ph?.2:0);
   q=(q+(1-q)*sm((gap(px,py,0,0,TX)+12)/36))*(light?1:1-.78*(1-sm(gap(px,py,0,0,N.a)/(.35*R)-.14)));
   Z.op+=(q-Z.op)*(snap?1:1-M.exp(-dt*(q<Z.op?12:3)));
  }
  U[0]=M.min(gx,PR[0]);U[1]=M.min(gy,PR[1]);U[2]=M.max(gx+Gw,PR[2]);U[3]=M.max(gy+Gh,PR[3]);
  PR[0]=gx;PR[1]=gy;PR[2]=gx+Gw;PR[3]=gy+Gh;
  if(snap){c.clearRect(0,0,WD,HD);c.drawImage(bas,0,0);}else rep(U[0],U[1],U[2]-U[0],U[3]-U[1]);
  gild(px,py,rr,ku,kd);
  y=cart.y+cart.h/2;p=M.max(0,1-M.hypot(cart.x-px,y-py)/(R*1.25));
  u=cart.h*(mob?1.2:1.6);x=M.round((cart.x-u/2)*dpr);v=M.round((y-u/2)*dpr);u=M.round(u*dpr);
  if((p>.01||cp)&&!snap&&(x<U[0]||v<U[1]||x+u>U[2]||v+u>U[3]))rep(x,v,u,u);
  cp=p>.01;
  c.globalCompositeOperation=light?'source-over':'lighter';
  al(I*(mob?Z.op:1));c.drawImage(glo,gx,gy);
  for(j=0;j<NI;j++)if(D[j]){k=j*6;al(B[j]*gain*KG[j]);c.drawImage(wall,IT[k+2],IT[k+3],IT[k+4],IT[k+5],IT[k+2],IT[k+3],IT[k+4],IT[k+5]);}
  if(cp){
   p=sm(p);
   if(!light){al(p*I*.45);c.drawImage(glo,x,v,u,u);}
   al(p*I*(light?mob?.8:.45:mob?.95:.55));c.drawImage(cc,M.round((cart.x-cart.cw/2)*dpr),M.round((cart.y-4)*dpr));
  }
  dust(px,py,t,dt,I,red);
  snap=false;al(1);c.globalCompositeOperation='source-over';c.setTransform(dpr,0,0,dpr,0,0);
 },
 destroy:function(){
  [wall,bas,glo,dot,cc].forEach(function(x){if(x)x.width=x.height=0;});
  if(ro){ro.disconnect();mu.disconnect();}
  wall=bas=glo=dot=cc=ro=mu=null;EL=[];PL.length=IT.length=MO.length=0;dirty=true;sig='';
 }
};
};
})();
