import { Injectable } from '@angular/core';

@Injectable()
export class ValidationService {

  constructor() { }

  validateRegister(user){
    if(user.email == undefined ||user.password == undefined ||user.name == undefined ||user.userName == undefined)
      return false;
    else
      return true;
  }

  validateEmail(email){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
