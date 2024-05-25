import { NgModule } from '@angular/core';
import { NgxThreeDimensionCarouselComponent } from './ngx-three-dimension-carousel.component';
import { CommonModule } from '@angular/common';
import { Ngx3dCarouselItemDirective } from './ngx-carousel-item.directive';



@NgModule({
  declarations: [
    NgxThreeDimensionCarouselComponent,
    Ngx3dCarouselItemDirective
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NgxThreeDimensionCarouselComponent,
    Ngx3dCarouselItemDirective
  ]
})
export class NgxThreeDimensionCarouselModule { }
