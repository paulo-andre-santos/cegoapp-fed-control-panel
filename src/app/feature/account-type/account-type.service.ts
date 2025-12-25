import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccountTypeModel {
  codTipConta: string;
  descr: string;
  ativo: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountTypeService {
  private apiUrl = 'http://localhost:8080/api/tipos-conta'; // Usando proxy para evitar CORS

  constructor(private http: HttpClient) {}

  getAccountTypes(): Observable<AccountTypeModel[]> {
    return this.http.get<AccountTypeModel[]>(this.apiUrl);
  }

  createAccountType(accountType: AccountTypeModel): Observable<AccountTypeModel> {
    return this.http.post<AccountTypeModel>(this.apiUrl, accountType);
  }

  updateAccountType(codTipConta: string, accountType: AccountTypeModel): Observable<AccountTypeModel> {
    return this.http.put<AccountTypeModel>(`${this.apiUrl}/${codTipConta}`, accountType);
  }

  deleteAccountType(codTipConta: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codTipConta}`);
  }
}