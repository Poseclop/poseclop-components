import { AfterContentInit, Component, ContentChildren, ElementRef, QueryList } from '@angular/core';
import { Ngx3dCarouselItemDirective } from './ngx-carousel-item.directive';

@Component({
    selector: 'ngx-three-dimension-carousel',
    template: `
    <div class="carousel">
      <ng-content></ng-content>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      position: relative;
      perspective: 1000px;
    }

    .carousel {
      width: 100%;
      height: 100%;
      position: absolute;
      transform-style: preserve-3d;
    }

    .carousel ::ng-deep .carousel__cell {
      position: absolute;
      left: 10px;
      top: 10px;
      width: 190px;
      height: 120px;
    }

    .carousel ::ng-deep .carousel__cell > * {
      width: 100%;
      height: 100%;
    }
  `],
    standalone: false
})
export class NgxThreeDimensionCarouselComponent implements AfterContentInit {
  @ContentChildren(Ngx3dCarouselItemDirective) items!: QueryList<Ngx3dCarouselItemDirective>;

  constructor(private elementRef: ElementRef) { }

  ngAfterContentInit(): void {
    const width = this.elementRef.nativeElement.offsetWidth;
    const height = this.elementRef.nativeElement.offsetHeight;

    this.items.forEach((item, index) => {
      item.elementRef.nativeElement.classList.add('carousel__cell');
      item.elementRef.nativeElement.style.transform = `translate3d(${index * 200}%, ${index}%, 0%)`;
    });
  }
}
