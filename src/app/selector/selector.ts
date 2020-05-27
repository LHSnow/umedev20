import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export abstract class Selector {
  public selectedIndexes$: Observable<number[]>;
  public multiple = false;

  abstract select(index?: number): void;
  abstract selectMultiple(index?: number): void;
}
