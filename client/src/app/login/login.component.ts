import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class LoginComponent implements OnInit {

  private loginData = { username: '', password: '' }

  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
    this._auth.isLoggedIn().subscribe(
      (payload: { "username": '' }) => {
        const { username } = payload
        return this._router.navigate(['/chats'], { queryParams: { username } })
      },
      err => console.log(err)
    )
  }

  loginUser = () => {
    this._auth.loginUser(this.loginData)
      .subscribe(
        (payload: { "username": '' }) => {
          const { username } = payload
          return this._router.navigate(['/chats'], { queryParams: { username } })
        },
        err => console.log(err)
      )
  }

  navigateToRegister = () => {
    this._router.navigate(['/register'])
  }

}
