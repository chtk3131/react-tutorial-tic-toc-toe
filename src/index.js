import React from 'react'
import ReactDOM from 'react-dom'
import "./index.css"

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return(
      <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}>

      </Square>
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history:[
        {
          squares:Array(9).fill(null)
        }
      ],
      stepNumber:0,
      xIsNext:true
    }
  }

  handleClick(i) {
    //固定の範囲の配列を返す
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    //最新は配列の末尾なので
    const current = history[history.length - 1];
    //なぜわざわざスライスするのか？
    const squares = current.squares.slice();

    //現在の状況を勝者判定の関数になげる
    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    //プレイヤーによって碁番に表示する文字を変える
    squares[i] = this.state.xIsNext?"X":"O";

    //stateの状態を更新
    this.setState({
      history:history.concat([
        {
          squares:squares
        }
      ]),
      stepNumber:history.length, //またはstepNumber+1
      xIsNext:!this.state.xIsNext
    });
  }

  //たぶん任意のstepの状態にするために使うやつ
  jumpTo(step) {
    this.setState({
      stepNumber:step,
      xIsNext:(step % 2) === 0  //これは先行がXである前提の話
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step,move) => {
      const desc = move ? "GO To Move #" + move : "Go To Game Start";

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if(winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return(
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)}>
          </Board>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{moves}</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />,document.getElementById("root"));

function calculateWinner(squares) {
  //この並びになったら勝ち　のパターン列挙
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  for(let i = 0; i < lines.length; i++) {
    //配列要素をそれぞれ取得
    const [a,b,c] = lines[i];

    //各添字の値がすべて同じなら勝ち
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  //3つ並んでいないならnullを返す
  return null;
}