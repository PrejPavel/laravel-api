import {useState, useEffect} from "react";

const spanStyle = {
    fontWeight: "bold",
}

//TODO: Limit pouze na jidla v tomto tydnu nebo dnu
//TODO: Caching
export default function LunchWidget({fetchUrl, numberOfDays}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lunch, setLunch] = useState([]);

    useEffect(() => {
        const fetchLunch = async () => {
            try {
                if (!fetchUrl) { return }
                const response = await fetch(fetchUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                const data = await response.json();
                if (data.success) {
                    if (Array.isArray(data.data)) {
                        setLunch(data.data);
                    }
                } else {
                    if (Array.isArray(data)) {
                        setLunch(data);
                    }
                }
                console.log(data);
            } catch (error) {
                console.log(error);
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchLunch();
        const interval = setInterval(() => {
            fetchLunch();
        }, 5 * 60 * 10000) //50 minut
        return () => clearInterval(interval);
    }, [fetchUrl]);

    if (fetchUrl === undefined) {
        return (
            <div style={spanStyle} className="LunchWidget">ERROR: NENÍ URL</div>
        )
    }
    if (error) {
        return (
            <div className="LunchWidget">
                <h1>ERROR: {error}</h1>
            </div>
        )
    }

    const lunches = lunch.slice(0, numberOfDays).map((lunch, lIndex) => (
        <div key={lIndex}>
            <h3>{lunch.day}</h3>
            <ul>
                {lunch.types.map((type, typeIndex) => (
                    <li key={typeIndex}>
                        <span style={spanStyle}>{type + ": "}</span>
                        <span>{lunch.meals[typeIndex]}</span>
                    </li>
                ))}
            </ul>
        </div>
    ))

    return (
        <div className="LunchWidget">
            <div>
                {loading ? <h1>Loading</h1> : lunches}
            </div>
        </div>
    )
}
