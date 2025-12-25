import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccountModel {
  codConta?: number;
  descr: string;
  tipo: string;
  saldoInicial: number;
  dtSaldoInicial: string;
  ativo: 'S' | 'N';
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = '/api/contas';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<AccountModel[]> {
    return this.http.get<AccountModel[]>(this.apiUrl);
  }

  createAccount(account: Omit<AccountModel, 'codConta'>): Observable<AccountModel> {
    return this.http.post<AccountModel>(this.apiUrl, account);
  }

  updateAccount(codConta: number, account: AccountModel): Observable<AccountModel> {
    return this.http.put<AccountModel>(`${this.apiUrl}/${codConta}`, account);
  }

  deleteAccount(codConta: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codConta}`);
  }
}
