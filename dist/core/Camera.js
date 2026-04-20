import { Matrix4 } from '../math/Matrix4';
import { Vector3 } from '../math/Vector3';
export class Camera {
    constructor() {
        this.position = new Vector3(0, 0, 5);
        this.rotation = new Vector3(0, 0, 0);
        this.projectionMatrix = new Matrix4();
        this.viewMatrix = new Matrix4();
        this.fov = 60 * (Math.PI / 180);
        this.near = 0.1;
        this.far = 1000;
        this.aspect = 1;
    }
    updateProjection(aspect) {
        this.aspect = aspect;
        this.projectionMatrix.perspective(this.fov, this.aspect, this.near, this.far);
    }
    updateViewMatrix() {
        const transform = new Matrix4().compose(this.position, this.rotation, new Vector3(1, 1, 1));
        this.viewMatrix.copy(transform).invert();
    }
}
