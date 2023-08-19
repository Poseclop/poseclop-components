import { Component, ElementRef, Input, ViewChild } from '@angular/core';

export interface ISourceAttributes {
  src: string;
  type: string;
}

@Component({
  selector: 'ngx-video-player',
  template: `
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <figure>
      <video #video
        [controls]="!browserSupportsVideo"
        preload="metadata"
        [poster]="poster"
        (loadedmetadata)="onMetadataLoaded()"
        (timeupdate)="onTimeUpdate()">
        <source *ngFor="let source of sources" [src]="source.src" [type]="source.type">
      </video>
      <ul *ngIf="browserSupportsVideo" class="controls">
        <li class="progress">
          <progress #progress value="0" min="0" (click)="setVideoTime($event)">
            <span></span>
          </progress>
        </li>
        <div class="buttons">
          <li><button type="button" (click)="toggleVideoPlayPause()">
            <span *ngIf="video.paused || video.ended; else pauseIcon" class="material-icons">play_arrow</span>
            <ng-template #pauseIcon><span class="material-icons">pause</span></ng-template>
          </button></li>
          <li><button type="button">
            <span class="material-icons">stop</span>
          </button></li>
          <li><button type="button" (click)="video.muted = !video.muted">
            <span *ngIf="!video.muted; else muteIcon" class="material-icons">volume_up</span>
            <ng-template #muteIcon><span class="material-icons">volume_off</span></ng-template>
          </button></li>
          <span style="flex-grow: 1;"></span>
          <li><button type="button">Vol+</button></li>
          <li><button type="button">Vol-</button></li>
          <li><button *ngIf="fullScreenEnabled" type="button" (click)="setFullScreen()"><span class="material-icons">fullscreen</span></button></li>
        </div>
      </ul>
    </figure>
  `,
  styles: [`
    :host {
      display: block;
    }

    figure {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      position: relative;
    }

    video {
      width: 100%;
      height: 100%;
      background: #000;
    }

    .controls {
      list-style: none;
      margin: 0;
      padding: 4px;
      box-sizing: border-box;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.1));

      .buttons {
        display: flex;
      }

      button {
        border: none;
        background: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
        width: 36px;
        height: 36px;
        border-radius: 50%;

        &:focus,
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }

      & ::ng-deep .material-icons {
        color: rgba(255, 255, 255, 1);
        font-size: 20px;
      }
    }

    .progress {
      margin-bottom: 4px;

      &:hover progress {
        height: 10px;
      }

      progress {
        width: 100%;
        height: 6px;
        cursor: pointer;
        transition: height 0.2s ease-in-out;
      }
    }

  `
  ]
})
export class NgxVideoPlayerComponent {
  // INPUTS

  /** The sources for the video */
  @Input() sources: ISourceAttributes[] = [];
  /** The poster that will be used for the video */
  @Input() poster: string = '';

  // CHILD COMPONENTS

  /** The video element */
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('progress') progress!: ElementRef<HTMLProgressElement>;

  // PROPERTIES
  readonly browserSupportsVideo: boolean = !!document.createElement('video').canPlayType;
  readonly fullScreenEnabled: boolean = !!document.fullscreenEnabled;

  // METHODS

  /**
   * Toggles the video play/pause state
   */
  toggleVideoPlayPause(): void {
    if (this.video.nativeElement.paused || this.video.nativeElement.ended) {
      this.video.nativeElement.play();
    } else {
      this.video.nativeElement.pause();
    }
  }

  stopVideo(): void {
    this.video.nativeElement.pause();
    this.video.nativeElement.currentTime = 0;
    this.progress.nativeElement.value = 0;
  }

  onMetadataLoaded(): void {
    this.progress.nativeElement.max = this.video.nativeElement.duration;
  }

  onTimeUpdate(): void {
    this.progress.nativeElement.value = this.video.nativeElement.currentTime;
  }

  setVideoTime(event: MouseEvent): void {
    const rect = this.progress.nativeElement.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    this.video.nativeElement.currentTime = pos * this.video.nativeElement.duration;
  }

  setFullScreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.video.nativeElement.requestFullscreen();
    }
  }
}
