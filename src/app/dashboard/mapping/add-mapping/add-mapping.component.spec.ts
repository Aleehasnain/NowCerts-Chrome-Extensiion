import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMappingComponent } from './add-mapping.component';

describe('AddMappingComponent', () => {
  let component: AddMappingComponent;
  let fixture: ComponentFixture<AddMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
