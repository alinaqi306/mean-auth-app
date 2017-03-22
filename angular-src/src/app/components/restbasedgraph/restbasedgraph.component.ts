import { Component, OnInit } from '@angular/core';
import { GraphdataService } from '../../services/graphdata.service';
import * as d3 from 'd3';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";

@Component({
  selector: 'app-restbasedgraph',
  templateUrl: './restbasedgraph.component.html',
  styleUrls: ['./restbasedgraph.component.css']
})
export class RestbasedgraphComponent implements OnInit {

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private data: Array<Object>;

  constructor(private graphDataService: GraphdataService ) {

    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
   
   }

  ngOnInit() {
    this.getData();
    this.initSvg()
    
    console.log(this.data);
  }

  initSvg() {
    this.svg = d3.select("svg")
                 .append("g")
                 .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  getData(){
 
    this.graphDataService.getGraphData().subscribe(data => {
      this.data = data;
 
    },
    err => {        //observable can return error
      console.log(err);
      return false;
    });
    
    
  }
}
