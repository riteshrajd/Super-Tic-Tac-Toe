import GameAndVideo from './pages/GameAndVideo';
import LobbyPage from './pages/LobbyPage';
import { useLobbyStore } from './store/lobbyStore';

const App = () => {
  const { start } = useLobbyStore();

  return (
    <div>
      {!start ? <LobbyPage /> : <GameAndVideo />}
    </div>
  )
}

export default App