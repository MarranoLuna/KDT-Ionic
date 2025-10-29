import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfferListPage } from './offer-list.page';

describe('OfferListPage', () => {
  let component: OfferListPage;
  let fixture: ComponentFixture<OfferListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
