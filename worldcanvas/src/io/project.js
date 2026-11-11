import { state } from "../core/state.js";
export function exportProject() {
  return { format:"worldcanvas", version:1, width:state.width, height:state.height, layers:state.layers.map(l=>({name:l.name,visible:l.visible,locked:l.locked,heights:Array.from(l.heights)})) };
}
export function saveJSON() {
  const blob=new Blob([JSON.stringify(exportProject())],{type:"application/json"}); const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="worldcanvas-project.json";a.click();URL.revokeObjectURL(a.href);
}
export async function loadJSON(file) {
  const data=JSON.parse(await file.text()); if(data.format!=="worldcanvas"||!Array.isArray(data.layers)) throw new Error("Arquivo WorldCanvas inválido.");
  if(data.width*data.height>2_000_000) throw new Error("Mapa grande demais.");
  state.width=data.width;state.height=data.height;
  state.layers=data.layers.map(l=>({id:crypto.randomUUID(),name:String(l.name||"Camada"),visible:l.visible!==false,locked:!!l.locked,heights:Float32Array.from(l.heights)}));
  state.activeLayer=0;
}