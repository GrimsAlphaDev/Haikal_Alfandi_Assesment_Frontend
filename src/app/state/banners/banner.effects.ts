import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { BannerService } from '../../core/services/banner.service';
import {
  addBanner,
  addBannerFailure,
  addBannerSuccess,
  deleteBanner,
  deleteBannerFailure,
  deleteBannerSuccess,
  loadBanners,
  loadBannersFailure,
  loadBannersSuccess,
} from './banners.action';
import {
  catchError,
  from,
  map,
  mergeMap,
  of,
  switchMap,
} from 'rxjs';

@Injectable()
export class BannerEffects {
  constructor(
    private actions$: Actions,
    private bannerService: BannerService
  ) {}

  // banner dispatch
  loadBanners$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBanners),
      switchMap(() =>
        // call the banner service
        from(this.bannerService.getBanners()).pipe(
          map((banners) => loadBannersSuccess({ banners: banners })),
          catchError((error) => of(loadBannersFailure({ error })))
        )
      )
    )
  );

  //   save banner
  addBanner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBanner),
      mergeMap((action) =>
        this.bannerService.createBanner(action.banner).pipe(
          mergeMap((createdBanner) => [
            addBannerSuccess({ banner: createdBanner }),
            loadBanners(), // Tambahkan aksi untuk memuat ulang banner
          ]),
          catchError((error) => of(addBannerFailure({ error })))
        )
      )
    )
  );

  // delete banner
  deleteBanner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBanner),
      mergeMap((action) =>
        this.bannerService.deleteBanner(action.bannerId).pipe(
          mergeMap(() => [
            deleteBannerSuccess({ bannerId: action.bannerId }),
            loadBanners(), // Muat ulang daftar banner
          ]),
          catchError((error) => of(deleteBannerFailure({ error })))
        )
      )
    )
  );
}
