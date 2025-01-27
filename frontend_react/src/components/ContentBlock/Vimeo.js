// import { useEffect, useRef } from "react";

export default function Vimeo({ id }) {
  // const iframeRef = useRef(null);

  // useEffect(() => {
  //   const iframe = iframeRef.current;

  //   const handleMessage = (event) => {
  //     if (event.origin !== "https://player.vimeo.com") return;
  //     if (
  //       event.data &&
  //       event.data.event === "error" &&
  //       event.data.data &&
  //       event.data.data.message &&
  //       event.data.data.message.includes("privacy")
  //     ) {
  //       iframe.style.display = "none";
  //       iframe.addEventListener("error", (e) => e.preventDefault());
  //     }
  //   };

  //   const handleLoad = (event) => {
  //     console.log(`Vimeo iframe loaded: ${event.target.src}`);
  //   };

  //   window.addEventListener("message", handleMessage);
  //   if (iframe) {
  //     iframe.addEventListener("load", handleLoad);
  //   }

  //   return () => {
  //     window.removeEventListener("message", handleMessage);
  //     if (iframe) {
  //       iframe.removeEventListener("load", handleLoad);
  //     }
  //   };
  // }, []);

  return (
    <div
      // Vimeo embed styling
      style={{ padding: "56.25% 0 0 0", position: "relative" }}
    >
      <iframe
        // ref={iframeRef}
        title="Vimeo video player"
        src={`https://player.vimeo.com/video/${id}?badge=0&amp;autopause=0&amp`}
        width="640"
        height="360"
        style={{
          border: "none",
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        }}
        allow="autoplay; fullscreen; picture-in-picture"
      ></iframe>
    </div>
  );
}
