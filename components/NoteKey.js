import * as THREE from "three";

export class NoteKey {
  constructor({ width, height, key, stringIndex, noteIndex }) {

    this.width = width;
    this.height = height;

    const { x: tileX, y: tileY } = this.getTilePositionForKey(key);

    const textureLoader = new THREE.TextureLoader();
    const buttonTexture = textureLoader.load('../images/letters_new.png');

    buttonTexture.offset.y = 1 - (0.14285714285 * (tileY + 1));
    buttonTexture.offset.x = (tileX * 0.167);
    buttonTexture.repeat.set(0.167, 0.14285714285);

    const buttonGeo = new THREE.PlaneGeometry(width, height);
    const buttonMat = new THREE.MeshBasicMaterial({ map: buttonTexture, transparent: true, opacity: 0.1 });
    this.object = new THREE.Mesh(buttonGeo, buttonMat);

    this.object.castShadow = true;
    this.object.receiveShadow = true;

    this.object.userData.isNote = true;
    this.object.userData.key = key
    this.object.userData.width = width;
    this.object.userData.height = height;
    this.object.userData.stringIndex = stringIndex;
    this.object.userData.noteIndex = noteIndex;
  }

  getTilePositionForKey(key) {

    const tileMap = {
      A: { x: 0, y: 0 },
      B: { x: 1, y: 0 },
      C: { x: 2, y: 0 },
      D: { x: 3, y: 0 },
      E: { x: 4, y: 0 },
      F: { x: 5, y: 0 },
      G: { x: 0, y: 1 },
    }

    let tile = tileMap[key.toUpperCase().split('')[0]] || { x: 6, y: 6 };
    if (key.toUpperCase().split('').includes("#")) {
      tile.y += 2;
    }

    return tile;
  }
}
