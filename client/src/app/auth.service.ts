import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }

  public registerUser = userData => 
    this._http.post('/api/register', userData)  

  public loginUser = userData =>
    this._http.post('/api/login', userData)
}
