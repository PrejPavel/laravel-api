import {useCallback, useEffect, useState} from "react";


export default function AdminMessages() {
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(true);

    //tentokrat mimo useffect abych mohl mit button na to
    const getMessagesData = useCallback(async () => {
        const response = await fetch("/api/messages");
        if (!response.ok) {
            throw new Error("Chyba při stahování zpráv");
        }
        return response.json();
    }, []);

    useEffect(() => {
        let ignore = false;
        getMessagesData().then((data) => {
                if (!ignore) {
                    console.log(data);
                    setMessage(data);
                    setLoading(false);
                }
            }).catch((error) => {
                if (!ignore) {
                    console.error(error);
                    setLoading(false);
                }
            });
        return () => {
            ignore = true;
        };
    }, [getMessagesData]);

    const handleRefresh = () => {
        setLoading(true);
        getMessagesData().then((data) => {
                console.log(data);
                setMessage(data);
                setLoading(false);
            }).catch((error) => {
                console.error(error);
                setLoading(false);
            });
    };

    if (loading) {
        return <div>Loadign Messages </div>
    }

    return (
        <>
            <div>Zprávy</div>
            <button onClick={handleRefresh}>refresh</button>
            <table>
                <thead>
                <tr>
                    <th>index</th>
                    <th>name</th>
                    <th>body</th>
                    <th>valid_from</th>
                    <th>valid_to</th>
                    <th>priority</th>
                    <th>screens</th>
                </tr>
                </thead>
                <tbody>
                {message.map((message, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{message.name}</td>
                        <td>{message.body}</td>
                        <td>{message.valid_from}</td>
                        <td>{message.valid_to}</td>
                        <td>{message.priority}</td>
                        <td>{message.screens && message.screens.length > 0
                            ? message.screens.map((s) => s.name).join(", ") : "noscreen😨"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}
