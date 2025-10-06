import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidateVehiclePage } from './validate-vehicle.page';

describe('ValidateVehiclePage', () => {
  let component: ValidateVehiclePage;
  let fixture: ComponentFixture<ValidateVehiclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateVehiclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
