import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMappingListComponent } from './edit-mapping-list.component';

describe('EditMappingListComponent', () => {
  let component: EditMappingListComponent;
  let fixture: ComponentFixture<EditMappingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMappingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
