import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUsuario } from './add-usuario';

describe('AddUsuario', () => {
  let component: AddUsuario;
  let fixture: ComponentFixture<AddUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
