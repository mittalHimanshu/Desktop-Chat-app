import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: SocketIOClient.Socket
  private _url: string = 'http://localhost:5000'

  constructor(private _http: HttpClient) {
    this.socket = io(this._url)
    this.socket.on('connect', () => {
      console.log(this.socket.id)
    })
  }

  public setOnlineStatus = (username, status) => {
    this.socket.emit('handle-online-status', { username, status })
  }

  public sendMessage = message => {
    this.socket.emit('new-message', message)
  }

  public getMessages = () => {
    return Observable.create(observer => {
      this.socket.on('new-message', message => {
        observer.next(message)
      })
    })
  }

  public handleTyping = (username, status) => {
    this.socket.emit('handle-typing', { username, status })
  }

  public setSocketUser = username => {
    this.socket.emit('set-socket-user', username)
  }

  public getChangedUsers = () => {
    return Observable.create(observer => {
      this.socket.on('users-changed', () => {
        this._http.get('/user').subscribe(
          users => observer.next(users)
        )
      })
    })
  }

}
