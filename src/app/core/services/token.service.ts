import { Injectable } from '@angular/core';

const KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  storeToken(token: string) {
    return localStorage.setItem(KEY, token);
  }

  removeToken() {
    localStorage.removeItem(KEY);
  }

  getToken() {
    return localStorage.getItem(KEY) ?? '';
  }

  hasToken() {
    return !!this.getToken();
  }
}
