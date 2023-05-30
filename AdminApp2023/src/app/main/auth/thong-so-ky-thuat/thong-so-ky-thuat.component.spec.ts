import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongSoKyThuatComponent } from './thong-so-ky-thuat.component';

describe('ThongSoKyThuatComponent', () => {
  let component: ThongSoKyThuatComponent;
  let fixture: ComponentFixture<ThongSoKyThuatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongSoKyThuatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThongSoKyThuatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
