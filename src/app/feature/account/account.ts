import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountService, AccountModel } from './account.service';
import { AccountTypeService, AccountTypeModel } from '../account-type/account-type.service';

@Component({
  selector: 'account',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account implements OnInit {
  accounts = signal<AccountModel[]>([]);
  accountTypes = signal<AccountTypeModel[]>([]);
  form: FormGroup;
  editingId: number | null = null;
  submitting = signal(false);

  constructor(
    private accountService: AccountService,
    private accountTypeService: AccountTypeService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      codConta: [{ value: '', disabled: true }],
      descr: ['', [Validators.required, Validators.maxLength(80)]],
      tipo: ['', [Validators.required, Validators.maxLength(1)]],
      saldoInicial: ['', [Validators.required]],
      dtSaldoInicial: ['', Validators.required],
      ativo: [true]
    });
  }

  ngOnInit() {
    this.loadAccountTypes();
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAccounts().subscribe({
      next: data => this.accounts.set(data),
      error: err => console.error('Erro ao carregar contas:', err)
    });
  }

  loadAccountTypes() {
    this.accountTypeService.getAccountTypes().subscribe({
      next: list => this.accountTypes.set(list),
      error: err => console.error('Erro ao carregar tipos de conta:', err)
    });
  }

  onSubmit() {
    if (!this.form.valid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    const payload = this.buildPayload();

    if (this.editingId) {
      this.accountService.updateAccount(this.editingId, payload).subscribe({
        next: () => {
          this.loadAccounts();
          this.resetForm();
        },
        error: err => console.error('Erro ao atualizar conta:', err),
        complete: () => this.submitting.set(false)
      });
      return;
    }

    const { codConta, ...createData } = payload;
    this.accountService.createAccount(createData).subscribe({
      next: () => {
        this.loadAccounts();
        this.resetForm();
      },
      error: err => console.error('Erro ao criar conta:', err),
      complete: () => this.submitting.set(false)
    });
  }

  edit(account: AccountModel) {
    if (!account.codConta) {
      return;
    }
    this.editingId = account.codConta;
    this.form.patchValue({
      codConta: account.codConta,
      descr: account.descr,
      tipo: account.tipo ?? '',
      saldoInicial: this.formatCurrencyInput(account.saldoInicial),
      dtSaldoInicial: this.toIsoDate(account.dtSaldoInicial),
      ativo: account.ativo === 'S'
    });
  }

  delete(codConta?: number, descr?: string) {
    if (!codConta) {
      return;
    }

    if (confirm(`Tem certeza que deseja excluir a conta "${descr ?? codConta}"?`)) {
      this.accountService.deleteAccount(Number(codConta)).subscribe({
        next: () => this.loadAccounts(),
        error: err => console.error('Erro ao deletar conta:', err)
      });
    }
  }

  duplicate(account: AccountModel) {
    this.editingId = null;
    this.form.patchValue({
      codConta: '',
      descr: account.descr,
      tipo: account.tipo ?? '',
      saldoInicial: this.formatCurrencyInput(account.saldoInicial),
      dtSaldoInicial: this.toIsoDate(account.dtSaldoInicial),
      ativo: account.ativo === 'S'
    });
  }

  resetForm() {
    this.form.reset({
      codConta: '',
      descr: '',
      tipo: '',
      saldoInicial: '',
      dtSaldoInicial: '',
      ativo: true
    });
    this.editingId = null;
    this.submitting.set(false);
  }

  private buildPayload(): AccountModel {
    const raw = this.form.getRawValue();
    return {
      codConta: raw.codConta ? Number(raw.codConta) : undefined,
      descr: raw.descr?.trim() ?? '',
      tipo: (raw.tipo ?? '').toUpperCase(),
      saldoInicial: this.toNumber(raw.saldoInicial),
      dtSaldoInicial: raw.dtSaldoInicial,
      ativo: raw.ativo ? 'S' : 'N'
    };
  }

  toNumber(value: unknown): number {
    if (value === null || value === undefined) {
      return 0;
    }

    if (typeof value === 'string') {
      const normalized = value
        .trim()
        .replace(/\./g, '')
        .replace(',', '.');
      const parsedString = Number(normalized);
      return Number.isNaN(parsedString) ? 0 : parsedString;
    }

    if (typeof value === 'number') {
      return Number.isNaN(value) ? 0 : value;
    }

    return 0;
  }

  onSaldoInput(event: Event) {
    const control = this.form.get('saldoInicial');
    const input = event.target as HTMLInputElement | null;
    if (!control || !input) {
      return;
    }

    const digits = input.value.replace(/\D/g, '');
    if (!digits) {
      control.setValue('', { emitEvent: false });
      input.value = '';
      return;
    }

    const numeric = Number(digits) / 100;
    const formatted = numeric.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    if (control.value !== formatted) {
      control.setValue(formatted, { emitEvent: false });
      input.value = formatted;
      requestAnimationFrame(() => {
        const end = formatted.length;
        input.setSelectionRange(end, end);
      });
    }
  }

  private formatCurrencyInput(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const amount = this.toNumber(value);
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  getAccountTypeLabel(code?: string): string {
    if (!code) {
      return '';
    }
    return this.accountTypes().find(type => type.codTipConta === code)?.descr ?? code;
  }

  private toIsoDate(value: string | undefined): string {
    if (!value) {
      return '';
    }
    return value.includes('T') ? value.split('T')[0] : value;
  }
}
