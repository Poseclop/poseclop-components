import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IChapterAttribute, ISourceAttribute, ITrackAttribute } from 'ngx-video-player';


const components = [
  'NgxVideoPlayerComponent',
  'NgxCarouselComponent',
  'NgxThreeDimensionCarouselComponent'
] as const;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedVideo = 0;
  sources: ISourceAttribute[][] = [[
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
  ],[
    {
      src: 'assets/video/sintel-short.mp4',
      type: 'video/mp4',
    },
    {
      src: 'assets/video/sintel-short.webm',
      type: 'video/webm',
    }
  ]];
  tracks: ITrackAttribute[][] = [[],[
    {
      src: 'assets/vtt/sintel-en.vtt',
      kind: 'subtitles',
      srclang: 'en',
      label: 'English'
    },
    {
      src: 'assets/vtt/sintel-de.vtt',
      kind: 'subtitles',
      srclang: 'de',
      label: 'Deutsch'
    },
    {
      src: 'assets/vtt/sintel-es.vtt',
      kind: 'subtitles',
      srclang: 'es',
      label: 'Español'
    }
  ]]
  chapters: IChapterAttribute[][] = [[
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
  ],[
    {
      title: 'Chapter 1A',
      time: 0,
    },
    {
      title: 'Chapter 2A',
      time: 50
    },
    {
      title: 'Chapter 3A',
      time: 110
    }
  ]]
  posters = ['assets/img/poster.jpg', 'assets/img/Sintel-Movie-1.jpg'];

  selectedComponent = new BehaviorSubject<null | typeof components[number]>('NgxThreeDimensionCarouselComponent');

}
