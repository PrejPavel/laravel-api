/* eslint-disable react/prop-types */
import {widgets} from "../widgets.js";
import {useEffect, useState} from "react";

export default function Zone({items}) {
    const [index, setIndex] = useState(0);

    const item = items?.[index]
    const Widget = item ? widgets[item.widget] : undefined;

    useEffect(() => {
        if (!items || items.length < 2) return;
        const interval = setInterval(() => {
            if (index >= items.length - 1) {
                setIndex(0);
            } else {
                setIndex(index => index + 1);
            }
        }, item.seconds * 1000);
        return () => clearInterval(interval);
    }, [index, items, item]);

    if (!items || !items.length) {
        return (<div>ZONE ERROR: <strong>NENÍ ITEMS</strong></div>)
    }

    if (!Widget) {
        return <div>ERROR 404: {item.widget}</div>
    }
    return (
        <Widget {...item.props} ></Widget>
    )
}
