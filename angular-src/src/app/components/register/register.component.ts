import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../services/validation.service';
import { FlashMessagesService} from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  userName: String;
  email: String;
  password: String;

  constructor(
    private validationService : ValidationService,
    private flashMessagesService: FlashMessagesService, 
    private authService: AuthService,
    private router : Router) { }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      userName: this.userName,
      email: this.email,
      password: this.password
    }

    if(!this.validationService.validateRegister(user)){
      this.flashMessagesService.show('Please fill in all fields', {cssClass : 'alert-danger', timeout: 3000});
      return false;
    }

    if(!this.validationService.validateEmail(user.email)){
      this.flashMessagesService.show('Provide valid email address', {cssClass : 'alert-danger', timeout: 3000});
      return false;
    }
  this.authService.registerUser(user).subscribe(data => {
  if(data.success){
    this.flashMessagesService.show('You are registered and can login.', {cssClass : 'alert-success', timeout: 3000});
    this.router.navigate(['/login']);
  }
  else{
    this.flashMessagesService.show('Something went wrong.', {cssClass : 'alert-danger', timeout: 3000});
    this.router.navigate(['/register']);
  }
});

  }
}
