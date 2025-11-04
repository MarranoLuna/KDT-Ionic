import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderMapPage } from './order-map.page';

describe('OrderMapPage', () => {
  let component: OrderMapPage;
  let fixture: ComponentFixture<OrderMapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
