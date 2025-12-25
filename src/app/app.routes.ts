import { Routes } from '@angular/router';
import { AccountType } from './feature/account-type/account-type';
import { Account } from './feature/account/account';
import { ControlPanel } from './feature/control-panel/control-panel';

export const routes: Routes = [
    {
        path: 'painel',
        component: ControlPanel
    },
    {
        path: 'account-type',
        component: AccountType
    },
    {
        path: 'accounts',
        component: Account
    }
];
