import { Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faHouse,
  faArrowRightArrowLeft,
  faBuildingColumns
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth-service';
import { toast } from 'ngx-sonner';
import { ErrorMessages } from '../../enums/error-messages';

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
  faHouse = faHouse;
  faArrowRightArrowLeft = faArrowRightArrowLeft;
  faBuildingColumns = faBuildingColumns;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  user:any;


  menus = [
    {
      label: 'Dashboard',
      route: 'dashboard',
      icon: faHouse
    },
    {
      label: 'Transactions',
      route: 'transactions',
      icon: faArrowRightArrowLeft
    },
    {
      label: 'Accounts',
      route: 'accounts',
      icon: faBuildingColumns
    }
  ];


  async ngOnInit(): Promise<void> {
    try {
      const user = this.authService.getCurrentUser();
      if(!user) {
        toast.error(ErrorMessages.SESSION_TIMEOUT_ERROR);
        return;
      }
      console.log(user);
      this.user = user;
      console.log(this.user);
      
    } catch(error) {
        toast.error(ErrorMessages.SESSION_TIMEOUT_ERROR);
    } 
    
  }

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

  get initials(): string {
  const name = this.user?.displayName?.trim();

  if (!name) {
    return 'DU';
  }

  const words = name.split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (
    words[0].charAt(0) +
    words[words.length - 1].charAt(0)
  ).toUpperCase();
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

  async logout(): Promise<void> {
  try {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  } catch (error) {
    toast.error(ErrorMessages.LOGOUT_FAILED);
  }
}
}
