export class GLBuffer {
  private readonly gl: WebGLRenderingContext;
  private readonly target: number;
  public readonly buffer: WebGLBuffer;

  constructor(gl: WebGLRenderingContext, target: number) {
    this.gl = gl;
    this.target = target;
    const created = gl.createBuffer();
    if (!created) {
      throw new Error('Falha ao criar buffer WebGL.');
    }
    this.buffer = created;
  }

  setData(data: Float32Array | Uint16Array, usage: number = this.gl.STATIC_DRAW): void {
    this.bind();
    this.gl.bufferData(this.target, data, usage);
  }

  bind(): void {
    this.gl.bindBuffer(this.target, this.buffer);
  }
}
