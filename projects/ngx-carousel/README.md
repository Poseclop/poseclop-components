<h1 align="center">Ngx-Carousel</h1>

<div align="center">
  A lightweight angular carousel component.
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

## About
### Main features
- Lightweight, no nonsense carousel component
- Can be set to scroll vertically or horizontally
- Can use the autoplay attribute to scroll automatically

## Getting Started
### Prerequisites
This component is only available for [Angular](https://www.angular.io) projects.
### Installation
1. Install the package
```sh
npm install @Poseclop/ngx-carousel
```
`or`
```sh
yarn add @Poseclop/ngx-carousel
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
    NgxCarouselModule,
    ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
3. Add the component in your application. The carousel will display all the children of the component.
```ts
<ngx-carousel [autoplay]="2000" [scrollDirection]="'horizontal'">
  <ng-template ngxCarouselItem>
    <p>Page 1</p>
  </ng-template>
  <ng-template ngxCarouselItem>
    <p>Page 2</p>
  </ng-template>
  <ng-template ngxCarouselItem>
    <p>Page 3</p>
  </ng-template>
</ngx-video-player>
```
### Usage
#### Inputs
| Input | Type | Default | Description |
| --- | --- | --- | --- |
| autoplay | number | 0 | Time in milliseconds between each scroll. If set to 0, the carousel will not scroll automatically. |
| scrollDirection | string | 'horizontal' | Direction of the scroll. Can be 'horizontal' or 'vertical'. |
| scrollTime | number | 500 | Time in milliseconds for the scroll animation. |
| scrollSensitivity | number | 0.5 | The sensitivity of the scroll. Number between 0 and 1. |

#### Outputs
| Output | Event type | Description |
| --- | --- | --- |
| pageChange | Number | Event emitted when the page changes. |

#### Methods
| Method | Description |
| --- | --- |
| next() | Scroll to the next page. |
| previous() | Scroll to the previous page. |
| goToPage(page: number) | Scroll to the specified page. |
