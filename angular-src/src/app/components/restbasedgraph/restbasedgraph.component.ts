import { Component, OnInit } from '@angular/core';
import { GraphdataService } from '../../services/graphdata.service';
import * as d3 from 'd3';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
//import * as d3Transition from "d3-transition";
import * as type from '../../data/Readings';

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
  private xAxis: any;
  private yAxis : any;
  private svg: any;
  //private transition: any;
  private data: Array<type.Reading>;
  private line: d3Shape.Line<[number, number]>;

  constructor(private graphDataService: GraphdataService ) {

    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
   
   }

  ngOnInit() {
    this.getData();
    setTimeout(() => {
      if (this.data != null) {
        console.log(this.data);
        //console.log(Readings);
        this.initSvg();
        this.initAxis();
        this.labelLine(); // add readings on the line graph
        this.drawAxis();
        this.xAxisLable();
        this.yAxisLable();
        this.drawLine();
      } else{
        console.log("Service did not return");
      }
    
    }, 3000);
    
    
    
    //console.log(this.data);
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

  private initAxis() {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(this.data, (d) => new Date(d.LogDate) ))
    this.y.domain(d3Array.extent(this.data, (d) => d.Value ))
    this.xAxis = d3Axis.axisBottom(this.x)
                  .tickSizeInner(-this.height)
                  .tickSizeOuter(0)
                  .tickPadding(10);
    this.yAxis = d3Axis.axisLeft(this.y)
                  .tickSizeInner(-this.width)
                  .tickSizeOuter(0)
                  .tickPadding(10);
  }

  private drawAxis() {

    this.svg.append("g")
          .attr("class", "x axis") 
          .attr("transform", "translate(0," + this.height + ")")
          .call(this.xAxis);

    this.svg.append("g")
          .attr("class", "y axis")
          .call(this.yAxis)
          .append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em");
  }
xAxisLable(){
    this.svg.append("text")             
      .attr("transform",
            "translate(" + (this.width/2) + " ," + 
                           (this.height + this.margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Time");
}

yAxisLable(){
      this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x",0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Value"); 
}

  private drawLine() {
    this.line = d3Shape.line()
                       .x( (d: any) => this.x(new Date(d.LogDate)) )
                       .y( (d: any) => this.y(d.Value) );

    this.svg.append("path")
            .datum(this.data)
            .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", this.line)
      .transition()
      .ease(d3.easeLinear) // trying to add transition
      .delay(function(d,i){ return i * 200;});

  }

  labelLine(){
    // values to appear on line graph also
    this.svg.selectAll("text")
            .datum(this.data)
            .enter()
            .append("text")
            .text(function(d) {return d.Value;})
            .attr("x", function(d) {return this.x(d.LogDate);})
            .attr("y", function(d) {return this.y(d.Value);})
            .style("fill", "black");

  }
}
