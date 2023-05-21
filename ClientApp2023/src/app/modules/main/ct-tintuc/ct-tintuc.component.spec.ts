import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtTintucComponent } from './ct-tintuc.component';

describe('CtTintucComponent', () => {
  let component: CtTintucComponent;
  let fixture: ComponentFixture<CtTintucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtTintucComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtTintucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
