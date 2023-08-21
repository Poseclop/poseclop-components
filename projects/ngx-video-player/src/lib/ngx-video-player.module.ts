import { NgModule } from '@angular/core';
import { NgxVideoPlayerComponent } from './ngx-video-player.component';
import { CommonModule } from '@angular/common';
import { TimePipe } from './time.pipe';



@NgModule({
  declarations: [
    NgxVideoPlayerComponent,
    TimePipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NgxVideoPlayerComponent
  ]
})
export class NgxVideoPlayerModule { }
