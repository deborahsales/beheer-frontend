import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../interfaces/user';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor(private tokenService: TokenService) {
    if (this.tokenService.possuiToken()) {
      this.decodificarJwt();
    }
  }

  decodificarJwt() {
    const token = this.tokenService.retornarToken();
    const user = jwtDecode(token) as User;
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
}
