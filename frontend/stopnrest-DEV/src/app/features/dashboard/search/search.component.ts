import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [DatePipe]
})
export class SearchComponent implements OnChanges {
  @Input() location: string = '';
  @Output() searchCriteria = new EventEmitter<any>();

  searchForm: FormGroup;

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    this.searchForm = this.fb.group({
      location: ['', Validators.required],
      checkIn: [''],
      checkOut: [''],
      category: ['SINGLE']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['location'] && changes['location'].currentValue) {
      this.searchForm.patchValue({ location: this.location });
    }
  }

  onCheckInChange() {
    const checkInDate = this.searchForm.get('checkIn')?.value;
    const checkOutDate = this.searchForm.get('checkOut')?.value;
    if (checkInDate && checkOutDate && new Date(checkOutDate) < new Date(checkInDate)) {
      this.searchForm.patchValue({ checkOut: checkInDate });
    }
  }

  searchHotels() {
    if (this.searchForm.valid) {
      const formattedCheckIn = this.datePipe.transform(this.searchForm.value.checkIn, 'yyyy-MM-dd');
      const formattedCheckOut = this.datePipe.transform(this.searchForm.value.checkOut, 'yyyy-MM-dd');

      const searchParams = {
        ...this.searchForm.value,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
      };
      console.log("Values of the search param ", searchParams);
      this.searchCriteria.emit(searchParams);
    }
  }
}