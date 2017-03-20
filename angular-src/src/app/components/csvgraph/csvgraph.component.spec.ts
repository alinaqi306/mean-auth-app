/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CsvgraphComponent } from './csvgraph.component';

describe('CsvgraphComponent', () => {
  let component: CsvgraphComponent;
  let fixture: ComponentFixture<CsvgraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvgraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
