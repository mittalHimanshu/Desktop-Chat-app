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
  private users: any
  private room: string = 'community'
  private chatRoomId: string

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _chatService: ChatService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(queryParams => {
      this.username = queryParams['username']
      this._chatService.setSocketUser(this.username)
    })

    this._chatService.setOnlineStatus(this.username, true)

    this._chatService.getChangedUsers().subscribe(changedUsers => {
      this.users = changedUsers.users
    })

    this._chatService.getInitialChats(this.room).subscribe(initialChats => {
      this.messages = initialChats
    })

    // this._chatService.getMessages(this.room).subscribe(msgs => {
    //   this.messages = msgs
    // })

  }

  changeRoom = value => {
    this.room = value
    if (this.room != 'community') {
      this._chatService.setPrivateRoom({ from: this.username, to: this.room })
      this._chatService.getChatRoomId({ from: this.username, to: this.room }, roomId => {
        this._chatService.getPrivateMessages(roomId).subscribe(msgs => {
          this.messages = msgs
        })
      })
    } else {
      this._chatService.getPrivateMessages('community').subscribe(msgs => {
        this.messages = msgs
      })
    }
  }

  handleTyping = () => {
    if (this.message != '')
      this._chatService.handleTyping(this.username, true)
    else
      this._chatService.handleTyping(this.username, false)
  }

  sendMessage = () => {
    this._chatService.handleTyping(this.username, false)
    if (this.room == 'community')
      this._chatService.sendMessage(this.message, this.room)
    else {
      this._chatService.sendPrivateMessage(this.message, this.username, this.room, () => {
        this._chatService.getChatRoomId({ from: this.username, to: this.room }, roomId => {
          this._chatService.getPrivateMessages(roomId).subscribe(msgs => {
            this.messages = msgs
          })
        })
      })
    }
    this.message = ''
  }

  filterUsers = () => {
    if (this.users){
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
