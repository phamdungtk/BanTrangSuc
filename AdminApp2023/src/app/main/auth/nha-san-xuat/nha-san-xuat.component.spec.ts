import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhaSanXuatComponent } from './nha-san-xuat.component';

describe('NhaSanXuatComponent', () => {
  let component: NhaSanXuatComponent;
  let fixture: ComponentFixture<NhaSanXuatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NhaSanXuatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NhaSanXuatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
