import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KdtHomePage } from './kdt-home.page';

describe('KdtHomePage', () => {
  let component: KdtHomePage;
  let fixture: ComponentFixture<KdtHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KdtHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
