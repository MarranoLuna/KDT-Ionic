import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterBicyclePage } from './register-bicycle.page';

describe('RegisterBicyclePage', () => {
  let component: RegisterBicyclePage;
  let fixture: ComponentFixture<RegisterBicyclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterBicyclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
