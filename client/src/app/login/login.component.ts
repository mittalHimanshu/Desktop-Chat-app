import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loginData = {username: '', password: ''}

  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  loginUser = () => {
    this._auth.loginUser(this.loginData)
      .subscribe(
        res => console.log(res),
        err => console.log(err.message)
      )
  }

  registerUser = () => {
    this._router.navigate(['/register'])
  }

}
