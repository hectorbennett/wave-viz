// function genWAVUrl(fun, DUR = 1, NCH = 1, SPS = 44100, BPS = 1) {
//   let size = DUR * NCH * SPS * BPS;
//   let put = (n, l = 4) =>
//     [n << 24, n << 16, n << 8, n]
//       .filter((x, i) => i < l)
//       .map((x) => String.fromCharCode(x >>> 24))
//       .join("");
//   let p = (...a) => a.map((b) => put(...[b].flat())).join("");
//   let data = `RIFF${put(44 + size)}WAVEfmt ${p(
//     16,
//     [1, 2],
//     [NCH, 2],
//     SPS,
//     NCH * BPS * SPS,
//     [NCH * BPS, 2],
//     [BPS * 8, 2]
//   )}data${put(size)}`;

//   for (let i = 0; i < DUR * SPS; i++) {
//     let f = Math.min(Math.max(fun(i / SPS, DUR, SPS), 0), 1);
//     data += put(Math.floor(f * (2 ** (BPS * 8) - 1)), BPS);
//   }

//   return "data:Audio/WAV;base64," + btoa(data);
// }

export function play_tone() {
  //   var WAV = new Audio(tone_generator()); // 5s
  //   WAV.setAttribute("controls", "controls");
  //   document.body.appendChild(WAV);
  //   WAV.play();
}
