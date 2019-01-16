import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor() { }

}




  // message: string
  // messages: string[] = []

  // constructor(private _chatService: ChatService) { }

  // ngOnInit() {
  //   this._chatService.getMessages().subscribe(message => {
  //     this.messages.push(message)
  //   })
  // }

  // sendMessage = () => {
  //   this._chatService.sendMessage(this.message)
  //   this.message = ''
  // }