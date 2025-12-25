import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountType } from './account-type';

describe('AccountType', () => {
  let component: AccountType;
  let fixture: ComponentFixture<AccountType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountType);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
