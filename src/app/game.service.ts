import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _metaBoard!: Board[];
  private _board!: Cell[];
  boardSize = 9;
  currentBoard: number | null = null;
  turnCount: number = 0;
  player: 'X' | 'O' = 'X';
  isOver: boolean = false;
  private _lastPlayed: Cell | null = null;

  constructor() {
    this.reset();
    this.board = this.resetBoard();
    this._metaBoard = this.resetMetaBoard();
  }

  reset() {
    this.player = 'X';
    this.turnCount = 0;
    this.isOver = false;
    this.board = this.resetBoard();
    this.metaBoard = this.resetMetaBoard();
  }

  resetMetaBoard(): Board[] {
    let board: Board[] = [];
    for (let i = 0; i < this.boardSize; i++) {
      board.push({
        id: i,
        state: null,
        active: true,
        lastPlayed: false,
        winningCell: false,
        subBoard: this.resetBoard(),
        get(i) {
          return this.subBoard[i];
        },
      });
    }
    return board;
  }

  resetBoard(): Cell[] {
    let board: Cell[] = [];
    for (let i = 0; i < this.boardSize; i++) {
      board.push({
        id: i,
        state: null,
        lastPlayed: false,
        winningCell: false,
        active: true,
      });
    }
    return board;
  }

  public get board(): Cell[] {
    return this._board;
  }

  public set board(board: Cell[]) {
    this._board = board;
  }

  public get metaBoard(): Board[] {
    return this._metaBoard;
  }

  public set metaBoard(metaBoard: Board[]) {
    this._metaBoard = metaBoard;
  }

  public get lastPlayed(): Cell | null {
    return this._lastPlayed;
  }

  public set lastPlayed(value: Cell | null) {
    for (let board of this._metaBoard)
      for (let cell of board.subBoard) cell.lastPlayed = value == cell;
    this._lastPlayed = value;
  }

  victory(board: Cell[]): boolean {
    return (
      this.checkDiag(board) ||
      this.checkLine(board, 'row') ||
      this.checkLine(board, 'col')
    );
  }

  checkDiag(board: Cell[]) {
    const timesRun = 2,
      midSquare = board[4];

    for (let i = 0; i <= timesRun; i += 2) {
      let upperCorner = board[i],
        lowerCorner = board[8 - i];

      if (!!midSquare.state && !!upperCorner.state && !!lowerCorner.state) {
        if (
          midSquare.state === upperCorner.state &&
          upperCorner.state === lowerCorner.state
        ) {
          midSquare.winningCell = true;
          upperCorner.winningCell = true;
          lowerCorner.winningCell = true;
          return true;
        }
      }
    }

    return false;
  }

  checkLine(board: Cell[], type: string): boolean {
    const ROW = type === 'row' ? true : false,
      DIST = ROW ? 1 : 3,
      INC = ROW ? 3 : 1,
      NUMTIMES = ROW ? 7 : 3;

    for (let i = 0; i < NUMTIMES; i += INC) {
      let firstCell = board[i],
        secondCell = board[i + DIST],
        thirdCell = board[i + DIST * 2];

      if (firstCell.state && secondCell.state && thirdCell.state) {
        if (
          firstCell.state === secondCell.state &&
          secondCell.state === thirdCell.state
        ) {
          firstCell.winningCell = true;
          secondCell.winningCell = true;
          thirdCell.winningCell = true;
          return true;
        }
      }
    }
    return false;
  }

  public changePlayer(cell: Cell, board: Board) {
    this.lastPlayed = cell;
    this.setBoardState(board);

    if (!this.victory(this.metaBoard)) {
      this.setActive(cell.id);
      console.log('Still playing\n');
      this.player = this.player === 'X' ? 'O' : 'X';
      this.turnCount++;
    } else {
      console.log('Game won by ' + this.player + '\n');
      this.isOver = true;
      this.cleanWinningCells();
    }
  }

  public cleanWinningCells() {
    for (let board of this.metaBoard) {
      board.active = false;
      if (!board.winningCell) {
        for (let cell of board.subBoard) {
          cell.winningCell = false;
        }
      }
    }
  }

  public setBoardState(board: Board) {
    if (this.victory(board.subBoard)) {
      console.log('Board %d won by %s!', board.id, this.player);
      board.state = this.player;
    } else {
      // Check draw
      let finished = true;
      for (let cell of board.subBoard) {
        if (!cell.state) {
          finished = false;
        }
      }
      if (finished) {
        board.state = 'draw';
      }
    }
  }

  public setActive(targetId: number) {
    if (!this.metaBoard[targetId].state) {
      // target is not finished
      for (let board of this.metaBoard) {
        // only target board is active
        board.active = board.id == targetId;
      }
    } else {
      // target is finised
      for (let board of this.metaBoard) {
        // board is active if it's not finished
        board.active = !board.state;
      }
    }
  }
}

export interface Cell {
  lastPlayed: boolean;
  id: number;
  state: any;
  active: boolean;
  winningCell: boolean;
}

export interface Board extends Cell {
  get(i: number): Cell;
  subBoard: Cell[];
}
