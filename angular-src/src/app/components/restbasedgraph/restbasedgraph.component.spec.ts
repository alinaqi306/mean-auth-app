/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RestbasedgraphComponent } from './restbasedgraph.component';

describe('RestbasedgraphComponent', () => {
  let component: RestbasedgraphComponent;
  let fixture: ComponentFixture<RestbasedgraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestbasedgraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestbasedgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
