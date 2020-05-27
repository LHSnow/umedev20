export class Spelplan {
  plan: number[][];

  constructor() {
    this.plan = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  kollidera() {
    this.plan = this.plan.map((rad) => kollideraRad(rad));
  }
}

function kollideraRad(rad) {
  let j = 0;
  const resultat = [0, 0, 0, 0];
  for (let i = 0; i < rad.length; i++) {
    let cell = rad[i];
    if (cell === rad[i + 1]) {
      resultat[j++] = cell * 2;
      i++;
    } else {
      resultat[j++] = cell;
    }
  }
  return resultat;
};
