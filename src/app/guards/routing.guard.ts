import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from '../store/state';

@Injectable({
  providedIn: 'root',
})
export class RoutingGuard implements CanActivate {
  getUser: any = [];
  constructor(private store: Store<State>, private router: Router) {
    this.store.select('store_state').subscribe((data) => {
      this.getUser = data;
    });
  }

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkLogin();
  }

  checkLogin(): boolean {
    const { user } = this.getUser;

    if (user == '') {
      this.router.navigate(['/login']);
    }
    return true;
  }
}
