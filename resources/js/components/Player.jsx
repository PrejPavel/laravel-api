import {GridStack} from "gridstack/dist/react";
import 'gridstack/dist/gridstack.min.css';
import Zone from "./Zone.jsx";
import ClockWidget from "./ClockWidget.jsx";
import TextWidget from "./TextWidget.jsx";
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

const config = {Zone: Zone, ClockWidget: ClockWidget, TextWidget: TextWidget}; //je to vedle aby se pokaždné nevytvářel znova objekt
export default function Player() {
    //WARN: nedavat hooky mimo komponentu !!!
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const [layout, setLayout] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!token) return;
        const fetchUrl = `api/player/${token}`
        const fetchLayout = async () => {
            try {
                const response = await fetch(fetchUrl);
                if (!response.ok) {
                    const error = new Error(`Unable to fetch ${response.status}`);
                    error.status = response.status;
                    throw error;
                }
                const data = await response.json();
                if (!data || !data.grid_json){
                    throw new Error(`Grid json neni validni`);
                }

                console.log("layout je fetchnuty");
                //když je už mame stejny layout jako ten co je fetchnuty tak nererenderujeme
                setLayout(layout => {
                    if (layout != null && JSON.stringify(data.grid_json) === JSON.stringify(layout)) {
                        console.log("layouty jsou stejne");
                        return layout;
                    } else {
                        console.log("layout je nastaven");
                        return data.grid_json;
                    }
                });
                setError(null);
            } catch (error) {
                console.log("Layout fetch Error: " + error.message);
                setError(error);
            }
        }
        fetchLayout();
        const interval = setInterval(() => {
            fetchLayout();
        }, 30 * 1000); //každých 30 sekund
        return () =>  clearInterval(interval);
    }, [ token]);

    if (!token) {
        return <div>V URL není Token</div>
    }
    if (error && layout === null) {
        if (error.status === 404) {return <div>Layout nebyl nalezen {error.status}</div>;}
        if (error.status === 409) {return <div>Layout není nastaven {error.status}</div>;}
        return <div>Chyba {error.status ? error.status : "chyba pripojeni"}</div>;
    }
    if (layout === null) {
        return <div><strong>Louding</strong></div>;
    }
    return (
        <GridStack key={JSON.stringify(layout)} options={layout} components={config} />
    )

}
