import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="home-container">
      <h1>Hello World</h1>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      background-color: #f5f5f5;
    }

    h1 {
      font-size: 3rem;
      color: #333;
      margin: 0;
    }
  `]
})
export class HomeComponent {}