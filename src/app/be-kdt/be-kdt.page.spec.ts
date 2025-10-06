import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeKDTPage } from './be-kdt.page';

describe('BeKDTPage', () => {
  let component: BeKDTPage;
  let fixture: ComponentFixture<BeKDTPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BeKDTPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
