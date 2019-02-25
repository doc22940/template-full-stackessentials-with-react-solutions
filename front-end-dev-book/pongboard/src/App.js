import React from 'react';
import './App.css';
import Game from './Game';

const AppHeader = () => <h1 className="app-header">Pongboard</h1>;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentGame: [
        { id: 1, name: 'Player 1', score: 0 },
        { id: 2, name: 'Player 2', score: 0 },
      ],
      allGames: [],
      viewing: 'All',
      isLoading: true,
    };
  }

  componentDidMount() {
    fetch('https://pongboardapi.herokuapp.com/')
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          allGames: responseJson,
        });
      })
      .catch(error => console.log(error));
  }

  updateScore(playerId) {
    this.setState((previousState) => {
      const updatedGame = previousState.currentGame.map((player) => {
        if (player.id !== playerId) return player;
        return {
          ...player,
          score: player.score + 1,
        };
      });

      return { currentGame: updatedGame };
    });
  }

  showCurrentGame() {
    this.setState({
      viewing: 'Current',
    });
  }

  showAllGames() {
    this.setState({
      viewing: 'All',
    });
  }

  render() {
    let gameView;
    if (this.state.viewing === 'Current') {
      gameView = (
        <Game
          gameData={this.state.currentGame}
          updateScore={playerId => this.updateScore(playerId)}
        />
      );
    } else {
      gameView = this.state.allGames.map(game => (
        <Game
          key={game.id}
          gameData={game.players}
        />
      ));
    }

    if (this.state.isLoading) {
      return (
        <p>Loading...</p>
      );
    }

    return (
      <div>
        <AppHeader />
        <div className="app-navigation">
          <button onClick={() => this.showAllGames()}>View Previous Games</button>
          <button onClick={() => this.showCurrentGame()}>View Current Game</button>
        </div>
        { gameView }
      </div>
    );
  }
}

export default App;
