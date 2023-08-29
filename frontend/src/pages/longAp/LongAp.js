import { useState, useEffect, useRef } from "react";
import { storage } from "../../firebase_config";
import { ref, getDownloadURL } from "firebase/storage";
import { useListAll } from "../../hooks/storage/useListAll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function LongAp() {
  return (
    <div>
      <Album folderName="essays/styles-n-fundamentals" />
    </div>
  );
}

function Album({ folderName }) {
  const { files, error, isPending } = useListAll(folderName);
  const [activeIndex, setActiveIndex] = useState(0);
  const downloadURLsRef = useRef({});

  useEffect(() => {
    if (files && files[activeIndex]) {
      const fileRef = ref(storage, files[activeIndex].fullPath);
      getDownloadURL(fileRef)
        .then((url) => {
          setActiveDownloadURL(url);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [files, activeIndex]);

  return (
    <div>
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {files && <Carousel items={files} setActiveIndex={setActiveIndex} />}
      <h1>{activeIndex}</h1>
      {/* {activeDownloadURL && (
        <img src={activeDownloadURL} alt={files[activeIndex].name} />
      )} */}
    </div>
  );
}

// Carousel that allows circular navigation.
function Carousel({ items, setActiveIndex }) {
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
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {/* Next button */}
      <button onClick={handleNext}>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
