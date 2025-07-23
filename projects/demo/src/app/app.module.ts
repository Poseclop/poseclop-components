import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxCarouselModule } from 'ngx-carousel';
import { NgxThreeDimensionCarouselModule } from 'ngx-three-dimension-carousel';
import { NgxVideoPlayerModule } from 'projects/ngx-video-player/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxVideoPlayerModule,
    NgxCarouselModule,
    NgxThreeDimensionCarouselModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
