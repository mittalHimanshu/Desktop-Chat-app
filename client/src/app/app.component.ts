import { ChatService } from './chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  message: string
  messages: string[] = []

  constructor(private _chatService: ChatService) { }

  ngOnInit() {
    this._chatService.getMessages().subscribe(message => {
      this.messages.push(message)
    })
  }

  sendMessage = () => {
    this._chatService.sendMessage(this.message)
    this.message = ''
  }



}
