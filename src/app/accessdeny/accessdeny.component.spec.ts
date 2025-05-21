import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessdenyComponent } from './accessdeny.component';

describe('AccessdenyComponent', () => {
  let component: AccessdenyComponent;
  let fixture: ComponentFixture<AccessdenyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessdenyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessdenyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
