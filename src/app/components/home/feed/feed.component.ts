import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PostServiceService } from 'src/app/services/post-service.service';
import { PostInterface, UserInterface } from 'src/app/store/model';
import { postSelector, userSelector } from 'src/app/store/selector';
import { State } from 'src/app/store/state';
import Pusher from 'pusher-js';
import { MatDialog } from '@angular/material/dialog';
import { CommentsComponent } from './comments/comments.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
})
export class FeedComponent implements OnDestroy {
  posts_: any = [];
  user_: Observable<UserInterface>;
  uid_: any = '';
  filename: string = '';
  message = '';
  file: any;
  pusher: Pusher;

  constructor(
    private store: Store<State>,
    protected postService: PostServiceService,
    public http: HttpClient,
    public dialog: MatDialog
  ) {
    this.pusher = new Pusher('657da354cfe34ab989da', {
      cluster: 'ap2',
    });
    const channel = this.pusher.subscribe('posts');
    channel.bind('post', () => this.postService.getAllPosts());
    this.user_ = this.store.pipe(select(userSelector));
    this.user_.subscribe({
      next: (data) => (this.uid_ = data._id),
    });
    this.posts_ = this.store.pipe(select(postSelector));
  }

  ngOnDestroy(): void {
    this.pusher.unbind_all();
    this.pusher.unsubscribe('post');
  }

  openCommentBox(data: PostInterface) {
    this.dialog.open(CommentsComponent, { data: data });
  }

  clearFile(): void {
    this.filename = '';
    this.file = undefined;
  }

  imageUpload(event: any) {
    this.file = event.target.files[0];
    this.filename = `${Date.now()}-post-${this.file.name}`;
  }

  postMsg(): void {
    let userid: any = '';
    let fname: any = '';
    let lname: any = '';
    let profilePic: any = '';
    this.user_.subscribe({
      next: (data) => {
        (userid = data._id),
          (fname = data.fname),
          (lname = data.lname),
          (profilePic = data.profilePic);
      },
    });

    let newPost = {
      userId: userid,
      fname: fname,
      lname: lname,
      profilePic: profilePic,
      desc: this.message || '',
      image: this.filename || '',
      imageID: '',
    };

    if (this.file && this.filename) {
      let formData = new FormData();
      formData.append('file', this.file, this.filename);
      try {
        const promise = new Promise((res, rej) => {
          this.postService.uploadFile(formData).subscribe({
            next: (data) => {
              res(data);
            },
            error: (msg) => {
              rej(msg.message);
            },
          });
        });
        promise
          .then((data: any) => {
            newPost.imageID = data;
            try {
              this.postService.sendPost(newPost).subscribe({
                error: (err) => alert(err.message),
              });
            } catch (error) {
              alert(error);
            }
          })
          .catch((e) => alert(e));
      } catch (error) {
        alert(error);
      }
    } else {
      if (this.message) {
        try {
          this.postService.sendPost(newPost).subscribe({
            error: (err) => alert(err),
          });
        } catch (error) {
          alert(error);
        }
      }
    }
    this.message = '';
    this.clearFile();
  }
}
