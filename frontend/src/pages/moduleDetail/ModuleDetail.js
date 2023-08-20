import { useFetchModule } from "../../hooks/useFetchModule";
import ModuleMetadata from "./ModuleMetadata";

export default function ModuleDetail({ moduleId }) {
  const { mod, error, isPending } = useFetchModule(moduleId);
  console.log(mod, error, isPending);

  return isPending ? (
    <h2>Đợi xíu nha 😙...</h2>
  ) : (
    <div>
      {error && <h2>😳 {error}</h2>}
      {mod && <ModuleMetadata mod={mod} />}
      {/* {modules.length > 0 ? (
        <Carousel courseId={courseId} modules={modules} />
      ) : (
        <h2>😳 Khóa học này trống trơn, không tìm thấy modules nào.</h2>
      )} */}
    </div>
  );
}
