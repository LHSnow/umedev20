import { async } from '@angular/core/testing';
import {of, Subject} from 'rxjs';
import {first, pairwise, shareReplay, skip, take} from 'rxjs/operators';
import { ListboxSelector } from './listbox-selector';

describe('ListboxSelector', () => {
  let selector: ListboxSelector;
  const a = 0;
  const b = 1;
  const c = 2;
  const d = 3;
  const e = 4;

  beforeEach(async(() => {
    selector = new ListboxSelector();
    selector.multiple = true;
  }));

  it('Select markerar argumentets option', (done) => {
    selector.selectedIndexes$.pipe(first()).subscribe(selected => {
      expect(selected[0]).toBe(1);
      done();
    });
    selector.select(b);
  });

  it('Select lägger till markering till redan markerade', (done) => {
    selector.selectedIndexes$.pipe(skip(1), first()).subscribe(selected => {
      expect(selected.length).toBe(2);
      expect(selected).toContain(0);
      expect(selected).toContain(1);
      done();
    });
    selector.select(b);
    selector.select(a);
  });

  it('Select togglar redan markerad option', (done) => {
    selector.selectedIndexes$.pipe(skip(1), first()).subscribe(selected => {
      expect(selected.length).toBe(0);
      done();
    });
    selector.select(b);
    selector.select(b);
  });

  it('SelectMultiple markerar ett intervall från senast markerade', (done) => {
    selector.selectedIndexes$.pipe(skip(1), first()).subscribe(selected => {
      expect(selected.length).toBe(3);
      expect(selected).toContain(0);
      expect(selected).toContain(1);
      expect(selected).toContain(2);
      done();
    });
    selector.select(a);
    selector.selectMultiple(c);
  });

  it('SelectMultiple markerar ett intervall från högt index till lågt', (done) => {
    selector.selectedIndexes$.pipe(skip(1), first()).subscribe(selected => {
      expect(selected.length).toBe(3);
      expect(selected).toContain(0);
      expect(selected).toContain(1);
      expect(selected).toContain(2);
      done();
    });
    selector.select(c);
    selector.selectMultiple(a);
  });

  it('SelectMultiple utgår från senast markerade index (dvs ignorerar tidigare markeringar)', (done) => {
    selector.selectedIndexes$.pipe(skip(2), first()).subscribe(selected => {
      expect(selected.length).toBe(4);
      expect(selected).toContain(0);
      expect(selected).not.toContain(1);
      done();
    });

    selector.select(a);
    selector.select(c);
    selector.selectMultiple(e);
  });

  it('SelectMultiple avmarkerar ett intervall från senaste avmarkering', (done) => {
    selector.selectedIndexes$.pipe(skip(3), first()).subscribe(selected => {
      expect(selected).toContain(0);
      expect(selected).toContain(4);
      expect(selected.length).toBe(2, selected);
      done();
    });
    selector.select(a);
    selector.selectMultiple(e);
    selector.select(d);
    selector.selectMultiple(b);
  });

  it('SelectMultiple markerar ett intervall från senaste förändring', (done) => {
    selector.selectedIndexes$.pipe(skip(3), first()).subscribe(selected => {
      expect(selected.length).toBe(4);
      expect(selected).not.toContain(0);
      done();
    });
    selector.select(b);
    selector.selectMultiple(d);
    selector.select(b);
    selector.selectMultiple(e);
  });

  it('SelectMultiple markerar över ett tidigare markerat intervall', (done) => {
    selector.selectedIndexes$.pipe(skip(3), first()).subscribe(selected => {
      expect(selected.length).toBe(5);
      done();
    });
    selector.select(b);
    selector.selectMultiple(d);
    selector.selectMultiple(e);
    selector.selectMultiple(a);
  });

  it('SelectMultiple påbörjar en ny markering om ingen tidigare singelmarkering gjorts', (done) => {
    selector.selectedIndexes$.pipe(skip(1), first()).subscribe(selected => {
      expect(selected.length).toBe(3);
      expect(selected).toContain(0);
      expect(selected).toContain(1);
      expect(selected).toContain(2);
      done();
    });
    selector.selectMultiple(a);
    selector.selectMultiple(c);
  });

  describe('med multiple=false', () => {
    beforeEach(() => {
      selector.multiple = false;
    });

    it('byter select ut markeringen istället för att läggas till (som input type=radio)', (done) => {
      selector.selectedIndexes$.pipe(skip(1), first()).subscribe(selected => {
        expect(selected.length).toBe(1, selected);
        expect(selected).toContain(1);
        done();
      });
      selector.select(a);
      selector.select(b);
    });

    it('fungerar SelectMultiple som select', (done) => {
      selector.selectedIndexes$.pipe(skip(1), first()).subscribe(selected => {
        expect(selected.length).toBe(1, selected);
        expect(selected).toContain(2);
        done();
      });
      selector.select(a);
      selector.selectMultiple(c);
    });
  });


});
