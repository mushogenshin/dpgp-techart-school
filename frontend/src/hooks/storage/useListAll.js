import { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase_config";

export const useListAll = (folderName) => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [files, setFiles] = useState(null);

  useEffect(() => {
    setFiles(null);
    setError(null);
    setIsPending(true);
    const folderRef = ref(storage, folderName);

    listAll(folderRef)
      .then((listResult) => {
        const promises = listResult.items.map((itemRef) =>
          getDownloadURL(ref(storage, itemRef.fullPath))
        );

        Promise.all(promises)
          .then((downloadURLs) => {
            const filesWithDownloadURLs = listResult.items.map(
              (itemRef, index) => ({
                ...itemRef,
                downloadURL: downloadURLs[index],
              })
            );
            setFiles(filesWithDownloadURLs);
            setError(null);
          })
          .catch((error) => {
            setError(error.message);
            setFiles(null);
          })
          .finally(() => {
            setIsPending(false);
          });
      })
      .catch((error) => {
        setError(error.message);
        setFiles(null);
        setIsPending(false);
      });
  }, [folderName]);

  return { files, error, isPending };
};
