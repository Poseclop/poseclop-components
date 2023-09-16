import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngxCarouselItem]',
})
export class NgxCarouselItemDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
