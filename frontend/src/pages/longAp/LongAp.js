import { storage } from "../../firebase_config";
import { ref } from "firebase/storage";
import { useListAll } from "../../hooks/storage/useListAll";

export default function LongAp() {
  return (
    <div>
      <StylesAndFundamentals />
    </div>
  );
}

function StylesAndFundamentals() {
  const { files, error, isPending } = useListAll(
    "essays/styles-n-fundamentals"
  );

  return (
    <div>
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {files &&
        files.map((file, index) => (
          <img key={index} src={file.downloadURL} alt={file.name} />
        ))}
    </div>
  );
}
