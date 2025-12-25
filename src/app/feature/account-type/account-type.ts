import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AccountTypeService, AccountTypeModel } from './account-type.service';

@Component({
  selector: 'account-type',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './account-type.html',
  styleUrl: './account-type.css',
})
export class AccountType implements OnInit {
  accountTypes = signal<AccountTypeModel[]>([]);
  form: FormGroup;
  editingId: string | null = null;

  constructor(private accountTypeService: AccountTypeService, private fb: FormBuilder) {
    this.form = this.fb.group({
      codTipConta: ['', Validators.required],
      descr: ['', Validators.required],
      ativo: [true]
    });
  }

  ngOnInit() {
    this.loadAccountTypes();
  }

  loadAccountTypes() {
    this.accountTypeService.getAccountTypes().subscribe({
      next: (data: AccountTypeModel[]) => {
        console.log('Dados carregados:', data);
        this.accountTypes.set(data);
      },
      error: (err: any) => {
        console.error('Erro ao carregar tipos de conta:', err);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const accountType: AccountTypeModel = {
        ...formValue,
        ativo: formValue.ativo ? 'S' : 'N'
      };
      if (this.editingId) {
        this.accountTypeService.updateAccountType(this.editingId, accountType).subscribe({
          next: () => {
            this.loadAccountTypes();
            this.resetForm();
          },
          error: err => console.error('Erro ao atualizar:', err)
        });
      } else {
        this.accountTypeService.createAccountType(accountType).subscribe({
          next: () => {
            this.loadAccountTypes();
            this.resetForm();
          },
          error: err => console.error('Erro ao criar:', err)
        });
      }
    }
  }

  edit(accountType: AccountTypeModel) {
    this.editingId = accountType.codTipConta;
    this.form.patchValue({
      ...accountType,
      ativo: accountType.ativo === 'S'
    });
  }

  delete(codTipConta: string, descr: string) {
    if (confirm(`Tem certeza que deseja excluir "${descr}"?`)) {
      this.accountTypeService.deleteAccountType(codTipConta).subscribe({
        next: () => this.loadAccountTypes(),
        error: (err: any) => {
          console.error('Erro ao excluir:', err);
          alert('Erro ao excluir: ' + err.message);
        }
      });
    }
  }

  resetForm() {
    this.form.reset();
    this.editingId = null;
  }
}
