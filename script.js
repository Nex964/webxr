import * as THREE from "three";
import { gsap } from "gsap";
import * as Tone from 'tone'
import * as DigitalBaconUI from 'DigitalBacon-UI';
import { anticipateGlow, debounce, highlightNotes, loadNotes, getAllNotes, findKeys, saveFretboard, unhighlightNotes, withTimingFromBeats, findByIndex, highlightChord } from "./utils/helper.js";
import { HAPPY_BIRTHDAY_NOTES, STANDARD_MAP, SCALES_MAP } from "./utils/constants.js";
import { StringContainer } from "./components/StringContainer.js";
import { UIContainer } from "./components/UIContainer.js";
import { ThreeManager } from "./components/ThreeManager.js";
import { UIManager } from "./components/UIManager.js";


let plane;

const intersected = [];

let group, buttonContainer;
let stringSpaceContainerUI;
let notesSpaceContainerUI;
let fretSpaceContainerUI;
let stringsContainer;
let stringContainerHolder = []

// Value variables
let isAttached = false;
let scaleX = 1;
let scaleZ = 1;

let xScale = 0.05;
let yPosOffset = 0.2;
let fretbroadOffset = 0.01;
const synth = new Tone.PolySynth().toDestination();

let threeManager;
let uiManager;

let isPlayingProgression = false

function playMidiNotes() {
  const tl = gsap.timeline({ defaults: { ease: "none" } });
  const start = Tone.now();

  withTimingFromBeats(loadNotes(), 60).forEach(note => {
    tl.call(() => {
      highlightNotes(threeManager.scene, note.note);

      synth.triggerAttackRelease(note.note, note.duration, Tone.now(), note.velocity);
    }, null, note.time);

    tl.call(() => unhighlightNotes(threeManager.scene, note.note), null, note.time + note.duration);
  });
  return tl;
}

function loadFretboard() {
  const fretboard = localStorage.getItem("fretboard")?.split(",");

  if (fretboard) {
    xScale = parseFloat(fretboard[0]);
    yPosOffset = parseFloat(fretboard[1]);
    fretbroadOffset = parseFloat(fretboard[2]);
  }
}

// Build GSAP timeline
function playHappyBirthday() {
  const tl = gsap.timeline();

  HAPPY_BIRTHDAY_NOTES.forEach(({ note, duration }) => {
    tl.call(() => anticipateGlow(threeManager.scene, note));
    tl.to({}, { duration: 0.6 });
    tl.call(() => anticipateKey(threeManager.scene, note));
    tl.call(() => highlightNotes(threeManager.scene, note));          // Turn ON
    tl.to({}, { duration: duration * 0.8 });      // Keep ON for 80% of duration
    tl.call(() => unhighlightNotes(threeManager.scene, note));        // Turn OFF
    tl.to({}, { duration: 0.2 });      // Wait rest of duration
  });
}


loadFretboard();
init();



function init() {

  gsap.ticker.remove(gsap.updateRoot);

  threeManager = new ThreeManager(animate, onSelectStart, onSelectEnd);

  group = new THREE.Group();
  threeManager.scene.add(group);

  buttonContainer = new THREE.Group();
  threeManager.scene.add(buttonContainer);

  stringSpaceContainerUI = new UIContainer({ x: 0, y: 2, z: -0.5, scene: threeManager.scene });
  notesSpaceContainerUI = new UIContainer({ x: 0, y: 1.7, z: -0.5, scene: threeManager.scene });
  fretSpaceContainerUI = new UIContainer({ x: 0, y: 1.4, z: -0.5, scene: threeManager.scene });

  buttonContainer.add(stringSpaceContainerUI.container);
  buttonContainer.add(notesSpaceContainerUI.container);
  buttonContainer.add(fretSpaceContainerUI.container);

  buttonContainer.scale.set(0.5, 0.5, 0.5)

  stringSpaceContainerUI.addNew(0.1, 0.1, './images/ui/back.png', "decrease_string_space")
  stringSpaceContainerUI.addNew(0.8, 0.2, './images/ui/string_space.png', "string_space_text")
  stringSpaceContainerUI.addNew(0.1, 0.1, './images/ui/next.png', "increase_string_space")

  notesSpaceContainerUI.addNew(0.1, 0.1, './images/ui/back.png', "decrease_notes_space")
  notesSpaceContainerUI.addNew(0.8, 0.2, './images/ui/notes_space.png', "notes_space_text")
  notesSpaceContainerUI.addNew(0.1, 0.1, './images/ui/next.png', "increase_notes_space")

  fretSpaceContainerUI.addNew(0.1, 0.1, './images/ui/back.png', "decrease_fret_space")
  fretSpaceContainerUI.addNew(0.8, 0.2, './images/ui/fret_space.png', "fret_space_text")
  fretSpaceContainerUI.addNew(0.1, 0.1, './images/ui/next.png', "increase_fret_space")

  stringsContainer = new THREE.Group();

  stringsContainer.position.z = -0.5

  let yPos = 1;

  Object.keys(STANDARD_MAP).forEach((string, stringIndex) => {

    const container = new StringContainer({ x: -1.5, y: yPos, z: 0, scene: threeManager.scene });
    stringContainerHolder.push(container);
    stringsContainer.add(container.container);

    STANDARD_MAP[string].forEach((note, noteIndex) => {
      container.addNew(0.1, 0.1, note, stringIndex, noteIndex);
    })

    yPos -= 0.2;
  })

  stringContainerHolder.forEach(container => container.updateSpace(xScale, fretbroadOffset))

  window.addEventListener('keydown', (e) => {
    console.log("Key pressed", e.key)

    if (e.key === "p") {
      playHappyBirthday();
      return
    }

    if (e.key === "m") {
      playMidiNotes();
      return
    }

    if (e.key === "s") {
      saveFretboard();
      return
    }

    highlightNotes(threeManager.scene, e.key)

    if (e.key === "w") {
      console.log("W pressed")
      xScale += 0.05;
      stringContainerHolder.forEach(container => container.updateSpace(xScale, fretbroadOffset))
    }

    if (e.key === "n") {
      loadNotes()
    }
  })

  group.add(stringsContainer);

  uiManager = new UIManager(threeManager, onScaleChange, onClick, onRangeChange)

  window.addEventListener('resize', onWindowResize);

}

