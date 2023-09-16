import { AfterContentInit, Component, ContentChildren, ElementRef, Input, OnDestroy, OnInit, QueryList, TemplateRef } from '@angular/core';
import { NgxCarouselItemDirective } from './ngx-carousel-item.directive';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BehaviorSubject, Observable, Subject, combineLatest, delay, filter, fromEvent, map, startWith, takeUntil, tap, timeInterval } from 'rxjs';

@Component({
  selector: 'ngx-carousel',
  template: `
    <ng-container *ngFor="let item of items; let i = index">
      <div class="carousel-item" [@slide]="slideDirection" *ngIf="_currentItemIndex$.value === i" [@.disabled]="_animationDisabled">
        <ng-container [ngTemplateOutlet]="currentItem$ | async"></ng-container>
      </div>
    </ng-container>

    <div class="page-buttons" [ngClass]="{'vertical': _scrollDirection === 'vertical'}">
      <button class="arrow-button" (click)="previous()">
        <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 0 24 24" width="14px" fill="#fff" [ngStyle]="{'transform': _scrollDirection === 'vertical' ? 'rotate(90deg)' : null}">
          <path d="M0 0h24v24H0V0z" fill="none" opacity=".87"/>
          <path d="M17.51 3.87L15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z"/>
        </svg>
      </button>
      <!-- eslint-disable-next-line @angular-eslint/template/elements-content -->
      <button
        class="page-button"
        *ngFor="let item of items; let i = index"
        (click)="goTo(i)"
        [ngClass]="{'selected': _currentItemIndex$.value === i}">
      </button>
      <button class="arrow-button" (click)="next()">
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="14px" viewBox="0 0 24 24" width="14px" fill="#fff" [ngStyle]="{'transform': _scrollDirection === 'vertical' ? 'rotate(90deg)' : null}">
          <g><path d="M0,0h24v24H0V0z" fill="none"/></g>
          <g><polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12"/></g>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .carousel-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .buttons {
      position: absolute;
      bottom: 0;
    }

    .page-buttons {
      position: absolute;
      bottom: 12px;
      left: 50%;
      display: flex;
      align-items: center;
      gap: 6px;

      &.vertical {
        flex-direction: column;
        bottom: 50%;
        right: 12px;
        left: unset;
        transform: translateY(50%);
      }

      button {
        display: inline-block;
        box-sizing: border-box;
        padding: 0;
        background: none;
        outline: none;
        border: none;
        height: 12px;
        width: 12px;
        line-height: 1em;
        cursor: pointer;
      }

      .arrow-button {
        height: 14px;
        width: 14px;
      }

      .page-button {
        display: inline-block;
        box-sizing: border-box;
        padding: 0;
        border: 2px solid white;
        border-radius: 50%;
        background: white;

        &.selected {
          background-color: grey;
        }
      }
    }`],
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(0)' })),
      state('top', style({ transform: 'translateY(0)' })),
      state('bottom', style({ transform: 'translateY(0)' })),
      transition('void => left', [
        style({ transform: 'translateX(100%)' }),
        animate('0.5s ease-in-out')
      ]),
      transition('void => right', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s ease-in-out')
      ]),
      transition('left => void', [
        animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
      ]),
      transition('right => void', [
        animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
      ]),
      transition('void => top', [
        style({ transform: 'translateY(100%)' }),
        animate('0.5s ease-in-out')
      ]),
      transition('void => bottom', [
        style({ transform: 'translateY(-100%)' }),
        animate('0.5s ease-in-out')
      ]),
      transition('top => void', [
        animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)' }))
      ]),
      transition('bottom => void', [
        animate('0.5s ease-in-out', style({ transform: 'translateY(100%)' }))
      ]),
    ]),
  ],
})
export class NgxCarouselComponent implements OnInit, AfterContentInit, OnDestroy {
  @ContentChildren(NgxCarouselItemDirective) items!: QueryList<NgxCarouselItemDirective>;

  @Input()
  public set scrollSensitivity(value: number) {
    if (value <= 0 || value > 1) {
      throw new Error('scrollSensitivity must be between 0 and 1');
    }
    this._scrollSensitivity = (1 - value) * 1000;
  }

  @Input()
  public set scrollDirection(value: 'horizontal' | 'vertical') {
    this._scrollDirection = value;
    this.slideDirection = value === 'horizontal' ? 'left' : 'top';
  }

  private _scrollSensitivity = 500;
  private _unsubscribeAll = new Subject<void>();
  private _animationRunning = false;

  public _scrollDirection: 'horizontal' | 'vertical' = 'horizontal';
  public _animationDisabled = true;
  public _currentItemIndex$ = new BehaviorSubject<number>(0);

  public currentItem$!: Observable<TemplateRef<unknown>>;
  public slideDirection: 'left' | 'right' | 'top' | 'bottom' = 'left';

  constructor(private _elementRef: ElementRef) { }

  ngOnInit(): void {
    let accumulatedDelta = 0;

    fromEvent(this._elementRef.nativeElement, 'wheel').pipe(
      filter(() => !this._animationRunning),
      timeInterval(),
      takeUntil(this._unsubscribeAll)
    ).subscribe(event => {

      if (event.interval > 1000) {
        accumulatedDelta = 0;
      } else {
        accumulatedDelta += (event.value as WheelEvent).deltaY;
      }

      if (Math.abs(accumulatedDelta) >= this._scrollSensitivity) {
        console.warn(accumulatedDelta);
        if (accumulatedDelta > 0) {
          this.next();
        } else {
          this.previous()
        }
        accumulatedDelta = 0;
      }
    });
  }


  ngAfterContentInit(): void {
    this.currentItem$ = combineLatest([
      (this.items.changes).pipe(startWith(this.items)),
      this._currentItemIndex$
    ]).pipe(
      map(([items, index]) => items.get(index).templateRef),
      delay(0),
      tap(() => {
        this._animationDisabled = false;
      })
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  next(): void {
    this._animationRunning = true;
    this.slideDirection = this._scrollDirection === 'horizontal' ? 'left' : 'top';
    const nextIndex = this._currentItemIndex$.value + 1 > this.items.length - 1 ? 0 : this._currentItemIndex$.value + 1;
    setTimeout(() => {
      this._currentItemIndex$.next(nextIndex);
    }, 0);

    setTimeout(() => {
      this._animationRunning = false;
    }, 500);
  }

  previous(): void {
    this._animationRunning = true;
    this.slideDirection = this._scrollDirection === 'horizontal' ? 'right' : 'bottom';
    setTimeout(() => {
      const nextIndex = this._currentItemIndex$.value - 1 < 0 ? this.items.length - 1 : this._currentItemIndex$.value - 1;
      this._currentItemIndex$.next(nextIndex);
    }, 0);

    setTimeout(() => {
      this._animationRunning = false;
    }, 500);
  }

  goTo(index: number): void {
    this._animationRunning = true;
    this.slideDirection = index > this._currentItemIndex$.value
      ? this._scrollDirection === 'horizontal' ? 'left' : 'top'
      : this.scrollDirection === 'horizontal' ? 'right' : 'bottom';
    setTimeout(() => {
      this._currentItemIndex$.next(index);
    }, 0);

    setTimeout(() => {
      this._animationRunning = false;
    }, 500);
  }
}
