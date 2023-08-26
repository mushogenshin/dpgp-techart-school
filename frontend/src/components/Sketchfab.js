export default function Sketchfab({ id }) {
  return (
    <div className="sketchfab-embed-wrapper">
      <iframe
        title="Sketchfab player"
        frameBorder="0"
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        xr-spatial-tracking
        execution-while-out-of-viewport
        execution-while-not-rendered
        width="640"
        height="480"
        src={`https://sketchfab.com/models/${id}/embed`}
      ></iframe>
    </div>
  );
}
