import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(j) {
    return (
      <div className="board-row">
        {this.renderSquare(3*j + 0)}
        {this.renderSquare(3*j + 1)}
        {this.renderSquare(3*j + 2)}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderRow(0)}
        {this.renderRow(1)}
        {this.renderRow(2)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      XisNext: true,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (!squares[i] && !calculateWinner(squares)){
      squares[i]= this.state.XisNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        XisNext: !this.state.XisNext,
        stepNumber: history.length,
      });
    }
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      XisNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to Move #' + move :
        'Go to Game Start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li> 
      );
    })

    let status;
    if (winner){
      status = 'Winner: ' + (this.state.XisNext ? 'O' : 'X');
    }
    else {
      status = 'Next player: ' + (this.state.XisNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

class Arena extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      games: [],
    };
  }
  deleteAllGames() {
    this.setState({
      games:[],
    })
  }
  createNewGame() {
    this.setState({
      games: this.state.games.concat(this.state.games.length + 1),
    })
  }

  render() {
    const games = this.state.games.map((game, gameKey) => {
      return(
        <Game key={gameKey}></Game>
      );
    }); 
    return(
      <div>
        <div>
          <button onClick={() => this.createNewGame()}>Create New Game</button>
          <button onClick={() => this.deleteAllGames()}>Clear</button>
        </div>
        <div>
          {games}
        </div>
      </div>
    );
  }
}


// ========================================

ReactDOM.render(
  <Arena />,
  document.getElementById('root')
);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}