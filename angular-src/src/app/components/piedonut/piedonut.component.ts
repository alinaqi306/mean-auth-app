import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GraphdataService} from '../../services/graphdata.service';




@Component({
  selector: 'app-piedonut',
  templateUrl: './piedonut.component.html',
  styleUrls: ['./piedonut.component.css']
})
export class PiedonutComponent implements OnInit {

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private radius: number;

  private arc: any;
  private labelArc: any;
  private pie: any;
  private color: any;
  private svg: any;
  private dummyData = [12];
  private svgs = ["svg1", "svg2", "svg3",];
  private logos = ["image1" , "image2", "image3"];

  constructor(private router: Router, private dataService : GraphdataService) { 
    this.width = 270 ;
    this.height = 200 ;
    this.radius = Math.min(this.width, this.height) / 2;
  }

  ngOnInit() {
    this.initSvg()
    
   this.svgs.forEach((entry, index) => {

      this.drawPie(entry, index);
   })
   Observable.interval(5000).subscribe(x => {
      console.log("API call");
      var value = this.dataService.getGasConsumption();
      d3.select("#svg1text").text(value);
   });
    
  }

  initSvg(){

    this.arc = d3Shape.arc()
                      .outerRadius(this.radius - 10)
                      .innerRadius(this.radius- 30);
    this.pie = d3.pie()
                 .sort(null)

  }

  drawPie(svgId, index){
    var svg = d3.select("#"+svgId)
                .append("g")
                 .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
    
    svg.append("circle")
    .attr("cx",0)
    .attr("cy", 0)
    .attr("r",this.radius-30)
    .style("fill","url(#"+this.logos[index]+")");


    svg.selectAll("path")
    .data(this.pie(this.dummyData))
    .enter()
      .append("path")
      .attr("fill", "#4286f4")
      .attr("d", this.arc);

    svg.append('text')
            .datum(0)
            .text("Text")
            .attr("id", svgId+"text")
            .attr("class",'middleText')
            .attr('text-anchor','middle')
            .attr( 'dy','0.35em')
            .style("fill",'#ec1561')
            .style('font-size','40px')
            .style("cursor","pointer")
            .on("click", () => {
              this.router.navigate(['login']);
            });
    
  }

}
