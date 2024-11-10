import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceCardsComponent } from './place-cards.component';

describe('PlaceCardsComponent', () => {
  let component: PlaceCardsComponent;
  let fixture: ComponentFixture<PlaceCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaceCardsComponent]
    });
    fixture = TestBed.createComponent(PlaceCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
