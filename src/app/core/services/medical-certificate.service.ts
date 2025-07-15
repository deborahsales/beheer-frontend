import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
import { MedicalCertificate } from '../interfaces/medical-certificate';

@Injectable({
  providedIn: 'root',
})
export class MedicalCertificateService {
  private apiUrl = `${enviroment.apiUrl}/atestado`;

  constructor(private http: HttpClient) {}

  getMedicalCertificates(): Observable<MedicalCertificate[]> {
    return this.http.get<MedicalCertificate[]>(this.apiUrl);
  }

  getMedicalCertificateById(
    medicalCertificateId: number
  ): Observable<MedicalCertificate> {
    return this.http.get<MedicalCertificate>(
      `${this.apiUrl}/${medicalCertificateId}`
    );
  }

  createMedicalCertificate(medicalCertificateData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, medicalCertificateData);
  }

  updateMedicalCertificate(
    medicalCertificateId: number,
    MedicalCertificateData: any
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${medicalCertificateId}`,
      MedicalCertificateData
    );
  }

  deleteMedicalCertificate(medicalCertificateId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${medicalCertificateId}`);
  }
}
