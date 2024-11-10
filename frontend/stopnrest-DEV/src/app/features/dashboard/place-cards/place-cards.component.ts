import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-place',
  templateUrl: './place-cards.component.html',
  styleUrls: ['./place-cards.component.css']
})
export class PlaceCardsComponent {
  @Output() placeSelected = new EventEmitter<string>();
  @ViewChild('placesGrid', { static: true }) placesGrid!: ElementRef<HTMLDivElement>;

  places = [
    { name: 'Goa', imageUrl: 'assets/goa.jpeg' },
    { name: 'Mumbai', imageUrl: 'assets/mumbai.jpeg' },
    { name: 'Delhi', imageUrl: 'assets/delhi.jpeg' },
    { name: 'Kolkata', imageUrl: 'assets/kolkata.jpeg' },
    { name: 'Chennai', imageUrl: 'assets/Chennai.png' },
    { name: 'Bengaluru', imageUrl: 'assets/bengaluru.jpeg' }
  ];

  onPlaceClick(placeName: string) {
    this.placeSelected.emit(placeName);
  }

  // Scroll left by a certain amount
  scrollLeft() {
    this.placesGrid.nativeElement.scrollBy({
      left: -200, // Adjust the scroll amount as needed
      behavior: 'smooth'
    });
  }

  // Scroll right by a certain amount
  scrollRight() {
    this.placesGrid.nativeElement.scrollBy({
      left: 200, // Adjust the scroll amount as needed
      behavior: 'smooth'
    });
  }

  // Handle mouse wheel scroll
  onScroll(event: WheelEvent) {
    event.preventDefault(); // Prevent default scrolling behavior
    this.placesGrid.nativeElement.scrollBy({
      left: event.deltaY < 0 ? -100 : 100, // Scroll left or right based on wheel direction
      behavior: 'smooth'
    });
  }
}
