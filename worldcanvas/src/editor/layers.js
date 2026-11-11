import { state } from "../core/state.js";
const list = document.querySelector("#layers");
export function renderLayers(onChange) {
  list.replaceChildren();
  state.layers.forEach((layer, i) => {
    const row = document.createElement("button");
    row.className = "layer-row" + (i === state.activeLayer ? " selected" : "");
    row.textContent = (layer.visible ? "◉ " : "○ ") + (layer.locked ? "🔒 " : "") + layer.name;
    row.onclick = () => { state.activeLayer = i; renderLayers(onChange); onChange(); };
    list.append(row);
  });
}
export function addLayer(onChange) {
  const heights = new Float32Array(state.width * state.height);
  state.layers.push({ id: crypto.randomUUID(), name: "Camada " + (state.layers.length + 1), visible: true, locked: false, heights });
  state.activeLayer = state.layers.length - 1; renderLayers(onChange); onChange();
}
export function renameLayer(onChange) {
  const layer = state.layers[state.activeLayer]; const name = prompt("Nome da camada:", layer.name);
  if (name?.trim()) layer.name = name.trim(); renderLayers(onChange);
}
export function toggleLayer(onChange) { const l = state.layers[state.activeLayer]; l.visible = !l.visible; renderLayers(onChange); onChange(); }
export function lockLayer(onChange) { const l = state.layers[state.activeLayer]; l.locked = !l.locked; renderLayers(onChange); }
export function mergeLayer(onChange) {
  const i = state.activeLayer; if (i === 0) return alert("Não existe camada abaixo.");
  const top = state.layers[i], bottom = state.layers[i - 1];
  for (let n = 0; n < top.heights.length; n++) bottom.heights[n] = Math.max(bottom.heights[n], top.heights[n]);
  state.layers.splice(i, 1); state.activeLayer = i - 1; renderLayers(onChange); onChange();
}