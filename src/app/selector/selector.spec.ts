import { async } from '@angular/core/testing';
import {ReplaySubject, Subject} from 'rxjs';
import { take, skip } from 'rxjs/operators';
import { ListboxSelector } from './listbox-selector';
import * as _ from 'lodash';

describe(`ListboxSelector (av-)markerar element enligt följande exempel, givet att
 [abcde] är single select,
 [ABCDE] är multiple/shift-select
`, () => {
  let selector: ListboxSelector;
  const collection = 'abcde';

  beforeEach(async(() => {
    selector = new ListboxSelector();
    selector.multiple = true;
  }));

  const ex = (sequence: string, expectation: string) => {
    it(`${sequence} -> [${expectation}]`, done => {
      const seq = sequence.split('');
      const allButTheLastOne = seq.length - 1;

      selector.selectedIndexes$
        .pipe(skip(allButTheLastOne), take(1))
        .subscribe(selectedIndexes => {
          const bokstäver: string[] = _.pullAt(
            collection.split(''),
            selectedIndexes
          );
          expect(_.join(bokstäver, '')).toEqual(expectation);
          done();
        });
      seq.forEach(s => {
        let index = collection.indexOf(s.toLowerCase());
        if (s === s.toUpperCase()) {
          selector.selectMultiple(index);
        } else {
          selector.select(index);
        }
      });
    });
  };

  describe('toggling', () => {
    ex('b', 'b');
    ex('aa', '');
    ex('bb', '');
    ex('AA', '');
    ex('Aa', '');
  })

  describe('markerat index-intervall är alltid sorterat', () => {
    ex('ba', 'ab');
    ex('aC', 'abc');
    ex('cA', 'abc');
  });

  describe('tidigare markeringar blir kvar när ett nytt intervall markeras', () => {
    ex('acE', 'acde');
  });

  describe('avmarkering av ett intervall inuti ett markerat intervall', () => {
    ex('aEdB', 'ae');
  });

  describe('intervall utgår från näst senaste markering', () => {
    ex('bDEA', 'abcde');
    ex('beA', 'abcde');
  });

  describe('A fungerar som "a" vid första markering', () => {
    ex('A', 'a');
  })

  describe('Den sista förändringen avgör om ett intervall blir markering eller avmarkering', () => {
    ex('AAB', 'ab')
    ex('AaB', 'ab');
    ex('bbB', 'b');
    ex('bbBB', '');
    ex('bbbbB', 'b');
    ex('bDbE', 'bcde');
    ex('bDbC', 'd');
    ex('acdB', 'abcd');
  });

  describe('MultiSelect påbörjar själv en ny markering', () => {
    ex('AC', 'abc');
  });

  describe('i läget multiple=false fungerar MultiSelect som Select', () => {
    beforeEach(() => {
      selector.multiple = false;
    });

    ex('ab', 'b');
    ex('aC', 'c');
  });
});
