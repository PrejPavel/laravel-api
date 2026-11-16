import Zone from "./Zone.jsx";
import {useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import {GridStack, useGridStack} from "gridstack/dist/react";
import AddWidgetButton from "./AddWidgetButton.jsx";
import 'gridstack/dist/gridstack.min.css';
import ClockWidget from "./ClockWidget.jsx";
import TextWidget from "./TextWidget.jsx";
import SaveButton from "./SaveButton.jsx";
import { GridStack as GridStackCore } from "gridstack";
import AdminMessages from "./AdminMessages.jsx";
import AdminForm from "./AdminForm.jsx";
import VideoWidget from "./VideoWidget.jsx";
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
    const [editingMessage, setEditingMessage] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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
                layoutRef.current = structuredClone(data.grid_json); //INFO: structuredClone
                setLayout(data.grid_json);
                GridStackCore.setupDragIn(".new-widget", {
                    appendTo: "body",
                    helper: "clone"
                });
            } catch (error) {
                console.log("Layout fetch Error: " + error.message);
                setError(error);
            }
        }
        fetchLayout();
    }, []);

    useEffect(() => {
        if (!layout) return;

        GridStackCore.setupDragIn(".new-widget", {
            appendTo: "body",
            helper: "clone"
        });
    }, [layout]);

    // Spojení čistých dat z DB s chováním editoru pouze pro render Adminu
    const gridOptions = useMemo(() => {
        if (!layout) return null;
        return {
            ...layout,
            removable: ".trash-zone",
            acceptWidgets: true
        };
    }, [layout]);

    const handleChange = (e, items) => {
        if (!items || !layoutRef.current) return;

        console.log("items changed", items);
        //console.log("JOSN", JSON.stringify(items)); //WARN: triggers cyclic object value
        console.log(layoutRef.current);

        items.forEach(item => {
            const changedZone = layoutRef.current.children.find(child => String(child.id) === String(item.id));
            if (!changedZone) return;
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

    const handleDropped = (e, previousWidget, newWidget) => {
        const componentName = newWidget.el?.getAttribute("data-component") || "Zone";

        // Odstraní surový DOM element vložený prohlížečem
        if (newWidget.el) {
            addWidgetRef.current?.grid?.removeWidget(newWidget.el);
        }

        const createdWidget = {
            id: `${Date.now()}`,
            x: newWidget.x,
            y: newWidget.y,
            w: newWidget.w,
            h: newWidget.h,
            component: componentName,
            props: {
                items: []
            }
        };

        layoutRef.current.children.push(createdWidget);
        addWidgetRef.current?.addWidget({ ...createdWidget });
    };
    const handleSave = async () => {
        try {
            //setSaving(true);
            const payload = {
                column: layoutRef.current.column,
                cellHeight: layoutRef.current.cellHeight,
                children: layoutRef.current.children.map(({ id, x, y, w, h, component, props }) => ({
                    id, x, y, w, h,
                    component,
                    ...(props ? { props } : {})
                }))
            }
            const response = await fetch("api/layouts/1",{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': 'application/json',
                },
                body: JSON.stringify({grid_json: payload})
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

    const handleFormSuccess = () => {
        setEditingMessage(null);
        setRefreshTrigger(prev => prev + 1);
        console.log("handlujem form sakses");
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
            <AdminMessages onEdit={(message) => setEditingMessage(message)} refreshTrigger={refreshTrigger} />
            <AdminForm key={editingMessage ? editingMessage.id : "new"} editingMessage={editingMessage}
                       onSuccess={handleFormSuccess} onCancel={() => setEditingMessage(null)} />
            <SaveButton onSave={handleSave}/>
            <AddWidgetButton layoutRef={layoutRef} addWidgetRef={addWidgetRef}/>
            <div className="trash-zone">Drop here to remove widget!</div>
            <div className="new-widget grid-stack-item" gs-w="2" gs-h="2" data-component="Zone">
                <div className="grid-stack-item-content" style={{userSelect:"none"}}>Drag me into the dashboard!</div>
            </div>
            <GridStack options={gridOptions} components={config} onChange={handleChange} onRemoved={handleRemoved} onDropped={handleDropped}>
                <GridBridge addWidgetRef={addWidgetRef}/>
            </GridStack>
        </>
    )
}
