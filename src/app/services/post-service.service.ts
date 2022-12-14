import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { post } from '../store/actions';
import { State } from '../store/state';

@Injectable({
  providedIn: 'root',
})
export class PostServiceService implements OnInit {
  // url: string = 'https://friends-backend.onrender.com/api/posts';
  url: string = 'http://localhost:9000/api/posts';
  allPostResonse: any;

  constructor(private http: HttpClient, private store: Store<State>) {}

  ngOnInit(): void {
    console.log('reloaded');
  }

  setPosts(data: Observable<object>): void {
    data.subscribe({
      next: (data) => this.store.dispatch(post({ p: data })),
      error: (err) =>
        Swal.fire({
          icon: 'error',
          text: err.message,
        }),
    });
  }

  getUserPost(uid: string) {
    return this.http.get(`${this.url}/get/${uid}`);
  }

  uploadFile(file: FormData) {
    return this.http.post(`${this.url}/upload`, file);
  }

  sendPost(data: any) {
    return this.http.post(`${this.url}/create`, data);
  }

  handleLikes(liker: string, postId: string) {
    this.http
      .put(`${this.url}/like/${postId}`, {
        userId: liker,
      })
      .subscribe();
  }

  getAllComments(pid: string) {
    return this.http.get(`${this.url}/get/comments/${pid}`);
  }

  postComments(
    pid: string,
    uid: string,
    fname: string,
    lname: string,
    message: string
  ) {
    this.http
      .put(`${this.url}/post/comment/${pid}`, {
        uid,
        fname,
        lname,
        message,
      })
      .subscribe({
        error: (err) =>
          Swal.fire({
            icon: 'error',
            title: 'something went wrong!',
            text: err.message,
          }),
      });
  }

  deletePost(uid: string, pid: string) {
    this.http
      .delete(`${this.url}/delete/${pid}`, {
        body: { userId: uid },
      })
      .subscribe({
        error: (err) =>
          Swal.fire({
            icon: 'error',
            title: 'something went wrong!',
            text: err.message,
          }),
      });
  }

  getAllPosts(): void {
    const res = this.http.get(`${this.url}/get/all-posts/`);
    this.allPostResonse = res;
    this.setPosts(res);
  }
}
