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
import {Observable} from 'rxjs/Rx';

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
  private xScaleBar: any;
  private xAxis: any;
  private yAxis : any;
  private svg: any;
  //private transition: any;
  private data: Array<type.Reading>;
  private line: d3Shape.Line<[number, number]>;
  private loadingMask: boolean;

  // zoom veriables
  private zoom : any;
  private zoomViewPort: any;
  private gX : any;
  private gY : any;
  private path : any;

  private numberOfMonths: number;
  private isDateRangeSelected: boolean;
  private fromDate: Date;
  private toDate: Date;
  private filters: Filter = new Filter();
  private isLineGraph: boolean;
  private toggleBtnLabel: string;
  private weekScale = d3.timeWeek;
  private monthScale = d3.timeMonth;
  private activeScale : any;
  private monthTimeFormat = d3.timeFormat("%b %d");
  private weekTimeFormat = d3.timeFormat("%a %d");
  private yearTimeFormat = d3.timeFormat("%b %Y");
  private dayTimeFormat = d3.timeFormat("%a %I %p");
  private selectedTimeFormat: any;
  private tickSlab: any;
  private tickInterval: any;

  private scheduledUpdateInterval = 1830000; // milisecond equivalent of 30 mins 30 seconds 

  constructor(private graphDataService: GraphdataService, private ngZone : NgZone,
              private validationService: ValidationService, private flashMessage: FlashMessagesService ) {
    this.numberOfMonths = 1;
    this.isDateRangeSelected = false;
    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.filters.numberOfMonths = this.numberOfMonths;
    
    this.isLineGraph = true;
    this.toggleBtnLabel = "Show Bar Graph";
  }
  ngOnInit() {
    //this.loadingMask = true;
    this.activeScale = this.monthScale;
    this.selectedTimeFormat = this.monthTimeFormat;
    // this is set taking in view that initailly we will be showing 30 days data by default
    this.tickInterval = d3.timeDay;
    this.tickSlab = 5;
    this.getData(this.filters);
    Observable.interval(10000).subscribe(x => {
      console.log('API Call');
     
      this.update();
      
   });
    
    
  }

