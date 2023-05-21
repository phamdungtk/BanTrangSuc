import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhanHoiComponent } from './phan-hoi.component';

describe('PhanHoiComponent', () => {
  let component: PhanHoiComponent;
  let fixture: ComponentFixture<PhanHoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhanHoiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhanHoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
