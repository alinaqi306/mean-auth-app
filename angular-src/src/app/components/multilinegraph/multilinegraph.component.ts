import { Component, OnInit,NgZone } from '@angular/core';
import { GraphdataService } from '../../services/graphdata.service';
import { FlashMessagesService} from 'angular2-flash-messages';
import { ValidationService } from '../../services/validation.service';
import * as d3 from 'd3';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
//import * as d3Transition from "d3-transition";
import * as type from '../../data/Readings';
import { Filter } from '../../dto/Filter';

@Component({
  selector: 'app-multilinegraph',
  templateUrl: './multilinegraph.component.html',
  styleUrls: ['./multilinegraph.component.css']
})
export class MultilinegraphComponent implements OnInit {

private margin = {top: 20, right: 20, bottom: 70, left: 50};
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
  private loadingMask: boolean;

  private numberOfMonths: number;
  private isDateRangeSelected: boolean;
  private fromDate: Date;
  private toDate: Date;
  private dataNest: any;
  private color : any;
  private filters: Filter = new Filter();

  constructor(private graphDataService: GraphdataService, private ngZone : NgZone,
              private validationService: ValidationService, private flashMessage: FlashMessagesService ) {
    this.numberOfMonths = 1;
    this.isDateRangeSelected = false;
    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.filters.numberOfMonths = this.numberOfMonths;
  }
  ngOnInit() {

    this.getData(this.filters);
    
  }

  initSvg() {
    this.svg = d3.select("svg")
                 .append("g")
                 .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  getData(filters) {
   this.loadingMask = true;
    this.graphDataService.getGraphData(filters).subscribe(data => {
     
      this.data = data;
      this.dataNest = d3.nest()
                      .key(function(d : any) {return d.MeterId;})
                      .entries(this.data);
      this.loadingMask = false;
      this.ngZone.run(() => {
        this.initSvg();
        this.initAxis();
        //this.labelLine(); // add readings on the line graph
        this.drawAxis();
        this.xAxisLable();
        this.yAxisLable();
        this.drawLine();
      })
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
    
    this.xAxis = d3Axis.axisBottom(this.x);
                  /*.tickSizeInner(-this.height)
                  .tickSizeOuter(0)
                  .tickPadding(10);*/
    this.yAxis = d3Axis.axisLeft(this.y);
                  /*.tickSizeInner(-this.width)
                  .tickSizeOuter(0)
                  .tickPadding(10);*/
  }

// gridlines in x axis function
make_x_gridlines() {		
    return d3.axisBottom(this.x)
}

// gridlines in y axis function
make_y_gridlines() {		
    return d3.axisLeft(this.y)
}
  private drawAxis() {

// add the X gridlines
  this.svg.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.make_x_gridlines()
            .tickSizeInner(-this.height)
            .tickSizeOuter(0)
            .tickPadding(10)
      )

    // add the Y gridlines
  this.svg.append("g")			
      .attr("class", "grid")
      .call(this.make_y_gridlines()
          .tickSizeInner(-this.width)
          .tickSizeOuter(0)
          .tickPadding(10)
      )

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

    this.color = d3.scaleOrdinal(d3.schemeCategory10);

   var legendSpace = this.width/this.dataNest.length;

    this.dataNest.forEach((d,i) => {
      this.svg.append("path")
        //.datum(this.data)
        .attr("fill", "none")
        .attr("stroke", () => {
          return d.color = this.color(d.key);
        })
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("id", 'tag'+d.key.replace(/\s+/g, ''))
        .attr("d", this.line(d.values))
        .transition()
        .ease(d3.easeLinear) // trying to add transition
        .delay(function (d, i) { return i * 200; });


        this.svg.append("text")                                    
            .attr("x", (legendSpace/2)+i*legendSpace) // spacing
            .attr("y", this.height + (this.margin.bottom/2)+ 5)     
            .attr("class", "legend")    // style the legend   
            .style("fill", () => { // dynamic colours
                return d.color = this.color(d.key); })
            .on("click", function(){
                // Determine if current line is visible
                var active   = d.active ? false : true,
                newOpacity = active ? 0 : 1;
                // Hide or show the elements based on the ID
                d3.select("#tag"+d.key.replace(/\s+/g, '')) 
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                // Update whether or not the elements are active
                d.active = active;
                })
            .text(d.key);   
    });

    

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

  removeOldGraphElements(){
    this.svg.selectAll("path").remove();
    this.svg.selectAll("g").remove();
    this.svg.selectAll("text").remove();
    this.xAxis = null;
    this.yAxis = null;
    this.x = null;
    this.y = null;
    this.line = null;
    this.data = null;
    this.svg = null;
    this.dataNest = null;
  }

  onFormSubmit(){
    if(!this.isDateRangeSelected){
      this.filters.numberOfMonths = Math.abs(this.numberOfMonths);
      this.filters.fromDate = null;
      this.filters.toDate = null;
      this.removeOldGraphElements(); // this is required otherwise graphs are overlayed for each request  
      this.getData(this.filters);
    }
    else{
      this.filters.fromDate = this.fromDate;
      this.filters.toDate = this.toDate;
      if(this.validationService.dateDiffInDays(new Date(this.fromDate),new Date(this.toDate)) < 0 ){

        this.flashMessage.show('To date should be greater than from date', {cssClass : 'alert-danger', timeout: 4000});
        return false;
      }
      this.removeOldGraphElements(); // this is required otherwise graphs are overlayed for each request 
      this.getData(JSON.stringify(this.filters));
    }
  }
}
