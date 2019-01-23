import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class LoginComponent implements OnInit {

  public loginData = { username: '', password: '' }
  public isError: boolean = false
  private errorText: string

  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {

    this.isError = false

    this._auth.isLoggedIn().subscribe(
      (payload: { "username": '' }) => {
        const { username } = payload
        return this._router.navigate(['/chats'], { queryParams: { username } })
      },
      err => console.log(err.message)
    )
  }

  loginUser = () => {
    this._auth.loginUser(this.loginData)
      .subscribe(
        (payload: { "username": '' }) => {
          const { username } = payload
          return this._router.navigate(['/chats'], { queryParams: { username } })
        },
        err => {
          console.log(err.status)
          this.isError = true
          if(err.status == 406){
            this.errorText = 'User already logged in'
          }
          else if (err instanceof HttpErrorResponse){
            this.errorText = 'Incorrect Username or Password'
          }
        }
      )
  }

  removeError = () => {
    this.isError = false
  }

  navigateToRegister = () => {
    this._router.navigate(['/register'])
  }

}
