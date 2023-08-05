import { useParams } from "react-router-dom";

export default function CourseDetail() {
  const { id } = useParams();
  return <div>CourseDetail: {id}</div>;
}
