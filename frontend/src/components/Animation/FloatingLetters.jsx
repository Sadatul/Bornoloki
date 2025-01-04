import React from "react";
import { FloatingLetter } from "./FloatingLetter";

const letters = [
  { char: "A", x: 15, y: 20 },
  { char: "ক", x: 75, y: 30 },
  { char: "B", x: 25, y: 60 },
  { char: "খ", x: 85, y: 70 },
  { char: "C", x: 45, y: 15 },
  { char: "গ", x: 65, y: 40 },
  { char: "D", x: 35, y: 80 },
  { char: "ঘ", x: 55, y: 25 },
];

export const FloatingLetters = () => {
  return (
    <>
      {letters.map((letter, index) => (
        <FloatingLetter
          key={index}
          x={letter.x}
          y={letter.y}
          delay={index * 0.5}
        >
          {letter.char}
        </FloatingLetter>
      ))}
    </>
  );
};
