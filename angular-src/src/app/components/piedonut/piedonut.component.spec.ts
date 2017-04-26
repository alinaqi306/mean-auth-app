/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PiedonutComponent } from './piedonut.component';

describe('PiedonutComponent', () => {
  let component: PiedonutComponent;
  let fixture: ComponentFixture<PiedonutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiedonutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiedonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
