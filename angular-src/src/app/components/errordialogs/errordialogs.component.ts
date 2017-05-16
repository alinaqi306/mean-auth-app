import { Component, OnInit, ViewChild } from '@angular/core';
import {Popup} from 'ng2-opd-popup';

@Component({
  selector: 'app-errordialogs',
  templateUrl: './errordialogs.component.html',
  styleUrls: ['./errordialogs.component.css']
})
export class ErrordialogsComponent implements OnInit {

private isPrimeNgError : boolean;
private isNgPopupError: boolean;
private message : String = "Something wrong happened";
@ViewChild('ngpopup') ngpopup: Popup;
  constructor() { }

  ngOnInit() {

  }

  showPrimeNgError(){
    
    this.isPrimeNgError = true;
  }

  showNgPopup(){
    this.ngpopup.options = {
    header: "Error",
    color: "#393a35", // red, blue.... 
    widthProsentage: 40, // The with of the popou measured by browser width 
    animationDuration: 1, // in seconds, 0 = no animation 
    showButtons: false, // You can hide this in case you want to use custom buttons 
    confirmBtnContent: "OK", // The text on your confirm button 
    // cancleBtnContent: "Cancel", // the text on your cancel button 
    confirmBtnClass: "btn btn-default", // your class for styling the confirm button 
   //  cancleBtnClass: "btn btn-default", // you class for styling the cancel button 
    animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown' 
};
    this.ngpopup.show(this.ngpopup.options);
    this.isNgPopupError = true;
  }
  closeDialog(){
    if(this.isPrimeNgError){
      this.isPrimeNgError = false;
    }
    else if(this.isNgPopupError){
      this.isNgPopupError = false;
      this.ngpopup.hide();
    }
  }
}
