import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostServiceService } from 'src/app/services/post-service.service';
import { UserService } from 'src/app/services/user.service';
import { PostInterface, UserInterface } from 'src/app/store/model';
import { userSelector } from 'src/app/store/selector';
import { State } from 'src/app/store/state';
import { CommentsComponent } from '../feed/comments/comments.component';
import Swal from 'sweetalert2';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
})
export class VisitComponent implements OnInit {
  uid: any;
  curUserId: any;
  curUser: Observable<UserInterface>;
  user_: any;
  posts_: any = [];
  pusher: Pusher;

  req_status: string = '';

  constructor(
    private router: ActivatedRoute,
    private navigator: Router,
    protected userService: UserService,
    protected postService: PostServiceService,
    private dialog: MatDialog,
    private store: Store<State>
  ) {
    this.pusher = new Pusher(environment.PUSHER_KEY, {
      cluster: 'ap2',
    });
    const channel_user = this.pusher.subscribe('users');
    const channel_posts = this.pusher.subscribe('posts');
    const channel_requests = this.pusher.subscribe('requests');

    this.uid = this.router.snapshot.paramMap.get('id');
    this.curUser = this.store.pipe(select(userSelector));
    this.curUser.subscribe({
      next: (data) => (this.curUserId = data._id),
    });

    channel_user.bind('user', () => this.getUser(this.uid));
    channel_posts.bind('post', () => this.getPosts());
    channel_requests.bind('request', () => this.checkReqStatus());
    this.checkReqStatus();
  }

  ngOnInit(): void {
    this.getUser(this.uid);
    this.getPosts();
  }

  checkReqStatus() {
    const subject = new BehaviorSubject<any>('');
    this.userService.chekcReqStatus(this.curUserId, this.uid).subscribe({
      next: (data) => {
        subject.next(data);
        subject.subscribe((val) => (this.req_status = val));
      },
    });
  }

  sendRequest(receiverId: string) {
    let sender_fname = '';
    let sender_lname = '';
    let profilePic;
    this.curUser.subscribe({
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
      senderId: this.curUserId,
    };
    this.userService.sendRequest(props);
  }

  unfriend(receiverId: string) {
    this.userService.unfriend(this.curUserId, receiverId);
  }

  withdraw(receiverId: string) {
    this.userService.withdraw(this.curUserId, receiverId);
  }

  getUser(uid: string) {
    this.userService.getUser(uid).subscribe({
      next: (data) => {
        this.user_ = data;
      },
      error: (err) => {
        Swal.fire({ icon: 'error', text: err.error.message }).then(() =>
          this.navigator.navigate(['/'])
        );
      },
    });
  }

  getPosts() {
    this.postService.getUserPost(this.uid).subscribe({
      next: (data) => (this.posts_ = data),
      error: (err) => {
        Swal.fire({ icon: 'error', text: err.message });
      },
    });
  }

  openCommentBox(data: PostInterface) {
    this.dialog.open(CommentsComponent, { data: data });
  }
}
