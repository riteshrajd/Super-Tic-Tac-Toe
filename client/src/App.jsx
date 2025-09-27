import GamePage from './pages/GamePage';
import LobbyPage from './pages/LobbyPage';
import { useLobbyStore } from './store/lobbyStore';

const App = () => {
  const { start } = useLobbyStore();

  return (
    <div>
      {!start ? <LobbyPage /> : <GamePage />}
    </div>
  )
}

export default App