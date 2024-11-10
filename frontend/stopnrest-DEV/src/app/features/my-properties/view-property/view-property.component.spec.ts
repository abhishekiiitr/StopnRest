import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ViewPropertyComponent } from './view-property.component';

describe('ViewPropertyComponent', () => {
  let component: ViewPropertyComponent;
  let fixture: ComponentFixture<ViewPropertyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPropertyComponent],
      imports:[HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(ViewPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
