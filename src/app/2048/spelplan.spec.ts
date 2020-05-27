import { Spelplan } from './spelplan';

describe('Spelplan', () => {
  let spelplan: Spelplan;

  beforeEach(() => {
    spelplan = new Spelplan();
  });

  describe(`När två brickor med samma valör kolliderar
            bildar de en ny bricka med summan av de två`, () => {
    function ex(input, expectation) {
      it(`${input}< => ${expectation}`, () => {
        spelplan.plan[0] = input;
        spelplan.kollidera();
        expect(spelplan.plan[0]).toEqual(expectation);
      });
    }

    ex([4, 2, 0, 0], [4, 2, 0, 0]);
    ex([2, 2, 0, 0], [4, 0, 0, 0]);
    ex([4, 4, 2, 2], [8, 4, 0, 0]);


  });
});
