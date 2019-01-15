import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: SocketIOClient.Socket
  private _url: string = 'http://localhost:5000'

  constructor() {
    this.socket = io(this._url)
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

}
