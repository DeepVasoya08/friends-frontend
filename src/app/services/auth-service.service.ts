import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { isLoggedIn, user } from '../store/actions';
import { State } from '../store/state';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  // url: string = 'https://friends-backend.onrender.com/api/auth';
  url: string = 'http://localhost:9000/api/auth';
  constructor(
    private http: HttpClient,
    private store: Store<State>,
    private router: Router
  ) {
    this.store.select('store_state');
  }

  saveData(data: any) {
    this.store.dispatch(user({ u: data }));
    this.store.dispatch(isLoggedIn());
    localStorage.setItem('auth', JSON.stringify(data));
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
    return this.http.post(`${this.url}/signin`, {
      email: form.email,
      password: form.password,
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
