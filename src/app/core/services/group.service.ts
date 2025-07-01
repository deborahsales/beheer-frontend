import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
import { Group } from '../interfaces/group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = `${enviroment.apiUrl}/grupo`;

  constructor(private http: HttpClient) {}

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  getGroupsByUser(userId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/usuario/${userId}`);
  }

  getGroupById(groupId: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${groupId}`);
  }

  createGroup(groupData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, groupData);
  }

  updateGroup(groupId: number, GroupData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${groupId}`, GroupData);
  }

  deleteGroup(groupId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${groupId}`);
  }
}
