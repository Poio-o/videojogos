
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

}
