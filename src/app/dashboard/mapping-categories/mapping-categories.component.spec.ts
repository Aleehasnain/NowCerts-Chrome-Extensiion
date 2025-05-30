import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingCategoriesComponent } from './mapping-categories.component';

describe('MappingCategoriesComponent', () => {
  let component: MappingCategoriesComponent;
  let fixture: ComponentFixture<MappingCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MappingCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
