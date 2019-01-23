import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class RegisterComponent implements OnInit {

  private registerData = { username: '', password: '' }
  private isError: boolean

  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
    this.isError = false
  }

  removeError = () => {
    this.isError = false
  }

  registerUser = () => {
    this._auth.registerUser(this.registerData)
      .subscribe(
        (payload: { "username": '' }) => {
          const { username } = payload
          return this._router.navigate(['/chats'], { queryParams: { username } })
        },
        err => {
          if (err instanceof HttpErrorResponse){
            this.isError = true
          }
        }
      )
  }

  navigateToLogin = () => {
    this._router.navigate(['/login'])
  }

}
