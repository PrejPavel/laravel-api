/* eslint-disable react/prop-types */
import {useEffect, useState} from "react";
//TODO: pokud je smazana ta zprava co se edituje dejme cancel

const initialForm = {
    name: '',
    body: "",
    valid_from: "",
    valid_to: "",
    priority: 2,
    screen_ids: []
}

const formatDateForInput = (date) => {
    if (!date) {
        return "";
    }
    return date.replace(" ", "T").slice(0,16);
}

export default function AdminForm({editingMessage, onSuccess, onCancel}) {

    const [error, setError] = useState({});
    const [submitting, setSubmitting] = useState(false);
    //const [form, setForm] = useState(initialForm);
    const [screens, setScreens] = useState([]);

    const [form, setForm] = useState(() => {
        if (editingMessage) {
            return {
                name: editingMessage.name || "",
                body: editingMessage.body || "",
                valid_from: formatDateForInput(editingMessage.valid_from),
                valid_to: formatDateForInput(editingMessage.valid_to),
                priority: editingMessage.priority ?? 2,
                screen_ids: editingMessage.screens ? editingMessage.screens.map((s) => s.id) : []
            };
        }
        return initialForm;
    });

    useEffect(() => {
        fetch("/api/screens", {
            headers: {Accept: "application/json"},
        }).then(async (res) => {
            if (!res.ok) {
                throw new Error("HTTP error: " + res.status);
            }
            return res.json();
        }).then((data) => {
            const list = Array.isArray(data) ? data : (data.data ?? []);
            setScreens(list);
        })
            .catch((error) => {console.error(error)
                setScreens([]);
            });
    }, []);

    /*
    useEffect(() => {
        if (editingMessage) {
            setForm({
                name: editingMessage.name || "",
                body: editingMessage.body || "",
                valid_from: formatDateForInput(editingMessage.valid_from),
                valid_to: formatDateForInput(editingMessage.valid_to),
                priority: editingMessage.priority ?? 2,
                // Převedeme pole objektů screens na pole jejich ID
                screen_ids: editingMessage.screens ? editingMessage.screens.map((s) => s.id) : []
            });
            setError({});
        } else {
            setForm(initialForm);
        }
    }, [editingMessage]);
    */

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setSubmitting(true);

        const payload = {
            ...form,
            valid_from: form.valid_from || null,
            valid_to: form.valid_to || null,
        };
        setSubmitting(true);

        const isEditing = Boolean(editingMessage);
        const url = isEditing ? `/api/messages/${editingMessage.id}` : "/api/messages";
        const method = isEditing ? "PUT" : "POST";
        try {
            const response = await fetch(url, {
                method: method,
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) {
                if (data.errors) {
                    setError(data.errors);
                } else {
                    console.log("nevim");
                }
                return;
            }
            setForm(initialForm);
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: name === "priority" ? Number(value) : value }));
    }

    const handleScreenToggle = (screenId) => {
        setForm((prev) => ({ ...prev,
            screen_ids: prev.screen_ids.includes(screenId) ? prev.screen_ids.filter((id) => id !== screenId)
                : [...prev.screen_ids, screenId] }));
    };

    const handleSelectAll = () => {
        setForm((prev) => ({ ...prev,screen_ids: prev.screen_ids.length === screens.length
                ? [] : screens.map((s) => s.id)}));
    }


    //TODO: make a checkbox for deleting
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">name:</label>
            <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />
            <label htmlFor="body">body:</label>
            <textarea id="body" name="body" value={form.body} onChange={handleChange} required />
            <label htmlFor="validFrom">valid from:</label>
            <input type="datetime-local" id="validFrom" name="valid_from" value={form.valid_from} onChange={handleChange}/>
            <label htmlFor="validTo">valid to:</label>
            <input type="datetime-local" id="validTo" name="valid_to" value={form.valid_to} onChange={handleChange}/>
            <label htmlFor="priority" ></label>
            <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
                <option value={0}>highest</option>
                <option value={1}>high</option>
                <option value={2}>normal</option>
            </select>
            <fieldset>
                <legend>Screens</legend>
                {screens.length > 0 && (
                    <button type="button" onClick={handleSelectAll} >
                        {form.screen_ids.length === screens.length ? "Zrušit výběr" : "Vybrat všechny"}
                    </button>
                )}
                {screens.length === 0 ? (<div>No screens available</div>) : (
                    screens.map((screen) => (
                        <div key={screen.id}><label htmlFor={`screen-${screen.id}`}>
                            <input type="checkbox" id={`screen-${screen.id}`} checked={form.screen_ids.includes(screen.id)}
                                   onChange={() => handleScreenToggle(screen.id)}>
                            </input>
                            {" "}{screen.name}
                        </label></div>
                    ))
                )}
                {error.screen_ids && <div style={{ color: "red", fontSize: "0.9em" }}>{error.screen_ids[0]}</div>}
            </fieldset>
            <button type="submit" disabled={submitting}>{submitting ? "submitting..." : "submit"}</button>
            {editingMessage && (
                <button onClick={onCancel}>Cancel</button>
            )}
        </form>
    )
}
