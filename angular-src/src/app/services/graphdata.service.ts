import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class GraphdataService {

  constructor(private http : Http) { }

  getGraphData(){
    debugger;
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/graphdata/data',{headers:headers})
    .map(res => res.json());
  }

}
