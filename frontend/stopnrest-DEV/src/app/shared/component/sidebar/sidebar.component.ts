import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userRole: string = '';

  ngOnInit() {
    this.userRole = localStorage.getItem('role') || 'user';
  }

  onNavigate(destination: string) {
    console.log('Navigating to:', destination);
  }

  showTab(tab: string): boolean {
    if (this.userRole === 'user') {
      return ['dashboard', 'bookings', 'profile'].includes(tab);
    } else if (this.userRole === 'owner') {
      return ['profile', 'my-properties','dashboard', 'bookings'].includes(tab);
    }
    return false;
  }
}