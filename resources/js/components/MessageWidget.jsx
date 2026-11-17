import {useEffect, useState} from "react";


export default function NessageWidget({token}) {
    const [message, setMessage] = useState([]);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await fetch(`/api/player/${token}/messages`, {
                   method: "GET",
                   headers: {
                       "Content-Type": "application/json",
                       Accept: "application/json",
                   }
                });
                const data = await response.json();
                console.log(data);
                setMessage(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchMessage();
    }, [token]);


    return (
        <>
            <div>{message.map((message, id) => (
                <div key={id}>
                    <div>{message.body}</div>
                </div>
            ))}</div>
        </>
    )
}
