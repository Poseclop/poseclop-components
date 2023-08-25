/* eslint-disable @angular-eslint/no-output-native */
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, MonoTypeOperatorFunction, Observable, Subject, combineLatest, debounceTime, fromEvent, merge, takeUntil, tap, throttleTime } from 'rxjs';

export interface ISourceAttribute {
  src: string;
  type: string;
}

export interface ITrackAttribute {
  src: string;
  kind: string;
  srclang: string;
  default?: boolean;
  label: string;
}

export interface IChapterAttribute {
  title: string,
  time: number,
  duration?: number
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
export class NgxVideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  //#region INPUTS

  /** The poster that will be used for the video */
  @Input() poster = '';
  /** The chapters for the video */
  @Input() chapters: IChapterAttribute[] = [{ title: '', time: 0 }];
  /** The tracks for the video */
  @Input() tracks: ITrackAttribute[] = [];
  /** The sources for the video */
  @Input() set sources(sources: ISourceAttribute[]) {
    this._videoSources = sources;
    if (this.video) {
      this.video.nativeElement.load();
    }
  }
  @Input() controls: boolean | string = false;
  /** Autoplay the video */
  @Input() autoplay = false;
  // TODO Implement Controlslist attribute
  /** Expose video crossOrigin attribute */
  @Input() crossOrigin?: 'anonymous' | 'use-credentials' | '';
  /** Expose video height attribute */
  @Input() height?: number;
  /** Expose video width attribute */
  @Input() width?: number;
  /** Expose video loop attribute */
  @Input() loop: boolean | string = false;
  /** Use optionally to add a single source to the video */
  @Input() src?: string;
  /** The volume of the video */
  @Input() volume = 0.5;
  //#endregion

  //#region VIEWCHILDREN
  /** The video element */
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  /** The progress bar element */
  @ViewChild('progress') progress!: ElementRef<HTMLElement>;
  /** The figure element (container to video and controls) */
  @ViewChild('figure') figure!: ElementRef<HTMLElement>;
  //#endregion

  //#region PUBLIC PROPERTIES
  /** Does the browser support video */
  readonly browserSupportsVideo: boolean = !!document.createElement('video').canPlayType;
  /** Is fullScreen enabled */
  readonly fullScreenEnabled: boolean = !!document.fullscreenEnabled;
  _videoSources: ISourceAttribute[] = [];
  /** The source for the progress thumbnail */
  thumbnailSrc?: string;
  /** The time at which the progress cursor is currently pointing to */
  thumbnailTime?: number;
  /** The chapter that the progress cursor is currently pointing to */
  thunmnailChapter?: string;
  /** Is the track menu open */
  trackMenuOpen = false;
  /** Is the mouse moving (will be set to false only after specified delay) */
  mouseMoving = false;
  /** Expose the video buffered attribute */
  get buffered(): TimeRanges {
    return this.video.nativeElement.buffered;
  }
  //#endregion

  //#region EVENT EMITTERS
  /** The video ended event */
  @Output() ended = new EventEmitter<Event>();
  /** The video pause event */
  @Output() pause = new EventEmitter<Event>();
  /** The video play event */
  @Output() play = new EventEmitter<Event>();
  /** The video time update event */
  @Output() timeupdate = new EventEmitter<Event>();
  /** The video volume change event */
  @Output() volumechange = new EventEmitter<Event>();
  /** The video waiting event */
  @Output() waiting = new EventEmitter<Event>();
  /** The video error event */
  @Output() error = new EventEmitter<Event>();
  /** The video loaded metadata event */
  @Output() loadedmetadata = new EventEmitter<Event>();
  /** The video loaded data event */
  @Output() loadeddata = new EventEmitter<Event>();
  /** The video can play event */
  @Output() canplay = new EventEmitter<Event>();
  /** The video can play through event */
  @Output() canplaythrough = new EventEmitter<Event>();
  /** The video duration change event */
  @Output() durationchange = new EventEmitter<Event>();
  /** The video rate change event */
  @Output() ratechange = new EventEmitter<Event>();
  /** The video seeked event */
  @Output() seeked = new EventEmitter<Event>();
  /** The video seeking event */
  @Output() seeking = new EventEmitter<Event>();
  /** The video stalled event */
  @Output() stalled = new EventEmitter<Event>();
  /** The video suspend event */
  @Output() suspend = new EventEmitter<Event>();
  /** The video emptied event */
  @Output() emptied = new EventEmitter<Event>();
  /** The video abort event */
  @Output() abort = new EventEmitter<Event>();
  /** The video cue change event */
  @Output() cuechange = new EventEmitter<Event>();
  /** The video enter picture in picture event */
  @Output() enterpictureinpicture = new EventEmitter<Event>();
  /** The video leave picture in picture event */
  @Output() leavepictureinpicture = new EventEmitter<Event>();
  /** The video fullscreen change event */
  @Output() fullscreenchange = new EventEmitter<Event>();
  /** The video fullscreen error event */
  @Output() fullscreenerror = new EventEmitter<Event>();
  //#endregion

