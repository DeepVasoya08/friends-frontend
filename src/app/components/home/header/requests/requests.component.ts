import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { userSelector } from 'src/app/store/selector';
import { State } from 'src/app/store/state';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
})
export class RequestsComponent implements OnInit {
  req_queue: any;
  userList: any = [];
  uid: string = '';
  user_: Observable<any>;
  req_status = '';

  constructor(private userService: UserService, private store: Store<State>) {
    this.user_ = this.store.pipe(select(userSelector));
    this.user_.subscribe({
      next: (data) => (this.uid = data._id),
    });
  }

  ngOnInit(): void {
    this.checkRequests();
    this.getUsers();
  }

  checkRequests() {
    this.userService.req_queue.subscribe((val) => (this.req_queue = val));
  }

  getUsers() {
    this.userService.allUsersList.subscribe((val) => {
      val.map((u: any) => {
        if (u._id != this.uid) {
          this.userList.push(u);
        }
      });
    });
  }

  sendRequest(receiverId: string) {
    let sender_fname = '';
    let sender_lname = '';
    let profilePic;
    this.user_.subscribe({
      next: (data) => {
        sender_fname = data.fname;
        sender_lname = data.lname;
        profilePic = data.profilePic || '';
      },
    });
    const props = {
      receiverId,
      sender_fname,
      sender_lname,
      profilePic,
      senderId: this.uid,
    };
    this.userService.sendRequest(props);
  }

  unfriend(receiverId: string) {
    this.userService.unfriend(this.uid, receiverId);
  }

  withdraw(receiverId: string) {
    this.userService.withdraw(this.uid, receiverId);
  }

  responseRequest(res: string, senderId: string, receiverId: string) {
    if (res == 'ACCPET') {
      return this.userService.responseRequest(res, senderId, receiverId);
    }
    this.userService.responseRequest(res, senderId, receiverId);
  }
}
