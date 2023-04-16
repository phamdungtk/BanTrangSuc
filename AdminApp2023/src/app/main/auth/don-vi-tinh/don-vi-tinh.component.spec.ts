import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonViTinhComponent } from './don-vi-tinh.component';

describe('DonViTinhComponent', () => {
  let component: DonViTinhComponent;
  let fixture: ComponentFixture<DonViTinhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonViTinhComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonViTinhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
