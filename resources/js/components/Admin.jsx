import Zone from "./Zone.jsx";
import {useEffect, useRef, useState} from "react";
import {GridStack} from "gridstack/dist/react";
import 'gridstack/dist/gridstack.min.css';
import ClockWidget from "./ClockWidget.jsx";
import TextWidget from "./TextWidget.jsx";
//TODO: config ze souboru uz me to stve
//TODO: Oznamit uložení uživateli
//TODO: Ošetření
const config = {Zone: Zone, ClockWidget: ClockWidget, TextWidget: TextWidget}; //je to vedle aby se pokaždné nevytvářel znova objekt
export default function Admin() {
    const [layout, setLayout] = useState(null);
    const [error, setError] = useState(null);
    const layoutRef = useRef(undefined);
    useEffect(() => {
        const fetchUrl = `/api/layouts/1`
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
                layoutRef.current = data.grid_json; //INFO: structuredClone
                setLayout(data.grid_json);
            } catch (error) {
                console.log("Layout fetch Error: " + error.message);
                setError(error);
            }
        }
        fetchLayout();
    }, []);

    const handleChange = (e, items) => {
        console.log("items changed", items);
        //console.log("JOSN", JSON.stringify(items)); //WARN: triggers cyclic object value
        console.log(layoutRef.current);

        items.forEach(item => {
            const Zone = layoutRef.current.children.find(child => child.id === item.id);
            Zone.w = item.w;
            Zone.y = item.y;
            Zone.x = item.x;
            Zone.h = item.h;
        })
        console.log("ů layoutref",layoutRef.current);

        /*
        const mapItems = items.map( item => ({
                id: item.id,
                x: item.x,
                y: item.y,
                w: item.w,
                h: item.h,
        }));
        console.log(JSON.stringify(mapItems));
        */
    }
    const handleSave =async () => {
        try {
            const response = await fetch("api/layouts/1",{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                },
                body: JSON.stringify({grid_json: layoutRef.current})
            });
            if (!response.ok) {
                console.log(response);
                throw new Error(`Unable to update ${response.status}`);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    if (error) {
        return (<div>Error: {error.message}</div>)
    }
    if (layout === null) {
        return <div><strong>Louding</strong></div>;
    }
    console.log("layout loaded");
    return (
        <>
            <button onClick={handleSave} >Save</button>
            <GridStack options={layout} components={config} onChange={handleChange} />
        </>
    )
}
