import { Mesh, MeshGeometry } from '../graphics/Mesh';
import { Vector3 } from '../math/Vector3';

export interface NFXObject {
  id: string;
  mesh: {
    vertices: [number, number, number][];
    faces: number[][];
  };
  transform?: {
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  };
  color?: [number, number, number];
}

export interface NFXFile {
  format: 'nfx';
  version: number;
  objects: NFXObject[];
}

export class NFXLoader {
  private readonly gl: WebGLRenderingContext;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
  }

  async loadFromUrl(url: string): Promise<Mesh[]> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Falha ao carregar NFX: ${response.status} ${response.statusText}`);
    }
    const json = (await response.json()) as NFXFile;
    return this.parse(json);
  }

  parse(data: NFXFile): Mesh[] {
    this.validate(data);

    return data.objects.map((obj) => {
      const geometry = this.buildGeometry(obj.mesh.vertices, obj.mesh.faces);
      const mesh = new Mesh(this.gl, obj.id, geometry);

      if (obj.transform?.position) {
        mesh.position.copy(Vector3.fromArray(obj.transform.position));
      }
      if (obj.transform?.rotation) {
        mesh.rotation.copy(Vector3.fromArray(obj.transform.rotation));
      }
      if (obj.transform?.scale) {
        mesh.scale.copy(Vector3.fromArray(obj.transform.scale));
      }
      if (obj.color) {
        mesh.color.copy(Vector3.fromArray(obj.color));
      }

      mesh.updateMatrix();
      return mesh;
    });
  }

  private validate(data: NFXFile): void {
    if (data.format !== 'nfx') {
      throw new Error('Formato inválido. Esperado "nfx".');
    }
    if (data.version !== 1) {
      throw new Error(`Versão NFX não suportada: ${data.version}`);
    }
    if (!Array.isArray(data.objects)) {
      throw new Error('Campo "objects" inválido no arquivo NFX.');
    }
  }

  private buildGeometry(vertices: [number, number, number][], faces: number[][]): MeshGeometry {
    const flatVertices = vertices.flat();
    const indices: number[] = [];

    for (const face of faces) {
      const triangles = this.triangulateFace(face);
      indices.push(...triangles);
    }

    const normals = this.generateVertexNormals(flatVertices, indices);

    return {
      vertices: flatVertices,
      normals,
      indices,
    };
  }

  private triangulateFace(face: number[]): number[] {
    if (face.length < 3) {
      throw new Error('Face inválida: é necessário ao menos 3 vértices.');
    }
    if (face.length === 3) {
      return [...face];
    }

    const triangles: number[] = [];
    for (let i = 1; i < face.length - 1; i++) {
      triangles.push(face[0], face[i], face[i + 1]);
    }

    return triangles;
  }

  private generateVertexNormals(vertices: number[], indices: number[]): number[] {
    const normals = new Array(vertices.length).fill(0);

    for (let i = 0; i < indices.length; i += 3) {
      const ia = indices[i] * 3;
      const ib = indices[i + 1] * 3;
      const ic = indices[i + 2] * 3;

      const a = new Vector3(vertices[ia], vertices[ia + 1], vertices[ia + 2]);
      const b = new Vector3(vertices[ib], vertices[ib + 1], vertices[ib + 2]);
      const c = new Vector3(vertices[ic], vertices[ic + 1], vertices[ic + 2]);

      const ab = b.clone().sub(a);
      const ac = c.clone().sub(a);
      const normal = ab.cross(ac).normalize();

      normals[ia] += normal.x;
      normals[ia + 1] += normal.y;
      normals[ia + 2] += normal.z;

      normals[ib] += normal.x;
      normals[ib + 1] += normal.y;
      normals[ib + 2] += normal.z;

      normals[ic] += normal.x;
      normals[ic + 1] += normal.y;
      normals[ic + 2] += normal.z;
    }

    for (let i = 0; i < normals.length; i += 3) {
      const n = new Vector3(normals[i], normals[i + 1], normals[i + 2]).normalize();
      normals[i] = n.x;
      normals[i + 1] = n.y;
      normals[i + 2] = n.z;
    }

    return normals;
  }
}
