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

  public setPrivateRoom = payload => {
    this.socket.emit('set-private-room', payload)
  }

  public sendMessage = (message, room) => {
    this.socket.emit('new-message', { message, room })
  }

  public sendPrivateMessage = (message, from, to, cb) => {
    this.socket.emit('new-private-message', {message, from, to}, cb)
  }

  public getMessages = room => {
    return Observable.create(observer => {
      this.socket.on('new-message', () => {
        this._http.get(`/messages/${room}`).subscribe(
          messages => observer.next(messages)
        )
      })
    })
  }

  public getPrivateMessages = room => {
    return Observable.create(observer => {
      this._http.get(`/messages/${room}`).subscribe(
        messages => {
          observer.next(messages)
        }
      )
    })
  }

  public handleTyping = (username, status) => {
    this.socket.emit('handle-typing', { username, status })
  }

  public setSocketUser = username => {
    this.socket.emit('set-socket-user', username)
  }

  public getChatRoomId = (payload, cb) => {
    this.socket.emit('get-chat-room-id', payload, chatRoomId => {
      return cb(chatRoomId)
    })
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
