import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidAppComponent } from './covid-app.component';

describe('CovidAppComponent', () => {
  let component: CovidAppComponent;
  let fixture: ComponentFixture<CovidAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CovidAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
