import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMappingListComponent } from './all-mapping-list.component';

describe('AllMappingListComponent', () => {
  let component: AllMappingListComponent;
  let fixture: ComponentFixture<AllMappingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllMappingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
