import { Component, OnInit } from '@angular/core';

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

  constructor(private dataService : GraphdataService) { 

    this.width = 300;
    this.height = 500;
  }

  ngOnInit() {

    this.initSvg();
    this.drawArcs();
    this.drawLines();
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

    this.arc_gas = d3Shape.arc()
                          .innerRadius(60)
                          .outerRadius(70)
                          .startAngle(2 * Math.PI)
                          .endAngle( (2 * Math.PI) - (gasValue / 50) * Math.PI)
                          .cornerRadius(20);

    this.arc_gas = d3Shape.arc()
                          .innerRadius(60)
                          .outerRadius(70)
                          .startAngle(2 * Math.PI)
                          .endAngle( (2 * Math.PI) - (waterValue / 50) * Math.PI)
                          .cornerRadius(20);

    this.arc_water = d3Shape.arc()
                            .innerRadius(45)
                            .outerRadius(55)
                            .startAngle(2 * Math.PI)
                            .endAngle( (2 * Math.PI) - (powerValue / 50) * Math.PI)
                            .cornerRadius(20);

    this.arc_power = d3Shape.arc()
                            .innerRadius(30)
                            .outerRadius(40)
                            .startAngle(2 * Math.PI)
                            .endAngle( (2 * Math.PI) - (35 / 50) * Math.PI)
                            .cornerRadius(20);

    this.arc_group.append("path")
    .attr("class", "arc_gas")
    .attr("d", this.arc_gas);

    this.arc_group.append("path")
    .attr("class", "arc_water")
    .attr("d", this.arc_water);
    
    this.arc_group.append("path")
    .attr("class", "arc_power")
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