import { Component } from '@angular/core';

@Component({
  selector: 'ngx-video-player',
  template: `
    <figure>
      <video controls preload="metadata" poster="assets/img/poster.jpg"></video>
    </figure>
  `,
  styles: [
  ]
})
export class NgxVideoPlayerComponent {

}
