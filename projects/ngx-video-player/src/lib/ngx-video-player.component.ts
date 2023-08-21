import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Subject, debounceTime, merge, throttleTime } from 'rxjs';

export interface ISourceAttributes {
  src: string;
  type: string;
}

function throunceTime<T>(duration: number): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    merge(source.pipe(throttleTime(duration)), source.pipe(debounceTime(duration)))
      .pipe(throttleTime(0, undefined, { leading: true, trailing: false }));
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
        <li class="progress" (mousemove)="onProgressHover($event)">
          <progress #progress value="0" min="0" tabindex="0"
            (click)="setVideoTime($event)"
            (keyup.ArrowRight)="advanceVideoBy(10)"
            (keyup.ArrowLeft)="advanceVideoBy(-10)"
            (focus)="onProgressHover()">
          </progress>
          <div class="thumbnail">
            <div>
              <img [src]="thumbnailSrc" alt="">
            </div>
            <p style="color: white" *ngIf="thumbnailTime">{{ thumbnailTime | time }}</p>
          </div>
        </li>
        <div class="buttons">
          <li><button type="button" (click)="toggleVideoPlayPause()">
            <span *ngIf="video.paused || video.ended; else pauseIcon" class="material-icons">play_arrow</span>
            <ng-template #pauseIcon><span class="material-icons">pause</span></ng-template>
          </button></li>
          <li><button type="button">
            <span class="material-icons">stop</span>
          </button></li>
          <li class="mute"><button type="button" (click)="video.muted = !video.muted">
            <span *ngIf="!video.muted; else muteIcon" class="material-icons">volume_up</span>
            <ng-template #muteIcon><span class="material-icons">volume_off</span></ng-template>
          </button></li>
          <li class="volume-control"><input type="range" min="0" max="1" step="0.1" (input)="onVolumeChange($event)"></li>
          <li class="video-duration"><span>{{video.currentTime | time}} / {{video.duration | time}}</span></li>
          <span style="flex-grow: 1;"></span>
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
      position: relative;
    }

    video {
      display: block;
      width: 100%;
      background: #000;
    }

    .controls {
      position: absolute;
      list-style: none;
      margin: 0;
      box-sizing: border-box;
      bottom: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.1));
      padding: 0 8px 4px 8px;

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
        display: flex;
        align-items: center;
        justify-content: center;

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
      cursor: pointer;
      position: relative;

      &:hover {
        &::before {
          content: var(--thumbnail-src);
          position: absolute;
          top: -100px;
          left: calc(var(--hover-x) - 80px);
          width: 160px;
          height: min-content;
        }

        progress {
          height: 6px;

          &::before {
            content: '';
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: var(--hover-x);
            height: 100%;
            background-color: rgba(0,0,0,0.3);
          }

          &::after {
            content: '';
          }
        }
      }

      progress {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 4px;
        transition: height 0.2s ease-in-out;
        position: relative;
      }


    }

    .progress:hover .thumbnail {
      visibility: visible;
    }

    .thumbnail {
      display: block;
      visibility: hidden;
      position: absolute;
      top: -100px;
      left: calc(var(--hover-x) - 80px);

      img {
        border: 2px solid white;
        display: block;
      }

      p {
        text-align: center;
        margin-top: 4px;
      }
    }

    .video-duration {
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      margin-left: 8px;
    }

    .volume-control {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 0;
      overflow: hidden;
      transition: width 0.2s ease-in-out;

      input {
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
        background: white;
        height: 4px;
        border-radius: 2px;
        width: 80px;

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 6px;
          background: white;
        }
      }
    }

    .mute:hover + .volume-control,
    .volume-control:hover {
      width: 80px;
    }
  `
  ]
})
export class NgxVideoPlayerComponent implements OnInit, OnDestroy {
  //#region INPUTS
  /** The sources for the video */
  @Input() sources: ISourceAttributes[] = [];
  /** The poster that will be used for the video */
  @Input() poster = '';
  //#endregion

  //#region VIEWCHILDREN
  /** The video element */
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('progress') progress!: ElementRef<HTMLProgressElement>;
  //#endregion

  //#region PROPERTIES
  readonly browserSupportsVideo: boolean = !!document.createElement('video').canPlayType;
  readonly fullScreenEnabled: boolean = !!document.fullscreenEnabled;
  //#endregion

  private unsubscribe$ = new Subject<void>();
  private updateThumbnail$ = new Subject<number>()

  public thumbnailSrc?: string;
  public thumbnailTime?: number;

  //#region PUBLIC METHODS

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

  /**
   * Stops the video and resets the time to 0
   */
  stopVideo(): void {
    this.video.nativeElement.pause();
    this.video.nativeElement.currentTime = 0;
    this.progress.nativeElement.value = 0;
  }

  /**
   * Sets the video time based on the progress bar position
   * @param event The mouse event
   */
  setVideoTime(event: MouseEvent): void {
    const rect = this.progress.nativeElement.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    this.video.nativeElement.currentTime = pos * this.video.nativeElement.duration;
  }
  //#endregion

  //#endregion PRIVATE METHODS
  private handleThumbnailDisplay(): void {
    let video: HTMLVideoElement;
    let canvas: HTMLCanvasElement;

    this.updateThumbnail$.pipe(
      throunceTime(100)
    ).subscribe((seconds) => {
      if (!video) {
        video = this.video.nativeElement.cloneNode(true) as HTMLVideoElement;
        const controls = video.children.namedItem('controls');
        console.warn(controls)
        // video.src = this.video.nativeElement.src;
        // video.preload = 'metadata';

        video.addEventListener('seeked', () => {
          canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
          canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
          this.thumbnailSrc = canvas.toDataURL();
        });
      }

      if (!canvas) {
        canvas = document.createElement("canvas");
        const ratio = this.video.nativeElement.videoWidth / this.video.nativeElement.videoHeight;
        canvas.width = 160;
        canvas.height = Math.floor(160 / ratio);
        console.warn(canvas.width, canvas.height);
      }

      video.currentTime = seconds;
    })
  }

  //#endregion

  //#region LIFECYCLE HOOKS
  ngOnInit(): void {
    this.handleThumbnailDisplay();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  //#endregion

  //#region EVENT HANDLERS

  /**
   * Called when the video metadata has been loaded
   */
  onMetadataLoaded(): void {
    this.progress.nativeElement.max = this.video.nativeElement.duration;
  }

  /**
   * Called when the video time has been updated
   */
  onTimeUpdate(): void {
    this.progress.nativeElement.value = this.video.nativeElement.currentTime;
  }

  onVolumeChange(event: Event): void {
    const volume = (event.target as HTMLInputElement).value;
    this.video.nativeElement.volume = Number(volume);
  }

  /**
   * Called when the user hovers over the progress bar
   * @param event The mouse event
   * @returns void
   */
  onProgressHover(event?: MouseEvent): void {
    if (!event) return
    console.warn("WOOT");
    const rect = this.progress.nativeElement.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    this.progress.nativeElement.parentElement?.style.setProperty('--hover-x', `${event.clientX - rect.left}px`);
    this.thumbnailTime = Math.floor(pos * this.video.nativeElement.duration);
    this.updateThumbnail$.next(Math.floor(pos * this.video.nativeElement.duration));
  }

  //#endregion


  setFullScreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.video.nativeElement.requestFullscreen();
    }
  }

  advanceVideoBy(seconds: number): void {
    this.video.nativeElement.currentTime = this.video.nativeElement.currentTime + seconds;
  }


}
