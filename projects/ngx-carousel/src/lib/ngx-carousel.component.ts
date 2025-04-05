import { AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, TemplateRef } from '@angular/core';
import { NgxCarouselItemDirective } from './ngx-carousel-item.directive';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BehaviorSubject, Observable, Subject, Subscription, combineLatest, delay, filter, fromEvent, interval, map, startWith, takeUntil, tap, timeInterval } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ngx-carousel',
  template: `
    <ng-container *ngFor="let item of items; let i = index">
      <div class="carousel-item" [@slide]="{value: slideDirection, params: { scrollTime: scrollTime}}" *ngIf="_currentItemIndex$.value === i" [@.disabled]="_animationDisabled">
        <ng-template [ngTemplateOutlet]="currentItem$ | async"></ng-template>
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
        animate('{{scrollTime}}ms ease-in-out')
      ]),
      transition('void => right', [
        style({ transform: 'translateX(-100%)' }),
        animate('{{scrollTime}}ms ease-in-out')
      ]),
      transition('left => void', [
        animate('{{scrollTime}}ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ]),
      transition('right => void', [
        animate('{{scrollTime}}ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ]),
      transition('void => top', [
        style({ transform: 'translateY(100%)' }),
        animate('{{scrollTime}}ms ease-in-out')
      ]),
      transition('void => bottom', [
        style({ transform: 'translateY(-100%)' }),
        animate('{{scrollTime}}ms ease-in-out')
      ]),
      transition('top => void', [
        animate('{{scrollTime}}ms ease-in-out', style({ transform: 'translateY(-100%)' }))
      ]),
      transition('bottom => void', [
        animate('{{scrollTime}}ms ease-in-out', style({ transform: 'translateY(100%)' }))
      ]),
    ]),
  ],
  standalone: false
})
export class NgxCarouselComponent implements OnInit, AfterContentInit, OnDestroy {
  @ContentChildren(NgxCarouselItemDirective) items!: QueryList<NgxCarouselItemDirective>;

  @Input()
  public scrollTime = 500;

  /**
   * The sensitivity of the scroll event to trigger a slide.
   */
  @Input()
  public set scrollSensitivity(value: number) {
    if (value <= 0 || value > 1) {
      throw new Error('scrollSensitivity must be between 0 and 1');
    }
    this._scrollSensitivity = (1 - value) * 1000;
  }

  /**
   * The direction of the carousel.
   */
  @Input()
  public set scrollDirection(value: 'horizontal' | 'vertical') {
    this._scrollDirection = value;
    this.slideDirection = value === 'horizontal' ? 'left' : 'top';
  }

  /**
   * The interval in milliseconds to automatically go to the next item.
   */
  @Input()
  public set autoPlay(value: number) {
    let intervalSub: Subscription | undefined;

    if (intervalSub && !intervalSub.closed) {
      intervalSub.unsubscribe();
    }

    if (value > 0) {
      intervalSub = interval(value).pipe(
        filter(() => !this._animationRunning)
      ).subscribe(() => {
        this.next();
      });
    }
  }

  /**
   * Event emitted when the carousel page changes.
   */
  @Output() pageChange = new EventEmitter<number>();

  /**
   * The sensitivity of the scroll event to trigger a slide.
   */
  private _scrollSensitivity = 500;
  /**
   * Subject that emits when the component is destroyed.
   */
  private _unsubscribeAll = new Subject<void>();
  /**
   * Whether the animation is running.
   */
  private _animationRunning = false;

  /**
   * The direction of the carousel.
   */
  public _scrollDirection: 'horizontal' | 'vertical' = 'horizontal';
  /**
   * Whether the animation is disabled.
   */
  public _animationDisabled = true;
  /**
   * The index of the current item.
   */
  public _currentItemIndex$ = new BehaviorSubject<number>(0);
  /**
   * The current item.
   */
  public currentItem$!: Observable<TemplateRef<unknown>>;
  /**
   * The direction of the slide.
   */
  public slideDirection: 'left' | 'right' | 'top' | 'bottom' = 'left';

  constructor(private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this.handleWheelEvent();
  }

  /**
   * Watch the wheel event and slide the carousel accordingly.
   */
  private handleWheelEvent() {
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
        if (accumulatedDelta > 0) {
          this.next();
        } else {
          this.previous();
        }
        accumulatedDelta = 0;
      }
    });
  }

  ngAfterContentInit(): void {
    this.currentItem$ = combineLatest([
      this.items.changes.pipe(startWith(this.items)),
      this._currentItemIndex$
    ]).pipe(
      map(([items, index]) => items.get(index).templateRef),
      delay(0),
      tap(() => {
        // Enable the animation after the first item has been rendered.
        this._animationDisabled = false;
      })
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   * Go to the next item in the carousel.
   */
  next(): void {
    this.slideDirection = this._scrollDirection === 'horizontal' ? 'left' : 'top';
    const nextIndex = this._currentItemIndex$.value + 1 > this.items.length - 1 ? 0 : this._currentItemIndex$.value + 1;
    this.triggerAnimation(nextIndex);
  }

  /**
   * Go to the previous item in the carousel.
   */
  previous(): void {
    this.slideDirection = this._scrollDirection === 'horizontal' ? 'right' : 'bottom';
    const nextIndex = this._currentItemIndex$.value - 1 < 0 ? this.items.length - 1 : this._currentItemIndex$.value - 1;
    this.triggerAnimation(nextIndex);
  }

  /**
   * Go to the item at the specified index.
   * @param index The index of the item to go to.
   */
  goTo(index: number): void {
    this.slideDirection = index > this._currentItemIndex$.value
      ? this._scrollDirection === 'horizontal' ? 'left' : 'top'
      : this._scrollDirection === 'horizontal' ? 'right' : 'bottom';
    this.triggerAnimation(index);
  }

  /**
   * Trigger the animation to go to the item at the specified index.
   * @param index The index of the item to go to.
   */
  private triggerAnimation(index: number): void {
    // Mark the animation as running to prevent multiple animations at the same time.
    this._animationRunning = true;

    // Set timeout to trigger the animation after slide direction has been updated in change detection cycle.
    setTimeout(() => {
      this._currentItemIndex$.next(index);
    }, 0);

    // Set timeout to mark the animation as not running after the animation has finished.
    setTimeout(() => {
      this._animationRunning = false;
      this.pageChange.emit(index);
    }, this.scrollTime);
  }
}
