import { useState, useEffect } from "react";
import { ref, listAll } from "firebase/storage";
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
        // just return the item refs
        setFiles(listResult.items);
      })
      .catch((error) => {
        setError(error.message);
        setFiles(null);
      })
      .finally(() => {
        setIsPending(false);
      });
  }, [folderName]);

  return { files, error, isPending };
};
