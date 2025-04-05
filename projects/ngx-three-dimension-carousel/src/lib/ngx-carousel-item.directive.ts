import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[ngx3dCarouselItem]',
    standalone: false
})
export class Ngx3dCarouselItemDirective {
  constructor(
    public elementRef: ElementRef<any>
  ) {}
}
