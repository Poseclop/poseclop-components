<h1 align="center">Ngx-Video-Player</h1>

<div align="center">
  An angular video player component.
</div>

<details open="open">
<summary>Table of Contents</summary>

- [About](#about)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)
- [Acknowledgements](#acknowledgements)
</details>

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## About
<img align="center" src="./img/player-ui.png"></img>

### Main features
- Lightweight ??
- Default controls managing all interactions with the video
- Thumbnail on the video progress, that shows a snapshot, time and chapter for pointed position
- Expose all video attributes
- Expose all video events through event emitters
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
  [chapters]="{ title: 'Chapter 1'; time: 0 }"
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

## Build
Run `ng build ngx-video-player` to build the project. The build artifacts will be stored in the `dist/` directory.
## Running unit tests

Run `ng test ngx-video-player` to execute the unit tests via [Karma](https://karma-runner.github.io).
