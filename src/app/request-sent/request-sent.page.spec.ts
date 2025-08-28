import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestSentPage } from './request-sent.page';

describe('RequestSentPage', () => {
  let component: RequestSentPage;
  let fixture: ComponentFixture<RequestSentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
