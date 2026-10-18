# Φέρνει την κεντρική τρύπα της πλάκας της φτερωτής ακριβώς στον άξονα περιστροφής (κέντρο εικόνας).
# Χρήση: python fan_hub_center.py p-mx290-fan-s.webp out.webp
import sys,numpy as np
from PIL import Image
src,dst=sys.argv[1],sys.argv[2]
im=np.array(Image.open(src).convert('RGBA')).astype(float)
H,W=im.shape[:2];C=(W-1)/2  # pixel-centre of the rotation axis (CSS rotates around 50%/50%)
Y,X=np.mgrid[0:H,0:W]
hx,hy=166.9,180.0  # centre of the 7-hole pattern (measured)
out=im.copy()
# 1) clean, rotationally symmetric hub plate for the annulus around the axis
r=np.hypot(X-C,Y-C);ang=np.arctan2(Y-C,X-C)
lum=im[...,:3].mean(-1);sat=im[...,:3].max(-1)-im[...,:3].min(-1)
good=(sat<40)&(lum>120)&(im[...,3]>230)&(np.hypot(X-hx,Y-hy)>0)
prof={}
for rr in range(0,36):
  m=good&(np.abs(r-rr)<0.75)
  if m.sum()>5: prof[rr]=np.median(im[m],axis=0)
keys=sorted(prof);arr=np.array([prof[k] for k in keys])
fill=np.stack([np.interp(r,keys,arr[:,c]) for c in range(4)],-1)
wA=np.clip((33.5-r)/1.5,0,1)[...,None]          # annulus fill up to the hub's own edge
out=out*(1-wA)+fill*wA
# 2) paste the hole plate so the centre hole sits exactly on the axis
R0=25.0
dx,dy=hx-C,hy-C
pl=Image.fromarray(im.astype(np.uint8)).transform((W,H),Image.AFFINE,(1,0,dx,0,1,dy),resample=Image.BICUBIC)
pl=np.array(pl).astype(float)
wP=np.clip((R0-r)/2.0,0,1)[...,None]
out=out*(1-wP)+pl*wP
Image.fromarray(np.clip(out,0,255).astype(np.uint8)).save(dst,quality=92,method=6)
