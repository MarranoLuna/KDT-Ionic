import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KdtEarningsPage } from './kdt-earnings.page';

describe('KdtEarningsPage', () => {
  let component: KdtEarningsPage;
  let fixture: ComponentFixture<KdtEarningsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KdtEarningsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
