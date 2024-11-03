import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { CellComponent } from '../cell/cell.component';
import { GameService, Board } from '../game.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, MatGridListModule, CellComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

  @Input() board!: Board;

  constructor(public gameService: GameService) { }

  public get id() {
    return this.board.id;
  }

  public get state() {
    return this.board.state;
  }

  public get winningCell() {
    return this.board.winningCell;
  }

  ngOnInit() {
  }
}
