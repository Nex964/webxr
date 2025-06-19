// Notes
export const STANDARD_MAP = {
  eString2: ["E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5"],
  bString: ["B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"],
  gString: ["G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4"],
  dString: ["D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4"],
  aString: ["A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3"],
  eString: ["E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3"],
}

export const SCALES_MAP = {
  // Major Pentatonic
  C: ["C", "D", "E", "G", "A"],
  "C#": ["C#", "D#", "F", "G#", "A#"],
  D: ["D", "E", "F#", "A", "B"],
  "D#": ["D#", "F", "G", "A#", "C"],
  E: ["E", "F#", "G#", "B", "C#"],
  F: ["F", "G", "A", "C", "D"],
  "F#": ["F#", "G#", "A#", "C#", "D#"],
  G: ["G", "A", "B", "D", "E"],
  "G#": ["G#", "A#", "C", "D#", "F"],
  A: ["A", "B", "C#", "E", "F#"],
  "A#": ["A#", "C", "D", "F", "G"],
  B: ["B", "C#", "D#", "F#", "G#"],

  // Minor Pentatonic
  Cm: ["C", "D#", "F", "G", "A#"],
  "C#m": ["C#", "E", "F#", "G#", "B"],
  Dm: ["D", "F", "G", "A", "C"],
  "D#m": ["D#", "F#", "G#", "A#", "C#"],
  Em: ["E", "G", "A", "B", "D"],
  Fm: ["F", "G#", "A#", "C", "D#"],
  "F#m": ["F#", "A", "B", "C#", "E"],
  Gm: ["G", "A#", "C", "D", "F"],
  "G#m": ["G#", "B", "C#", "D#", "F#"],
  Am: ["A", "C", "D", "E", "G"],
  "A#m": ["A#", "C#", "D#", "F", "G#"],
  Bm: ["B", "D", "E", "F#", "A"],
}


const MAJOR_KEYS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
];

export const HAPPY_BIRTHDAY_NOTES = [
  { note: "G3", duration: 0.5 },
  { note: "G3", duration: 0.5 },
  { note: "A3", duration: 1 },
  { note: "G3", duration: 1 },
  { note: "C4", duration: 1 },
  { note: "B3", duration: 2 },

  { note: "G3", duration: 0.5 },
  { note: "G3", duration: 0.5 },
  { note: "A3", duration: 1 },
  { note: "G3", duration: 1 },
  { note: "D4", duration: 1 },
  { note: "C4", duration: 2 },

  { note: "G3", duration: 0.5 },
  { note: "G3", duration: 0.5 },
  { note: "G4", duration: 1 },   // One octave up for variety
  { note: "E4", duration: 1 },
  { note: "C4", duration: 1 },
  { note: "B3", duration: 1 },
  { note: "A3", duration: 2 },

  { note: "F4", duration: 0.5 },
  { note: "F4", duration: 0.5 },
  { note: "E4", duration: 1 },
  { note: "C4", duration: 1 },
  { note: "D4", duration: 1 },
  { note: "C4", duration: 2 }
];

export const CHORD_SHAPES = {
  // Major chords
  C: [[4, 3], [2, 2], [1, 1]],
  D: [[2, 2], [1, 3], [0, 2]],
  E: [[4, 2], [3, 2], [2, 1]],
  F: [[3, 3], [2, 2], [1, 1], [0, 1], [4, 3], [5, 1]], // simplified barre
  G: [[5, 3], [4, 2], [0, 3]],
  A: [[3, 2], [2, 2], [1, 2]],
  B: [[2, 4], [1, 4], [0, 4], [3, 4], [4, 2], [5, 2]], // barre chord

  // Minor chords
  Cm: [[4, 1], [3, 0], [2, 1]], // simplified
  Dm: [[2, 2], [1, 3], [0, 1]],
  Em: [[4, 2], [3, 2]],
  Fm: [[3, 1], [2, 1], [1, 1], [0, 1], [4, 3], [5, 1]], // simplified barre
  Gm: [[5, 3], [4, 5], [3, 5], [2, 3], [1, 3], [0, 3]], // barre chord
  Am: [[2, 2], [1, 1], [0, 2]],
  Bm: [[2, 4], [1, 3], [0, 2], [3, 4], [4, 2], [5, 2]]  // barre chord
}


const TONAL_NOTE_LIST = [
  'C', 'Cm',
  'C#', 'C#m',
  'D', 'Dm',
  'D#', 'D#m',
  'E', 'Em',
  'F', 'Fm',
  'F#', 'F#m',
  'G', 'Gm',
  'G#', 'G#m',
  'A', 'Am',
  'A#', 'A#m',
  'B', 'Bm'
];

export const UI_DATA = [
  {
    type: 'tabs',
    options: [
      {
        name: 'Chords',
        options: [
          { type: 'text', text: 'Press a chord to show it on the fretboard' },
          {
            type: 'group',
            options: [
              {
                type: 'button',
                text: 'C',
                action: 'c_chord',
              },
              {
                type: 'button',
                text: 'D',
                action: 'd_chord',
              },
              {
                type: 'button',
                text: 'E',
                action: 'e_chord',
              },
              {
                type: 'button',
                text: 'F',
                action: 'f_chord',
              },
              {
                type: 'button',
                text: 'G',
                action: 'g_chord',
              },
              {
                type: 'button',
                text: 'A',
                action: 'a_chord',
              },
            ]
          },
          {
            type: 'group',
            options: [
              {
                type: 'button',
                text: 'B',
                action: 'b_chord'
              }
            ]
          }
        ]
      }
      , {
        name: 'Scales',
        selected: true,
        options: [
          // {
          //   type: 'group', options: [
          //     { type: 'text', text: 'Tonality:' },
          //     {
          //       type: 'radio',
          //       options: [
          //         {
          //           text: 'Major',
          //           name: 'tonality',
          //           action: 'major_scale'
          //         },
          //         {
          //           text: 'Minor',
          //           name: 'tonality',
          //           action: 'minor_scale'
          //         }
          //       ]
          //     }
          //   ]
          // },

          {
            type: 'group', options: [
              { type: 'text', text: 'Scale:' },
              {
                type: 'select', name: 'scale', options: TONAL_NOTE_LIST
              }
            ]
          },
          {
            type: 'group', options: [
              { type: 'text', text: 'Pattern:' },
              { type: 'select', name: 'pattern1', options: TONAL_NOTE_LIST, width: 0.2 },
              { type: 'select', name: 'pattern2', options: TONAL_NOTE_LIST, width: 0.2 },
              { type: 'select', name: 'pattern3', options: TONAL_NOTE_LIST, width: 0.2 },
              { type: 'select', name: 'pattern4', options: TONAL_NOTE_LIST, width: 0.2 }
            ]
          },
          {
            type: 'group', options: [
              { type: 'text', text: 'BPM :' },
              { type: 'range', name: 'bpm', },
              { type: 'button', text: 'Play Progression', action: 'play_progression' },
            ]
          }
        ]
      }]
  }
]