import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestSentKdtPage } from './request-sent-kdt.page';

describe('RequestSentKdtPage', () => {
  let component: RequestSentKdtPage;
  let fixture: ComponentFixture<RequestSentKdtPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSentKdtPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
