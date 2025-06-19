import * as THREE from "three";
import { Button } from "./Button.js";

export class UIContainer {
  constructor({ x, y, z, scene }) {
    this.container = new THREE.Group();
    this.container.position.set(x, y, z)
    scene.add(this.container);

    this.lastItemPosition = 0;

  }

  addNew(width, height, texture, action) {
    const button = new Button({ texture, width, height, action, container: this.container });

    button.object.position.x = (button.width / 2) + this.lastItemPosition;
    this.container.add(button.object);

    this.lastItemPosition += button.width + 0.05
  }
}