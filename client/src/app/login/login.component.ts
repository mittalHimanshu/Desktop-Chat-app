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
    this._auth.isLoggedIn().subscribe(
      res => this._router.navigate(['/chats']),
      err => console.log(err)
    )
  }

  loginUser = () => {
    this._auth.loginUser(this.loginData)
      .subscribe(
        res => this._router.navigate(['/chats']),
        err => console.log(err)
      )
  }

  registerUser = () => {
    this._router.navigate(['/register'])
  }

}
