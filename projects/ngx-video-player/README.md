<h1 align="center">Ngx-Video-Player</h1>

<div align="center">
  A lightweight angular video player component that try to emulate youtube video player.
</div>

<details open="open">
<summary>Table of Contents</summary>

- [About](#about)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)
- [Acknowledgements](#acknowledgements)
</details>

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## About
<img align="center" src="https://github.com/Poseclop/poseclop-components/blob/master/projects/ngx-video-player/img/player-ui.png"></img>

### Main features
- Lightweight, no nonsense video player for angular
- Emulate the youtube video progress bar. Can show chapters and a thumbnail for hovered video time.
- Interface intended to stick to the HTML5 video element (as much as possible, suggestions are welcome and check roadmap for features to come)
- Manage the video displayed using [sources] input
- Manage the subtitles using [tracks] input
- Use the [chapters] input to display current media chapter

## Getting Started
### Prerequisites
This component is only available for [Angular](https://www.angular.io) projects.
### Installation
1. Install the package
```sh
npm install @Poseclop/ngx-video-player
```
`or`
```sh
yarn add @Poseclop/ngx-video-player
```
2. Import the module in your application
```ts
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxVideoPlayerModule,
    ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
3. Add the component in your application
```ts
<ngx-video-player
  controls
  [poster]="/assets/img/myPoster"
  [chapters]="[
    {
      title: 'Chapter 1';
      time: 0
    },
    {
      title: 'Chapter 2';
      time: 10
    }]"
  [tracks]="[{
      src: 'assets/vtt/TOS-en.vtt',
      kind: 'subtitles',
      srclang: 'en',
      label: 'English'
    },
    {
      src: 'assets/vtt/TOS-fr-Goofy.vtt',
      kind: 'subtitles',
      srclang: 'fr',
      label: 'Français'
    }]"
  [sources]="[
    {
      src: 'assets/video/tears-of-steel-battle-clip-medium.mp4',
      type: 'video/mp4',
    },
    {
      src: 'assets/video/tears-of-steel-battle-clip-medium.ogg',
      type: 'video/ogg',
    },
  ]">
</ngx-video-player>
```
### Usage
#### Inputs
| Input | Type | Default | Description |
| --- | --- | --- | --- |
| controls | boolean | true | Display the video controls |
| posterSrc | string | null | URL of the poster image |
| sources | ISourceAttribute[] | null | List of video sources |
| tracks | ITrackAttribute[] | null | List of video tracks |
| chapters | IChapterAttribute[] | null | List of video chapters |
| autoplay | boolean | false | Autoplay the video |
| loop | boolean | false | Loop the video |
| width | string | '100%' | Width of the video |
| height | string | '100%' | Height of the video |
| crossOrigin | string | null | Cross origin of the video |
| volume | number | 1 | Volume of the video |

#### Attributes
| Attribute | Type | Description |
| --- | --- | --- |
| video | HTMLVideoElement | HTML5 video element |

#### Methods
| Method | Description |
| --- | --- |
| toogleVideoPlayPause() | Toogle the video play/pause |
| stopVideo() | Stop the video |
| setVideoTime(seconds: number) | Set the video time |
| setVideoVolume(volume: number) | Set the video volume |
| selectSubtitles(track: ITrackAttributes) | Select the subtitles track |
| toggleFullScreen() | Toogle the video fullscreen |
| advanceVideoBy(seconds: number) | Advance the video by the given seconds |

#### Interfaces
##### ISourceAttribute
| Attribute | Type | Description |
| --- | --- | --- |
| src | string | URL of the video source |
| type | string | Type of the video source |

##### ITrackAttribute
| Attribute | Type | Description |
| --- | --- | --- |
| src | string | URL of the track |
| kind | string | Kind of the track |
| srclang | string | Language of the track |
| label | string | Label of the track |

##### IChapterAttribute
| Attribute | Type | Description |
| --- | --- | --- |
| title | string | Title of the chapter |
| time | number | Start time of the chapter in seconds |

## Roadmap
This component is still in development and some features are still missing. Here is a list of features to come:
- [ ] Add more tests
- [ ] Add more documentation
- [ ] Add more examples
- [ ] Use the base video attributes to make the interface seemless with a <video> html5 tag
- [ ] Optimize performance
- [ ] Add more features:
  - [ ] Add more controls
  - [ ] Add more events
  - [ ] Add more attributes
  - [ ] Add more methods
  - [ ] Add more inputs
  - [ ] Add more outputs
  - [ ] Add skip by X seconds buttons
  - [ ] Handle the autoSwitch to fullScreen (possible?)

## Contributing
So yeah all help is welcome. I'm kind of new to the dev community but I'll do my best to ensure new contrivutions are dully treated and hilighted.
Best way to test your contrivutions is to run `ng serve` to launch the default project (demo application) and 'ng build <library-name> --watch' to build the library on the fly.

## Build
Run `ng build ngx-video-player` to build the project. The build artifacts will be stored in the `dist/` directory.
## Running unit tests

Run `ng test ngx-video-player` to execute the unit tests via [Karma](https://karma-runner.github.io).
