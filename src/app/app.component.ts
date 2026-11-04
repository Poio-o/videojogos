
import { Component, OnInit, inject } from '@angular/core';
import { GameService } from './services/game.service';
import { Game } from './models/game';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  games: Game[] = [];

  selectedGenre = '';
  selectedPlatform = '';

  private gameService = inject(GameService);

  ngOnInit(): void {
    this.cargarGames();
  }

  cargarGames(): void {
    this.gameService.getGames(
      this.selectedGenre,
      this.selectedPlatform
    ).subscribe(games => {
      this.games = games;
      console.log(games);
    });
  }

  buscarId(id: number): void {
    this.gameService.getGameById(id).subscribe(game => {
      this.games = [game];
    });
  }

  onGenreChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedGenre = select.value;
    this.cargarGames();
  }

  onPlatformChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPlatform = select.value;
    this.cargarGames();
  }

  buscarTitulo(text: string): void {
    if (!text.trim()) {
      this.cargarGames();
      return;
    }

    this.gameService.searchGames(text).subscribe(games => {
      this.games = games;
      console.log(games);
    });
  }

  buscarGlobal(text: string): void {
    if (!text.trim()) {
      this.cargarGames();
      return;
    }

    this.gameService.searchGlobal(text).subscribe(games => {
      this.games = games;
      console.log(games);
    });
  }

}
