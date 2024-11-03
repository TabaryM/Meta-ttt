import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatGridListModule } from '@angular/material/grid-list';
import { BoardComponent } from "./board/board.component";
import { GameService } from './game.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BoardComponent, MatGridListModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = "meta-ttt";
  constructor(public gameService: GameService) { }
}
