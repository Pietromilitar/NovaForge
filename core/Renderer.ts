import { Mesh } from '../graphics/Mesh';
import { ShaderProgram, DEFAULT_FRAGMENT_SHADER, DEFAULT_VERTEX_SHADER } from '../graphics/Shader';
import { Vector3 } from '../math/Vector3';
import { Camera } from './Camera';
import { Scene } from './Scene';

export class Renderer {
  public readonly gl: WebGLRenderingContext;
  public readonly camera: Camera;
  public readonly scene: Scene;

  public wireframe = false;
  public lightingEnabled = true;

  private readonly canvas: HTMLCanvasElement;
  private readonly shader: ShaderProgram;
  private animationFrame = 0;
  private readonly lightDirection = new Vector3(0.2, -1.0, 0.35).normalize();
  private renderHook?: (deltaSeconds: number) => void;
  private lastTime = 0;

  constructor(canvas: HTMLCanvasElement, scene: Scene, camera: Camera) {
    this.canvas = canvas;
    this.scene = scene;
    this.camera = camera;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      throw new Error('WebGL não suportado neste navegador.');
    }

    this.gl = gl;
    this.shader = new ShaderProgram(gl, DEFAULT_VERTEX_SHADER, DEFAULT_FRAGMENT_SHADER);

    this.configureContext();
    this.onResize();

    window.addEventListener('resize', () => this.onResize());
  }

  onBeforeRender(callback: (deltaSeconds: number) => void): void {
    this.renderHook = callback;
  }

  start(): void {
    const loop = (time: number) => {
      const delta = this.lastTime === 0 ? 0 : (time - this.lastTime) / 1000;
      this.lastTime = time;

      if (this.renderHook) {
        this.renderHook(delta);
      }

      this.render();
      this.animationFrame = requestAnimationFrame(loop);
    };

    this.animationFrame = requestAnimationFrame(loop);
  }

  stop(): void {
    cancelAnimationFrame(this.animationFrame);
  }

  private configureContext(): void {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.05, 0.05, 0.08, 1.0);
  }

  private onResize(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.camera.updateProjection(this.canvas.width / Math.max(this.canvas.height, 1));
  }

  private render(): void {
    const gl = this.gl;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.camera.updateViewMatrix();

    this.shader.use();
    this.shader.setMatrix4('uView', this.camera.viewMatrix);
    this.shader.setMatrix4('uProjection', this.camera.projectionMatrix);
    this.shader.setVector3('uLightDirection', this.lightDirection);
    this.shader.setFloat('uLightingEnabled', this.lightingEnabled ? 1 : 0);

    const meshes = this.scene.getAll();
    for (const mesh of meshes) {
      mesh.draw(this.shader, this.wireframe);
    }
  }

  add(mesh: Mesh): void {
    this.scene.add(mesh);
  }
}
