import { createReducer, on } from '@ngrx/store';
import { Banner } from '../../shared/models/banner.model';
import {
  loadBanners,
  loadBannersFailure,
  loadBannersSuccess,
  addBanner,
  addBannerFailure,
  addBannerSuccess,
  sortBanners,
  deleteBanner,
  deleteBannerSuccess,
  deleteBannerFailure,
} from './banners.action';

export interface BannerState {
  banners: Banner[];
  error: any;
  status: string;
  sortOrder: 'asc' | 'desc';
}

export const initialState: BannerState = {
  banners: [],
  error: null,
  status: 'pending',
  sortOrder: 'asc',
};

export const bannerReducer = createReducer(
  initialState,

  // trigger loading banner
  on(loadBanners, (state) => ({ ...state, status: 'loading' })),

  // handle successfully loaded banners
  on(loadBannersSuccess, (state, { banners }) => ({
    ...state,
    banners: banners,
    error: null,
    status: 'success',
  })),

  on(loadBannersFailure, (state, { error }) => ({
    ...state,
    banners: [],
    error: error,
    status: 'error',
  })),

  on(addBanner, (state) => ({
    ...state,
    status: 'loading',
  })),
  on(addBannerSuccess, (state, { banner }) => ({
    ...state,
    banners: [...state.banners, banner],
    status: 'success',
    error: null,
  })),
  on(addBannerFailure, (state, { error }) => ({
    ...state,
    status: 'error',
    error: error,
  })),

  on(deleteBanner, (state) => ({
    ...state,
    deleteStatus: 'deleting'
  })),
  on(deleteBannerSuccess, (state, { bannerId }) => ({
    ...state,
    banners: state.banners.filter(banner => banner.id_banner_ads_package !== Number(bannerId)),
    deleteStatus: 'deleted',
    error: null
  })),
  on(deleteBannerFailure, (state, { error }) => ({
    ...state,
    deleteStatus: 'error',
    error: error
  })),

  on(sortBanners, (state, { sortOrder }) => {
    // Lakukan sorting pada array banner
    const sortedBanners = [...state.banners].sort((a, b) => {
      // Contoh sorting berdasarkan harga
      if (sortOrder === 'asc') {
        return a.package_price - b.package_price;
      } else {
        return b.package_price - a.package_price;
      }
    });

    return {
      ...state,
      banners: sortedBanners,
      sortOrder: sortOrder,
    };
  })
);
