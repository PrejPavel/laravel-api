/* eslint-disable react/prop-types */

export default function AddWidgetButton({ layoutRef, addWidgetRef }) {

    const handleAddWidget = () => {
        const newWidget = {
            id: `${Date.now()}`, w: 1, h: 2, x: 0, y: 0,
            component: "Zone"
        };
        addWidgetRef.current.addWidget({...newWidget});
        layoutRef.current.children.push(newWidget);
    };

    return <button onClick={handleAddWidget}>Add widget</button>;
}
