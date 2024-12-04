import { Component } from '@angular/core';
import { BannerService } from '../../core/services/banner.service';
import { Banner } from '../../shared/models/banner.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
})
export class BannerComponent {
  banners: Banner[] = [];
  bannerForm: FormGroup;

  constructor(private bannerService: BannerService, private fb: FormBuilder) {
    this.bannerForm = this.fb.group({
      package_name: ['', Validators.required],
      package_description: ['', Validators.required],
      package_price: ['', Validators.required],
      package_duration: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadBanners();
  }

  loadBanners() {
    this.bannerService.getBanners().subscribe((data) => (this.banners = data));
  }

  sortPrice($event: any) {
    this.banners = this.bannerService.sortBanners(
      this.banners,
      $event.target.value
    );
  }

  currencyFormat(price: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  }

  deformateCurrency(price: any) {
    // remove RP and space
    const removeRP = price.replace('Rp', '');
    // remove comma
    // if there is dot, remove all dot
    const removeDot = removeRP.replace(/\./g, '');
    // if there is comma, replace with dot
    const removeComma = removeDot.replace(/,/g, '.');
    // convert to number
    const numberValue = parseInt(removeComma);

    return numberValue;
  }

  formatCurrency($event: any) {
    const input = $event.target;
    const value = input.value;

    const numberValue = this.deformateCurrency(value);
    // format number to currency
    const formattedValue = this.currencyFormat(numberValue);

    // set the formatted value without resetting the cursor position
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.value = formattedValue;
    input.setSelectionRange(start, end);
  }

  onSubmit() {
    console.log('form: ', this.bannerForm.value);
    if (this.bannerForm.valid) {
  
      // deformat package_price
      this.bannerForm.value.package_price = this.deformateCurrency(this.bannerForm.value.package_price);

      this.bannerService.createBanner(this.bannerForm.value).subscribe({
        next: () => {
          console.log('Banner created');
          this.loadBanners();
          this.bannerForm.reset();
        },
        error: (err) => console.error(err),
      });
    } else {
      alert('Please fill the form');
    }
  }
}
