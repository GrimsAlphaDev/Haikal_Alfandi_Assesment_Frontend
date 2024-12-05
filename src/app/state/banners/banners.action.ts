import { createAction, props } from "@ngrx/store";
import { Banner } from "../../shared/models/banner.model";

export const loadBanners = createAction(
    '[Banners] Load Banners'
)

export const loadBannersSuccess = createAction(
    '[Banners] Load Banners Success',
    props<{ banners: Banner[]}>()
)

export const loadBannersFailure = createAction(
    '[Banners] Load Banners Failure',
    props<{ error: any}>()
)

export const addBanner = createAction(
    '[Banners] Add Banner',
    props<{ banner: Banner}>()
)

export const addBannerSuccess = createAction(
    '[Banners] Add Banner Success',
    props<{ banner: Banner}>()
)

export const addBannerFailure = createAction(
    '[Banners] Add Banner Failure',
    props<{ error: any}>()
)

export const sortBanners = createAction(
    '[Banners] Sort Banners',
    props<{sortOrder: 'asc' | 'desc'}>()
)

export const deleteBanner = createAction(
    '[Banners] Delete Banner',
    props<{bannerId: string}>()
)

export const deleteBannerSuccess = createAction(
    '[Banners] Delete Banner Success',
    props<{bannerId: string}>()
)

export const deleteBannerFailure = createAction(
    '[Banners] Delete Banner Failure',
    props<{error: any}>()
)