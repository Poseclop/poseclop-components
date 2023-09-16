import { TestBed } from '@angular/core/testing';

import { NgxThreeDimensionCarouselService } from './ngx-three-dimension-carousel.service';

describe('NgxThreeDimensionCarouselService', () => {
  let service: NgxThreeDimensionCarouselService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxThreeDimensionCarouselService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