const chords = ["G", "E", "C", "D"]
let chordIndex = 0;

let playSpeed = 4;

function onScaleChange(name, value) {

  if (name.includes("pattern")) {
    chords[parseInt(name.split('pattern')[1]) - 1] = value;
    console.log("Pattern change", parseInt(name.split('pattern')[1]), value)
    return;
  }

  if (name === "scale") {
    getAllNotes(threeManager.scene).forEach(note => note.material.opacity = 0.1)
    SCALES_MAP[value].forEach(key => findKeys(threeManager.scene, key, false).forEach(note => note.material.opacity = 1))
  }
}

function onClick(action) {
  if (action === "play_progression") {
    onPlayProgression();
  }
  if (action.includes("chord")) {
    const chord = action.split("_")[0].toUpperCase();
    getAllNotes(threeManager.scene).forEach(note => note.material.opacity = 0.1)
    highlightChord(threeManager.scene, chord)
  }
}

function onRangeChange(value) {
  playSpeed = value * 10;
  console.log("Range change", playSpeed)
}

function onPlayProgression() {
  if (isPlayingProgression) {
    isPlayingProgression = false;
    uiManager.textElements['play_progression'].text = "Play Progression";
    return;
  }
  isPlayingProgression = true;
  uiManager.textElements['play_progression'].text = "Stop Progression";
  onScaleChange1(chords[chordIndex]);
}


function onScaleChange1(value) {
  getAllNotes(threeManager.scene).forEach(note => note.material.opacity = 0.1)
  SCALES_MAP[value].forEach(key => findKeys(threeManager.scene, key, false).forEach(note => note.material.opacity = 1))

  setTimeout(() => {
    chordIndex++;
    if (chordIndex >= chords.length) chordIndex = 0;
    if (isPlayingProgression) onScaleChange1(chords[chordIndex], playSpeed)
  }, playSpeed * 1000)
}

function onWindowResize() {

  threeManager.camera.aspect = window.innerWidth / window.innerHeight;
  threeManager.camera.updateProjectionMatrix();

  threeManager.renderer.setSize(window.innerWidth, window.innerHeight);

}

function attachController(controller) {
  const object = stringsContainer;
  controller.attach(object);
  controller.userData.selected = object;
}

function detachController(controller) {
  const object = controller.userData.selected;
  group.attach(object);
  controller.userData.selected = undefined;
}

function handleButtonPress(button) {

  console.log("Button pressed", button.userData.action);

  let yPos = 1;

  if (button.userData.action === "increase_string_space") {
    xScale += 0.05;
    stringContainerHolder.forEach(container => container.updateSpace(xScale, fretbroadOffset))
    return;
  }
  if (button.userData.action === "decrease_string_space") {
    xScale -= 0.05;
    stringContainerHolder.forEach(container => container.updateSpace(xScale, fretbroadOffset))
    return;
  }

  if (button.userData.action === "increase_notes_space") {
    yPosOffset += 0.05; ppl
    yPos = 1;
    stringContainerHolder.forEach(container => {
      container.container.position.y = yPos;
      yPos -= yPosOffset;
    })
    return;
  }

  if (button.userData.action === "decrease_notes_space") {
    yPosOffset -= 0.05;
    yPos = 1;
    stringContainerHolder.forEach(container => {
      container.container.position.y = yPos;
      yPos -= yPosOffset;
    })
    return
  }

  if (button.userData.action === "increase_fret_space") {
    fretbroadOffset -= 0.01;
    stringContainerHolder.forEach(container => container.updateSpace(xScale, fretbroadOffset))
    return;
  }

  if (button.userData.action === "decrease_fret_space") {
    fretbroadOffset += 0.01;
    stringContainerHolder.forEach(container => container.updateSpace(xScale, fretbroadOffsets))
    return;
  }


  if (button.material.opacity === 1) {
    button.material.opacity = 0.6;
    if (button.userData.action === "c_scale") {

      const textureLoader = new THREE.TextureLoader();

      const cScaleTexture = textureLoader.load('./fret_new.png');
      // const material = new THREE.MeshBasicMaterial({ map: cScaleTexture, transparent: true });
      plane.material.map = cScaleTexture;
    }
  }
  else {
    button.material.opacity = 1;

    if (button.userData.action === "c_scale") {

      const textureLoader = new THREE.TextureLoader();

      const cScaleTexture = textureLoader.load('./c_scale_fret.png');
      // const material = new THREE.MeshBasicMaterial({ map: cScaleTexture, transparent: true });
      plane.material.map = cScaleTexture;
    }
  }
}

