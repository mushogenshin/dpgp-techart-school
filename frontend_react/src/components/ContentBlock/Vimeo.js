export default function Vimeo({ id }) {
  return (
    <div
      // Vimeo embed styling
      style={{ padding: "56.25% 0 0 0", position: "relative" }}
    >
      <iframe
        title="Vimeo video player"
        src={`https://player.vimeo.com/video/${id}?badge=0&amp;autopause=0&amp`}
        width="640"
        height="360"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        }}
      ></iframe>
    </div>
  );
}
