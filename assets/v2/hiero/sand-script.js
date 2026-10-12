/* Sand Script: every ~15 s the gold silk of "flow" writes a hieroglyph in grains of light, then lets it go like sand. */
(function(){
window.SA_SCENES=window.SA_SCENES||{};
window.SA_SCENES['sand-script']=function(ctx,env){
var M=Math,doc=document,PI=M.PI,rnd=M.random,mn=M.min,mx=M.max;
var SEQ=['ankh','wedjat','scarab','seif','sun','falcon'];
var GATH=4200,HOLD=4600,REL=1800,F=0.08,G=8,PD=12;
/* grains: position, last, velocity, life, target, flight (QX..CY, SP, KA/KB) */
var X,Y,OX,OY,VX,VY,LF,AX,AY,KA,KB,TA,RA,SP,PH,QX,QY,CX,CY,DL,ST,CT;
/* ST: 0 silk, 1 picked, 2 held, 3 held+release time, 4 flying in, 5 sand, 6 spare */
var N=0,F0,KM,K=0,nf=0,wp=0,W,H,wide,rtl,lite,col='#000',kk=1;
var q=[0,0,0,0],pl=[],cls,gw,hx,hy,VH,INK={},P2={},cells,buf;
var gi=3,bx,by,bw,bh,gx,gy,ew=0,eh,phase=-1,bs=0,tg,th,tr,tn,gd=GATH,sw=1,last=0;
var engA=0,hold=0,avg=0,lvl=0,pls=0,plx,ply,pmv=0,warm=0;
var eng=doc.createElement('canvas'),ec=eng.getContext('2d'),rc=doc.createElement('canvas'),rx=rc.getContext('2d',{willReadFrequently:true});

function op(c,v){c.globalCompositeOperation=v;}
function kf(c,f){return 1-M.pow(1-c,f);}
function inR(r,x,y){return x>r[0]&&x<r[2]&&y>r[1]&&y<r[3];}
function dim(n){return n==='seif'?{w:270,h:570,b:3}:env.glyphs().byName[n];}
function path(n){
 if(P2[n])return P2[n];
 var G2=env.glyphs().byName,p;
 if(n!=='seif')p=new Path2D(G2[n].d);
 else{
  /* cartouche + tie bar: s-y-f = cloth, two reeds, viper */
  p=new Path2D();
  p.moveTo(20,115);p.arc(135,115,115,PI,0);p.lineTo(250,440);p.arc(135,440,115,0,PI);p.closePath();
  p.moveTo(247,115);p.arc(135,115,112,0,PI,true);p.lineTo(23,440);p.arc(135,440,112,PI,0,true);p.closePath();
  p.rect(0,553,270,15);p.moveTo(3,556);p.lineTo(3,565);p.lineTo(267,565);p.lineTo(267,556);p.closePath();
  [['cloth',111,55,0.6],['reed',88,262,0.66],['reed',142,262,0.66],['viper',47,445,0.5]].forEach(function(s){
   p.addPath(new Path2D(G2[s[0]].d),new DOMMatrix([s[3],0,0,s[3],s[1],s[2]]));
  });
 }
 return(P2[n]=p);
}
/* layout, 8 px cells: 0 free, 1 body text (dimmed), 2 covered (cards, gold button), 3+ keep out */
function cl(x,y){return x<0||y<0||x>=W||y>=H?3:cls[(y/G|0)*gw+(x/G|0)];}
function rel(r){return r.width?[r.left-hx,r.top-hy,r.right-hx,r.bottom-hy]:0;}
function mark(a,m,c,o){
 for(var y=mx(0,(a[1]-m)/G|0),x,k,dx,dy;y<mn(cls.length/gw,(a[3]+m)/G+1);y++)
  for(x=mx(0,(a[0]-m)/G|0);x<mn(gw,(a[2]+m)/G+1);x++){
   dx=x*G+4-o[0];dy=y*G+4-o[1];
   if((!o[4]||M.abs(dx*o[2]+dy*o[3])<o[4]&&M.abs(dy*o[2]-dx*o[3])<o[5])&&cls[k=y*gw+x]<c)cls[k]=c;
  }
}
function measure(){
 var r=ctx.canvas.getBoundingClientRect(),u=[1e9,1e9,-1e9,-1e9],e,i,a,k,Z=[0,0];
 function all(s,m,c,f){
  e=doc.querySelectorAll(s);
  for(i=0;i<e.length;i++)if((a=rel(e[i].getBoundingClientRect()))){mark(a,m,c,f?f(e[i]):Z);if(c>3)for(k=0;k<4;k++)u[k]=(k<2?mn:mx)(u[k],a[k]);}
 }
 hx=r.left;hy=r.top;VH=mn(H,innerHeight-hy);rtl=doc.documentElement.dir==='rtl';gw=M.ceil(W/G)+1;k=gw*(M.ceil(H/G)+1);
 if(!cls||cls.length!==k)cls=new Uint8Array(k);else cls.fill(0);
 all('#heroTitle .split,#heroTitle .reel-pill',wide?24:12,4);
 if(u[0]>u[2])mark(u=[W*0.05,H*0.28,W*0.6,H*0.6],24,4,Z);
 q=[u[0]-20,u[1]-10,u[2]+20,u[3]+10];
 all('.hero-meta b,.hero-meta span>span,#nav,.hero-foot .badge',16,3);
 all(wide?'.hero-cta .btn':'.hero-cta .btn-gold',wide?12:0,wide?3:2);
 all('.hero-cta .btn-ghost>*',3,1);
 /* rotated video cards: their true outline */
 all('#heroStack .hs',0,2,function(el){
  var t=getComputedStyle(el).transform.slice(7).match(/-?[\d.]+(e-?\d+)?/g)||[1,0],c=+t[0],s=+t[1],l=M.hypot(c,s)||1;
  return[(a[0]+a[2])/2,(a[1]+a[3])/2,c/l,s/l,el.offsetWidth*l/2,el.offsetHeight*l/2];
 });
 pl=[];e=doc.querySelector('.hero-foot p');
 if(e){r=doc.createRange();r.selectNodeContents(e);e=r.getClientRects();for(i=0;i<e.length;i++)if((a=rel(e[i]))){pl.push(a);mark(a,4,1,Z);}}
}
/* a sign's ink as ~150 points in its unit box */
function ink(n){
 if(INK[n])return INK[n];
 var d=dim(n),s=72/mx(d.w,d.h),w=rc.width=M.ceil(d.w*s)+2,h=rc.height=M.ceil(d.h*s)+2,o=[],r=[],j,D;
 rx.setTransform(s,0,0,s,1,1);rx.fill(path(n));D=rx.getImageData(0,0,w,h).data;
 for(j=0;j<w*h;j++)if(D[j*4+3]>60)o.push((j%w-1)/s/d.w,((j/w|0)-1)/s/d.h);
 for(j=0;j<o.length/2;j+=o.length/300)r.push(o[2*(j|0)],o[2*(j|0)+1]);
 return(INK[n]=r);
}
/* biggest spot above the fold where no stroke touches text and >= vm of the ink shows */
function fit(n,vm){
 var d=dim(n),a=d.w/d.h,ra=M.sqrt(a),p=ink(n),L=p.length,best=0,R=0,h,x,y,st,i;
 function t(x,y){
  var w=h*a,j,c,hid=0;
  if(x<8||y<8||x+w>W-8||y+h>VH-8)return;
  for(j=0;j<L;j+=2){
   c=cls[((y+p[j+1]*h)/G|0)*gw+((x+p[j]*w)/G|0)];
   if(c>2||(hid+=c>1?1:c*(W<700?0.8:2.5))>(1-vm)*L/2)return;
  }
  c=h*ra*(1-hid/L*2)*(1+0.2*(rtl?1-(x+w/2)/W:(x+w/2)/W)+(wide?-0.15*M.abs(y+h/2-(q[1]+q[3])/2)/H:0.2*y/H));
  if(c>best){best=c;R=[x,y,w,h];}
 }
 for(h=(wide?mn(H*0.85,620):H*0.4)/mx(1,ra);h*ra>=(wide?mx(150,H*0.19):H*0.15)&&best<h*ra*1.4;h*=0.88)
  for(st=mx(G,h*0.07),y=8;y+h<=VH-8;y+=st)for(x=8;x+h*a<=W-8;x+=st)t(x,y);
 if(R)for(h=R[3],st=mx(G,h*0.07)/3,x=R[0],y=R[1],i=0;i<49;i++)t(x+(i%7-3)*st,y+((i/7|0)-3)*st);
 return R;
}
/* next sign in SEQ that fits */
function pick(){
 for(var j=0,n,R;j<7;j++){
  n=SEQ[(gi+j)%6];
  if((R=fit(n,j>5?0.4:n==='seif'?(wide?0.95:0.5):wide?0.86:0.45))){
   gi=(gi+j)%6;bx=R[0];by=R[1];bw=R[2];bh=R[3];gx=bx+bw/2;gy=by+bh/2;return 1;
  }
 }
}
/* build, one step per frame. raster: line thinned to a constant weight */
function raster(){
 var n=SEQ[gi],k=bh/dim(n).h;
 ew=rc.width=M.ceil(bw)+2*PD;eh=rc.height=M.ceil(bh)+2*PD;
 rx.setTransform(k,0,0,k,PD,PD);rx.fill(path(n));thin(wide?4.6:3.2);
}
function thin(t){
 var n=SEQ[gi],k=bh/dim(n).h,e=((dim(n).b||5)*k-t)/2;
 op(rx,'destination-out');if(e>0.4){rx.lineWidth=2*e/k;rx.lineJoin='round';rx.stroke(path(n));}
}
/* grain targets, ~one per grid cell */
function sample(){
 var D=rx.getImageData(0,0,ew,eh).data,len=ew*eh,n=0,p,j,cs=wide?4:2.7,P,cw,nc,px,py,c;
 if(!buf||buf.length<len)buf=new Int32Array(len);
 for(p=0,j=3;p<len;p++,j+=4)if(D[j]>100)buf[n++]=p;
 P=n%7919?7919:7907;
 do{
  cw=M.ceil(ew/cs)+1;nc=cw*(M.ceil(eh/cs)+1);
  if(!cells||cells.length<nc)cells=new Uint8Array(nc);else cells.fill(0,0,nc);
  for(K=j=0;j<n&&K<KM;j++){
   p=buf[(j*P)%n];px=p%ew;py=p/ew|0;c=(py/cs|0)*cw+(px/cs|0);
   if(!cells[c]){cells[c]=1;KA[K]=bx+px-PD+rnd();KB[K++]=by+py-PD+rnd();}
  }
  cs*=1.12;
 }while(K>=KM);
}
/* crisp 1 px engraving, dimmed under body text */
function engrave(){
 thin(1.3);rx.setTransform(1,0,0,1,PD-bx,PD-by);rx.globalAlpha=0.8;
 pl.forEach(function(a){rx.fillRect(a[0]-5,a[1]-5,a[2]-a[0]+10,a[3]-a[1]+10);});
 eng.width=ew;eng.height=eh;ec.drawImage(rc,0,0);tint();rc.width=rc.height=1;
}
function tint(){op(ec,'source-in');ec.fillStyle=col;ec.fillRect(0,0,ew,eh);op(ec,'source-over');}
/* K nearest free grains (headline last) get targets by angle + a twist, top first */
function assign(now){
 var ix=[],ot=[],i,r,t,dx,dy,o,cmp=function(a,b){return TA[a]-TA[b];};
 for(i=0;i<N;i++)if(!ST[i]){dx=X[i]-gx;dy=Y[i]-gy;TA[i]=(dx*dx+dy*dy)*(inR(q,X[i],Y[i])?6:1);ix.push(i);}
 ix.sort(cmp);if(ix.length>K)ix.length=K;K=ix.length;
 for(i=0;i<K;i++){ot.push(i);RA[i]=M.atan2(KB[i]-gy,KA[i]-gx);r=ix[i];TA[r]=M.atan2(Y[r]-gy,X[r]-gx);}
 ot.sort(function(a,b){return RA[a]-RA[b];});ix.sort(cmp);
 sw=-sw;o=(K*0.15)|0;if(sw<0)o=K-o;
 for(i=0;i<K;i++){
  r=ix[i];t=ot[(i+o)%K];AX[r]=KA[t];AY[r]=KB[t];ST[r]=1;
  DL[r]=now+gd*(0.38*(AY[r]-by)/bh+0.17*rnd());
 }
 phase=1;
}
function release(now){
 for(var i=0,s;i<N;i++){
  s=ST[i];
  if(s===1)ST[i]=0;else if(s===4){ST[i]=0;nf++;}
  else if(s===2){ST[i]=3;DL[i]=now+1100*(AY[i]-by)/bh+380*rnd();}
 }
 phase=3;
}
function sched(now,lead,g,h){phase=bs=0;gd=g;tg=now+lead;th=tg+g;tr=th+h;tn=tr+REL;}
function spawn(i){
 var x=rnd()*W,y=rnd()*H;
 if(inR(q,x,y)&&rnd()<0.6){x=rnd()*W;y=rnd()*H;}
 X[i]=OX[i]=x;Y[i]=OY[i]=y;LF[i]=60+rnd()*180;
}
/* a spare takes grain i's place, so the silk never thins */
function wake(i){for(var j=0;j<N;j++){wp=(wp+1)%N;if(ST[wp]===6){X[wp]=OX[wp]=X[i];Y[wp]=OY[wp]=Y[i];LF[wp]=99+rnd()*140;ST[wp]=0;nf++;return;}}}
function draw(k,a,s){
 var c=ctx,n=0,h=s/2,i;c.beginPath();
 for(i=0;i<N;i++)if(CT[i]===k){n++;if(s)c.rect(X[i]-h,Y[i]-h,s,s);else{c.moveTo(OX[i],OY[i]);c.lineTo(X[i],Y[i]);}}
 if(n){c.globalAlpha=mn(1,a*kk);s?c.fill():c.stroke();}
}

function step(S,t,f){
 var c=ctx,pt=S.pointer,px=pt.x,py=pt.y,hc=0,i,x,y,s,vx,vy,dx,dy,d,g,e;
 /* music: beat (90 ms attack, 400 ms release) + slow level; frame-rate independent */
 var m=env.music()||0,b=mx(0,m-avg)*3;
 avg+=(m-avg)*kf(0.03,f);lvl+=(m-lvl)*kf(0.012,f);pls+=(mn(1,b)-pls)*kf(b>pls?0.17:0.04,f);
 var sp=1.5*(1+0.35*pls),br=1+0.012*pls,dmp=M.pow(0.8,f),fk=kf(F,f),kd=warm?12:fk/F;
 if(px!==plx||py!==ply){pmv=t;plx=px;ply=py;}
 var ps=pt.on?mn(1,mx(0,1-(t-pmv-600)/900)):0;
 warm=0;
 op(c,'destination-out');c.globalAlpha=fk;c.fillStyle='#000';c.fillRect(0,0,W,H);
 op(c,lite?'source-over':'lighter');
 engA+=(hold*hold-engA)*kf(0.08,f);
 if(engA>0.01&&ew&&!bs){c.globalAlpha=mn(1,engA*(lite?0.022:0.011)*(1+pls+0.3*lvl)*kk*kd);c.drawImage(eng,bx-PD,by-PD);}
 for(i=0;i<N;i++){
  s=ST[i];if(s===6)continue;
  x=OX[i]=X[i];y=OY[i]=Y[i];
  if(s===3&&t>=DL[i]){
   /* crumble: small push, wind, gravity */
   ST[i]=s=5;dx=x-gx;dy=y-gy;d=M.hypot(dx,dy)+1;
   VX[i]=dx/d*0.35+(rtl?-1:1)*(0.15+0.35*rnd());VY[i]=dy/d*0.35-0.2*rnd();SP[i]=500+600*rnd();DL[i]=t+SP[i];
  }
  if(s===5){
   /* fades, then rests as a spare */
   if(t<DL[i]){VY[i]+=0.015*f;X[i]+=VX[i]*f;Y[i]+=VY[i]*f;CT[i]=DL[i]-t>SP[i]/2?5:8;}else ST[i]=6,CT[i]=0;
   continue;
  }
  if(s===2||s===3){
   /* held: spring, shimmer, beat breath, parts under a finger */
   g=PH[i];
   vx=(VX[i]+(gx+(AX[i]-gx)*br+0.55*M.sin(t*0.0023+g)-x)*0.1*f)*dmp;
   vy=(VY[i]+(gy+(AY[i]-gy)*br+0.55*M.cos(t*0.0019+g*1.3)-y)*0.1*f)*dmp;
   if(ps){
    dx=x-px;dy=y-py;d=dx*dx+dy*dy;
    if(d<14400){g=(1-d/14400)*1.6*ps;d=M.sqrt(d)+0.01;vx+=(dx-dy*0.8)/d*g;vy+=(dy+dx*0.8)/d*g;}
   }
   VX[i]=vx;VY[i]=vy;X[i]=x+vx*f;Y[i]=y+vy*f;hc++;
   CT[i]=cl(x,y)===1?7:vx*vx+vy*vy>0.5?2:3+(i&1);
   continue;
  }
  if(s===1&&t>=DL[i]){
   /* take off: eased polar spiral + drift momentum */
   dx=x-gx;dy=y-gy;d=M.atan2(AY[i]-gy,AX[i]-gx)-M.atan2(dy,dx);
   d-=2*PI*M.round((d-sw*1.2)/(2*PI));
   QX[i]=M.hypot(dx,dy);QY[i]=M.atan2(dy,dx);CY[i]=d;dx=AX[i]-gx;dy=AY[i]-gy;CX[i]=M.hypot(dx,dy)-QX[i];
   KA[i]=VX[i];KB[i]=VY[i];d=M.abs(CX[i])+M.abs(d)*(QX[i]+CX[i]/2);
   SP[i]=(1600+d*0.8+rnd()*500)*gd/GATH;DL[i]=t;ST[i]=s=4;nf--;wake(i);
  }
  if(s===4){
   g=(t-DL[i])/SP[i];
   if(g>=1){ST[i]=2;X[i]=AX[i];Y[i]=AY[i];VX[i]=VY[i]=0;CT[i]=3;continue;}
   e=0.5-0.5*M.cos(PI*g);d=QX[i]+CX[i]*e;dx=QY[i]+CY[i]*e;dy=g*(1-g)*(1-g)*SP[i]*0.021;
   X[i]=x=gx+d*M.cos(dx)+KA[i]*dy;Y[i]=y=gy+d*M.sin(dx)+KB[i]*dy;
   VX[i]=x-OX[i];VY[i]=y-OY[i];CT[i]=inR(q,x,y)||cl(x,y)===1?6:2;continue;
  }
  /* free: flow field, stirred on the beat; pointer swirls outwards */
  e=M.sin(x*0.0021+t*0.00013)*1.8+M.cos(y*0.0026-t*0.00011)*1.8+M.sin((x+y)*0.0008+t*0.00006)*1.2;
  g=kf(0.16,f);
  vx=VX[i]+=(M.cos(e)*sp-VX[i])*g;vy=VY[i]+=(M.sin(e)*sp-VY[i])*g;
  if(ps&&!(hold>0.3&&x>bx&&x<bx+bw&&y>by&&y<by+bh)){
   dx=x-px;dy=y-py;d=dx*dx+dy*dy;
   if(d<44100){g=(1-d/44100)*3.4*ps;d=M.sqrt(d)+0.01;vx+=(dx*0.2-dy)/d*g;vy+=(dx+dy*0.2)/d*g;}
  }
  X[i]=x+=vx*f;Y[i]=y+=vy*f;CT[i]=0;
  if((LF[i]-=f)<=0||x<-10||x>W+10||y<-10||y>H+10){
   if(!s&&nf>F0){ST[i]=6;nf--;}else spawn(i);
   continue;
  }
  CT[i]=inR(q,x,y)||cl(x,y)===1?6:1;
 }
 hold=K?hc/K:0;
 c.lineWidth=1.2;c.strokeStyle=c.fillStyle=col;
 draw(6,lite?0.17:0.13);draw(1,lite?0.36:0.32);draw(2,lite?0.32:0.26);
 var gA=(lite?0.17:0.055)*kd*(1+0.75*pls+0.25*lvl),gs=(wide?1.6:1.4)*(1+0.35*pls),tw=0.15*M.sin(t*0.0031)*mx(0,1-lvl*4);
 draw(3,gA*(1+tw),gs);draw(4,gA*(1-tw),gs);draw(7,gA*0.2,gs);draw(5,gA*0.6,gs);draw(8,gA*0.25,gs);
 c.globalAlpha=1;op(c,'source-over');
}
var B=[measure,pick,raster,sample,engrave];

return{
 lowRes:true,
 init:function(S){
  var sx=S.W/W,sy=S.H/H,i,n,A;
  W=S.W;H=S.H;wide=W>=1000;F0=W<700?700:wide?1500:1100;KM=W<700?700:wide?1400:1000;n=F0+KM;
  if(n===N&&phase>=0&&!env.reduce){
   /* same size class: rescale, keep the cycle */
   for(i=0;i<N;i++){X[i]*=sx;Y[i]*=sy;OX[i]=X[i];OY[i]=Y[i];AX[i]*=sx;AY[i]*=sy;}
   gx*=sx;gy*=sy;bx*=sx;by*=sy;bw*=sx;bh*=sy;ew=bs=0;measure();warm=1;return;
  }
  N=n;A=function(){return new Float32Array(n);};
  [X,Y,OX,OY,VX,VY,LF,AX,AY,KA,KB,TA,RA,SP,PH,QX,QY,CX,CY]=Array.from({length:19},A);
  DL=new Float64Array(n);ST=new Uint8Array(n);CT=new Uint8Array(n);
  measure();
  for(i=0;i<N;i++){PH[i]=rnd()*6.283;if(i<F0)spawn(i);else ST[i]=6;}
  nf=F0;K=engA=0;
  if(phase>=0)sched(performance.now(),600,GATH,HOLD);
 },
 theme:function(S){
  lite=S.light;col='rgb('+S.rgb+')';kk=S.k;
  if(ew)tint();
  ctx.clearRect(0,0,W,H);
 },
 frame:function(S,now){
  if(!N||!env.glyphs())return;
  if(env.reduce){
   /* one still frame: sign written, silk settled */
   for(var i=0;i<N;i++)ST[i]=i<F0?0:6;
   nf=F0;gi=3;gd=GATH;
   for(i=0;i<5;i++)if(!B[i]()&&i===1)return;
   assign(now);
   for(i=0;i<N;i++)if(ST[i]===1){nf--;wake(i);X[i]=AX[i];Y[i]=AY[i];ST[i]=2;}
   phase=2;
   for(i=0;i<70;i++)step(S,now+i*16.7,1);
   return;
  }
  var f=last?mn(3,mx(0.25,(now-last)/16.67)):1;last=now;
  /* first sign: after the intro, held 4.3-7.7 s */
  if(phase<0)sched(now,mx(400,1800-now),2500,3400);
  if(phase>0)SEQ.some(function(n){return!INK[n]&&ink(n);});
  if(!phase){
   if(bs>4){if(now>=tg){assign(now);bs=0;}}
   else if(bs||now>=tg-400){
    if(!B[bs]()&&bs===1){gi=(gi+1)%6;sched(now,GATH,GATH,HOLD);bs=-1;}
    bs++;
   }
  }else if(phase===1&&now>=th)phase=2;
  else if(phase===2&&now>=tr)release(now);
  else if(phase===3&&now>=tn){gi=(gi+1)%6;sched(now,GATH,GATH,HOLD);}
  step(S,now,f);
 },
 destroy:function(){
  eng.width=eng.height=rc.width=rc.height=ew=N=K=0;P2={};INK={};buf=cells=cls=null;
  X=Y=OX=OY=VX=VY=LF=AX=AY=KA=KB=TA=RA=SP=PH=QX=QY=CX=CY=DL=ST=CT=null;
 }
};
};
})();
