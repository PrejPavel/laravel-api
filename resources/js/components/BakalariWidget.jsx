import {useEffect, useState} from "react";


export default function BakalariWidget() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/sources/bakalari");
                const fetchedData = await response.json();
                if (fetchedData) {
                    setData(fetchedData);
                    console.log(data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    },[])

    return (
        <>
            <h1>Bakalari Widget</h1>
        </>
    )
}
