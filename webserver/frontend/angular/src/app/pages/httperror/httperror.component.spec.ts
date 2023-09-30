import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttperrorComponent } from './httperror.component';

describe('HttperrorComponent', () => {
  let component: HttperrorComponent;
  let fixture: ComponentFixture<HttperrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HttperrorComponent]
    });
    fixture = TestBed.createComponent(HttperrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
