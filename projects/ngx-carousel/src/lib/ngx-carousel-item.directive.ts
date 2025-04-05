import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[ngxCarouselItem]',
    standalone: false
})
export class NgxCarouselItemDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
