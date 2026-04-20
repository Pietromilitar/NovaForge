export class Scene {
    constructor() {
        this.meshes = [];
    }
    add(mesh) {
        this.meshes.push(mesh);
    }
    remove(mesh) {
        const idx = this.meshes.indexOf(mesh);
        if (idx >= 0) {
            this.meshes.splice(idx, 1);
        }
    }
    getAll() {
        return this.meshes;
    }
}
