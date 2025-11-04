import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KdtHistorialPage } from './kdt-historial.page';

describe('KdtHistorialPage', () => {
  let component: KdtHistorialPage;
  let fixture: ComponentFixture<KdtHistorialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KdtHistorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
