"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/app/services/api";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { useRouter } from "next/navigation";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

export default function CreateForm() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    type: "digital",
    version: "",
    price: "",
    stock: "",
    description: "",
    manufactor: "",
    language: "",
    releaseDate: "",
    metacriticScore: "",
    metacriticURL: "",
    ignScore: "",
    ignURL: "",
    playerNumber: "",
    ageConstraints: "",
    videoLink: "",
    options: "",
    playmode: "",
  });
  const [categories, setCategories] = useState<
    { _id: string; name: string; description: string }[]
  >([]);
  const [avatar, setAvatar] = useState<File[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  // ✅ Lấy danh mục thật từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<
          { _id: string; name: string; description: string }[]
        >("/api/categories");
        setCategories(res);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (avatar[0]) formData.append("avatar", avatar[0]);
      productImages.forEach((file) => formData.append("productImage", file));

      console.log("🔍 Sending FormData:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await api.post("/api/product", formData);
      setMessage("✅ Tạo sản phẩm thành công!");
      setForm({
        name: "",
        category: "",
        type: "digital",
        version: "",
        price: "",
        stock: "",
        description: "",
        manufactor: "",
        language: "",
        releaseDate: "",
        metacriticScore: "",
        metacriticURL: "",
        ignScore: "",
        ignURL: "",
        playerNumber: "",
        ageConstraints: "",
        videoLink: "",
        options: "",
        playmode: "",
      });
      setAvatar([]);
      setProductImages([]);
      router.push("/admin/products");
    } catch (err: any) {
      setMessage("❌ Lỗi khi tạo sản phẩm: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-10 max-w-6xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
      >
        {/* --- Cột trái --- */}
        <div className="space-y-5 flex flex-col">
          {/* Ảnh đại diện */}
          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Ảnh đại diện
            </label>
            <div className="w-[180px] h-[180px]">
              <FilePond
                files={avatar}
                onupdatefiles={(fileItems) => {
                  setAvatar(fileItems.map((f) => f.file as File));
                }}
                allowMultiple={false}
                name="avatar"
                labelIdle='<span class="text-4xl font-bold text-gray-500">+</span>'
                acceptedFileTypes={["image/*"]}
                stylePanelAspectRatio="1:1"
                imagePreviewHeight={180}
                className="filepond--root rounded-xl overflow-hidden shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Tên sản phẩm
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Danh mục
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Giá
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Tồn kho
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          {/* Thêm 1 field để cân đối chiều cao */}
          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Ngày phát hành
            </label>
            <input
              type="date"
              name="releaseDate"
              value={form.releaseDate}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Điểm Metacritic
            </label>
            <input
              type="text"
              name="metacriticScore"
              value={form.metacriticScore}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Bài Đánh Giá Metacritic
            </label>
            <input
              type="text"
              name="metacriticURL"
              value={form.metacriticURL}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Giới Hạn Độ Tuổi
            </label>
            <input
              type="text"
              name="ageConstraints"
              value={form.ageConstraints}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Options
            </label>
            <input
              type="text"
              name="options"
              value={form.options}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>
        </div>

        {/* --- Cột phải --- */}
        <div className="space-y-5 flex flex-col">
          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Kiểu game
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            >
              <option value="digital">Digital</option>
              <option value="physical">Physical</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Version
            </label>
            <input
              type="text"
              name="version"
              value={form.version}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Ngôn ngữ
            </label>
            <input
              type="text"
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Nhà sản xuất
            </label>
            <input
              type="text"
              name="manufactor"
              value={form.manufactor}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Điểm IGN
            </label>
            <input
              type="text"
              name="ignScore"
              value={form.ignScore}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Bài Đánh Giá IGN
            </label>
            <input
              type="text"
              name="ignURL"
              value={form.ignURL}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Số Lượng người chơi tối đa
            </label>
            <input
              type="text"
              name="playerNumber"
              value={form.playerNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Demo Video Link
            </label>
            <input
              type="text"
              name="videoLink"
              value={form.videoLink}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Play Mode
            </label>
            <input
              type="text"
              name="playmode"
              value={form.playmode}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          {/* Ảnh sản phẩm */}
          <div className="mt-auto">
            <label className="font-semibold text-gray-600 block mb-2">
              Ảnh sản phẩm (tối đa 10)
            </label>
            <div className="w-[180px] h-[180px]">
              <FilePond
                files={productImages}
                onupdatefiles={(fileItems) => {
                  setProductImages(fileItems.map((f) => f.file as File));
                }}
                allowMultiple={true}
                maxFiles={10}
                name="productImage"
                labelIdle='<span class="text-4xl font-bold text-gray-500">+</span>'
                acceptedFileTypes={["image/*"]}
                stylePanelAspectRatio="1:1"
                imagePreviewHeight={180}
                className="filepond--root rounded-xl overflow-hidden shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* --- Mô tả (full 2 cột) --- */}
        <div className="col-span-2">
          <label className="font-semibold text-gray-600 block mb-2">
            Mô tả chi tiết
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-4 h-56 resize-none"
            placeholder="Nhập mô tả chi tiết về sản phẩm..."
          />
        </div>

        {/* --- Nút submit --- */}
        <div className="col-span-2 text-center mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Đang tạo..." : "Tạo mới"}
          </button>
          {message && <p className="mt-4 text-gray-700">{message}</p>}
        </div>
      </form>
    </div>
  );
}
