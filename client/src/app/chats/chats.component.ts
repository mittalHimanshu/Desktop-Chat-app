import { ChatService } from './../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  private message: string = ''
  private messages: any
  private username: string
  private users: any
  private room: string = 'community'
  private isLoading: boolean

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _chatService: ChatService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.isLoading = true

    this.route.queryParams.subscribe(queryParams => {
      this.username = queryParams['username']
      this._chatService.setSocketUser(this.username)
    })

    this._chatService.setOnlineStatus(this.username, true)

    this._chatService.getChangedUsers().subscribe(changedUsers => {
      this.users = changedUsers.users
    })

    this._chatService.getInitialChats(this.room, this.username).subscribe((initialChats: any) => {
      this.isLoading = false
      this.messages = initialChats.messages
    })

    this._chatService.getMessage().subscribe(message => {
      if ((message.room == 'community' && this.room == 'community')
        || (message.room == this.username && message.user.username == this.room)
        || message.room == this.room) this.messages.push(message)
    })

  }

  changeRoom = value => {
    this.room = value
    this.isLoading = true
    if (this.room != 'community') {
      this._chatService.setPrivateRoom({
        from: this.username,
        to: this.room
      })
    }
    this._chatService.getInitialChats(this.room, this.username).subscribe((initialChats: any) => {
      this.isLoading = false
      this.messages = initialChats.messages
    })
  }

  handleTyping = () => {
    if (this.message != '')
      this._chatService.handleTyping(this.username, true)
    else
      this._chatService.handleTyping(this.username, false)
  }

  onBlurMethod = () => {
    this._chatService.handleTyping(this.username, false)
  }

  sendMessage = () => {
    this._chatService.handleTyping(this.username, false)
    this._chatService.sendMessage(this.username, this.room, this.message)
    this.message = ''
  }

  filterUsers = () => {
    if (this.users) {
      return this.users.filter(user => user.username != this.username)
    }
  }

  logoutUser = () => {
    this._chatService.setOnlineStatus(this.username, false)
    this._auth.logoutUser()
      .subscribe(
        res => this._router.navigate(['/login'])
      )
  }

}
