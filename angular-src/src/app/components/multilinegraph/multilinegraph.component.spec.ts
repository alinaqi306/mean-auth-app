/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MultilinegraphComponent } from './multilinegraph.component';

describe('MultilinegraphComponent', () => {
  let component: MultilinegraphComponent;
  let fixture: ComponentFixture<MultilinegraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultilinegraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilinegraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
