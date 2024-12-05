import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from './core/services/auth.service.ts.service';
import { StoreModule } from '@ngrx/store';
import { bannerReducer } from './state/banners/banners.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Assement Frontend';

  constructor(public authService: AuthService){}

  ngOnInit(): void {
    initFlowbite();
  }

  logout(){
    this.authService.logout();
  }



}
