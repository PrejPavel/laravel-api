import {GridStack} from "gridstack/dist/react";
import 'gridstack/dist/gridstack.min.css';
import Zone from "./Zone.jsx";

const options = {
    column: 6,
    cellHeight: 20,
    children: [
        {
            id: "a", x: 0, y: 0, w: 1, h: 2,
            component: "Zone",
            props: {
                items:
                    [
                        {widget: 'text',seconds: 2,  props: {text: 'Je to'}},
                        {widget: 'text',seconds: 4,  props: {text: 'Zone'}}
                    ]
            }
        },
        {
            id: "b", x: 2, y: 1, w: 1, h: 10,
            component: "Zone",
            props: {
                items:
                    [
                        {widget: 'clock',seconds: 2},
                        {widget: 'lunch',seconds: 6, props: {fetchUrl: 'http://127.0.0.1:8000/api/icanteenData'}},
                    ]
            }
        },
    ]
}
const config = {Zone: Zone}; //je to vedle aby se pokaždné nevytvářel znova objekt
export default function Player() {
    return (
        <GridStack options={options} components={config} />
    )
}
