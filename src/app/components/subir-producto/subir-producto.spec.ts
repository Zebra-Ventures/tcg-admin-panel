import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirProducto } from './subir-producto';

describe('SubirProducto', () => {
  let component: SubirProducto;
  let fixture: ComponentFixture<SubirProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubirProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubirProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
