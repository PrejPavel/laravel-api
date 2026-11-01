import {widgets} from "../widgets.js";
import {useEffect, useState} from "react";

export default function Zone({items}) {
    const [index, setIndex] = useState(0);

    if (!items || !items.length) {
        return (<div>ZONE ERROR: <strong>NENÍ ITEMS</strong></div>)
    }

    const item = items[index]
    const Widget = widgets[item.widget];

    function updateIndex() {
        if (index >= items.length - 1) {
            setIndex(0);
        } else {
            setIndex(index => index + 1);
        }
    }

    useEffect(() => {
        if (items.length < 2) return;

        const interval = setInterval(() => {
            updateIndex();
        }, item.seconds * 1000);
        return () => clearInterval(interval);
    }, [index]);

    if (!Widget) {
        return <div>ERROR 404: {item.widget}</div>
    }
    return (
        <Widget {...item.props} ></Widget>
    )
}
