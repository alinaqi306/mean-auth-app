import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import * as d3 from 'd3';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";


@Component({
  selector: 'app-csvgraph',
  templateUrl: './csvgraph.component.html',
  styleUrls: ['./csvgraph.component.css']
})
export class CsvgraphComponent implements OnInit {
    private margin = {top: 20, right: 20, bottom: 30, left: 50};
    private x: any;
    private y: any;
    private svg: any;

  constructor(private http: Http) { }

  ngOnInit() {
    this.initSvg();
    this.readData();
  }
  private initSvg() {
    this.svg = d3.select("svg")
                 .append("g")
                 .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  readData(){
    debugger;
    console.log('test');
    this.http.get('data2.csv')
    .subscribe(res => console.log(res.json()));
    //d3.csv('/angular-src/src/app/components/csvgraph/data2.csv', function(err,data){
      //console.log(data);
    //});
    /*d3.csvParse('./data2.csv', function(data){
        /*return {
    year: new Date(+d.Year, 0, 1), // lowercase and convert "Year" to Date
    make: d.Make, // lowercase
    model: d.Model, // lowercase
    length: +d.Length // lowercase and convert "Length" to number
  };
      return {
      
      };

    })*/
  }
}
