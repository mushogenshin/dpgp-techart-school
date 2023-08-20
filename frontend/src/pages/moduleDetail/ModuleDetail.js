import { useFetchModule } from "../../hooks/useFetchModule";

export default function ModuleDetail({ moduleId }) {
  const { mod, error, isPending } = useFetchModule(moduleId);
  console.log(mod, error, isPending);

  return isPending ? (
    <h2>Đợi xíu nha 😙...</h2>
  ) : (
    <div>
      TODO: show
      {/* {modules.length > 0 ? (
        <Carousel courseId={courseId} modules={modules} />
      ) : (
        <h2>😳 Khóa học này trống trơn, không tìm thấy modules nào.</h2>
      )} */}
    </div>
  );
}
