import { Mesh } from '../graphics/Mesh';

export class Scene {
  private readonly meshes: Mesh[] = [];

  add(mesh: Mesh): void {
    this.meshes.push(mesh);
  }

  remove(mesh: Mesh): void {
    const idx = this.meshes.indexOf(mesh);
    if (idx >= 0) {
      this.meshes.splice(idx, 1);
    }
  }

  getAll(): Mesh[] {
    return this.meshes;
  }
}
