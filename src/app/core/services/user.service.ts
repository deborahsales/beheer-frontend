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
    if (this.tokenService.possuiToken()) {
      this.decodificarJwt();
    }
  }

  decodificarJwt() {
    const token = this.tokenService.retornarToken();
    const user = jwtDecode(token) as AuthUser;
    this.userSubject.next(user);
  }

  retornarUser() {
    return this.userSubject.asObservable();
  }

  retornarToken() {
    return this.tokenService.retornarToken();
  }

  salvarToken(token: string) {
    this.tokenService.salvarToken(token);
    this.decodificarJwt();
  }

  logout() {
    this.tokenService.excluirToken();
    this.userSubject.next(null);
  }

  estaLogado() {
    return this.tokenService.possuiToken();
  }

  retornaNome() {
    return this.retornarUser().pipe(
      map((user) => {
        return user?.nome;
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
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
