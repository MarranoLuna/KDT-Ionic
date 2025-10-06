import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KdtForm2Page } from './kdt-form2.page';

describe('KdtForm2Page', () => {
  let component: KdtForm2Page;
  let fixture: ComponentFixture<KdtForm2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KdtForm2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
