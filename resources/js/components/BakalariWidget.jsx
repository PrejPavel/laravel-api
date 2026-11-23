import {useEffect, useState} from "react";

//TODO: map
export default function BakalariWidget() {
    const [data, setData] = useState(null);

    const [test, setTest] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/sources/bakalari");
                const fetchedData = await response.json();
                if (fetchedData) {
                    setData(fetchedData);
                    console.log(fetchedData);
                    const testteach = fetchedData.data.AbsentTeachers[0].Entity.Abbrev;
                    setTest(testteach);
                    console.log(test);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    },[]);

    return (
        <>
            <h1>Bakalari Widget</h1>
            <p>{test}</p>
        </>
    )
}
