import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PostServiceService } from 'src/app/services/post-service.service';
import { StoryService } from 'src/app/services/story.service';
import { UserService } from 'src/app/services/user.service';
import { userSelector } from 'src/app/store/selector';
import { State } from 'src/app/store/state';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  uid!: string;
  pusher: Pusher;

  constructor(
    private postService: PostServiceService,
    private userService: UserService,
    private store: Store<State>,
    private storyService: StoryService
  ) {
    this.pusher = new Pusher(environment.PUSHER_KEY, {
      cluster: 'ap2',
    });
    const channel_requests = this.pusher.subscribe('requests');
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
