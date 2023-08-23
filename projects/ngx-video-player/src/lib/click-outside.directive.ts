import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  @Input() exceptions: ElementRef<HTMLElement>[] = [];
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef<HTMLElement>) { }

  @HostListener('document:click', ['$event.target'])
  public onClick(target: Node | null): void {
    let clickedInside = false;
    clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside && this.exceptions.length > 0) {
      clickedInside = this.exceptions.some(e => e.nativeElement.contains(target));
    }

    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }

}
