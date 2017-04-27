import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class GraphdataService {

  constructor(private http : Http) { }

  getGraphData(filters){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   /* let params = '?numberOfMonths=' + filters.numberOfMonths + '&fromDate=' + filters.fromDate 
                  + '&toDate=' + filters.toDate ;*/
    /*return this.http.get('http://localhost:3000/graphdata/data'+ params , {headers:headers})
    .map(res => res.json());*/
    return this.http.post('http://localhost:3000/graphdata/data' , filters, {headers:headers})
    .map(res => res.json());
  }

  getGasConsumption(){
    let value = Math.ceil(Math.random()*100);
    return value;
  }
}
