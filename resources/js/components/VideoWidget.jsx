import { useRef } from "react";
import { useGridStack } from "gridstack/dist/react";

export default function VideoWidget({ fileName }) {
    const containerRef = useRef(null);
    const { grid } = useGridStack();
    const src = `/api/videos/${fileName}`;

    const handleMetadata = (e) => {
        const video = e.target;
        const gridItemEl = containerRef.current?.closest(".grid-stack-item");

        if (!grid || !gridItemEl || !video.videoWidth) return;

        // 1. Get the Zone's current width and Gridstack's cellHeight (20px in your DB)
        const currentWidth = gridItemEl.clientWidth;
        const cellHeight = grid.getCellHeight(true);

        // 2. Calculate exact height for the video's aspect ratio
        const aspectRatio = video.videoHeight / video.videoWidth;
        const targetHeightPx = currentWidth * aspectRatio;

        // 3. Update the Gridstack item height (this also triggers your handleChange in Admin!)
        const newH = Math.max(1, Math.round(targetHeightPx / cellHeight));
        grid.update(gridItemEl, { h: newH });
    };

    return (
        <div
            ref={containerRef}
            className="VideoWidget"
            style={{ width: "100%", height: "100%", overflow: "hidden" }}
        >
            <video
                src={src}
                onLoadedMetadata={handleMetadata}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                }}
                muted
                autoPlay
                loop
                playsInline
            />
        </div>
    );
}
