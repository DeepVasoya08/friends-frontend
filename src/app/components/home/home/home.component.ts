import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PostServiceService } from 'src/app/services/post-service.service';
import { StoryService } from 'src/app/services/story.service';
import { UserService } from 'src/app/services/user.service';
import { loadingSelector, userSelector } from 'src/app/store/selector';
import { State } from 'src/app/store/state';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  loading: Observable<boolean>;
  uid!: string;
  pusher: Pusher;

  constructor(
    private postService: PostServiceService,
    private userService: UserService,
    private store: Store<State>,
    private storyService: StoryService
  ) {
    this.pusher = new Pusher('657da354cfe34ab989da', {
      cluster: 'ap2',
    });
    const channel_requests = this.pusher.subscribe('requests');
    this.loading = this.store.pipe(select(loadingSelector));
    this.store.pipe(select(userSelector)).subscribe({
      next: (data) => (this.uid = data._id),
    });
    channel_requests.bind('request', () => {
      this.checkReq();
    });
  }

  ngOnInit(): void {
    this.checkReq();
    this.postService.getAllPosts();
    this.storyService.get();
    this.userService.getAllUsers();
  }

  checkReq() {
    this.userService.chekcReq(this.uid);
  }
}
