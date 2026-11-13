import Zone from "./Zone.jsx";
import {useEffect, useImperativeHandle, useRef, useState} from "react";
import {GridStack, useGridStack} from "gridstack/dist/react";
import AddWidgetButton from "./AddWidgetButton.jsx";
import 'gridstack/dist/gridstack.min.css';
import ClockWidget from "./ClockWidget.jsx";
import TextWidget from "./TextWidget.jsx";
import SaveButton from "./SaveButton.jsx";
//TODO: config ze souboru uz me to stve
//TODO: Oznamit uložení uživateli
//TODO: Ošetření
//TODO: alertnout uživatele pokud je prazdny Zone aby se na playerovi nezobrazil error
//      nebo nezobrazovat error ale alertovat v adminu že to je problem
const config = {Zone: Zone, ClockWidget: ClockWidget, TextWidget: TextWidget}; //je to vedle aby se pokaždné nevytvářel znova objekt
function GridBridge({ addWidgetRef }) {
    const { addWidget } = useGridStack();
    useImperativeHandle(addWidgetRef, () => ({
        addWidget
    }), [addWidget]);
    return null;
}
export default function Admin() {
    const addWidgetRef = useRef(null);
    const [layout, setLayout] = useState(null);
    const [error, setError] = useState(null);
    const layoutRef = useRef(undefined);

    useEffect(() => {
        const fetchUrl = `api/layouts/1`
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
                layoutRef.current = structuredClone(data.grid_json); //INFO: structuredClone
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
            const changedZone = layoutRef.current.children.find(child => String(child.id) === String(item.id));
            changedZone.w = item.w;
            changedZone.y = item.y;
            changedZone.x = item.x;
            changedZone.h = item.h;
        });
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
    const handleRemoved = (e, items) => {
        const removedIds = items.map(item => String(item.id));
        layoutRef.current.children = layoutRef.current.children.filter(
            child => !removedIds.includes(String(child.id))
        );
    };
    const handleSave = async () => {
        try {
            //setSaving(true);
            const response = await fetch("api/layouts/1",{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                },
                body: JSON.stringify({grid_json: layoutRef.current})//cyclic object value when new zone has been added
            });
            if(response.ok){
                //setSaving(false);
                console.log("Layout is saved successfully (i think)");//TODO: replace with message or alert of some sorts
            }
            if (!response.ok) {
                console.log(response);
                throw new Error(`Unable to update ${response.status}`);
            }
        } catch (error) {
            console.log(error.message);
            setError(error);
            //setSaving(false);
        }
    }

    if (error) {
        return (<div>Error: {error.message}</div>)
    }
    if (layout === null) {
        return <div><strong>Louding</strong></div>;
    }
    console.log("layout loaded");
    //TODO: replace save button with a component
    //<button onClick={handleRemoveWidget}>Remove widget</button>
    return (
        <>
            <SaveButton onSave={handleSave}/>
            <AddWidgetButton layoutRef={layoutRef} addWidgetRef={addWidgetRef}/>
            <div className="trash-zone">Drop here to remove widget!</div>
            <GridStack options={layout} components={config} onChange={handleChange} onRemoved={handleRemoved}>
                <GridBridge addWidgetRef={addWidgetRef}/>
            </GridStack>
        </>
    )
}
