export interface CameraFeed {
  id: string;
  name: string;
  location: string;
  url: string;
}

export function CameraPanel({ feed }: { feed?: CameraFeed }) {
  return (
    <section className="glass camera-frame">
      <div className="camera-grid">
        {feed?.url ? (
          <img src={feed.url} alt={`${feed.name} camera feed`} />
        ) : (
          <>
            <div className="scan-line" />
            <strong>{feed?.name || "Camera Stream Placeholder"}</strong>
            <span>{feed?.location || "Add an MJPEG stream, snapshot URL, or local camera bridge URL"}</span>
          </>
        )}
      </div>
    </section>
  );
}
