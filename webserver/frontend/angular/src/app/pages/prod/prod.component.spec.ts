import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdComponent } from './prod.component';

describe('ProdComponent', () => {
  let component: ProdComponent;
  let fixture: ComponentFixture<ProdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProdComponent]
    });
    fixture = TestBed.createComponent(ProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
