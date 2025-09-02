import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditUser } from './modal-edit-user';

describe('ModalEditUser', () => {
  let component: ModalEditUser;
  let fixture: ComponentFixture<ModalEditUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
