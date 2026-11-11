export const SIZE = 160;
export const state = {
  width: SIZE, height: SIZE, activeTool: "paint", activeLayer: 0,
  layers: [{ id: crypto.randomUUID(), name: "Terreno", visible: true, locked: false, heights: new Float32Array(SIZE * SIZE) }],
  brushSize: 4, strength: 5, selectedBlock: "grass_block"
};
export function activeLayer() { return state.layers[state.activeLayer]; }
export function clampHeight(n) { return Math.max(0, Math.min(64, n)); }
export function resetProject() {
  state.layers = [{ id: crypto.randomUUID(), name: "Terreno", visible: true, locked: false, heights: new Float32Array(state.width * state.height) }];
  state.activeLayer = 0;
}