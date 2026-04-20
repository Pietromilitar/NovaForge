import { Matrix4 } from '../math/Matrix4';
import { Vector3 } from '../math/Vector3';
import { GLBuffer } from './Buffer';
export class Mesh {
    constructor(gl, id, geometry) {
        this.modelMatrix = new Matrix4();
        this.position = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3(1, 1, 1);
        this.color = new Vector3(0.6, 0.7, 0.95);
        this.gl = gl;
        this.id = id;
        this.vertexBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER);
        this.vertexBuffer.setData(new Float32Array(geometry.vertices));
        this.normalBuffer = new GLBuffer(gl, gl.ARRAY_BUFFER);
        this.normalBuffer.setData(new Float32Array(geometry.normals));
        this.indexBuffer = new GLBuffer(gl, gl.ELEMENT_ARRAY_BUFFER);
        this.indexBuffer.setData(new Uint16Array(geometry.indices));
        this.indexCount = geometry.indices.length;
        this.updateMatrix();
    }
    updateMatrix() {
        this.modelMatrix.compose(this.position, this.rotation, this.scale);
    }
    draw(shader, wireframe = false) {
        this.updateMatrix();
        const posLocation = shader.getAttribLocation('aPosition');
        const normalLocation = shader.getAttribLocation('aNormal');
        this.vertexBuffer.bind();
        this.gl.enableVertexAttribArray(posLocation);
        this.gl.vertexAttribPointer(posLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.normalBuffer.bind();
        this.gl.enableVertexAttribArray(normalLocation);
        this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.indexBuffer.bind();
        shader.setMatrix4('uModel', this.modelMatrix);
        shader.setVector3('uObjectColor', this.color);
        if (wireframe) {
            for (let i = 0; i < this.indexCount; i += 3) {
                this.gl.drawElements(this.gl.LINE_LOOP, 3, this.gl.UNSIGNED_SHORT, i * 2);
            }
            return;
        }
        this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
    }
}
