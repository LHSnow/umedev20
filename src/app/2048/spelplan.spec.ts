import { Spelplan } from './spelplan';

fdescribe('Spelplan', () => {
  let spelplan: Spelplan;

  beforeEach(() => {
    spelplan = new Spelplan();
  });

  describe(`När två brickor med samma valör kolliderar
            bildar de en ny bricka med summan av de två`, () => {
    it('Ex: 4200< => 4200', () => {
      spelplan.plan[0] = [4, 2, 0, 0];
      spelplan.kollidera();
      expect(spelplan.plan[0]).toEqual([4, 2, 0, 0]);
    });

    it('Ex: 2200< => 4000', () => {
      spelplan.plan[0] = [2, 2, 0, 0];
      spelplan.kollidera();
      expect(spelplan.plan[0]).toEqual([4, 0, 0, 0]);
    });

    it('Ex: 4422< => 8400', () => {
      spelplan.plan[0] = [4, 4, 2, 2];
      spelplan.kollidera();
      expect(spelplan.plan[0]).toEqual([8, 4, 0, 0]);
    });
  });
});
