import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [ 
    RouterOutlet,
    RouterLink,
    RouterLinkActive],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {

   sidebarCollapsed = false;
  mobileSidebarOpen = false;
  profileMenuOpen = false;

  menus = [
    {
      label: 'Home',
      route: '/home',
      icon: 'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10'
    },
    {
      label: 'Home1',
      route: '/home',
      icon: 'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10'
    },
    {
      label: 'Home2',
      route: '/home',
      icon: 'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10'
    },
    {
      label: 'Home3',
      route: '/home',
      icon: 'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10'
    },
  ]

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen = false;
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }
}
