import { motion } from "motion/react";

const wavePaths = [
  {
    amplitude: 500,
    frequency: 1,
    delay: 0,
  },
  {
    amplitude: 300,
    frequency: 1.5,
    delay: 1,
  },
  {
    amplitude: 700,
    frequency: 2,
    delay: 2,
  },
];

const createWavePath = (amplitude, frequency) => {
  const waveLength = 1000; // Total width of the wave
  const controlPointOffset = waveLength / (frequency * 2); // Control point offset based on frequency

  return `
    M 0 500 
    C ${controlPointOffset} ${500 - amplitude}, 
      ${controlPointOffset * 2} ${500 + amplitude}, 
      ${controlPointOffset * 3} 500 
    C ${controlPointOffset * 4} ${500 - amplitude}, 
      ${controlPointOffset * 5} ${500 + amplitude}, 
      ${controlPointOffset * 6} 500
    C ${controlPointOffset * 7} ${500 - amplitude}, 
      ${controlPointOffset * 8} ${500 + amplitude}, 
      ${controlPointOffset * 9} 500
    C ${controlPointOffset * 10} ${500 - amplitude}, 
      ${controlPointOffset * 11} ${500 + amplitude}, 
      ${controlPointOffset * 12} 500
  `;
};

export const AnimatedWave = () => {
  return (
    <div className="absolute inset-0 z-0">
      {wavePaths.map((wave, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            delay: wave.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-full opacity-30"
          >
            <path
              d={createWavePath(wave.amplitude, wave.frequency)}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-cyan-500"
              style={{
                filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))",
              }}
            >
              <animate
                attributeName="d"
                dur="5s"
                repeatCount="indefinite"
                values={`
                  ${createWavePath(wave.amplitude, wave.frequency)};
                  ${createWavePath(wave.amplitude * 1.2, wave.frequency)};
                  ${createWavePath(wave.amplitude, wave.frequency)}
                `}
              />
            </path>
          </svg>
        </motion.div>
      ))}
    </div>
  );
};
