export function quipFor(opts: {
  kicked: string[];
  side: number;
  cross: number;
  you: string;
  da: number;
}) {
  if (opts.kicked.length) {
    return `${opts.kicked.join(" and ")} just got squared out. The lightest seat always leaves.`;
  }
  if (opts.side >= 12) {
    return "Twelve. The room is full. The next sit throws somebody.";
  }
  const lines = [
    `${opts.you}, you're in. The pool noticed and it still isn't yours.`,
    `Cross term is ${opts.cross}. Add the squares and you miss it.`,
    `That was ${opts.da === 1 ? "one odd tile" : "three at once"}. Odds only know how to make squares.`,
    `Your number went up. Your square went up harder.`,
    `GME is the pair. The seat is the game.`,
    `Keep walking. Twelve is a small room with a rude door.`,
  ];
  return lines[opts.side % lines.length] ?? lines[0];
}
