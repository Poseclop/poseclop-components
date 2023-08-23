import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISourceAttributes } from 'ngx-video-player';


const components = [
  'NgxVideoPlayerComponent'
] as const;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sources: ISourceAttributes[] = [
    {
      src: 'assets/video/tears-of-steel-battle-clip-medium.mp4',
      type: 'video/mp4',
    },
    {
      src: 'assets/video/tears-of-steel-battle-clip-medium.ogg',
      type: 'video/ogg',
    },
    {
      src: 'assets/video/tears-of-steel-battle-clip-medium.webm',
      type: 'video/webm',
    },
  ];
  chapters = [
    {
      title: 'Chapter 1',
      time: 0,
    },
    {
      title: 'Chapter 2',
      time: 30
    },
    {
      title: 'Chapter 3',
      time: 50
    }
  ]
  poster = 'assets/img/poster.jpg';

  selectedComponent = new BehaviorSubject<null | typeof components[number]>('NgxVideoPlayerComponent');

}
