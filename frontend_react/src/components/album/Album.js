import { useState, useEffect, useRef } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase_config";
import { useListAll } from "../../hooks/storage/useListAll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./Album.module.css";

export default function Album({ albumName, folderName, imgLabels }) {
  const { files, error, isPending } = useListAll(folderName);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeDownloadURL, setActiveDownloadURL] = useState(null);

  const downloadURLsRef = useRef({});

  useEffect(() => {
    if (files && files[activeIndex]) {
      const fileRef = ref(storage, files[activeIndex].fullPath);
      if (downloadURLsRef.current[fileRef.fullPath]) {
        setActiveDownloadURL(downloadURLsRef.current[fileRef.fullPath]);
      } else {
        getDownloadURL(fileRef)
          .then((url) => {
            downloadURLsRef.current[fileRef.fullPath] = url;
            setActiveDownloadURL(url);
          })
          .catch((error) => {
            console.error(error.message);
          });
      }
    }
  }, [files, activeIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 37) {
        // Left arrow key
        setActiveIndex((prevIndex) => prev_item(prevIndex, files.length));
      } else if (event.keyCode === 39) {
        // Right arrow key
        setActiveIndex((prevIndex) => next_item(prevIndex, files.length));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, files]);

  return (
    <div className={styles.album}>
      {error && <div>{error}</div>}
      <h2>{albumName}</h2>
      {isPending && <div>Loading...</div>}
      {files && (
        <div>
          <Carousel
            items={files}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />

          {/* DEBUG */}
          {/* <p>{activeDownloadURL}</p> */}
          {/* <p>{files[activeIndex].name}</p> */}

          {imgLabels[activeIndex] && (
            <p className={styles.label}>{imgLabels[activeIndex]}</p>
          )}
          {activeDownloadURL && <img src={activeDownloadURL} alt="" />}
        </div>
      )}
    </div>
  );
}

// Carousel that allows circular navigation.
function Carousel({ items, activeIndex, setActiveIndex }) {
  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => {
          setActiveIndex((prevIndex) => prev_item(prevIndex, items.length));
        }}
      >
        <FontAwesomeIcon icon={faCaretLeft} />
      </button>

      <span className={styles.hint}>
        {items.length === 0 ? activeIndex : activeIndex + 1} / {items.length}
      </span>

      {/* Next button */}
      <button
        onClick={() => {
          setActiveIndex((prevIndex) => next_item(prevIndex, items.length));
        }}
      >
        <FontAwesomeIcon icon={faCaretRight} />
      </button>
    </div>
  );
}

function next_item(prevIndex, length) {
  return length !== 0
    ? prevIndex === length - 1
      ? 0
      : prevIndex + 1
    : prevIndex;
}

function prev_item(prevIndex, length) {
  return length !== 0
    ? prevIndex === 0
      ? length - 1
      : prevIndex - 1
    : prevIndex;
}
