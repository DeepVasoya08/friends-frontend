import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { story } from '../store/actions';
import { State } from '../store/state';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  url: string = 'https://friends-backend.onrender.com/api/story';
  // url: string = 'http://localhost:9000/api/story';
  allStories: any;

  constructor(private http: HttpClient, private store: Store<State>) {}

  upload(file: FormData) {
    return this.http.post(`${this.url}/upload`, file);
  }

  create(data: any) {
    return this.http.post(`${this.url}/create`, data);
  }

  set(data: Observable<object>): void {
    data.subscribe({
      next: (data) => this.store.dispatch(story({ s: data })),
      error: (err) => alert(err.message),
    });
  }

  get(forceReload: boolean = false): void {
    if (this.allStories && !forceReload) {
      return;
    }

    const res = this.http.get(`${this.url}/get/stories`);
    this.allStories = res;
    this.set(res);
  }
}
