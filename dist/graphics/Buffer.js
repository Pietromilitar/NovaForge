export class GLBuffer {
    constructor(gl, target) {
        this.gl = gl;
        this.target = target;
        const created = gl.createBuffer();
        if (!created) {
            throw new Error('Falha ao criar buffer WebGL.');
        }
        this.buffer = created;
    }
    setData(data, usage = this.gl.STATIC_DRAW) {
        this.bind();
        this.gl.bufferData(this.target, data, usage);
    }
    bind() {
        this.gl.bindBuffer(this.target, this.buffer);
    }
}
