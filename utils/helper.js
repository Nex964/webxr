import { midiData } from "../midi/midi.js"
import { CHORD_SHAPES } from "./constants.js";

// Browser Functions

export function saveFretboard() {
  const fretboard = xScale + "," + yPosOffset + "," + fretbroadOffset;

  localStorage.setItem("fretboard", fretboard);
}


// ThreeJS Functions

export function findAllByUserData(root, key, value, first = true) {
  const results = [];

  console.log(key, value)

  root.traverse((child) => {
    if (child.userData?.[key] === value) {
      results.push(child);
    }
  });

  if (results.length === 0) return [];

  if (first) {
    const newArray = [];
    newArray.push(results.find(item => item.userData.isNote === true));
    console.log(newArray, results)
    return newArray;
  }
  else {
    return results;
  }
}

export function highlightChord(scene, chordName) {
  getAllNotes(scene).forEach(note => note.material.opacity = 0.1);

  const positions = CHORD_SHAPES[chordName];
  if (!positions) return;

  positions.forEach(([stringIndex, fret]) => {
    const note = findByIndex(scene, stringIndex, fret)?.[0];
    if (note) note.material.opacity = 1;
  });
}

export function findByIndex(root, stringIndex, noteIndex) {
  const results = [];


  root.traverse((child) => {
    if (child.userData?.stringIndex == stringIndex && child.userData?.noteIndex == noteIndex) {
      results.push(child);
    }
  });

  return results;
}

export function findKeys(root, value, first = true) {
  const results = [];

  const hasHash = value.includes("#");

  root.traverse((child) => {
    if (child.userData?.key !== undefined) {
      if (child.userData?.key.includes(value)) {

        if (hasHash && child.userData?.key.includes("#")) {
          results.push(child);
        }
        else if (!hasHash && !child.userData?.key.includes("#")) {
          results.push(child);
        }
      }
    }
  });

  if (results.length === 0) return [];

  if (first) {
    const newArray = [];
    newArray.push(results.find(item => item.userData.isNote === true));
    console.log(newArray, results)
    return newArray;
  }
  else {
    return results;
  }
}

export function getAllNotes(root) {
  const results = [];

  root.traverse((child) => {
    if (child.userData?.isNote === true) {
      results.push(child);
    }
  });

  return results;
}

// GSAP Functions

export function highlightKeys(notes, duration) {
  notes.forEach(note => {
    gsap.to(note.material, {
      opacity: 1,
      duration,
      ease: "power2.inOut"
    });
  });
}

export function unhighlightKeys(notes, duration) {
  notes.forEach(note => {
    gsap.to(note.material, {
      opacity: 0.1,
      duration,
      ease: "power2.inOut"
    });
  });
}

export function anticipateKey(scene, note) {
  findAllByUserData(scene, "key", note.toUpperCase()).forEach(key => {
    gsap.to(key.scale, {
      x: 1.6,
      y: 1.6,
      z: 1.6,   // small push forward (toward guitar body)
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  });
}

export function anticipateGlow(scene, note) {
  findAllByUserData(scene, "key", note.toUpperCase()).forEach(key => {
    gsap.to(key.material.color, {
      r: 0.5,
      g: 0.5,
      b: 1,
      duration: 0.3,
      yoyo: true,
      repeat: 3
    });
  });
}

export function highlightNotes(scene, key, duration = 0.2) {
  findAllByUserData(scene, "key", key.toUpperCase()).forEach(note => {
    gsap.to(note.material, {
      opacity: 1,
      duration,
      ease: "power2.inOut"
    });
  });
}

export function unhighlightNotes(scene, key, duration = 0.1) {
  findAllByUserData(scene, "key", key.toUpperCase()).forEach(note => {
    gsap.to(note.material, {
      opacity: 0.1,
      duration,
      ease: "power2.inOut"
    });
  });
}

// ToneJs Functions

export function loadNotes() {
  const midi = midiData;

  console.log(midi);

  const notes = midi.tracks[0].notes.map(note => ({
    note: note.name,
    time: note.time,
    duration: note.duration,
    velocity: note.velocity
  }));

  return notes;
}

export function withTimingFromBeats(beatNotes, bpm = 120) {
  const beatDuration = 60 / bpm;
  let currentTime = 0;

  return beatNotes.map(({ note, duration }) => {
    const result = {
      note,
      time: currentTime,
      duration: duration * beatDuration
    };
    currentTime += duration * beatDuration;
    return result;
  });
}

// Utility Functions

export function debounce(callback, delay) {
  let timer
  return function() {
    clearTimeout(timer)
    timer = setTimeout(() => {
      callback();
    }, delay)
  }
}