  //#region PRIVATE PROPERTIES
  /** The unsubscribe subject emits and complete on destroy */
  private unsubscribe$ = new Subject<void>();
  /** The update Thumbnail subject */
  private updateThumbnail$ = new Subject<number>();
  /** The reset Thumbnail subject */
  private resetThumbnail$ = new BehaviorSubject<boolean>(false);
  //#endregion

  //#region LIFECYCLE HOOKS
  ngOnInit(): void {
    this.handleThumbnailDisplay();
  }

  ngAfterViewInit(): void {
    this.handleMouseMovement();

    if (this.height) {
      this.video.nativeElement.height = this.height;
    }
    if (this.width) {
      this.video.nativeElement.width = this.width;
    }
    if (this.src) {
      this.video.nativeElement.src = this.src;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  //#endregion

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
   * Sets the video time to the specified number of seconds
   * @param seconds The number of seconds to set the video time to
   */
  setVideoTime(seconds: number): void {
    this.video.nativeElement.currentTime = seconds;
  }

  /**
   * Sets the video subtitle track to use if any was selected
   * @param track The track to select
   */
  selectSubtitles(track: ITrackAttribute | null): void {
    for (let i = 0; i< this.video.nativeElement.textTracks.length; i++) {
      if (track === null) {
        this.video.nativeElement.textTracks[i].mode = 'hidden';
      } else if (this.video.nativeElement.textTracks[i].language === track.srclang) {
        this.video.nativeElement.textTracks[i].mode = 'showing';
      } else {
        this.video.nativeElement.textTracks[i].mode = 'hidden';
      }
    }
    this.trackMenuOpen = false;
  }

  /**
   * Toggle the fullScreen mode
   */
  toggleFullScreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.figure.nativeElement.requestFullscreen();
    }
  }

  /**
   * Advances the video by the specified number of seconds
   * @param seconds The number of seconds to advance the video by
   */
  advanceVideoBy(seconds: number): void {
    this.setVideoTime(this.video.nativeElement.currentTime + seconds);
  }
  //#endregion

  //#region PRIVATE METHODS
  /**
   * Handles the display of the progress thumbnail
   */
  private handleThumbnailDisplay(): void {
    let video: HTMLVideoElement;
    let canvas: HTMLCanvasElement;
    let chapters: { title: string, time: number }[];

    combineLatest([this.updateThumbnail$, this.resetThumbnail$]).pipe(
      throunceTime(100),
      takeUntil(this.unsubscribe$),
    ).subscribe(([seconds, resetThumbnail]) => {
      if (!video || resetThumbnail) {
        video = this.video.nativeElement.cloneNode(true) as HTMLVideoElement;
        video.addEventListener('seeked', () => {
          canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
          canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
          this.thumbnailSrc = canvas.toDataURL();
        });
      }

      if (!canvas || resetThumbnail) {
        canvas = document.createElement("canvas");
        const ratio = this.video.nativeElement.videoWidth / this.video.nativeElement.videoHeight;
        canvas.width = 160;
        canvas.height = Math.floor(160 / ratio);
      }

      if (!chapters || resetThumbnail) {
        chapters = this.chapters ? [...this.chapters].sort((a, b) => b.time - a.time) : [];
      }

      this.thunmnailChapter = chapters.find((chapter) => chapter.time <= seconds)?.title;
      this.thumbnailTime = seconds;
      video.currentTime = seconds;

      if (resetThumbnail) {
        this.resetThumbnail$.next(false);
      }
    })
  }

  /**
   * Handles the display of the video controls on mouse movement
   */
  private handleMouseMovement(): void {
    fromEvent(this.figure.nativeElement, 'mousemove').pipe(
      tap(() => {
        this.mouseMoving = true;
      }),
      debounceTime(1500),
      tap(() => {
        this.mouseMoving = false;
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }
  //#endregion


  /**
   * Coerces a data-bound value (typically a string) to a boolean.
   * @param value The value to coerce
   * @returns The coerced value
   */
  _coerceBooleanProperty(value: boolean | string): boolean {
    return value != null && `${value}` !== 'false';
  }

  //#region EVENT HANDLERS
  onVolumeChange(event: Event): void {
    const volume = (event.target as HTMLInputElement).value;
    this.video.nativeElement.volume = Number(volume);
  }

  onMetadataLodaded(event: Event): void {
    this.loadedmetadata.emit(event);
    this.chapters = this.chapters
      .sort((a, b) => a.time - b.time)
      .map((chapter, index) => ({
        ...chapter,
        duration: (this.chapters[index + 1]?.time  || this.video.nativeElement.duration) - chapter.time
      }));
    this.resetThumbnail$.next(true);
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

  /**
   * Sets the video time based on the progress bar position
   * @param event The mouse event
   */
  onProgressBarClick(event: MouseEvent): void {
    const rect = this.progress.nativeElement.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    this.setVideoTime(pos * this.video.nativeElement.duration);
  }
  //#endregion
}
