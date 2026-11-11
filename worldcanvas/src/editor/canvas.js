import { state, activeLayer, clampHeight } from "../core/state.js";
export function initCanvas(canvas, onChange) {
  const ctx = canvas.getContext("2d", { alpha: false }); let drawing = false;
  function paint(e) {
    const layer = activeLayer(); if (layer.locked || !layer.visible) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / rect.width * state.width);
    const y = Math.floor((e.clientY - rect.top) / rect.height * state.height);
    const r = Math.max(1, state.brushSize), delta = state.strength * .12;
    for (let py = Math.max(0,y-r); py < Math.min(state.height,y+r); py++)
      for (let px = Math.max(0,x-r); px < Math.min(state.width,x+r); px++) {
        const d = Math.hypot(px-x,py-y); if (d > r) continue;
        const idx = py*state.width+px, falloff = 1-d/r;
        if (state.activeTool === "paint") layer.heights[idx] = clampHeight(layer.heights[idx] + delta*falloff);
        if (state.activeTool === "lower") layer.heights[idx] = clampHeight(layer.heights[idx] - delta*falloff);
        if (state.activeTool === "smooth") {
          let sum=0,count=0;
          for(let yy=Math.max(0,py-1);yy<=Math.min(state.height-1,py+1);yy++)
            for(let xx=Math.max(0,px-1);xx<=Math.min(state.width-1,px+1);xx++){sum+=layer.heights[yy*state.width+xx];count++;}
          layer.heights[idx] = layer.heights[idx]*.65 + sum/count*.35;
        }
      }
    onChange();
  }
  canvas.addEventListener("pointerdown", e => { drawing=true; canvas.setPointerCapture(e.pointerId); paint(e); });
  canvas.addEventListener("pointermove", e => { if(drawing) paint(e); });
  canvas.addEventListener("pointerup", () => drawing=false);
  canvas.addEventListener("pointercancel", () => drawing=false);
  return renderCanvas;
  function renderCanvas() {
    const img = ctx.createImageData(state.width,state.height), heights = new Float32Array(state.width*state.height);
    state.layers.filter(l=>l.visible).forEach(l=>l.heights.forEach((v,i)=>heights[i]+=v));
    for(let i=0;i<heights.length;i++){
      const h=heights[i], shade=Math.max(0,Math.min(255,70+h*2.7));
      const p=i*4; img.data[p]=Math.min(255,shade*.68); img.data[p+1]=Math.min(255,shade*.92); img.data[p+2]=Math.min(255,shade*.58); img.data[p+3]=255;
    }
    ctx.putImageData(img,0,0);
  }
}