import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${enviroment.apiUrl}/demanda`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTasksByGroup(groupId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/grupo/${groupId}`);
  }

  getTasksByTimeline(timelineId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/cronograma/${timelineId}`);
  }

  getTasksByUser(groupId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/usuario/${groupId}`);
  }

  getTaskById(taskId: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${taskId}`);
  }

  createTask(taskData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, taskData);
  }

  updateTaskStatus(taskId: number, TaskData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/status/${taskId}`, TaskData);
  }

  updateTask(taskId: number, TaskData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${taskId}`, TaskData);
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${taskId}`);
  }
}
