import { Component, Input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { GameService, Cell, Board } from '../game.service';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [MatGridListModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css',
})
export class CellComponent {
  @Input() cell!: Cell;
  @Input() parent!: Board;

  constructor(private gameService: GameService) {}

  get parentId() {
    return this.parent.id;
  }

  get id() {
    return this.cell.id;
  }

  get lastPlayed() {
    return this.cell.lastPlayed;
  }

  get winningCell() {
    return this.cell.winningCell;
  }

  get state() {
    return this.cell.state;
  }

  get active() {
    return this.cell.active && this.gameService.metaBoard[this.parentId].active;
  }

  changeState() {
    if (this.cell.state === null && !this.gameService.isOver) {
      this.cell.state = this.gameService.player;
      this.gameService.changePlayer(this.cell, this.parent);
    }
  }
}
