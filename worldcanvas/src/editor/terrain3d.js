import * as THREE from "three";
import { state } from "../core/state.js";
export function createTerrain3D(container) {
  let renderer, scene, camera, mesh;
  function build() {
    if(!renderer){ renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); container.append(renderer.domElement); scene=new THREE.Scene(); scene.background=new THREE.Color(0x171c27); camera=new THREE.PerspectiveCamera(48,1,.1,1000); camera.position.set(90,110,150); camera.lookAt(0,0,0); scene.add(new THREE.HemisphereLight(0xffffff,0x526044,2)); const light=new THREE.DirectionalLight(0xffffff,2); light.position.set(60,100,40); scene.add(light); }
    if(mesh){scene.remove(mesh);mesh.geometry.dispose();mesh.material.dispose();}
    const geo=new THREE.PlaneGeometry(120,120,state.width-1,state.height-1); geo.rotateX(-Math.PI/2);
    const pos=geo.attributes.position;
    const heights=Array.from({length:state.width*state.height},(_,i)=>state.layers.filter(l=>l.visible).reduce((a,l)=>a+l.heights[i],0));
    for(let i=0;i<pos.count;i++) pos.setY(i,heights[i]??0);
    geo.computeVertexNormals(); mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x7ca65a,roughness:1,side:THREE.DoubleSide})); scene.add(mesh);
    const w=container.clientWidth||600,h=container.clientHeight||500; renderer.setSize(w,h); camera.aspect=w/h;camera.updateProjectionMatrix();renderer.render(scene,camera);
  }
  build(); return build;
}