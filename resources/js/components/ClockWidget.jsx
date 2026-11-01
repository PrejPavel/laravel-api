import {useEffect, useState} from "react";


export default function ClockWidget() {
    //uchovani casu
    const [time, setTime] = useState(new Date());
    //cas
    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        },1000);
        return () => {clearInterval(timerId);};
    }, []);
    //format
    const formattedTime = time.toLocaleTimeString();
    const formattedDate = time.toLocaleDateString();
    return (
        <div className="clock-widget">
            <div className="clock-time">{formattedTime}</div>
            <div className="clock-date">{formattedDate}</div>
        </div>
    );
}
