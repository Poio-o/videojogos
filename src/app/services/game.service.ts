import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:3000/games';
  private http = inject(HttpClient);


  getGames() {
    return this.http.get<Game[]>(this.apiUrl);
  }

  getGameById(id: number) {
    return this.http.get<Game>(`${this.apiUrl}/${id}`);
  }

  getGameByGenre(genre: string) {
    return this.http.get<Game[]>(`${this.apiUrl}?genre=${genre}`)
  }

}
