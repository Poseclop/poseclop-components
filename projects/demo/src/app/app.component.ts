import { Component } from '@angular/core';
import { NgxVideoPlayerComponent } from 'ngx-video-player';
import { BehaviorSubject } from 'rxjs';

const components = [
  'NgxVideoPlayerComponent'
] as const;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Demo';

  selectedComponent = new BehaviorSubject<null | typeof components[number]>(null);

  constructor() {
  }
}
