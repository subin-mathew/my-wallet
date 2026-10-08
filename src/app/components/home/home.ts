import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faBuildingColumns,
  faChartLine,
  faMoneyBillTransfer
} from '@fortawesome/free-solid-svg-icons';

@Component({
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule
  ],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {

  sidebarCollapsed = false;
  mobileSidebarOpen = false;
  profileMenuOpen = false;

  //font awesome icons
  faBuildingColumns = faBuildingColumns;
  faChartLine = faChartLine;
  faMoneyBillTransfer = faMoneyBillTransfer;

  menus = [
    {
      label: 'Dashboard',
      route: 'dashboard',
      icon: faChartLine
    },
    {
      label: 'Transactions',
      route: 'transactions',
      icon: faMoneyBillTransfer
    },
    {
      label: 'Accounts',
      route: 'accounts',
      icon: faBuildingColumns
    }
  ];

   @ViewChild('profileMenuRef')
  profileMenuRef!: ElementRef<HTMLElement>;

  toggleProfileMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.profileMenuOpen = !this.profileMenuOpen;
  }

    @HostListener('document:click', ['$event'])
  closeProfileMenu(event: MouseEvent): void {
    if (!this.profileMenuOpen) {
      return;
    }

    const target = event.target as Node;

    if (
      this.profileMenuRef &&
      !this.profileMenuRef.nativeElement.contains(target)
    ) {
      this.profileMenuOpen = false;
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen = false;
  }

}
