// app/products/edit/[id]/page.tsx
import EditForm from "./EditForm";

export default function EditPage() {
  return (
    <>
      <div className="p-6">
        <h1 className="text-black mb-[30px] font-[700] text-[32px]">
          Chỉnh sửa Sản Phẩm
        </h1>
        <EditForm />
      </div>
    </>
  );
}
