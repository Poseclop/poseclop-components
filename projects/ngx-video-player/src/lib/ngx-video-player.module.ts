import { NgModule } from '@angular/core';
import { NgxVideoPlayerComponent } from './ngx-video-player.component';
import { CommonModule } from '@angular/common';
import { TimePipe } from './time.pipe';
import { ChapterPipe } from './chapter.pipe';
import { SortPipe } from './sort.pipe';
import { ClickOutsideDirective } from './click-outside.directive';



@NgModule({
  declarations: [
    NgxVideoPlayerComponent,
    ClickOutsideDirective,
    TimePipe,
    ChapterPipe,
    SortPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NgxVideoPlayerComponent
  ]
})
export class NgxVideoPlayerModule { }
