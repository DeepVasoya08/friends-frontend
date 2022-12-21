import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { isLoggedIn, user } from '../store/actions';
import { State } from '../store/state';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  url: string = 'https://friends-backend.onrender.com/api/auth';
  token_!: any;

  constructor(
    private http: HttpClient,
    private store: Store<State>,
    private router: Router
  ) {
    this.token_ = localStorage.getItem('auth');
    this.store.select('store_state');
  }

  saveData(data: any, token: any) {
    this.store.dispatch(user({ u: data }));
    this.store.dispatch(isLoggedIn());
    localStorage.setItem('auth', JSON.stringify(token));
    this.router.navigate(['/']);
  }

  geodata(latitude: number, longitude: number) {
    this.http
      .post(`${this.url}/get/geodata`, {
        latitude,
        longitude,
      })
      .subscribe();
  }

  login(form: any) {
    return this.http.post(
      `${this.url}/signin`,
      {
        email: form.email,
        password: form.password,
      },
      {
        observe: 'response',
      }
    );
  }

  reload() {
    const headers = new HttpHeaders().set(
      'authorization',
      'Bearer ' + JSON.parse(this.token_)
    );
    this.http
      .post(`${this.url}/reload`, '', { headers: headers, observe: 'response' })
      .subscribe({
        next: (data) => {
          this.saveData(data.body, JSON.parse(this.token_));
        },
        error: (err) => {
          if (err.error.message == 'reload') {
            Swal.fire({
              icon: 'warning',
              title: 'Auth token expired!',
              text: 'Login again to get new token',
            }).then(() => {
              this.router.navigate(['/login']);
            });
          } else {
            Swal.fire({
              icon: 'error',
              text: err.error.message,
            });
          }
        },
      });
  }

  register(form: any) {
    return this.http.post(`${this.url}/signup`, {
      fname: form.fname,
      lname: form.lname,
      email: form.email,
      password: form.password,
    });
  }
}
