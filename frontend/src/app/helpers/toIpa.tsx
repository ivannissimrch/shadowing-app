// ARPABET to IPA conversion map
const arpabetToIpa: Record<string, string> = {
  // Vowels
  aa: "ɑ",
  ae: "æ",
  ah: "ʌ",
  ao: "ɔ",
  aw: "aʊ",
  ax: "ə",
  ay: "aɪ",
  eh: "ɛ",
  er: "ɝ",
  ey: "eɪ",
  ih: "ɪ",
  iy: "i",
  ow: "oʊ",
  oy: "ɔɪ",
  uh: "ʊ",
  uw: "u",
  // Consonants
  b: "b",
  ch: "tʃ",
  d: "d",
  dh: "ð",
  f: "f",
  g: "ɡ",
  hh: "h",
  jh: "dʒ",
  k: "k",
  l: "l",
  m: "m",
  n: "n",
  ng: "ŋ",
  p: "p",
  r: "ɹ",
  s: "s",
  sh: "ʃ",
  t: "t",
  th: "θ",
  v: "v",
  w: "w",
  y: "j",
  z: "z",
  zh: "ʒ",
};

export default function toIpa(arpabet: string): string {
  return arpabetToIpa[arpabet.toLowerCase()] || arpabet;
}
