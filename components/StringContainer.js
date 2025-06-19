import * as THREE from "three";
import { NoteKey } from "./NoteKey.js";

export class StringContainer {
  constructor({ x, y, z, scene }) {
    this.container = new THREE.Group();
    this.name = "e";
    this.container.position.set(x, y, z)
    scene.add(this.container);

    this.lastItemPosition = 0;

  }

  updateSpace(space, fretbroadOffset = 0.1) {
    this.lastItemPosition = 0;

    this.itemCount = 0;

    this.container.children.forEach(child => {
      child.position.x = (child.userData.width / 2) + this.lastItemPosition;
      this.lastItemPosition += (child.userData.width + space) - this.itemCount;

      this.itemCount += fretbroadOffset;
    })
  }

  addNew(width, height, key, stringIndex, noteIndex) {

    const note = new NoteKey({ width, height, key, stringIndex, noteIndex })

    note.object.position.x = (note.width / 2) + this.lastItemPosition;
    this.container.add(note.object);

    this.lastItemPosition += note.width + 0.05
  }
}
