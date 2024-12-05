import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BannerState } from './banners.reducer';

export const selectBannersState = createFeatureSelector<BannerState>('banners');

export const selectAllBanners = createSelector(
  selectBannersState, // Gunakan feature selector
  (state: BannerState) => state.banners
);

export const selectBannersSortOrder = createSelector(
  selectBannersState,
  (state: BannerState) => state.sortOrder
)

