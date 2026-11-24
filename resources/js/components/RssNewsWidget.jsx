import {useEffect, useState} from "react";

//TODO: think about the limit in the adapter
//TODO: the /n are not being respected
//TODO: deal with whatever {phocagallery view=category|categoryid=287|limitstart=0|limitcount=0} is
export default function RssNewsWidget() {
    const [items, setItems] = useState(null);
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch("/api/sources/news", {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                const data = await response.json();
                if (data.success) {
                    if (Array.isArray(data.data)) {
                        setItems(data.data);
                    }
                } else {
                    if (Array.isArray(data)) {
                        setItems(data);
                    }
                }
            } catch (error) {
                console.log(error);
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
        const interval = setInterval(() => {
            fetchNews();
        }, 5 * 60 * 10000) //50 minut
        return () => clearInterval(interval);
    }, []);
    console.log(items);

    if (loading === true) {
        return ( <div>LOADING</div> );
    }

    if (error) {
        return ( <div>ERROR: {error}</div> );
    }

    return (
        <>
            <div>items se loglo alespon by melo bo neni error a loading je hotovy</div>
            {items.map((item, index) => (
                <div key={index}>
                    <h3>{item.title}</h3>
                    <div dangerouslySetInnerHTML={{__html: item.description}}/>
                </div>
            ))}
        </>
    )
}
