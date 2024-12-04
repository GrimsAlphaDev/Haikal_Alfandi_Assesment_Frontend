import { Component, Input, NgZone } from '@angular/core';
import { BannerService } from '../../core/services/banner.service';
import { Banner } from '../../shared/models/banner.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { ExportService } from '../../core/services/export.service';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
})
export class BannerComponent {
  @Input() banners: Banner[] = [];
  bannerForm!: FormGroup;
  isEditMode: boolean = false;
  selectedBanner: any = null;
  deleteId: string | null = null;

  constructor(
    private bannerService: BannerService,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private exportService: ExportService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadBanners();
    this.initializeFlowbite();
  }

  initializeFlowbite() {
    this.ngZone.runOutsideAngular(() => {
      initFlowbite();
    });
  }

  loadBanners() {
    this.bannerService.getBanners().subscribe((data) => (this.banners = data));
  }

  initForm() {
    this.bannerForm = this.fb.group({
      id_banner_ads_package: [''],
      package_name: ['', Validators.required],
      package_description: ['', Validators.required],
      package_price: ['', Validators.required],
      package_duration: ['', Validators.required],
    });
  }

  sortPrice($event: any) {
    // Pastikan sorting dilakukan di service
    this.banners = this.bannerService.sortBanners(
      [...this.banners], // Gunakan spread operator untuk clone array
      $event.target.value
    );

    // Reinisialisasi Flowbite setelah perubahan
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        initFlowbite();
      }, 0);
    });
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

  openCreateModal() {
    // Reset form sebelum membuka modal create
    this.resetForm();
    this.isEditMode = false;
  }

  openEditModal(banner: Banner) {
    this.isEditMode = true;
    this.selectedBanner = banner;
    this.resetForm();
    this.bannerForm.patchValue({
      id_banner_ads_package: banner.id_banner_ads_package,
      package_name: banner.package_name,
      package_description: banner.package_description,
      package_price: this.currencyFormat(banner.package_price),
      package_duration: banner.package_duration,
    });

    this.showModal('edit_model');
  }

  // Reset form
  resetForm() {
    this.bannerForm.reset();
    this.isEditMode = false;
    this.selectedBanner = null;
  }

  showModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.classList.remove('hidden');
      // insert flex class
      modalElement.classList.add('flex');
    }
  }

  // Tutup modal
  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    const modalToggle = document.querySelector(
      `[data-modal-toggle="${modalId}"]`
    );

    if (modalToggle) {
      (modalToggle as HTMLElement).click();
    }

    if (modalElement) {
      modalElement.classList.add('hidden');
      modalElement.setAttribute('aria-hidden', 'true');
    }
  }


  createBanner(bannerData: any) {
    this.bannerService.createBanner(bannerData).subscribe({
      next: () => {
        this.loadBanners();
        this.closeModal('crud-modal');
        this.resetForm();
        alert('Banner created successfully');
      },
      error: (err) => {
        console.error('Error creating banner', err);
      },
    });
  }

  // if impement update
  updateBanner(bannerData: any) {
    // this.bannerService.updateBanner(bannerData).subscribe({
    //   next: () => {
    //     this.loadBanners();
    //     this.closeModal('edit_model');
    //     this.resetForm();
    //   },
    //   error: (err) => {
    //     console.error('Error updating banner', err);
    //   }
    // });
  }

  onSubmit() {
    if (this.bannerForm.valid) {
      const bannerData = {
        ...this.bannerForm.value,
        package_price: this.deformateCurrency(
          this.bannerForm.value.package_price
        ),
      };

      if (this.isEditMode) {
        // update logic here if want to edit
      } else {
        this.createBanner(bannerData);
      }
    } else {
      alert('Please fill the form');
    }
  }

  openDeleteConfirmModal(id: string) {
    this.deleteId = id;
    this.showModal('delete-confirm-modal');
  }

  confirmDelete() {
    if (this.deleteId) {
      this.bannerService.deleteBanner(this.deleteId).subscribe({
        next: () => {
          // Reload banners setelah delete
          this.loadBanners();
          
          // Tutup modal konfirmasi
          this.closeModal('delete-confirm-modal');
          
          // Reset delete ID
          this.deleteId = null;
  
          // Optional: Tambahkan notifikasi
          alert('Banner berhasil dihapus');
        },
        error: (error) => {
          console.error('Error deleting banner', error);
          alert('Gagal menghapus banner');
        }
      });
    }
  }

  exportPDF(){
    const columns = [
      'id_banner_ads_package',
      'package_name',
      'package_description',
      'package_price',
      'package_duration',
      'package_is_active'
    ];

    const exportData = this.banners.map(banner => ({
      id_banner_ads_package: banner.id_banner_ads_package,
      package_name: banner.package_name,
      package_description: banner.package_description,
      package_price: banner.package_price,
      package_duration: banner.package_duration,
      package_is_active: banner.package_is_active
    }));

    this.exportService.exportToPDF(
      exportData,
      columns,
      'Laporan Banner Ads',
    )

  }

  exportExcel() {
    const columns = [
      'id_banner_ads_package', 
      'nama_banner', 
      'deskripsi', 
      'harga', 
      'status'
    ];

    // Transformasi data sesuai kebutuhan
    const exportData = this.banners.map(banner => ({
      id_banner_ads_package: banner.id_banner_ads_package,
      nama_banner: banner.package_name,
      deskripsi: banner.package_description,
      harga: banner.package_price,
      status: banner.package_is_active ? 'Aktif' : 'Tidak Aktif'
    }));

    this.exportService.exportToExcel(
      exportData, 
      columns, 
      'Laporan_Banner_Ads'
    );
  }

}

