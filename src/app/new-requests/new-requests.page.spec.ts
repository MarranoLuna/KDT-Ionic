import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewRequestsPage } from './new-requests.page';

describe('NewRequestsPage', () => {
  let component: NewRequestsPage;
  let fixture: ComponentFixture<NewRequestsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
