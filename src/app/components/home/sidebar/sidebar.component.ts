import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { UserInterface } from 'src/app/store/model';
import { userSelector } from 'src/app/store/selector';
import { State } from 'src/app/store/state';
import Pusher from 'pusher-js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  id_: string = '';
  friends: any = [];
  user_: Observable<UserInterface>;
  pusher: Pusher;

  constructor(private userService: UserService, private store: Store<State>) {
    this.user_ = this.store.pipe(select(userSelector));
    this.user_.subscribe({
      next: (data) => {
        this.id_ = data._id;
      },
    });
    this.pusher = new Pusher('657da354cfe34ab989da', {
      cluster: 'ap2',
    });
    const channel_user = this.pusher.subscribe('users');
    channel_user.bind('user', () => {
      this.getFriendsList();
      this.userService.updateUser(this.id_);
    });
  }

  ngOnInit(): void {
    this.getFriendsList();
  }

  getFriendsList() {
    this.userService.getFriendsList(this.id_).subscribe({
      next: (data) => (this.friends = data),
    });
  }

  logout() {
    localStorage.removeItem('auth');
    window.location.reload();
  }

  deleteAccount() {
    Swal.fire({
      icon: 'warning',
      title: 'Hold Your Horses!',
      text: 'You Really Wanna Go??',
      showDenyButton: true,
      denyButtonText: 'Delete',
      showConfirmButton: true,
      confirmButtonText: 'Cancle',
    }).then((res) => {
      if (res.isDenied) {
        this.userService.deleteUser(this.id_);
      }
    });
  }
}
