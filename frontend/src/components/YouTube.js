export default function YouTube({ id }) {
  return (
    <div>
      <iframe
        title="YouTube video player"
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${id}`}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
  );
}
