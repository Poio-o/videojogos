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

  formGroup = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    }),
    genre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    platform: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01), Validators.max(100)]
    }),
    stock: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(999), Validators.pattern(/^\d+$/)]
    })
  });

  game: Game = this.emptyGame();
  actualizaGames = output<Game>();
  editCancelled = output<void>();
  saveError = '';
  saveMessage = '';

  private gameForm?: FormGroupDirective;

  @ViewChild('gameForm')
  set formDirective(form: FormGroupDirective | undefined) {
    this.gameForm = form;
    if (form) {
      form.resetForm(this.formValues(this.game));
    }
  }

  @Input()
  set editGame(game: Game | undefined) {
    this.game = game ? { ...game } : this.emptyGame();
    if (this.gameForm) {
      this.gameForm.resetForm(this.formValues(this.game));
    } else {
      this.formGroup.reset(this.formValues(this.game));
    }
    this.clearMessages();
  }

  saveGame(form: FormGroupDirective): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid || this.formGroup.pending) {
      return;
    }

    const isEditing = this.game.id !== undefined;
    const game: Game = {
      ...this.formGroup.getRawValue(),
      ...(isEditing ? { id: this.game.id } : {})
    };
    const request = isEditing
      ? this.gameService.updateGame(game)
      : this.gameService.postGame(game);

    this.clearMessages();
    request.subscribe({
      next: savedGame => {
        this.resetForm(form);
        this.actualizaGames.emit(savedGame);
        this.saveMessage = isEditing
          ? 'Videojuego actualizado correctamente.'
          : 'Videojuego creado correctamente.';
      },
      error: () => {
        this.saveError = 'No se pudo guardar el videojuego. Inténtalo de nuevo.';
      }
    });
  }

  cancelEdit(form: FormGroupDirective): void {
    this.resetForm(form);
    this.editCancelled.emit();
  }

  limpiar(form: FormGroupDirective): void {
    const wasEditing = this.game.id !== undefined;
    this.resetForm(form);
    if (wasEditing) {
      this.editCancelled.emit();
    }
  }

  private resetForm(form: FormGroupDirective): void {
    this.game = this.emptyGame();
    form.resetForm(this.formValues(this.game));
    this.clearMessages();
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

  private formValues(game: Game) {
    return {
      title: game.title,
      genre: game.genre,
      platform: game.platform,
      price: game.price,
      stock: game.stock
    };
  }

  private clearMessages(): void {
    this.saveError = '';
    this.saveMessage = '';
  }
}
