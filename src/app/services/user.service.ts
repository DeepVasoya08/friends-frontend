import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { user } from '../store/actions';
import { State } from '../store/state';
import Swal from 'sweetalert2';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  allUsersList = new BehaviorSubject<any>([]);
  req_queue = new BehaviorSubject<any>('');

  constructor(
    private http: HttpClient,
    private store: Store<State>,
    private authService: AuthServiceService
  ) {}

  // url: string = 'http://localhost:9000/api/user';
  url: string = 'https://friends-backend.onrender.com/api/user';
  authUrl: string = 'https://friends-backend.onrender.com/api/auth';

  getFriendsList(uid: string) {
    return this.http.get(`${this.url}/friends/${uid}`);
  }

  sendRequest(props: object) {
    this.http.post(`${this.url}/make/req`, { props }).subscribe({
      next: () =>
        Swal.fire({
          icon: 'success',
        }),
      error: (error) => {
        console.log(error);

        Swal.fire({
          icon: 'error',
          text: error.error.message,
        });
      },
    });
  }

  chekcReq(receiverId: string) {
    this.http.post(`${this.url}/check/req`, { receiverId }).subscribe({
      next: (data) => {
        this.req_queue.next(data);
      },
    });
  }

  responseRequest(res: string, senderId: string, receiverId: string) {
    this.http
      .post(`${this.url}/accept/req`, {
        senderId,
        receiverId,
        status: res,
      })
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
          });
        },
        error: (err) => {
          console.log(err);

          Swal.fire({
            icon: 'error',
            text: err.error.message,
          });
        },
      });
  }

  chekcReqStatus(senderId: string, receiverId: string): Observable<object> {
    return this.http.post(`${this.url}/check/req_status`, {
      senderId,
      receiverId,
    });
  }

  withdraw(senderId: string, receiverId: string) {
    this.http
      .delete(`${this.url}/withdraw/req`, {
        body: {
          senderId,
          receiverId,
        },
      })
      .subscribe({
        error: (err) =>
          Swal.fire({
            icon: 'error',
            text: err.message,
          }),
      });
  }

  unfriend(senderId: string, receiverId: string) {
    this.http
      .put(`${this.url}/unfriend`, {
        senderId,
        receiverId,
      })
      .subscribe({
        next: () =>
          Swal.fire({
            icon: 'success',
          }),
        error: (err) =>
          Swal.fire({
            icon: 'error',
            text: err.message,
          }),
      });
  }

  searchUser(uname: string) {
    return this.http.get(`${this.url}/search/user/${uname}`);
  }

  deleteUser(id: string) {
    const token = JSON.parse(this.authService.token_);
    const headers = new HttpHeaders().set('authorization', `Bearer ${token}`);
    this.http
      .delete(`${this.url}/delete/user/${id}`, {
        body: { id: id },
        headers: headers,
      })
      .subscribe({
        next: (data) => {
          localStorage.removeItem('auth');
          window.location.reload();
        },
        error: (err) =>
          Swal.fire({
            icon: 'error',
            text: err.error.message,
          }),
      });
  }

  updateUser() {
    const token: any = localStorage.getItem('auth');
    const headers = new HttpHeaders().set(
      'authorization',
      `Bearer ${JSON.parse(token)}`
    );
    this.http
      .post(`${this.authUrl}/reload`, '', {
        headers: headers,
        observe: 'response',
      })
      .subscribe({
        next: (data) => {
          this.authService.saveData(data.body, data.headers.get('token'));
        },
        error: (err) =>
          Swal.fire({
            icon: 'error',
            text: err.message,
          }),
      });
  }

  updateProfilePic(uid: string, file: FormData) {
    return this.http.put(`${this.url}/update/profilePic/${uid}`, file);
  }
  updateCoverPic(uid: string, file: FormData) {
    return this.http.put(`${this.url}/update/cover/${uid}`, file);
  }

  getUser(uid: string) {
    return this.http.get(`${this.url}/get/user/${uid}`);
  }

  getAllUsers() {
    this.http.get(`${this.url}/get/users`).subscribe({
      next: (data) => {
        this.allUsersList.next(data);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          text: err.message,
        });
      },
    });
  }
}
