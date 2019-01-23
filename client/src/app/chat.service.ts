import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: SocketIOClient.Socket
  private _url: string = 'https://fast-journey-31359.herokuapp.com'

  constructor(private _http: HttpClient) {
    this.socket = io(this._url)
    this.socket.on('connect', () => {
      console.log(this.socket.id)
    })
  }
  
  public setSocketUser = username => {
    this.socket.emit('set-socket-user', { username })
  }

  public getChangedUsers = () => {
    return Observable.create(observer => {
      this.socket.on('users-changed', () => {
        this._http.get(`${this._url}/auth/users`).subscribe(
          users => observer.next(users)
        )
      })
    })
  }

  public setOnlineStatus = (username, status) => {
    this.socket.emit('handle-online-status', { username, status })
  }
  
  public getInitialChats = (room, username) => 
    this._http.get(`${this._url}/messages/${username}/${room}`)

  public setPrivateRoom = payload => {
    this.socket.emit('set-private-room', payload)
  }

  public handleTyping = (username, status) => {
    this.socket.emit('handle-typing', { username, status })
  }

  public sendMessage = (username, room, message) => {
    this.socket.emit('new-message', { username, room, message })
  }

  public getMessage = () => {
    return Observable.create(observer => {
      this.socket.on('new-message', message => {
        observer.next(message)
      })
    })
  }

}
