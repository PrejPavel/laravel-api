import {GridStack} from "gridstack/dist/react";
import 'gridstack/dist/gridstack.min.css';
import Zone from "./Zone.jsx";
import {useState, useEffect } from "react";

/*
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
*/

const config = {Zone: Zone}; //je to vedle aby se pokaždné nevytvářel znova objekt
export default function Player() {
    //WARN: nedavat hooky mimo komponentu !!!
    const fetchUrl = "http://localhost:8000/api/layouts/2" //INFO: nevim ted je nemmene id
    const [layout, setLayout] = useState(null);
    useEffect(() => {
        const fetchLayout = async () => {
            try {
                const response = await fetch(fetchUrl);
                const data = await response.json();
                setLayout(data.grid_json);
            } catch (error) {
                console.log("Layout fetch Error: " + Error);
            }
        }
        const interval = setInterval(() => {
            fetchLayout();
        }, 30 * 60 * 1000); //každých 30 sekund
        return () =>  clearInterval(interval);
    }, [])
    if (layout === null) {
        return <div><strong>Louding</strong></div>;
    } else {
        return (
            <GridStack options={layout} components={config} />
        )
    }
}
