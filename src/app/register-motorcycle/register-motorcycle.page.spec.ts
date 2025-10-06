import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterMotorcyclePage } from './register-motorcycle.page';

describe('RegisterMotorcyclePage', () => {
  let component: RegisterMotorcyclePage;
  let fixture: ComponentFixture<RegisterMotorcyclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMotorcyclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
