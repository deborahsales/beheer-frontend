import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment';
import { AdjustmentRequest } from '../interfaces/adjustment-request';

@Injectable({
  providedIn: 'root',
})
export class AdjustmentRequestService {
  private apiUrl = `${enviroment.apiUrl}/ajuste-ponto`;

  constructor(private http: HttpClient) {}

  getAdjustmentRequests(): Observable<AdjustmentRequest[]> {
    return this.http.get<AdjustmentRequest[]>(this.apiUrl);
  }

  getAdjustmentRequestById(
    adjustmentRequestId: number
  ): Observable<AdjustmentRequest> {
    return this.http.get<AdjustmentRequest>(
      `${this.apiUrl}/${adjustmentRequestId}`
    );
  }

  createAdjustmentRequest(
    adjustmentRequestId: number,
    adjustmentRequestData: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${adjustmentRequestId}`,
      adjustmentRequestData
    );
  }

  updateAdjustmentRequest(
    adjustmentRequestId: number,
    adjustmentRequestData: any
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${adjustmentRequestId}`,
      adjustmentRequestData
    );
  }

  manageAdjustmentRequest(
    adjustmentRequestId: number,
    AdjustmentRequestData: any
  ): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/gerenciamento/${adjustmentRequestId}`,
      AdjustmentRequestData
    );
  }

  deleteAdjustmentRequest(adjustmentRequestId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${adjustmentRequestId}`);
  }
}
