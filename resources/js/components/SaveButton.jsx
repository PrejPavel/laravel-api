import {useState} from "react";

const buttonStyle = {
    backgroundColor: "gray",
    padding: "10px",
    fontsize: "14px",

}

export default function SaveButton({onSave}) {
    const [saving, setSaving] = useState(false);

    const handleClick = async () => {
        setSaving(true);
        try {
            await onSave();
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <button onClick={handleClick} style={buttonStyle} disabled={saving}>{saving ? "Saving..." : "Save"} </button>
        </>
    )
}
