/* Inscription: a scribe writes real hieroglyphic words in gold leaf: a pilaster by the headline, faint margin friezes,
SEIF in a cartouche in a reserved slot. Molten front cools to gold; the pointer re-gilds; signs lock to the beat. */
(function () {
window.SA_SCENES=window.SA_SCENES||{};
window.SA_SCENES.inscription=function (ctx,env){
var M=Math,mx=M.max,mi=M.min,ab=M.abs,rnd=M.random,SO='source-over',G,PA=[],K=[],WD,qn,AA,KR=1,tp;
var W=0,H=0,R=1,T=0,last=-1,mob,U,UM,RAD,TG,light=null,ink,hot,add,glint,rule;
var zc,zx,zy,cols=[],pool=[],DR=[],nd=-1,B=[],HL,SR,xg,ty,ins,hasC,rt,ag,gL,gR;
var px=0,py=0,pon=0,won,gx=0,gy=0,mP=0,pl=0,bx=0,by=0,ex=0,ey=0,lo=-1e9,sAt,nxt=[0,0],CT=[0,0];
var BT=6e4/84,DEP=[.35,.7],REST=[11e3,9e3],HT=[.9,.5,.26,.12],BP=[1,.5,.18];
/* real words: nesu-bity, sa Ra, ankh, nefer, Ra, Amun, Ptah, seneb, kheper, hotep, akh, Maat.. */
var WS='sedge bread bee bread,sun duck,ankh water placenta,nefer viper mouth,netjer nefer,mouth arm sun,reed senet water,stool bread wick,cloth water foot,scarab mouth,hetep bread stool,ibis placenta,feather bread,ankh djed was,falcon gold,vulture neb cobra neb,wedjat,lotus,horizon,crook flail';
var mk=()=>document.createElement('canvas'),cl=v=>v<0?0:v>1?1:v;
var gi=n=>G.indexOf(G.byName[n]),al=a=>ctx.globalAlpha=a,op=o=>ctx.globalCompositeOperation=o;
var pk=a=>a[rnd()*a.length | 0],mn=(A,k,f)=>A.reduce((v,r)=>f(v,r[k]),f==mi?1e9:-1e9);

/* untransformed layout boxes; text lines extend back to their start */
function measure(){
 var hero=ctx.canvas.offsetParent,Q=[],C=[],P=[],F=[],pe=document.querySelector('.hero-foot>p'),i,t,f0,f1,o;
 var bo=(e,m,A,k)=>{
  for(var o=e,x=0,y=0;o&&o!=hero;o=o.offsetParent){x+=o.offsetLeft;y+=o.offsetTop;}
  var w=e.offsetWidth,h=e.offsetHeight,q=e.getBoundingClientRect(),u=k?(q.width-w)/2+m:m,v=k?(q.height-h)/2+m:m;
  if(w) A.push([x-u,y-v,x+w+u,y+h+v]);
  return [x-q.left,y-q.top];
 };
 var all=(s,m,A,k)=>document.querySelectorAll(s).forEach(e=>bo(e,m,A,k)),ext=r=>{r[rt?2:0]=rt?W:0;B.push(r);};
 rt=document.documentElement.dir=='rtl';
 all('#heroTitle .split,#heroTitle .reel-pill',mob?10:24,Q);all('#heroStack .hs',8,C,1);all('.hero-meta [data-i],.hero-meta b,.hero-cta>*',10,F);
 if(pe){o=bo(pe,0,[]);t=document.createRange();t.selectNodeContents(pe);for(i of t.getClientRects()) P.push([i.left+o[0]-14,i.top+o[1]-14,i.right+o[0]+14,i.bottom+o[1]+14]);}
 HL=[mn(Q,0,mi),mn(Q,1,mi),mn(Q,2,mx),mn(Q,3,mx)];
 t=Q.filter(r=>r[1]<HL[1]+20);f0=mn(t,0,mi);f1=mn(t,2,mx);
 hasC=C.length;ins=mob?14:24;B=[];gL=mn(F,0,mi)+10;gR=mn(F,2,mx)-10;
 xg=hasC?(rt?mn(C,2,mx)+f0:HL[2]+mn(C,0,mi))/2:rt?0:W;ty=hasC?(HL[1]+HL[3])/2:HL[3]-30;
 Q.forEach(ext);F.forEach(mob?ext:r=>B.push([0,r[1],W,r[3]]));P.forEach(ext);all('.badge',12,B);B.push(...C);
 if(!mob){/* headline + band above; reading path to the paragraph */
  B.push(rt?[f0,HL[1]-140,W,HL[3]]:[0,HL[1]-140,f1,HL[3]]);
  if(P.length){t=mn(P,1,mi);B.push(rt?[HL[0],HL[3],W,t]:[0,HL[3],HL[2],t]);}
 }
 if(!Q.length){B=[mob?[0,0,W*.88,H*.8]:[0,0,W*.78,H]];xg=rt?0:W;ty=H*.4;}
 for(SR=0,i=1.15;i>.6&&!SR;i-=.15){/* SEIF slot: largest size that fits by the headline */
  UM=U*i;SR=place(1,UM*.92,(mob?3.5:5.6)*UM,2.5*UM,1,1);
  if(SR&&ab((SR[1]+SR[3])/2-ty)>H*.22) SR=0;
 }
 if(!SR) UM=U;
}
/* free runs at snug/centred/aligned x: mains in the gutter, friezes in margins */
function place(l,cw,need,minH,seif,ign){
 var best,bs=-1e9,A=B.slice(),X=[ins,W-cw-ins],Y=[-1,-1],p=cw*1.55,e=seif?24:ins,i,j,k,o,x,y,h,s,a,bl,n,sl,sr;
 for(o of B){X.push(o[2]+2,o[0]-2-cw);Y.push(-1,-1);}
 if(!ign){
  for(o of cols){s=(cw+o.cw)*.26;h=(cw+o.cw)*.5;A.push([o.x-s,o.y-h,o.x+o.cw+s,o.y+o.h+h]);if(o.l==l){X.push(o.x,o.x-p,o.x+o.cw+p-cw);Y.push(-1,o.y,o.y);}}
  if(SR&&!seif&&T>sAt-12e3) A.push([SR[0],SR[1]-UM,SR[2],SR[3]+UM]);
 }
 for(k=0;k<X.length;k++){
  x=X[k];if(x<ins||x>W-cw-ins) continue;
  bl=[[-1e9,96],[H-12,1e9]];
  for(o of A) if(o[2]>x&&o[0]<x+cw) bl.push([o[1],o[3]]);
  bl.sort((a,b)=>a[0]-b[0]);
  for(i=0,j=-1e9;i<bl.length;i++){
   n=bl[i][0]-j;
   if(n>=minH){
    h=mi(need,n);y=seif?ty-h/2:Y[k]>=0?Y[k]:l?j:j+(n-h)*rnd()*.6;
    y=mx(j,mi(j+n-h,y));sl=ins;sr=W-ins;
    for(o of A) if(o[3]>y&&o[1]<y+h){if(o[2]<=x+1) sl=mx(sl,o[2]);else if(o[0]>=x+cw-1) sr=mi(sr,o[0]);}
    s=Y[k]<0&&sr-sl<cw*3?mx(e,mi(W-cw-e,(sl+sr-cw)/2)):x;a=ab(s+cw/2-xg);
    if((l?mob||!hasC||a<W*.22:a>W*.3&&(s+cw/2<gL||s+cw/2>gR))&&(!l||sr-sl>=cw*1.4)&&s>=e&&s<=W-cw-e){
     o=(l?-a/W*3-(seif?ab(y+h/2-ty)/H*3:0):(a-W*.3)/W)+.4*h/need+.15*rnd()+(Y[k]>=0||(l&&k>2*B.length+1&&ab(X[k]-s)<1)?.3:0);
     if(o>bs){bs=o;best=[s,y,s+cw,y+h];}
    }
   }
   if(bl[i][1]>j) j=bl[i][1];
  }
 }
 return best;
}

/* quadrats: tall signs side by side, flat/small ones stacked, big over small */
function sg(c,i,s,x,y){c.sg.push({i,s,x,y,w:G[i].w*s,h:G[i].h*s});}
function row(c,y,L,hh){
 var g=c.cw*.06,w=g*(L.length-1),k,s;
 for(k of L) w+=G[k].w*hh/G[k].h;
 k=mi(1,c.cw/w);hh*=k;g*=k;w=(c.cw-w*k)/2;
 for(k of L){s=hh/G[k].h;sg(c,k,s,w,y);w+=G[k].w*s+g;}
 return hh;
}
function quad(c,y,L,k){
 var u=c.u,a=K[L[k]],b=K[L[k+1]],h,m=b=='S'||b=='F';
 qn=1;
 if(a=='T'){while(qn<3&&K[L[k+qn]]=='T') qn++;return row(c,y,L.slice(k,k+qn),u);}
 if(a=='Q'&&!m) return row(c,y,[L[k]],.9*u);
 if(m){qn=2;h=row(c,y,[L[k]],a=='Q'?.62*u:.36*u)+u*.1;return h+row(c,y+h,[L[k+1]],a=='Q'?.3*u:.36*u);}
 return row(c,y,[L[k]],a=='S'?.42*u:.5*u);
}
function word(c,y,L){
 for(var k=0,n=c.sg.length;k<L.length;k+=qn) y+=quad(c,y,L,k)+c.u*.2;
 c.sg[n].wb=1;return y;
}
/* SEIF: cloth, reeds, viper in a double ring; tie bar at its base */
function cart(c,y){
 var u=c.u,p=c.cw*.2,n=G.seif,r={i:-1,x:0,y,w:c.cw},b={i:-2,x:0,w:c.cw,h:u*.08},t=y;
 c.sg.push(r,b);y+=p*1.15;
 y+=row(c,y,[gi(n[0])],.78*u)+u*.1;
 y+=row(c,y,[gi(n[1]),gi(n[2])],.7*u)+u*.12;
 y+=row(c,y,[gi(n[3])],.16*u)+p*1.1;
 r.h=y-t;b.y=y-u*.045;
 return b.y+b.h;
}

function stad(x,l,t,w,h){var r=w/2;x.moveTo(l,t+r);x.arc(l+r,t+r,r,M.PI,0);x.arc(l+r,t+h-r,r,0,M.PI);x.closePath();}
function clear(c){/* pooled sheets (ink, molten) only grow */
 var w=M.ceil((c.cw+2*c.P)*R),h=M.ceil((c.h+2*c.P)*R);
 for(var v of [c.sa,c.sb]){
  if(v.width<w||v.height<h){v.width=mx(v.width,w);v.height=mx(v.height,h);}
  else {var x=v.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,w,h);}
 }
}
function paint(c,e){
 for(var k=0;k<2;k++){
  var x=(k?c.sb:c.sa).getContext('2d'),lw=mx(light?1.1:.7,c.u*.026),g=e.w*.08,th=.8-5.5*e.s;
  x.fillStyle=x.strokeStyle=k?hot:light&&e.i<0?'rgb(95,62,12)':ink;x.lineJoin='round';
  if(e.i>=0){
   x.setTransform(R*e.s,0,0,R*e.s,R*(c.P+e.x),R*(c.P+e.y));x.fill(PA[e.i]);
   if(th>.05){x.lineWidth=th/e.s;x.stroke(PA[e.i]);}
  }else{
   x.setTransform(R,0,0,R,R*c.P,R*c.P);x.lineWidth=lw;x.beginPath();
   if(e.i<-1) x.rect(e.x+lw/2,e.y+lw/2,e.w-lw,e.h-lw);
   else {stad(x,e.x+lw/2,e.y+lw/2,e.w-lw,e.h-lw);stad(x,e.x+g,e.y+g,e.w-2*g,e.h-2*g);}
   x.stroke();
  }
 }
}

function spawn(l,t,seif,r){
 var u=l?UM:U*.6,cw=u*.92,gap=u*.2,y=0,k,e,c,q,hm,w,lw;
 if(!r) r=seif?place(1,cw,(mob?3.5:5.6)*u,2.5*u,1):place(l,cw,(l?mob?3.5:5.5:4)*u*(1+rnd()*.4),2.2*u);
 if(!r) return;
 c={l,x:r[0],y:r[1],cw,u,sg:[],t0:t,np:0,P:mx(3,cw*.07+2),rl:0,gu:0};hm=r[3]-r[1];
 if(seif){if(hm>4.5*u) y=word(c,y,WD[1]);y=cart(c,y)+gap;}
 for(k=0;k<(seif?1:4);){
  e=c.sg.length;w=seif?WD[13]:pk(WD);if(w==lw||w==WD[1]) continue;
  q=word(c,y,w);if(q-gap>hm){c.sg.length=e;k++;}else{y=q;lw=w;if(seif) break;}
 }
 if(c.sg.length<2) return;
 c.h=y-gap;c.all={x:1-c.P,y:1-c.P,w:cw+2*c.P-2,h:c.h+2*c.P-2};
 for(k=0,y=t+520,c.tw=0;k<c.sg.length;k++){
  e=c.sg[k];e.v=e.i==-1||(e.i>=0&&e.h>e.w*.5);e.g=-1e9;if(e.wb&&k) y+=350;
  e.d=300+(e.v?e.h:e.w)*13;e.t=y;y+=e.d*.62+110+rnd()*220;c.tw=mx(c.tw,e.t+e.d);
 }
 c.sh=c.tw+250;c.SD=1500+c.h*6;c.tf=c.tw+REST[l]*(.8+rnd()*.4);c.te=c.tf+c.sg.length*110+1600;
 c.sa=pool.pop()||mk();c.sb=pool.pop()||mk();clear(c);
 cols.push(c);return c;
}
function shift(c,d,j){for(;j<c.sg.length;j++) c.sg[j].t-=d;c.tw-=d;c.tf-=d;c.te-=d;c.sh-=d;}
function free(){for(var c of cols) pool.push(c.sa,c.sb);cols.length=0;}
function done(c){var d=c.tw-c.t0+2500;c.t0-=d;shift(c,d,0);c.tf=c.te=1e15;}
function warm(){/* mid-story; first SEIF written live */
 free();sAt=T+3e4;
 var c=SR&&spawn(1,T+500,1,SR),l,j,w=0,d;
 if(c&&env.reduce){done(c);c.sh=T-c.SD*.45;}
 for(l=1;l>=0;l--){
  nxt[l]=T+300;
  for(j=l&&c?1:0;j<TG[l];j++){
   if(!(c=spawn(l,T))) break;
   if(env.reduce){done(c);c.sh=1e15;continue;}
   d=w++?(c.tf-c.t0)*(.3+.5*rnd()):(c.tw-c.t0)*.5;c.t0-=d;shift(c,d,0);
  }
 }
}
function spr(v,st,r){
 var x=v.getContext('2d'),g=r?x.createRadialGradient(32,32,0,32,32,32):x.createLinearGradient(0,0,0,64);
 for(var i=0;i<8;i+=2) g.addColorStop(st[i],st[i+1]);
 x.clearRect(0,0,64,64);x.fillStyle=g;x.fillRect(0,0,64,64);
}
function colors(S){
 light=S.light;add=light?SO:'lighter';AA=light?[.45,.95]:[.33,.88];
 ink=light?'rgb(120,80,18)':'rgb('+S.rgb+')';hot=light?'rgb(206,150,38)':'rgb(255,243,212)';
 var c='rgba('+(light?'214,160,52,':'255,238,196,'),z='rgba(0,0,0,0)';
 spr(glint,[0,c+'1)',.22,c+'.75)',.5,c+'.16)',1,c+'0)'],1);spr(rule,[0,z,.15,ink,.85,ink,1,z]);
}
/* next 84 BPM grid point; phase = circular mean of onsets */
function grid(t){var p=M.atan2(by,bx)/2/M.PI*BT;return t+((p-t)%BT+BT)%BT;}

function slice(cv,e,u0,u1,v){
 var x=e.x-1,y=e.y-1,w=e.w+2,h=e.h+2,L=v?h:w;
 if(u0<0) u0=0;if(u1>L) u1=L;if(u1-u0<.05) return;
 if(v){y+=u0;h=u1-u0;}else{x+=u0;w=u1-u0;}
 ctx.drawImage(cv,(zc.P+x)*R,(zc.P+y)*R,w*R,h*R,zx+x,zy+y,w,h);
}
function shine(e,m,a){/* soft gold band at y m */
 for(var b=-2,s=zc.u*.3,u=m-e.y+1;b<3;b++){al(a*BP[b<0?-b:b]);slice(zc.sb,e,u+(b-.5)*s,u+(b+.5)*s,1);}
}

function draw(c,sync){
 var l=c.l,n=c.sg.length,a=AA[l]*(1+.12*pl),rg=c.u*.25,mg=rg+8,X,Y,j,e,p,f,L,q,d,b,t0=-1;
 zc=c;X=zx=mx(6,mi(W-6-c.cw,c.x+gx*DEP[l]));Y=zy=c.y+gy*DEP[l];
 DR[nd++]=X-mg;DR[nd++]=Y-mg;DR[nd++]=c.cw+2*mg;DR[nd++]=c.h+2*mg;
 if(sync&&c.np<n&&!(e=c.sg[c.np]).q){/* next sign on a beat, at most one late */
  p=c.sg[c.np-1];e.q=1;shift(c,e.t-grid(mx(e.t,p?p.t+p.d*.5:0)),c.np);
 }
 while(c.np<n&&c.sg[c.np].t<=T) paint(c,c.sg[c.np++]);
 if(T>c.sh+c.SD&&T<c.tf) c.sh=T+4500+rnd()*4000;
 q=(T-c.sh)/c.SD;
 var sh=q>0&&q<1?M.sin(M.PI*q)*(light?.95:.85)*(1+.7*pl):0,bc=-c.u+q*(c.h+c.u*2);
 var dx=px<X?X-px:px>X+c.cw?px-X-c.cw:0,dy=py<Y?Y-py:py>Y+c.h?py-Y-c.h:0,lp=pon*cl(1-(dx+dy)/RAD)*.6;
 if(lp>.18||tp) for(j=0;j<c.np;j++){/* pointer/tap re-gilds */
  e=c.sg[j];d=tp?40:10;
  if(T>e.t+e.d&&T-e.g>4e3&&ab(X+e.x+e.w/2-px)<e.w/2+d&&ab(Y+e.y+e.h/2-py)<e.h/2+d){e.g=T;c.gu=mx(c.gu,T+e.d);}
 }
 if(T>c.tw&&T<c.tf&&T>c.gu){/* resting: one blit + light bands */
  al(a);slice(c.sa,c.all,0,1e5,1);op(add);
  if(sh) shine(c.all,bc,a*sh);
  if(lp>.01) shine(c.all,py-Y,a*lp);
  op(SO);t0=0;
 }else for(j=0;j<n;j++){
  e=c.sg[j];f=T>c.tf?1-cl((T-c.tf-j*110)/1600):1;
  if(T<e.t||f<=0) continue;
  if(t0<0) t0=e.y;
  L=(e.v?e.h:e.w)+2;d=T-e.g<e.d;p=(T-(d?e.g:e.t))/e.d;f*=a;al(f);
  if(p<1){/* ink, cooling molten band, nib */
   q=(.5-.5*M.cos(M.PI*p))*L*1.6;slice(c.sa,e,0,d?L:q,e.v);op(add);
   for(b=0;b<4;b++){al(f*HT[b]);slice(c.sb,e,q-L*.15*(b+1),q-L*.15*b,e.v);}
   al(f*(light?.55:.9)*M.sin(M.PI*cl(q/L)));b=.5+.38*M.sin(p*17);d=c.u*.34;
   ctx.drawImage(glint,X+(e.v?e.x+e.w*b:e.x-1+q)-d/2,Y+(e.v?e.y-1+q:e.y+e.h*b)-d/2,d,d);
  }else{slice(c.sa,e,0,L,e.v);op(add);}
  if(sh&&p>=1) shine(e,bc,f*sh);
  if(lp>.01) shine(e,py-Y,f*lp);
  op(SO);
 }
 if(t0>=0){/* rules lead the pen, leave with the last sign */
  p=c.sg[c.np-1];q=T>c.tw?c.h+rg:p?p.y+p.h+c.u*.5:0;
  c.rl+=(mi(q,c.h+rg)-c.rl)*KR;q=Y+t0-rg;d=Y+c.rl-q;
  al(a*.4*cl((T-c.t0)/500)*(T>c.tf?1-cl((T-c.tf-(n-1)*110)/1600):1));
  if(d>1){ctx.drawImage(rule,X-rg,q,1/R,d);ctx.drawImage(rule,X+c.cw+rg,q,1/R,d);}
 }
}

return {
 lowRes:false,
 init(S){
  if(!G){
   if(!(G=env.glyphs())||!G.length) return (G=null);
   G.forEach((q,i)=>{PA[i]=new Path2D(q.d);K[i]=mx(q.w,q.h)<180?'S':q.w/q.h<.5?'T':q.h/q.w<.45?'F':'Q';});
   WD=WS.split(',').map(w=>w.split(' ').map(gi));
   glint=mk();rule=mk();glint.width=glint.height=rule.width=rule.height=64;
  }
  W=S.W;H=S.H;R=ctx.canvas.width/W||1;mob=W<700;
  U=mob?30:mx(30,mi(46,H*.05));RAD=mob?120:170;TG=mob?[0,2]:[2,2];
  if(light!==S.light) colors(S);
  measure();warm();last=nd=-1;
 },
 theme(S){
  if(!G||S.light===light) return;
  colors(S);
  for(var c of cols){clear(c);for(var j=0;j<c.np;j++) paint(c,c.sg[j]);}
 },
 frame(S,now){
  if(!G||!W) return;
  var dt=last<0||env.reduce?0:mi(50,now-last),i,c,l,wr,sb,sp=S.pointer,kp=1-M.exp(-dt/90),m=env.music()||0;
  last=now;T+=dt;KR=dt?1-M.exp(-dt/300):1;
  if(!ag&&T>3e3){ag=1;measure();}
  tp=sp.on&&!won;won=sp.on;
  if(sp.on){if(pon<.02){px=sp.x;py=sp.y;}else{px+=(sp.x-px)*kp;py+=(sp.y-py)*kp;}}
  pon+=((sp.on?1:0)-pon)*(1-M.exp(-dt/280));
  gx=pon*(W/2-px)/W*12;gy=pon*(H/2-py)/H*8;
  /* onsets vote for the beat phase; agreement on the half beat = confidence */
  i=dt>0&&m>.05&&m-mP>.07&&T-lo>250;mP=m;pl*=M.exp(-dt/320);l=M.exp(-dt/12e3);bx*=l;by*=l;ex*=l;ey*=l;
  if(i){lo=T;pl=mi(1,.4+m);l=2*M.PI*T/BT;bx+=(M.cos(l)-bx)*.3;by+=(M.sin(l)-by)*.3;ex+=(M.cos(2*l)-ex)*.3;ey+=(M.sin(2*l)-ey)*.3;}
  var sync=ex*ex+ey*ey>.2&&bx*bx+by*by>.01&&T-lo<6e3;
  if(dt){
   for(i=cols.length-1;i>=0;i--) if(T>cols[i].te){c=cols.splice(i,1)[0];pool.push(c.sa,c.sb);nxt[c.l]=T+300+rnd()*1500;}
   for(i=wr=sb=CT[0]=CT[1]=0;i<cols.length;i++){
    c=cols[i];CT[c.l]++;if(T<c.tw) wr++;
    if(SR&&c.x<SR[2]&&c.x+c.cw>SR[0]&&c.y<SR[3]+c.u&&c.y+c.h>SR[1]-c.u) sb=1;
   }
   if(T>sAt&&wr<2&&!sb){c=spawn(1,T,1,SR);sAt=T+(c?26e3+rnd()*12e3:3e3);if(c){wr++;CT[1]++;}}
   for(l=1;l>=0;l--) if(wr<2&&CT[l]<TG[l]&&T>nxt[l]){if(spawn(l,T)) wr++;nxt[l]=T+700+rnd()*1400;}
  }
  if(nd<0) ctx.clearRect(0,0,W,H);else for(i=0;i<nd;i+=4) ctx.clearRect(DR[i],DR[i+1],DR[i+2],DR[i+3]);
  for(i=nd=0;i<cols.length;i++) draw(cols[i],sync);
  tp=0;al(1);op(SO);
 },
 destroy(){free();for(var v of pool) v.width=v.height=0;pool=[];ctx.clearRect(0,0,W,H);}
};
};
})();
