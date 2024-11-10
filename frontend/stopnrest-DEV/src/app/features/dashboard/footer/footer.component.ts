import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router to redirect

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  isModalOpen = false;

  constructor(private router: Router) {}

  // Open the modal
  openModal() {
    this.isModalOpen = true;
  }

  // Close modal and redirect to dashboard
  closeModalAndRedirect() {
    this.isModalOpen = false;
    this.router.navigate(['/dashboard']); // Redirect to dashboard route
  }
}
