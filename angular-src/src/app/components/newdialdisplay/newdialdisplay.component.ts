import { Component, OnInit, NgZone } from '@angular/core';

import * as d3 from 'd3';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GraphdataService} from '../../services/graphdata.service';

@Component({
  selector: 'app-newdialdisplay',
  templateUrl: './newdialdisplay.component.html',
  styleUrls: ['./newdialdisplay.component.css']
})
export class NewdialdisplayComponent implements OnInit {

  private width: number;
  private height: number;

  private arc_gas: any;
  private arc_water: any;
  private arc_power: any;
  private label_gas: any;
  private label_water: any;
  private label_power: any;
  private svg: any;
  private arc_group: any;
  private line_group: any;
  private svg_gas : any;
  private svg_water : any;
  private svg_power : any;
  private update_gas_arc : any;
  private update_water_arc : any;
  private update_power_arc : any;

  constructor(private dataService : GraphdataService, private ngZone: NgZone) { 

    this.width = 300;
    this.height = 500;
  }

  ngOnInit() {

    this.initSvg();
    this.drawArcs();
    this.drawLines();

    Observable.interval(10000).subscribe(x => {
      console.log("API call");
      var gas_value = this.dataService.getGasConsumption(); // service method returning random values between 0-99
      var water_value = this.dataService.getGasConsumption(); // service method returning random values between 0-99
     var power_value = this.dataService.getGasConsumption(); // service method returning random values between 0-99


    this.svg_gas
        .transition()
        .duration(750)
        .attrTween("d", (d: any) => {
            var interpolateStart = d3.interpolate(d.startAngle, (2 * Math.PI) );
            var interpolateEnd = d3.interpolate(d.endAngle, ((2 * Math.PI) - (gas_value / 50) * Math.PI));
            return  (t) => {
                
                d.startAngle = interpolateStart(t);
                d.endAngle = interpolateEnd(t);
                return this.update_gas_arc(d);
            };
        });

    this.svg_water
        .transition()
        .duration(750)
        .attrTween("d", (d: any) => {
            var interpolateStart = d3.interpolate(d.startAngle, (2 * Math.PI) );
            var interpolateEnd = d3.interpolate(d.endAngle, ((2 * Math.PI) - (water_value / 50) * Math.PI));
            return  (t) => {
                
                d.startAngle = interpolateStart(t);
                d.endAngle = interpolateEnd(t);
                return this.update_water_arc(d);
            };
        });

    this.svg_power
        .transition()
        .duration(750)
        .attrTween("d", (d: any) => {
            var interpolateStart = d3.interpolate(d.startAngle, (2 * Math.PI) );
            var interpolateEnd = d3.interpolate(d.endAngle, ((2 * Math.PI) - (power_value / 50) * Math.PI));
            return  (t) => {
                
                d.startAngle = interpolateStart(t);
                d.endAngle = interpolateEnd(t);
                return this.update_power_arc(d);
            };
        });
  
   });
  }

  initSvg(){

    this.svg = d3.select("svg")
                  .attr("width",this.width)
                  .attr("height", this.height)
                  .style("background-color", 'white');

    this.arc_group = this.svg.append("g")
                          .attr("transform", "translate(150,100)");

    this.line_group = this.svg.append("g")
    									.attr("transform", "translate(0,0)");

  }

  drawArcs(){

    var gasValue = this.dataService.getGasConsumption();
    var waterValue = this.dataService.getGasConsumption();
    var powerValue = this.dataService.getGasConsumption();


    // these update_*_arc are needed to redraw the arcs with new start and end angles after schedule update(s)

      this.update_gas_arc = this.arc_gas = d3Shape.arc()
                          .innerRadius(60)
                          .outerRadius(70)
                          .cornerRadius(20);

      this.update_water_arc = d3Shape.arc()
                            .innerRadius(45)
                            .outerRadius(55)
                            .cornerRadius(20);

      this.update_power_arc = d3Shape.arc()
                            .innerRadius(30)
                            .outerRadius(40)
                            .cornerRadius(20);

    // these arc_* are used to draw the arcs on fir
    this.arc_gas = d3Shape.arc()
                          .innerRadius(60)
                          .outerRadius(70)
                          .startAngle(2 * Math.PI)
                          .endAngle( (2 * Math.PI) - (gasValue / 50) * Math.PI)
                          .cornerRadius(20);

    this.arc_water = d3Shape.arc()
                            .innerRadius(45)
                            .outerRadius(55)
                            .startAngle(2 * Math.PI)
                            .endAngle( (2 * Math.PI) - (waterValue / 50) * Math.PI)
                            .cornerRadius(20);

    this.arc_power = d3Shape.arc()
                            .innerRadius(30)
                            .outerRadius(40)
                            .startAngle(2 * Math.PI)
                            .endAngle( (2 * Math.PI) - (powerValue / 50) * Math.PI)
                            .cornerRadius(20);

    this.svg_gas = this.arc_group
                          .append("path")
                          .attr("class", "arc_gas")
                          .attr("id", "arc_gas")
                          .datum({
                            endAngle : (2 * Math.PI) - (gasValue / 50) * Math.PI,
                            startAngle: 2 * Math.PI
                          })
                          .attr("d", this.arc_gas);

    this.svg_water = this.arc_group
                              .append("path")
                              .attr("class", "arc_water")
                              .attr("id", "arc_water")
                              .datum({
                                endAngle : (2 * Math.PI) - (waterValue / 50) * Math.PI,
                                startAngle: 2 * Math.PI
                              })
                              .attr("d", this.arc_water);
    

    this.svg_power = this.arc_group
                              .append("path")
                              .attr("id", "arc_power")
                              .attr("class", "arc_power")
                              .datum({
                                endAngle : (2 * Math.PI) - (powerValue / 50) * Math.PI,
                                startAngle: 2 * Math.PI
                              })
                              .attr("d", this.arc_power);
  }

  drawLines(){
    this.label_gas = this.line_group.append("text")
                                    .text("Gas")
                                    .style("fill","grey")
                                    .style("font-size","18px")
                                    .style("font-family","sans-serif")
                                    .attr("x", "20")
                                    .attr("y", "190");

    this.line_group.append("line")
                    .attr("stroke", "grey")
                    .attr("stroke-width", "5")
                    .attr("stroke-linecap", "round")
                    .attr("x1", "20")
                    .attr("y1", "200")
                    .attr("x2", "80")
                    .attr("y2", "200");

    this.label_water = this.line_group.append("text")
                                      .text("Water")
                                      .style("fill","lightblue")
                                      .style("font-size","18px")
                                      .style("font-family","sans-serif")
                                      .attr("x", "20")
                                      .attr("y", "240");
    
    this.line_group.append("line")
                    .attr("stroke", "lightblue")
                    .attr("stroke-width", "5")
                    .attr("stroke-linecap", "round")
                    .attr("x1", "20")
                    .attr("y1", "250")
                    .attr("x2", "80")
                    .attr("y2", "250");

    this.label_power = this.line_group.append("text")
                            .text("Power")
                            .style("fill","orange")
                            .style("font-size","18px")
                            .style("font-family","sans-serif")
                            .attr("x", "20")
                            .attr("y", "290");

    this.line_group.append("line")
                    .attr("stroke", "orange")
                    .attr("stroke-width", "5")
                    .attr("stroke-linecap", "round")
                    .attr("x1", "20")
                    .attr("y1", "300")
                    .attr("x2", "80")
                    .attr("y2", "300");

  
}

}