function onSelectStart(event) {
  const controller = event.target;

  const intersections = getIntersections(controller);

  if (intersections.length > 0) {

    const intersection = intersections[0];

    console.log("Intersection", intersection.object)

    const object = intersection.object;
    // object.material.emissive.b = 1;
    controller.attach(stringsContainer);

    controller.userData.selected = stringsContainer;
  }

  controller.userData.targetRayMode = event.data.targetRayMode;

  if (intersections.length === 0) {
    const intersectionsButtons = getIntersectionsButtons(controller);
    intersectionsButtons.length > 0 && handleButtonPress(intersectionsButtons[0].object)
  }

}

function onSelectEnd(event) {

  const controller = event.target;

  if (controller.userData.selected !== undefined) {

    const object = controller.userData.selected;
    // object.material.emissive.b = 0;
    group.attach(object);

    controller.userData.selected = undefined;

  }

}

function getIntersections(controller) {

  controller.updateMatrixWorld();

  threeManager.raycaster.setFromXRController(controller);

  return threeManager.raycaster.intersectObjects(group.children, true);

}

function getIntersectionsButtons(controller) {

  controller.updateMatrixWorld();

  threeManager.raycaster.setFromXRController(controller);

  return threeManager.raycaster.intersectObjects(buttonContainer.children, true);

}

function intersectObjects(controller) {

  // Do not highlight in mobile-ar

  if (controller.userData.targetRayMode === 'screen') return;

  // Do not highlight when already selected

  if (controller.userData.selected !== undefined) return;

  const line = controller.getObjectByName('line');
  const intersections = getIntersections(controller);

  if (intersections.length > 0) {

    const intersection = intersections[0];

    const object = intersection.object;
    // object.material.emissive.r = 1;
    intersected.push(object);

    line.scale.z = intersection.distance;

  } else {

    line.scale.z = 5;

  }

}

function cleanIntersected() {

  while (intersected.length) {

    const object = intersected.pop();
    // object.material.emissive.r = 0;

  }

}

const debounceButtonPress = debounce(() => {

  console.log("Button pressed", isAttached);

  if (isAttached) {
    detachController(threeManager.controller1)
    isAttached = false;
  }
  else {
    attachController(threeManager.controller1)
    isAttached = true;
  }

}, 100);

function handleInput() {

  const session = threeManager.renderer.xr.getSession();

  if (session) {

    const rightHand = session.inputSources[0];
    const leftHand = session.inputSources[1];


    if (leftHand) {

      if (leftHand.gamepad?.buttons === undefined || rightHand.gamepad?.buttons === null) {
        return;
      }

      if (leftHand.gamepad.buttons[5].pressed) {
        debounceButtonPress();
        console.log("Left hand trigger pressed", leftHand.gamepad.buttons)
      }
    }

    //Scaling the plane
    if (leftHand) {

      if (leftHand.gamepad?.buttons === undefined || rightHand.gamepad?.buttons === null) {
        return;
      }
      const yAxis = leftHand.gamepad.axes[3]; // Thumbstick Y
      const xAxis = leftHand.gamepad.axes[2]; // Thumbstick Y

      if (Math.abs(yAxis) > 0.1) {
        scaleX += -yAxis * 0.01; // invert Y axis for natural control
        scaleX = Math.max(0.01, Math.min(2, scaleX)); // clamp scale
      }

      if (Math.abs(xAxis) > 0.1) {
        scaleZ += -xAxis * 0.01; // invert Y axis for natural control
        scaleZ = Math.max(0.1, Math.min(2, scaleZ)); // clamp scale
      }
      stringsContainer.scale.set(scaleX, scaleX, scaleX);
    }
  }
}

function animate(time, frame) {

  gsap.updateRoot(time / 1000);
  DigitalBaconUI.update(frame);

  cleanIntersected();

  handleInput();

  intersectObjects(threeManager.controller1);
  intersectObjects(threeManager.controller2);

  threeManager.renderer.render(threeManager.scene, threeManager.camera);

}
