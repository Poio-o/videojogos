
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = 'http://localhost:3000/games';
  private http = inject(HttpClient);

  getGames(genre: string = '', platform: string = '') {
    let params = new HttpParams();

    if (genre) {
      params = params.set('genre', genre);
    }

    if (platform) {
      params = params.set('platform', platform);
    }

    return this.http.get<Game[]>(this.apiUrl, { params });
  }

  getGameById(id: number) {
    return this.http.get<Game>(`${this.apiUrl}/${id}`);
  }

  searchGames(text: string) {
    const params = new HttpParams()
      .set('title_like', text);

    return this.http.get<Game[]>(this.apiUrl, { params });
  }

  searchGlobal(text: string) {
    const params = new HttpParams()
      .set('q', text);

    return this.http.get<Game[]>(this.apiUrl, { params });
  }


  getGamepriceMin(price_gte: number) {
    return this.http.get<Game[]>(
      `${this.apiUrl}?price_gte=${price_gte}`
    );
  }

  getGamepriceMax(price_lte: number) {
    return this.http.get<Game[]>(
      `${this.apiUrl}?price_lte=${price_lte}`
    );
  }

  getGameprice(price_gte: number, price_lte: number) {
    return this.http.get<Game[]>(
      `${this.apiUrl}?price_gte=${price_gte}&price_lte=${price_lte}`
    );
  }

getGamesPage(
  page: number,
  limit: number,
  genre: string,
  platform: string,
  title: string,
  global: string,
  minPrice: number,
  maxPrice: number
) {
  let params = new HttpParams()
    .set('_page', page)
    .set('_limit', limit);

  if (genre) params = params.set('genre', genre);
  if (platform) params = params.set('platform', platform);
  if (title) params = params.set('title_like', title);
  if (global) params = params.set('q', global);
  if (minPrice > 0) params = params.set('price_gte', minPrice);
  if (maxPrice > 0) params = params.set('price_lte', maxPrice);

  return this.http.get<Game[]>(this.apiUrl, {
    params,
    observe: 'response'
  });
}


}
