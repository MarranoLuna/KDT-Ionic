import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KdtFormPage } from './kdt-form.page';

describe('KdtFormPage', () => {
  let component: KdtFormPage;
  let fixture: ComponentFixture<KdtFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KdtFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
