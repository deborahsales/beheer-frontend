import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
import { Comment } from '../interfaces/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = `${enviroment.apiUrl}/comentario`;

  constructor(private http: HttpClient) {}

  getCommentByTask(taskId: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/demanda/${taskId}`);
  }

  getCommentById(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${commentId}`);
  }

  createComment(commentData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, commentData);
  }

  updateComment(commentId: number, CommentData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${commentId}`, CommentData);
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${commentId}`);
  }
}
