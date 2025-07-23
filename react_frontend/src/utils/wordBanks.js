export const wordBanks = {
  easy: [
    'the quick brown fox jumps over the lazy dog',
    'coding is fun',
    'practice makes perfect',
    'react is awesome',
    'hello world',
    'javascript rocks'
  ],
  technical: [
    'synchronous asynchronous scope closure',
    'webpack configuration component state',
    'functional programming paradigm',
    'accessibility aria attributes',
    'responsive layout breakpoint',
    'hypertext transfer protocol secure'
  ],
  random: [
    'banana orange elephant cactus pajama',
    'mysterious wizard swiftly vanished',
    'quickly jumping zebras vex fox',
    'type fast and accurately now',
    'the matrix has you',
    'exploring abstractions creatively'
  ]
};

export function getRandomPrompt(category = 'easy') {
  const bank = wordBanks[category] || wordBanks["easy"];
  return bank[Math.floor(Math.random() * bank.length)];
}
