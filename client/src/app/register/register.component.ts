import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private registerData = { username: '', password: '' }

  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  registerUser = () => {
    this._auth.registerUser(this.registerData)
      .subscribe(
        username => this._router.navigate(['/chats'], { queryParams: {username} }),
        err => console.log(err.message)
      )
  }

  navigateToLogin = () => {
    this._router.navigate(['/login'])
  }

}
