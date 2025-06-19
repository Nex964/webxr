import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { XRButton } from "three/addons/webxr/XRButton.js";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";

export class ThreeManager {

  constructor(animate, onSelectStart, onSelectEnd) {
    this.init(animate, onSelectStart, onSelectEnd);
  }

  init(animate, onSelectStart, onSelectEnd) {
    // Initialize ThreeJS

    this.container = document.createElement('div');
    document.body.appendChild(this.container);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x808080);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
    this.camera.position.set(0, 1.6, 3);

    this.controls = new OrbitControls(this.camera, this.container);
    this.controls.target.set(0, 1.6, 0);
    this.controls.update();

    const floorGeometry = new THREE.PlaneGeometry(6, 6);
    const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.25, blending: THREE.CustomBlending, transparent: false });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    this.scene.add(new THREE.HemisphereLight(0xbcbcbc, 0xa5a5a5, 3));

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(0, 6, 0);
    light.castShadow = true;
    light.shadow.camera.top = 3;
    light.shadow.camera.bottom = - 3;
    light.shadow.camera.right = 3;
    light.shadow.camera.left = - 3;
    light.shadow.mapSize.set(4096, 4096);
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(animate);
    this.renderer.shadowMap.enabled = true;
    this.renderer.xr.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    this.controller1 = this.renderer.xr.getController(0);
    this.controller1.addEventListener('selectstart', onSelectStart);
    this.controller1.addEventListener('selectend', onSelectEnd);
    this.scene.add(this.controller1);

    this.controller2 = this.renderer.xr.getController(1);
    this.controller2.addEventListener('selectstart', onSelectStart);
    this.controller2.addEventListener('selectend', onSelectEnd);
    this.scene.add(this.controller2);

    const controllerModelFactory = new XRControllerModelFactory();

    this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
    this.controllerGrip1.add(controllerModelFactory.createControllerModel(this.controllerGrip1));
    this.scene.add(this.controllerGrip1);

    this.controllerGrip2 = this.renderer.xr.getControllerGrip(1);
    this.controllerGrip2.add(controllerModelFactory.createControllerModel(this.controllerGrip2));
    this.scene.add(this.controllerGrip2);

    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);

    const line = new THREE.Line(geometry);
    line.name = 'line';
    line.scale.z = 5;

    this.controller1.add(line.clone());
    this.controller2.add(line.clone());

    this.raycaster = new THREE.Raycaster();


    document.body.appendChild(XRButton.createButton(this.renderer, {
      // 'optionalFeatures': ['depth-sensing'],
      // 'depthSensing': { 'usagePreference': ['gpu-optimized'], 'dataFormatPreference': [] }
    }));
  }

}