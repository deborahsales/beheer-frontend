import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
import { AuthUser, User } from '../interfaces/user';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  private apiUrl = `${enviroment.apiUrl}/usuario`;

  constructor(private tokenService: TokenService, private http: HttpClient) {
    if (this.tokenService.hasToken()) {
      this.decodeJwt();
    }
  }

  decodeJwt() {
    const token = this.tokenService.getToken();
    const user = jwtDecode(token) as AuthUser;
    this.userSubject.next(user);
  }

  getAuthUser() {
    return this.userSubject.asObservable();
  }

  getToken() {
    return this.tokenService.getToken();
  }

  storeToken(token: string) {
    this.tokenService.storeToken(token);
    this.decodeJwt();
  }

  logout() {
    this.tokenService.removeToken();
    this.userSubject.next(null);
  }

  isAuthenticated() {
    return this.tokenService.hasToken();
  }

  retornaNome() {
    return this.getAuthUser().pipe(
      map((user) => {
        return user?.nome;
      })
    );
  }

  getRole() {
    return this.getAuthUser().pipe(
      map((user) => {
        return user?.funcao;
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getColaboradores(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/colaboradores`);
  }

  getGestores(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/gestores`);
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }
}
