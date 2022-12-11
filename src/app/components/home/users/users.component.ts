import { Component, OnInit, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { userSelector } from 'src/app/store/selector';
import { State } from 'src/app/store/state';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  @Input() user!: any;

  // our profile's properties
  sender_fname!: string;
  sender_lname!: string;
  profilePic!: string;
  curUserId!: string;
  friendsList: any = [];

  req_status = '';
  pusher: Pusher;

  constructor(private userService: UserService, private store: Store<State>) {
    this.pusher = new Pusher('657da354cfe34ab989da', {
      cluster: 'ap2',
    });
    this.extractData();
    const channel_requests = this.pusher.subscribe('requests');
    const channel_users = this.pusher.subscribe('users');
    channel_requests.bind('request', () => this.checkReqStatus());
    channel_users.bind('user', () => {
      this.extractData();
      this.userService.updateUser(this.curUserId);
    });
  }

  ngOnInit(): void {
    this.checkReqStatus();
  }

  extractData() {
    this.store.pipe(select(userSelector)).subscribe({
      next: (data) => {
        this.curUserId = data._id;
        this.sender_fname = data.fname;
        this.sender_lname = data.lname;
        this.profilePic = data.profilePic || '';
        this.friendsList = data.friends;
      },
    });
  }

  checkReqStatus() {
    const subject = new BehaviorSubject<any>('');
    this.userService.chekcReqStatus(this.curUserId, this.user._id).subscribe({
      next: (data) => {
        subject.next(data);
        subject.subscribe((val) => (this.req_status = val));
      },
    });
  }

  add_friend(receiverId: string) {
    const props = {
      receiverId,
      senderId: this.curUserId,
      sender_fname: this.sender_fname,
      sender_lname: this.sender_lname,
      profilePic: this.profilePic,
    };
    this.userService.sendRequest(props);
  }

  unfriend(receiverId: string) {
    this.userService.unfriend(this.curUserId, receiverId);
  }

  withdraw(receiverId: string) {
    this.userService.withdraw(this.curUserId, receiverId);
  }
}
