from PIL import Image, ImageDraw, ImageFilter;import numpy as np,math
im=Image.open('/tmp/hpbuild/site/assets/img/p-mx290-fan.webp').convert('RGBA')
K=4;big=im.resize((im.width*K,im.height*K),Image.LANCZOS);A=np.array(big)[...,3]/255
best=None
for cx in np.arange(83,85.01,0.25):
  for cy in np.arange(79,81.01,0.25):
    r=np.array(big.rotate(120,center=(cx*K,cy*K),resample=Image.BILINEAR))[...,3]/255
    s=np.minimum(A,r).sum()/np.maximum(A,r).sum()
    if best is None or s>best[0]: best=(s,cx,cy)
_,cx,cy=best;print(best)
# precise hub center from gray pixels near hub
a=np.array(big).astype(int);H,W=a.shape[:2];yy,xx=np.mgrid[0:H,0:W]
near=np.hypot(xx-84*K,yy-78*K)<24*K
g=near&(abs(a[...,0]-a[...,1])<22)&(abs(a[...,1]-a[...,2])<30)&(a[...,0]>110)&(a[...,3]>220)
hx,hy=xx[g].mean(),yy[g].mean();hr=np.sqrt(g.sum()/math.pi);print('hub',hx/K,hy/K,hr/K)
R=int(math.ceil(np.hypot(xx[A>0.1]-cx*K,yy[A>0.1]-cy*K).max()))+8
S=2*R;C=S/2
def recentre(img,ox,oy):
  c=Image.new('RGBA',(S,S));c.paste(img,(round(C-ox),round(C-oy)));return c
base=recentre(big,cx*K,cy*K)
# angular profile -> choose wedge whose blade looks best: use each wedge and pick the one with max area (most complete)
B=np.array(base);Y,X=np.mgrid[0:S,0:S];ang=(np.degrees(np.arctan2(Y-C,X-C))+360)%360;rad=np.hypot(X-C,Y-C)
# gaps found earlier at ~60,180,300 -> wedges start there
def wedge(start):
  return ((ang-start)%360)<120
areas=[(B[...,3][wedge(s)]>40).sum() for s in (60,180,300)];print(areas)
s0=(60,180,300)[int(np.argmax(areas))]
out=np.zeros_like(B)
for k in range(3):
  rot=np.array(Image.fromarray(B).rotate(-120*k,center=(C,C),resample=Image.BICUBIC))  # PIL rotate is CCW; image y-down
  m=wedge((s0+120*k)%360)
  # check orientation: rotated wedge must land on target wedge
  out[m]=rot[m]
o=Image.fromarray(out)
# sanity: if the wedge content is empty, flip direction
if (np.array(o)[...,3]>40).sum()<0.5*sum(areas):
  out=np.zeros_like(B)
  for k in range(3):
    rot=np.array(Image.fromarray(B).rotate(120*k,center=(C,C),resample=Image.BICUBIC));m=wedge((s0+120*k)%360);out[m]=rot[m]
  o=Image.fromarray(out)
print('area',(np.array(o)[...,3]>40).sum(),sum(areas))
# hub: crop disc around hub centre, paste centred
hrp=int(hr*1.18)
hub=big.crop((int(hx-hrp),int(hy-hrp),int(hx+hrp),int(hy+hrp)))
mask=Image.new('L',hub.size,0);ImageDraw.Draw(mask).ellipse((2,2,hub.size[0]-3,hub.size[1]-3),fill=255);mask=mask.filter(ImageFilter.GaussianBlur(2))
o.paste(hub,(int(C-hrp),int(C-hrp)),mask)
o=o.resize((S//2,S//2),Image.LANCZOS)
o.save('/tmp/hpbuild/site/assets/img/p-mx290-fan-s.webp',quality=92);o.save('fan_s.png');print(o.size)
