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
  templateUrl: './ngx-video-player.component.html',
  styleUrls: ['./ngx-video-player.component.scss'],
})
export class NgxVideoPlayerComponent implements OnInit, OnDestroy {
  //#region INPUTS
  /** The sources for the video */
  @Input() sources: ISourceAttributes[] = [];
  /** The poster that will be used for the video */
  @Input() poster = '';
  /** The chapters for the video */
  @Input() chapters: { title: string, time: number, duration?: number }[] = [{
    title: '',
    time: 0
  }];

  //#endregion

  //#region VIEWCHILDREN
  /** The video element */
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('progress') progress!: ElementRef<HTMLElement>;
  @ViewChild('figure') figure!: ElementRef<HTMLElement>;
  //#endregion

  //#region PROPERTIES
  readonly browserSupportsVideo: boolean = !!document.createElement('video').canPlayType;
  readonly fullScreenEnabled: boolean = !!document.fullscreenEnabled;
  //#endregion

  private unsubscribe$ = new Subject<void>();
  private updateThumbnail$ = new Subject<number>()

  public thumbnailSrc?: string;
  public thumbnailTime?: number;
  public thunmnailChapter?: string;

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
    let chapters: { title: string, time: number }[];

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
      }

      if (!chapters) {
        chapters = this.chapters ? [...this.chapters].sort((a, b) => b.time - a.time) : [];
      }

      this.thunmnailChapter = chapters.find((chapter) => chapter.time <= seconds)?.title;
      this.thumbnailTime = seconds;
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

  onVolumeChange(event: Event): void {
    const volume = (event.target as HTMLInputElement).value;
    this.video.nativeElement.volume = Number(volume);
  }

  onMetadataLodaded(): void {
    this.chapters = this.chapters
      .sort((a, b) => a.time - b.time)
      .map((chapter, index) => ({
        ...chapter,
        duration: (this.chapters[index + 1]?.time  || this.video.nativeElement.duration) - chapter.time
      }));
  }

  onTimeUpdated(): void {
    // Just need to call the event so that change detection triggers every when time is updated
  }

  /**
   * Called when the user hovers over the progress bar
   * @param event The mouse event
   * @returns void
   */
  onProgressHover(event?: MouseEvent): void {
    if (!event) return
    const rect = this.progress.nativeElement.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    this.progress.nativeElement.parentElement?.style.setProperty('--hover-x', `${event.clientX - rect.left}px`);
    this.updateThumbnail$.next(Math.floor(pos * this.video.nativeElement.duration));
  }

  //#endregion


  setFullScreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.figure.nativeElement.requestFullscreen();
    }
  }

  advanceVideoBy(seconds: number): void {
    this.video.nativeElement.currentTime = this.video.nativeElement.currentTime + seconds;
  }


}
