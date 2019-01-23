import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _url: string = 'https://fast-journey-31359.herokuapp.com'

  constructor(private _http: HttpClient) { }

  public registerUser = userData => 
    this._http.post(`${this._url}/auth/register`, userData)

  public loginUser = userData =>
    this._http.post(`${this._url}/auth/login`, userData)

  public isLoggedIn = () => 
    this._http.get(`${this._url}/auth/isLoggedIn`)

  public logoutUser = () =>
    this._http.get(`${this._url}/auth/logout`)
    
}
