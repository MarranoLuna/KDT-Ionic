import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeeListPage } from './see-list.page';

describe('SeeListPage', () => {
  let component: SeeListPage;
  let fixture: ComponentFixture<SeeListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

