import { NgModule } from '@angular/core';
import { NgxVideoPlayerComponent } from './ngx-video-player.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    NgxVideoPlayerComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NgxVideoPlayerComponent
  ]
})
export class NgxVideoPlayerModule { }
