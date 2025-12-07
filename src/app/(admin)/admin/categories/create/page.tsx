// app/products/edit/[id]/page.tsx
import CreateForm from "./CreateForm";

export default function EditPage() {
  return (
    <>
      <div className="p-6">
        <h1 className="text-black mb-[30px] font-[700] text-[32px]">
          Tạo Danh Mục
        </h1>
        <CreateForm />
      </div>
    </>
  );
}
