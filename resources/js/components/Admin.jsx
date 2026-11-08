import Zone from "./Zone.jsx";
import {useEffect, useState} from "react";
import {GridStack} from "gridstack/dist/react";
import 'gridstack/dist/gridstack.min.css';

const config = {Zone: Zone}; //je to vedle aby se pokaždné nevytvářel znova objekt
export default function Admin() {
    const [layout, setLayout] = useState(null);
    const [error, setError] = useState(null);
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
        console.log("JOSN", JSON.stringify(items));
    }

    if (error) {
        return (<div>Error: {error.message}</div>)
    }
    if (layout === null) {
        return <div><strong>Louding</strong></div>;
    }
    console.log("layout loaded");
    return (
        <GridStack options={layout} components={config} onChange={handleChange} />
    )
}
