import { NgModule } from '@angular/core';
import { NgxVideoPlayerComponent } from './ngx-video-player.component';
import { TimePipe } from './time.pipe';
import { ChapterPipe } from './chapter.pipe';
import { SortPipe } from './sort.pipe';
import { ClickOutsideDirective } from './click-outside.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    NgxVideoPlayerComponent,
    ClickOutsideDirective,
    TimePipe,
    ChapterPipe,
    SortPipe,
  ],
  imports: [CommonModule],
  exports: [NgxVideoPlayerComponent],
})
export class NgxVideoPlayerModule {}
