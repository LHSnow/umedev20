import { merge, Observable, of, Subject } from 'rxjs';
import {
  take,
  map,
  scan,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import * as _ from 'lodash';
import { Selector } from './selector';
import { Injectable } from '@angular/core';

export class ListboxSelector implements Selector {
  multiple = false;
  private _touchSingleIndex$$ = new Subject<number | undefined>();
  private _touchMultiIndex$$ = new Subject<number | undefined>();

  constructor() {}

  protected multiTouchedIndex$ = this._touchMultiIndex$$.pipe();
  protected singleTouchedIndex$ = merge(
    this._touchSingleIndex$$.pipe(),
    this._touchMultiIndex$$.pipe(takeUntil(this._touchSingleIndex$$), take(1))
  );
  protected rangeStart$ = this.singleTouchedIndex$;
  protected rangeStop$ = this.multiTouchedIndex$;
  protected touchedIndexRange$: Observable<number[]> = this.rangeStart$.pipe(
    switchMap(() => this.rangeStop$),
    withLatestFrom(this.rangeStart$),
    // skapa en sorterad tupel, som är oberoende av i vilken ordning första och andra option valts
    map(([stop, start]) => [Math.min(start, stop), Math.max(start, stop)]),
    // +1 ger range inklusive sista elementets index
    map(([start, stop]) => _.range(start, stop + 1))
  );
  protected anyTouch$ = merge(
    this.singleTouchedIndex$,
    this.multiTouchedIndex$
  );

  public selectedIndexes$: Observable<number[]> = merge(
    // hantera single-selects som en array med ett element - "same-shapedness"
    this.singleTouchedIndex$.pipe(map(select => [select])),
    this.touchedIndexRange$
  ).pipe(
    withLatestFrom(this.anyTouch$),
    scan(
      (accumulator, [latestRange, latestTouch]) =>
        this.multiple
          ? combine(accumulator, latestRange, latestTouch)
          : latestRange,
      [] // scan seed
    )
  );

  select(index?: number): void {
    this._touchSingleIndex$$.next(index);
  }

  selectMultiple(index?: number): void {
    if (this.multiple) {
      this._touchMultiIndex$$.next(index);
    } else {
      this.select(index);
    }
  }
}

const combine = (
  accumulator: number[],
  latestRange: number[],
  latestTouch: number
) => {
  if (accumulator.includes(latestTouch) && latestRange.includes(latestTouch)) {
    return _.difference(accumulator, latestRange).sort();
  } else {
    return _.union(accumulator, latestRange).sort();
  }
};
