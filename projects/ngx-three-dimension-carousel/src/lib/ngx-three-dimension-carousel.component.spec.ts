import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxThreeDimensionCarouselComponent } from './ngx-three-dimension-carousel.component';

describe('NgxThreeDimensionCarouselComponent', () => {
  let component: NgxThreeDimensionCarouselComponent;
  let fixture: ComponentFixture<NgxThreeDimensionCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxThreeDimensionCarouselComponent]
    });
    fixture = TestBed.createComponent(NgxThreeDimensionCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
