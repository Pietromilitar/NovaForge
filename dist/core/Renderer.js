import { ShaderProgram, DEFAULT_FRAGMENT_SHADER, DEFAULT_VERTEX_SHADER } from '../graphics/Shader';
import { Vector3 } from '../math/Vector3';
export class Renderer {
    constructor(canvas, scene, camera) {
        this.wireframe = false;
        this.lightingEnabled = true;
        this.animationFrame = 0;
        this.lightDirection = new Vector3(0.2, -1.0, 0.35).normalize();
        this.lastTime = 0;
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
    onBeforeRender(callback) {
        this.renderHook = callback;
    }
    start() {
        const loop = (time) => {
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
    stop() {
        cancelAnimationFrame(this.animationFrame);
    }
    configureContext() {
        const gl = this.gl;
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearColor(0.05, 0.05, 0.08, 1.0);
    }
    onResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.camera.updateProjection(this.canvas.width / Math.max(this.canvas.height, 1));
    }
    render() {
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
    add(mesh) {
        this.scene.add(mesh);
    }
}
