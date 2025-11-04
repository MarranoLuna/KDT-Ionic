import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KdtVehiclePage } from './kdt-vehicle.page';

describe('KdtVehiclePage', () => {
  let component: KdtVehiclePage;
  let fixture: ComponentFixture<KdtVehiclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KdtVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
