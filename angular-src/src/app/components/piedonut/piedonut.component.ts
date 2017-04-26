import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import { Router } from '@angular/router';


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

  constructor(private router: Router) { 
    this.width = 270 ;
    this.height = 200 ;
    this.radius = Math.min(this.width, this.height) / 2;
  }

  ngOnInit() {
    this.initSvg()
    
   this.svgs.forEach((entry) => {

      this.drawPie(entry);
   })
      
  
    
  }

  initSvg(){

    this.arc = d3Shape.arc()
                      .outerRadius(this.radius - 10)
                      .innerRadius(this.radius- 30);
    this.pie = d3.pie()
                 .sort(null)
        

  }

  drawPie(svgId){
    
    var svg = d3.select("#"+svgId)
                 .append("g")
                 .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

    svg.selectAll("path")
    .data(this.pie(this.dummyData))
    .enter()
      .append("path")
      .attr("fill", "#4286f4")
      .attr("d", this.arc);

    svg.append('text')
            .datum(0)
            .text("Text")
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
