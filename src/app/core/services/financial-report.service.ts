import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
import { FinancialReport } from '../interfaces/financial-report';

@Injectable({
  providedIn: 'root',
})
export class FinancialReportService {
  private apiUrl = `${enviroment.apiUrl}/prestacao-contas`;

  constructor(private http: HttpClient) {}

  getFinancialReports(): Observable<FinancialReport[]> {
    return this.http.get<FinancialReport[]>(this.apiUrl);
  }

  getFinancialReportById(
    financialReportId: number
  ): Observable<FinancialReport> {
    return this.http.get<FinancialReport>(
      `${this.apiUrl}/${financialReportId}`
    );
  }

  createFinancialReport(financialReportData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, financialReportData);
  }

  updateFinancialReport(
    financialReportId: number,
    FinancialReportData: any
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${financialReportId}`,
      FinancialReportData
    );
  }

  deleteFinancialReport(financialReportId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${financialReportId}`);
  }
}
