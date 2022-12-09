import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UserService } from 'src/app/services/user.service';
import { userSelector } from 'src/app/store/selector';
import { State } from 'src/app/store/state';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-rightbar',
  templateUrl: './rightbar.component.html',
})
export class RightbarComponent implements OnInit {
  userList: any;
  uid: any;
  pusher: Pusher;

  constructor(private userService: UserService, private store: Store<State>) {
    this.store.pipe(select(userSelector)).subscribe({
      next: (data) => (this.uid = data._id),
    });
    this.pusher = new Pusher('657da354cfe34ab989da', {
      cluster: 'ap2',
    });
    const channel_users = this.pusher.subscribe('users');
    channel_users.bind('user', () => {
      this.userService.getAllUsers();
    });
  }

  ngOnInit(): void {
    this.userService.allUsersList.subscribe((val) => {
      this.userList = val;
    });
  }
}