update(){

  this.graphDataService.getScheduledUpdate().subscribe(data => {
    this.data = data;

    if(this.isLineGraph) {
      this.x = d3Scale.scaleTime().range([0, this.width])
                      .domain(d3Array.extent(this.data, (d) => new Date(d.LogDate) ));
      
      this.xAxis = d3Axis.axisBottom(this.x).tickFormat(this.selectedTimeFormat)
                        .ticks(this.tickInterval, this.tickSlab);

       this.svg.select(".line")
            .datum(this.data)
            .attr("d", this.line);
    }
    else{
        this.xScaleBar = d3Scale.scaleTime().rangeRound([0, this.width])
      .domain(d3Array.extent(this.data, (d) => new Date(d.LogDate) ));
      this.xAxis = d3Axis.axisBottom(this.xScaleBar).tickFormat(this.selectedTimeFormat)
                          .ticks(this.tickInterval, this.tickSlab);

      this.svg.selectAll(".bar")
              .remove()
              .exit()
              .data(this.data)
              .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (d:any) => { return this.xScaleBar(new Date(d.LogDate)); })
                .attr("y", (d:any) => { return this.y(d.Value); })
                .attr("width", "7px")
                .attr("height", (d:any) => { return this.height - this.y(d.Value); })
                .append("title")
                .text((d:any) => {
                  return d.Value + " , " + new Date(d.LogDate);
        });
    }
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    
    this.y.domain([0, d3Array.max(this.data, (d) => new Date(d.Value))]);

    
    this.yAxis = d3Axis.axisLeft(this.y);

   
    this.svg.select(".gridx")
            .call(this.make_x_gridlines()
            .tickSizeInner(-this.height)
            .tickSizeOuter(0)
            .tickPadding(10)
            .ticks(this.tickInterval, this.tickSlab)
            .tickFormat(this.selectedTimeFormat)
            );
    this.svg.select(".gridy")
            .call(this.make_y_gridlines()
          .tickSizeInner(-this.width)
          .tickSizeOuter(0)
          .tickPadding(10)
          );
    this.svg.select(".x.axis") // change the x axis
            .call(this.xAxis);
    this.svg.select(".y.axis") // change the y axis
            .call(this.yAxis);
  });
  
}
  initSvg() {
    this.svg = d3.select("svg")
                 .append("g")
                 .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  getData(filters) {
    //this.loadingMask = true;
    this.graphDataService.getGraphData(filters).subscribe(data => {
      
      this.data = data;
      //this.loadingMask = false;
      this.ngZone.run(() => {
        this.initSvg();
        //this.addZoomViewPort();
        this.initAxis();
        //this.labelLine(); // add readings on the line graph
        this.drawAxis();
        this.xAxisLable();
        this.yAxisLable();
        if(this.isLineGraph)
          this.drawLine();
        else
          this.drawBars();
        
      })
    },
    err => {        //observable can return error
      console.log(err);
      return false;
    });
    
    
    
  }


  private initAxis() {
    if(this.isLineGraph){
      this.x = d3Scale.scaleTime().range([0, this.width])
      .domain(d3Array.extent(this.data, (d) => new Date(d.LogDate) ));
      //.nice(this.activeScale);
      this.xAxis = d3Axis.axisBottom(this.x).tickFormat(this.selectedTimeFormat)
                        .ticks(this.tickInterval, this.tickSlab);
                  /*.tickSizeInner(-this.height)
                  .tickSizeOuter(0)
                  .tickPadding(10);*/
      
    }
    else{
      this.xScaleBar = d3Scale.scaleTime().rangeRound([0, this.width])
      .domain(d3Array.extent(this.data, (d) => new Date(d.LogDate) ))
      //.nice(this.activeScale)
      this.xAxis = d3Axis.axisBottom(this.xScaleBar).tickFormat(this.selectedTimeFormat)
                          .ticks(this.tickInterval, this.tickSlab);
                  /*.tickSizeInner(-this.height)
                  .tickSizeOuter(0)
                  .tickPadding(10);*/
    }

    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    
    this.y.domain([0, d3Array.max(this.data, (d) => new Date(d.Value))])

    this.yAxis = d3Axis.axisLeft(this.y);
                  /*.tickSizeInner(-this.width)
                  .tickSizeOuter(0)
                  .tickPadding(10);*/
  }

// gridlines in x axis function
make_x_gridlines() {
  if(this.isLineGraph)		
    return d3.axisBottom(this.x)
  else
    return d3.axisBottom(this.xScaleBar)
}

// gridlines in y axis function
make_y_gridlines() {		
    return d3.axisLeft(this.y)
}

  private drawAxis() {

    // add the X gridlines
 this.svg.append("g")			
      .attr("class", "gridx")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.make_x_gridlines()
            .tickSizeInner(-this.height)
            .tickSizeOuter(0)
            .tickPadding(10)
            .ticks(this.tickInterval, this.tickSlab)
            .tickFormat(this.selectedTimeFormat)
            //.ticks(10)
            
      )

    // add the Y gridlines
  this.svg.append("g")			
      .attr("class", "gridy")
      .call(this.make_y_gridlines()
          .tickSizeInner(-this.width)
          .tickSizeOuter(0)
          .tickPadding(10)
          
      )

    this.gX = this.svg.append("g")
          .attr("class", "x axis") 
          .attr("transform", "translate(0," + this.height + ")")
          .call(this.xAxis);

    this.gY = this.svg.append("g")
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

    this.path = this.svg.append("path")
            .datum(this.data)
            .attr("class","line")
      .attr("d", this.line)
      //.transition()
      //.ease(d3.easeLinear) // trying to add transition
      //.delay(function(d,i){ return i * 200;})
      ;

  }

