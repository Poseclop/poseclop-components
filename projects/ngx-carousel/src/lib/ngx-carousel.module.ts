import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxCarouselComponent } from './ngx-carousel.component';
import { NgxCarouselItemDirective } from './ngx-carousel-item.directive';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    NgxCarouselComponent,
    NgxCarouselItemDirective
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
  ],
  exports: [
    NgxCarouselComponent,
    NgxCarouselItemDirective
  ]
})
export class NgxCarouselModule { }
