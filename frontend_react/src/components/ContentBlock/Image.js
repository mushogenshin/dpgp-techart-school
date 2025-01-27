export default function Image({ src }) {
  return (
    <a href={src} target="_blank" rel="noopener noreferrer">
      <img src={src} alt="" style={{ maxWidth: "720px" }} />
    </a>
  );
}
