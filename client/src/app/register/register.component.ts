import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private registerData = { username: '', password: '' }

  constructor(private _auth: AuthService) { }

  ngOnInit() {
  }

  registerUser = () => {
    this._auth.registerUser(this.registerData)
      .subscribe(
        res => console.log(res),
        err => console.log(err.message)
      )
  }

}