drawBars(){
  this.svg.selectAll("rect")
    .data(this.data)
    .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d:any) => { return this.xScaleBar(new Date(d.LogDate)); })
      .attr("y", (d:any) => { return this.y(d.Value); })
      .attr("width", "7px")
      .attr("height", (d:any) => { return this.height - this.y(d.Value); })
      .append("title")
        .text((d:any) => {
          return d.Value + " , " + new Date(d.LogDate);
        });

}

  addZoomViewPort(){
    this.zoomViewPort = this.svg.append("rect")
                                .attr("class", "zoom")
                                .attr("width", this.width)
                                .attr("height", this.height)
                                .call(this.zoom)
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

  zoomFunction(){
      // create new scale ojects based on event
      debugger;
    var new_yScale = d3.event.transform.rescaleY(this.y);
    var new_xScale = d3.event.transform.rescaleX(this.x);

    // update axes
    this.gX.call(this.xAxis.scale(new_xScale));
    this.gY.call(this.yAxis.scale(new_yScale));

    this.path.attr("transform", d3.event.transform);
  }

  removeOldGraphElements(){
    this.svg.selectAll("path").remove();
    this.svg.selectAll("g").remove();
    this.svg.selectAll("text").remove();
    this.svg.selectAll("rect").remove();
    this.xAxis = null;
    this.yAxis = null;
    this.x = null;
    this.y = null;
    this.xScaleBar = null;
    this.line = null;
    this.data = null;
    this.svg = null;
    this.gX = null;
    this.gY = null;
    this.path = null;
  }

  onFormSubmit(){
    var dateDiff = this.validationService.dateDiffInDays(new Date(this.fromDate),new Date(this.toDate));
    if(!this.isDateRangeSelected){
      this.filters.numberOfMonths = Math.abs(this.numberOfMonths);
      this.filters.fromDate = null;
      this.filters.toDate = null;
      if(this.filters.numberOfMonths <= 12){
        this.selectedTimeFormat = this.monthTimeFormat;
        this.tickInterval = d3.timeMonth;
        this.tickSlab = 2; 
      }
      else{
        this.selectedTimeFormat = this.yearTimeFormat;
      }
      this.removeOldGraphElements(); // this is required otherwise graphs are overlayed for each request  
      this.getData(this.filters);
    }
    else{
      this.filters.fromDate = this.fromDate;
      this.filters.toDate = this.toDate;
      if(dateDiff < 0 ){

        this.flashMessage.show('To date should be greater than from date', {cssClass : 'alert-danger', timeout: 4000});
        return false;
      }
      if(dateDiff >0 && dateDiff < 1){
        this.selectedTimeFormat = this.dayTimeFormat;
        this.tickInterval = d3.timeHour;
        this.tickSlab = 3;
      }
      else if(dateDiff <= 2 ){
        //this.activeScale = this.weekScale;
        this.selectedTimeFormat = this.dayTimeFormat;
        this.tickInterval = d3.timeHour;
        this.tickSlab = 6;
      }
      else if(dateDiff <= 7 ){
        //this.activeScale = this.weekScale;
        this.selectedTimeFormat = this.weekTimeFormat;
        this.tickInterval = d3.timeDay;
        this.tickSlab = 1;
      }
      else if(dateDiff > 7 && dateDiff <= 15){
        //this.activeScale = this.monthScale;
        this.selectedTimeFormat = this.dayTimeFormat
        this.tickInterval = d3.timeDay;
        this.tickSlab = 3; 
      }
      else if(dateDiff > 15 && dateDiff <= 30){
        //this.activeScale = this.monthScale;
        this.selectedTimeFormat = this.dayTimeFormat
        this.tickInterval = d3.timeDay;
        this.tickSlab = 5; 
      }
      else if(dateDiff > 30 && dateDiff <= 182){
        //this.activeScale = this.monthScale;
        this.selectedTimeFormat = this.monthTimeFormat
        this.tickInterval = d3.timeDay;
        this.tickSlab = 16; 
      }
      else if(dateDiff > 182 && dateDiff <= 365){
        //this.activeScale = this.monthScale;
        this.selectedTimeFormat = this.monthTimeFormat
        this.tickInterval = d3.timeMonth;
        this.tickSlab = 2; 
      }
      else{
        this.selectedTimeFormat = this.yearTimeFormat;
        this.tickInterval = d3.timeMonth;
        this.tickSlab = 2;
      }
      this.removeOldGraphElements(); // this is required otherwise graphs are overlayed for each request 
      this.getData(JSON.stringify(this.filters));
      this.isDateRangeSelected = false;
    }
  }
  
showDateDialog(){
  this.isDateRangeSelected = true;
}

onToggleBtnClick(){
  if (!this.isLineGraph) {
    this.isLineGraph = true;
    this.toggleBtnLabel = "Show Bar Graph";
    this.removeOldGraphElements();
    this.getData(this.filters);
  }
    else{
      this.isLineGraph = false;
      this.toggleBtnLabel = "Show Line Graph";
      this.removeOldGraphElements(); 
      this.getData(this.filters);
    }
  }
}
