import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Banner } from "../../shared/models/banner.model";
import { map, Observable, tap } from "rxjs";

interface BannerResponse {
  data: Banner[];
  message: string;
  responseResult: string;
}

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private apiUrl = 'https://dev.patriotmed.id/BannerAds/Package';

  constructor(private http: HttpClient) {}

  // GET List Banners
  getBanners(): Observable<Banner[]>{
      return this.http.get<BannerResponse>(`${this.apiUrl}/List`).pipe(
        map(response => {
          if(response.responseResult){
            return this.sortBanners(response.data, 'asc');
          } else {
            throw new Error(response.message);
          }
        })
      )
    }

  // POST Create Banner
  createBanner(banner: Banner): Observable<Banner> {
    return this.http.post<Banner>(`${this.apiUrl}/Insert`, banner);
  }

  // DELETE Banner
  deleteBanner(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`);
  }

  // Sorting Method
sortBanners(
banners: Banner[], order: 'asc' | 'desc' = 'asc'  ): Banner[] {
    return banners.sort((a, b) => 
      order === 'asc' 
        ? a.package_price - b.package_price 
        : b.package_price - a.package_price
    );
  }
}