import { ChatService } from './../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  private message: string = ''
  private messages: any
  private username: string
  private sub: any
  private users: any
  private room: string = 'community'

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _chatService: ChatService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.sub = this.route.queryParams.subscribe(queryParams => {
      this.username = queryParams['username']
      this._chatService.setSocketUser(this.username)
    })

    this._auth.getInitialChats(this.room).subscribe(initialChats => {
      this.messages = initialChats
    })

    this._chatService.getMessages(this.room).subscribe(msgs => {
      this.messages = msgs
    })

    this._chatService.getChangedUsers().subscribe(changedUsers => {
      this.users = changedUsers
    })

    this._chatService.setOnlineStatus(this.username, true)
  }

  handleTyping = () => {
    if (this.message != '')
      this._chatService.handleTyping(this.username, true)
    else
      this._chatService.handleTyping(this.username, false)
  }

  sendMessage = () => {
    this._chatService.handleTyping(this.username, false)
    this._chatService.sendMessage(this.message, this.room)
    this.message = ''
  }

  filterUsers = () => {
    if(this.users)
      return this.users.filter(user => user.username != this.username)
  }

  logoutUser = () => {
    this._chatService.setOnlineStatus(this.username, false)
    this._auth.logoutUser()
      .subscribe(
        res => this._router.navigate(['/login'])
      )
  }

}
