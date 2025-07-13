import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
import { Attendance } from '../interfaces/attendance';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = `${enviroment.apiUrl}/ponto`;

  constructor(private http: HttpClient) {}

  getAttendances(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.apiUrl);
  }

  getAttendanceById(attendanceId: number): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.apiUrl}/${attendanceId}`);
  }

  createAttendance(attendanceData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, attendanceData);
  }

  updateAttendance(attendanceId: number, AttendanceData: any): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${attendanceId}`,
      AttendanceData
    );
  }

  deleteAttendance(attendanceId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${attendanceId}`);
  }
}
