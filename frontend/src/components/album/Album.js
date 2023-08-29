import { useState, useEffect, useRef } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase_config";
import { useListAll } from "../../hooks/storage/useListAll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./Album.module.css";

export default function Album({ albumName, folderName }) {
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
          {/* <p>{activeDownloadURL}</p> */}
          {activeDownloadURL && (
            <img src={activeDownloadURL} alt={files[activeIndex].name} />
          )}
        </div>
      )}
    </div>
  );
}

// Carousel that allows circular navigation.
function Carousel({ items, activeIndex, setActiveIndex }) {
  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleBack = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  return (
    <div>
      {/* Back button */}
      <button onClick={handleBack}>
        <FontAwesomeIcon icon={faCaretLeft} />
      </button>

      <span className={styles.hint}>
        {activeIndex + 1} / {items.length}
      </span>

      {/* Next button */}
      <button onClick={handleNext}>
        <FontAwesomeIcon icon={faCaretRight} />
      </button>
    </div>
  );
}
