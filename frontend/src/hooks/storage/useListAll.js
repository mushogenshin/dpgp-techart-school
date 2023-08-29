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
        // sort the item refs by name
        const sortedItems = listResult.items.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        // just return the item refs
        setFiles(sortedItems);
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
