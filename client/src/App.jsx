import GamePage from './pages/GamePage';
import LobbyPage from './pages/LobbyPage';
import { useGameStore } from './store/gameDataStore';

const App = () => {
  const { start } = useGameStore();

  return (
    <div>
      {!start ? <LobbyPage /> : <GamePage />}
    </div>
  )
}

export default App