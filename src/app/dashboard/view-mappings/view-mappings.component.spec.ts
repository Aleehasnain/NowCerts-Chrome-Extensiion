import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMappingsComponent } from './view-mappings.component';

describe('ViewMappingsComponent', () => {
  let component: ViewMappingsComponent;
  let fixture: ComponentFixture<ViewMappingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMappingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMappingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
