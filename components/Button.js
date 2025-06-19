import * as THREE from "three";

export class Button {
  constructor({ texture, width, height, action, container }) {

    this.width = width;
    this.height = height;

    if (container === null) {
      return 'No container provided';
    }

    const textureLoader = new THREE.TextureLoader();
    const buttonTexture = textureLoader.load(texture);
    const buttonGeo = new THREE.PlaneGeometry(width, height);
    const buttonMat = new THREE.MeshBasicMaterial({ map: buttonTexture, transparent: true, opacity: 0.6 });
    this.object = new THREE.Mesh(buttonGeo, buttonMat);

    this.object.castShadow = true;
    this.object.receiveShadow = true;

    this.object.userData.isButton = true;
    this.object.userData.action = action;
  }
}