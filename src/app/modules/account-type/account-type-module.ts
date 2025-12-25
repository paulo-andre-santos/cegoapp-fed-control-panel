import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountTypeRoutingModule } from './account-type-routing-module';
import { AccountType } from '../../feature/account-type/account-type';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AccountTypeRoutingModule,
    AccountType
  ]
})
export class AccountTypeModule { }
