import Player from './components/Player.jsx';
import {createRoot} from "react-dom/client";

const container = document.getElementById('player');
if (container) {
    const root = createRoot(container);
    root.render(<Player />);
}
