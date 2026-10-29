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

  private gameService = inject(GameService);

  ngOnInit(): void {
    this.gameService.getGames().subscribe(games => {
      this.games = games;
      console.log(games);
    });
  }

  buscarId(id: number) {

    this.gameService.getGameById(id).subscribe(games => {
      this.games = [games];
      console.log(games)
    })
  }

  buscarGenre(genre: string) {
    if (!genre || genre === 'todos') {
      this.gameService.getGames().subscribe(games => {
        this.games = games;
        console.log(games);
      });
    } else {
      this.gameService.getGameByGenre(genre).subscribe(games => {
        this.games = games;
        console.log(games);
      });
    }
  }

  onGenreChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const genre = select.value;
    this.buscarGenre(genre)
    console.log(genre);
  }


}
