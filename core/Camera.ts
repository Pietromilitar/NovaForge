import { Matrix4 } from '../math/Matrix4';
import { Vector3 } from '../math/Vector3';

export class Camera {
  public position: Vector3 = new Vector3(0, 0, 5);
  public rotation: Vector3 = new Vector3(0, 0, 0);

  public readonly projectionMatrix: Matrix4 = new Matrix4();
  public readonly viewMatrix: Matrix4 = new Matrix4();

  public fov = 60 * (Math.PI / 180);
  public near = 0.1;
  public far = 1000;
  public aspect = 1;

  updateProjection(aspect: number): void {
    this.aspect = aspect;
    this.projectionMatrix.perspective(this.fov, this.aspect, this.near, this.far);
  }

  updateViewMatrix(): void {
    const transform = new Matrix4().compose(this.position, this.rotation, new Vector3(1, 1, 1));
    this.viewMatrix.copy(transform).invert();
  }
}
