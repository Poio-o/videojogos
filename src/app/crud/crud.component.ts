import { Component, inject, Input, output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Game } from '../models/game';

@Component({
  selector: 'app-crud',
  imports: [ReactiveFormsModule],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css'
})

export class CrudComponent {

  private gameService = inject(GameService);

  title = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] })

  genre = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  })

  formGroup = new FormGroup({
    title: this.title,
    genre: this.genre,
  })


  game: Game = this.emptyGame();
  actualizaGames = output<Game>();
  editCancelled = output<void>();

  @ViewChild('gameForm') private gameForm?: FormGroupDirective;

  @Input()
  set editGame(game: Game | undefined) {
    this.game = game ? { ...game } : this.emptyGame();
    this.gameForm?.resetForm(this.game);
  }

  saveGame(form: FormGroupDirective) {
    if (form.invalid || form.pending) {
      return;
    }

    const request = this.game.id !== undefined
      ? this.gameService.updateGame(this.game)
      : this.gameService.postGame(this.game);

    request.subscribe(savedGame => {
      this.resetForm(form);
      this.actualizaGames.emit(savedGame);
    });
  }

  cancelEdit(form: FormGroupDirective): void {
    this.resetForm(form);
    this.editCancelled.emit();
  }

  private resetForm(form: FormGroupDirective): void {
    this.game = this.emptyGame();
    form.resetForm(this.game);
  }

  private emptyGame(): Game {
    return {
      title: '',
      genre: '',
      platform: '',
      price: 0,
      stock: 0
    };
  }
}
