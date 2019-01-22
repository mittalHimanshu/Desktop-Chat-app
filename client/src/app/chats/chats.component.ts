import { ChatService } from './../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

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
  private totalOnline: number = 0
  private countUnread = { 'community': 0 }
  private scrollToDown: boolean = false

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _chatService: ChatService,
    private route: ActivatedRoute,
    private _electron: ElectronService
  ) { }

  ngOnInit() {

    this.isLoading = true

    window.addEventListener('scroll', this.scroll, true)

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

      // this.showNotification(message.user.username)

      if (!this.countUnread[`${message.user.username}`]) this.countUnread[`${message.user.username}`] = 0

      if ((message.room == 'community' && this.room == 'community')
        || (message.room == this.username && message.user.username == this.room)
        || message.room == this.room) this.messages.push(message)

      if (message.room == this.username && this.room != message.user.username)
        this.countUnread[`${message.user.username}`] += 1

    })

  }

  scroll = (event: any) => {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      this.scrollToDown = false
    }
    else
      this.scrollToDown = true
  }

  scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight , behavior: "smooth"})
    // this.scrollToDown = true
  }

  close = () => {
    this._electron.ipcRenderer.send('close-window')
  }

  minimize = () => {
    this._electron.ipcRenderer.send('minimize-window')
  }

  showNotification = username => {
    this._electron.ipcRenderer.send('show-notification', username)
  }

  changeRoom = value => {
    if (value == this.room) return
    this.room = value
    if (this.countUnread[this.room]) this.countUnread[this.room] = 0
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
    this.totalOnline = 0
    if (this.users) {
      this.users.forEach(user => {
        if (user.is_active) this.totalOnline += 1
      });
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
