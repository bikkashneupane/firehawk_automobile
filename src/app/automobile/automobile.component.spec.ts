import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomobileComponent } from './automobile.component';

describe('AutomobileComponent', () => {
  let component: AutomobileComponent;
  let fixture: ComponentFixture<AutomobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
