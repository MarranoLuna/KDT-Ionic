import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DePruebaPage } from './de-prueba.page';

describe('DePruebaPage', () => {
  let component: DePruebaPage;
  let fixture: ComponentFixture<DePruebaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DePruebaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
