import { Component, Input, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StoryService } from 'src/app/services/story.service';
import { UserInterface } from 'src/app/store/model';
import { storySelector, userSelector } from 'src/app/store/selector';
import { State } from 'src/app/store/state';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
})
export class StoryComponent implements OnDestroy {
  user_: Observable<UserInterface>;
  stories_: any = [];
  pusher: Pusher;

  constructor(private storyService: StoryService, private store: Store<State>) {
    this.stories_ = this.store.pipe(select(storySelector));
    this.pusher = new Pusher(environment.PUSHER_KEY, {
      cluster: 'ap2',
    });
    const channel = this.pusher.subscribe('stories');
    channel.bind('story', () => this.storyService.get(true));
    this.user_ = this.store.pipe(select(userSelector));
  }

  ngOnDestroy(): void {
    this.pusher.unbind_all();
    this.pusher.unsubscribe('post');
  }

  createStory(event: any) {
    let id = '';
    let fname = '';
    let lname = '';
    let profilePic = '';
    this.user_.subscribe({
      next: (data) => {
        id = data._id;
        fname = data.fname;
        lname = data.lname;
        profilePic = data.profilePic;
      },
    });
    const file = event.target.files[0];
    const filename = `${Date.now()}-story-${file.name}`;
    const form = new FormData();
    form.append('file', file, filename);

    const storyPrmoise = new Promise((res, rej) => {
      this.storyService.upload(form).subscribe({
        next: (fileID) => res(fileID),
        error: (err) => rej(err.message),
      });
    });

    storyPrmoise
      .then((fileid) => {
        const story = {
          userId: id,
          fname: fname,
          lname: lname,
          profilePic: profilePic,
          image: filename,
          imageID: fileid,
        };
        this.storyService.create(story).subscribe({
          error: (err) => alert(err.message),
        });
      })
      .catch((err) => alert(err));
  }
}
