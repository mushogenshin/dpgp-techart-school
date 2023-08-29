import { useState, useEffect } from "react";
import { ref, listAll } from "firebase/storage";
import { storage } from "../../firebase_config";

// essays/styles-n-fundamentals
export const useListAll = (folderName) => {
  const [files, setFiles] = useState(null);

  useEffect(() => {
    setFiles(null);
    const folderRef = ref(storage, folderName);

    listAll(folderRef)
      .then((listResult) => {
        listResult.items.forEach((itemRef) => {
          console.log(itemRef.fullPath);
        });

        // return refs to files
        setFiles(listResult.items);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [folderName]);

  return { files };
};
