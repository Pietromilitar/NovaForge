import { Matrix4 } from '../math/Matrix4';
import { Vector3 } from '../math/Vector3';

export class ShaderProgram {
  private readonly gl: WebGLRenderingContext;
  public readonly program: WebGLProgram;

  constructor(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
    this.gl = gl;
    this.program = this.createProgram(vertexSource, fragmentSource);
  }

  use(): void {
    this.gl.useProgram(this.program);
  }

  getAttribLocation(name: string): number {
    return this.gl.getAttribLocation(this.program, name);
  }

  getUniformLocation(name: string): WebGLUniformLocation {
    const location = this.gl.getUniformLocation(this.program, name);
    if (!location) {
      throw new Error(`Uniforme não encontrado: ${name}`);
    }
    return location;
  }

  setMatrix4(name: string, value: Matrix4): void {
    this.gl.uniformMatrix4fv(this.getUniformLocation(name), false, value.elements);
  }

  setVector3(name: string, value: Vector3): void {
    this.gl.uniform3f(this.getUniformLocation(name), value.x, value.y, value.z);
  }

  setFloat(name: string, value: number): void {
    this.gl.uniform1f(this.getUniformLocation(name), value);
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error('Falha ao criar shader.');
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const log = this.gl.getShaderInfoLog(shader) || 'Erro desconhecido';
      this.gl.deleteShader(shader);
      throw new Error(`Erro na compilação do shader: ${log}`);
    }

    return shader;
  }

  private createProgram(vertexSource: string, fragmentSource: string): WebGLProgram {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

    const program = this.gl.createProgram();
    if (!program) {
      throw new Error('Falha ao criar programa de shader.');
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const log = this.gl.getProgramInfoLog(program) || 'Erro desconhecido';
      this.gl.deleteProgram(program);
      throw new Error(`Erro no link do programa: ${log}`);
    }

    return program;
  }
}

export const DEFAULT_VERTEX_SHADER = `
attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = uModel * vec4(aPosition, 1.0);
  vWorldPosition = worldPosition.xyz;
  vNormal = mat3(uModel) * aNormal;
  gl_Position = uProjection * uView * worldPosition;
}
`;

export const DEFAULT_FRAGMENT_SHADER = `
precision mediump float;

uniform vec3 uObjectColor;
uniform vec3 uLightDirection;
uniform float uLightingEnabled;

varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(-uLightDirection);
  float lambert = max(dot(normal, lightDir), 0.0);
  vec3 ambient = vec3(0.15);
  vec3 litColor = uObjectColor * (ambient + lambert);
  vec3 finalColor = mix(uObjectColor, litColor, clamp(uLightingEnabled, 0.0, 1.0));
  gl_FragColor = vec4(finalColor, 1.0);
}
`;
