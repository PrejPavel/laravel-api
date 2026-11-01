import React from 'react';
import {createRoot} from "react-dom/client";
import Zone from "./components/Zone.jsx";
import Player from "./components/Player.jsx";

const playerStyle = {
    backgroundColor: "#c43756"
}

export default function App() {
    return (
        <>
            <div>
                <Zone items={[
                    {widget: 'text',seconds: 2,  props: {text: 'Ahoj'}},
                    {widget: 'text',seconds: 4,  props: {text: 'Nazdar'}},
                    {widget: "clock", seconds: 5},
                ]}  ></Zone>
            </div>

            <div style={playerStyle}>
                <Player />
            </div>
        </>
    )
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
