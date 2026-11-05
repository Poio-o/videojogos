
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { GameService } from './services/game.service';
import { Game } from './models/game';
import { CrudComponent } from './crud/crud.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CurrencyPipe, UpperCasePipe, CrudComponent]
})
export class AppComponent implements OnInit {

  games: Game[] = [];
  private gameService = inject(GameService);

  selectedGenre = '';
  selectedPlatform = '';
  minPrice = 0;
  maxPrice = 0;
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;
  searchTitle = '';
  searchGlobal = '';


  ngOnInit(): void {
    this.cargarGames();
  }

  cargarGames(): void {
    this.currentPage = 1;
    this.onChangePage();
  }

  onChangePage(): void {
    this.gameService.getGamesPage(
      this.currentPage,
      this.pageSize,
      this.selectedGenre,
      this.selectedPlatform,
      this.searchTitle,
      this.searchGlobal,
      this.minPrice,
      this.maxPrice
    ).subscribe(response => {
      this.games = response.body ?? [];

      this.totalItems = Number(
        response.headers.get('X-Total-Count') ?? 0
      );

      this.totalPages = Math.ceil(
        this.totalItems / this.pageSize
      );
    });
  }

  buscarId(id: number): void {
    this.gameService.getGameById(id).subscribe(game => {
      this.games = [game];
    });
  }

  buscarTitulo(text: string): void {
    this.searchTitle = text;
    this.currentPage = 1;
    this.onChangePage();
  }

  onGenreChange(genre: string): void {
    this.selectedGenre = genre;
    this.currentPage = 1;
    this.onChangePage();
  }

  onPlatformChange(platform: string): void {
    this.selectedPlatform = platform;
    this.currentPage = 1;
    this.onChangePage();
  }

  buscarGlobal(text: string): void {
    this.searchGlobal = text;
    this.currentPage = 1;
    this.onChangePage();
  }

  onBuscarPrecio(price_gte: string, price_lte: string): void {
    this.minPrice = price_gte ? +price_gte : 0;
    this.maxPrice = price_lte ? +price_lte : 0;

    this.currentPage = 1;
    this.onChangePage();
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.onChangePage();
    }
  }

  paginaSiguiente(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.onChangePage();
    }
  }

  onPageSizeChange(limit: string): void {
    this.pageSize = +limit;
    this.currentPage = 1;
    this.onChangePage();
  }

}
