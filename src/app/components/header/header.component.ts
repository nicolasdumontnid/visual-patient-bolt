import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <nav class="navbar">
        <div class="nav-brand">
          <h1>Telemis</h1>
        </div>
        
        <ul class="nav-menu" [class.active]="isMenuOpen">
          <li class="nav-item">
            <a routerLink="/cas-radio" 
               class="nav-link"
               [class.active]="activeRoute === '/cas-radio'"
               (click)="closeMenu()">
              Cas / Radio
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/worklists" 
               class="nav-link"
               [class.active]="activeRoute === '/worklists'"
               (click)="closeMenu()">
              Worklists
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/templates" 
               class="nav-link"
               [class.active]="activeRoute === '/templates'"
               (click)="closeMenu()">
              Templates
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/patients" 
               class="nav-link"
               [class.active]="activeRoute === '/patients'"
               (click)="closeMenu()">
              Patients
            </a>
          </li>
        </ul>
        
        <div class="hamburger" (click)="toggleMenu()" [class.active]="isMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      background-color: #000;
      color: white;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      max-width: 1200px;
      margin: 0 auto;
      height: 60px;
    }

    .nav-brand h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }

    .nav-item {
      position: relative;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      transition: all 0.3s ease;
      border-bottom: 2px solid transparent;
      display: block;
    }

    .nav-link:hover {
      color: #ccc;
    }

    .nav-link.active {
      border-bottom-color: white;
      color: white;
    }

    .hamburger {
      display: none;
      flex-direction: column;
      cursor: pointer;
      gap: 4px;
    }

    .hamburger span {
      width: 25px;
      height: 3px;
      background-color: white;
      transition: 0.3s;
    }

    .hamburger.active span:nth-child(1) {
      transform: rotate(-45deg) translate(-5px, 6px);
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(45deg) translate(-5px, -6px);
    }

    @media (max-width: 768px) {
      .nav-menu {
        position: fixed;
        left: -100%;
        top: 60px;
        flex-direction: column;
        background-color: #000;
        width: 100%;
        text-align: center;
        transition: 0.3s;
        box-shadow: 0 10px 27px rgba(0,0,0,0.05);
        padding: 2rem 0;
        gap: 0;
      }

      .nav-menu.active {
        left: 0;
      }

      .nav-item {
        margin: 1rem 0;
      }

      .hamburger {
        display: flex;
      }
    }
  `]
})
export class HeaderComponent {
  activeRoute = '';
  isMenuOpen = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.activeRoute = event.url;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}