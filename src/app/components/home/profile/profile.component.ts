import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import Pusher from 'pusher-js';
import Swal from 'sweetalert2';

import { UserService } from 'src/app/services/user.service';
import { PostInterface, UserInterface } from 'src/app/store/model';
import { userSelector } from 'src/app/store/selector';
import { State } from 'src/app/store/state';
import { PostServiceService } from 'src/app/services/post-service.service';
import { CommentsComponent } from '../feed/comments/comments.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user_: Observable<UserInterface>;
  pusher: Pusher;

  uid_: any;
  posts_: any = [];

  constructor(
    private store: Store<State>,
    private userService: UserService,
    protected postService: PostServiceService,
    public dialog: MatDialog
  ) {
    this.user_ = this.store.pipe(select(userSelector));
    this.store
      .pipe(select(userSelector))
      .subscribe({ next: (data) => (this.uid_ = data._id) });
    this.pusher = new Pusher('657da354cfe34ab989da', {
      cluster: 'ap2',
    });
    const channel_user = this.pusher.subscribe('users');
    const channel_posts = this.pusher.subscribe('posts');
    channel_user.bind('user', () => this.userService.updateUser());
    channel_posts.bind('post', () => this.getPosts());
  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.postService.getUserPost(this.uid_).subscribe({
      next: (data) => {
        this.posts_ = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openCommentBox(data: PostInterface) {
    this.dialog.open(CommentsComponent, { data: data });
  }

  updateCoverImg(event: any) {
    const file: File = event.target.files[0];
    const filename = `${Date.now()}-user-${file.name}`;

    let formData = new FormData();
    formData.append('file', file, filename);

    this.userService.updateCoverPic(this.uid_, formData).subscribe({
      next: () =>
        Swal.fire({
          icon: 'success',
        }),
      error: (err) =>
        Swal.fire({
          icon: 'success',
          text: err.error.message,
        }),
    });
  }

  updateProfilePic(event: any) {
    const file: File = event.target.files[0];
    const filename = `${Date.now()}-user-${file.name}`;

    let formData = new FormData();
    formData.append('file', file, filename);

    this.userService.updateProfilePic(this.uid_, formData).subscribe({
      next: (data) =>
        Swal.fire({
          icon: 'success',
        }),
      error: (err) =>
        Swal.fire({
          icon: 'success',
          text: err.error.message,
        }),
    });
  }
}
