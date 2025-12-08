"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/app/services/api";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { useRouter, useParams } from "next/navigation";

// Import CSS
// import "filepond/dist/filepond.min.css";
// import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

export default function EditForm() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

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

  const [categories, setCategories] = useState<any[]>([]);

  // State FilePond
  const [avatarFiles, setAvatarFiles] = useState<any[]>([]);
  const [productImageFiles, setProductImageFiles] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  // 1. Load danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<any[]>("/api/categories");
        setCategories(res);
      } catch (error) {
        console.error("Lỗi category:", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. Load thông tin sản phẩm
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setFetching(true);
        const data: any = await api.get(`/api/product/${productId}`);
        const product = data.data || data;

        // Fill Text Fields
        setForm({
          name: product.name || "",
          category: product.category || "",
          type: product.type || "digital",
          version: product.version || "",
          price: product.price || "",
          stock: product.stock || "",
          description: product.description || "",
          manufactor: product.manufactor || "",
          language: product.language || "",
          releaseDate: product.releaseDate
            ? new Date(product.releaseDate).toISOString().split("T")[0]
            : "",
          metacriticScore: product.metacriticScore || "",
          metacriticURL: product.metacriticURL || "",
          ignScore: product.ignScore || "",
          ignURL: product.ignURL || "",
          playerNumber: product.playerNumber || "",
          ageConstraints: product.ageConstraints || "",
          videoLink: product.videoLink || "",
          options: Array.isArray(product.options)
            ? product.options.join(", ")
            : product.options || "",
          playmode: product.playmode || "",
        });

        // --- CẤU HÌNH ẢNH CŨ (QUAN TRỌNG) ---
        // Chúng ta lưu URL gốc vào 'metadata' tên là 'poster' (hoặc tên gì cũng được)

        if (product.avatar) {
          setAvatarFiles([
            {
              source: product.avatar,
              options: {
                type: "local",
                // Lưu URL gốc vào đây để lát submit lấy ra dùng
                metadata: { serverId: product.avatar },
              },
            },
          ]);
        }

        if (product.productImage && product.productImage.length > 0) {
          setProductImageFiles(
            product.productImage.map((url: string) => ({
              source: url,
              options: {
                type: "local",
                // Lưu URL gốc vào đây
                metadata: { serverId: url },
              },
            }))
          );
        }
      } catch (error) {
        console.error("Lỗi load sản phẩm:", error);
        setMessage("Không thể tải thông tin sản phẩm.");
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- HÀM SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      // 1. Append tất cả các trường text
      // Lưu ý: Đảm bảo không append giá trị null/undefined
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // 2. Xử lý Avatar
      if (avatarFiles.length > 0) {
        const item = avatarFiles[0];
        // Lấy metadata serverId chúng ta đã gán lúc init
        const serverId = item.getMetadata("serverId");

        if (serverId) {
          // A. Nếu có serverId -> Đây là ảnh cũ -> Gửi URL string
          formData.append("avatar", serverId);
        } else if (item.file instanceof File) {
          // B. Nếu không có serverId -> Đây là ảnh mới upload -> Gửi File
          formData.append("avatar", item.file);
        }
      }

      // 3. Xử lý Product Images
      productImageFiles.forEach((item) => {
        const serverId = item.getMetadata("serverId");

        if (serverId) {
          // A. Ảnh cũ -> Gửi URL string (Backend sẽ hứng vào body.productImage)
          formData.append("productImage", serverId);
        } else if (item.file instanceof File) {
          // B. Ảnh mới -> Gửi File (Backend sẽ hứng vào files.productImage)
          formData.append("productImage", item.file);
        }
      });

      // --- LOG ĐỂ KIỂM TRA (F12 trên trình duyệt) ---
      console.log("--- SUBMITTING FORM ---");
      for (const pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      // Gọi API Patch
      await api.patch(`/api/product/${productId}`, formData);

      setMessage("✅ Cập nhật sản phẩm thành công!");
      setTimeout(() => {
        router.push("/admin/products");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Lỗi khi cập nhật: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình Server Load để tải ảnh về hiển thị Preview
  const serverConfig = {
    load: (
      source: string,
      load: any,
      error: any,
      progress: any,
      abort: any,
      headers: any
    ) => {
      fetch(source)
        .then((res) => res.blob())
        .then((blob) => load(blob))
        .catch((err) => {
          console.error("Lỗi load ảnh preview:", err);
          error("Không tải được ảnh");
        });
    },
  };

  if (fetching)
    return <div className="text-center p-10">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-10 max-w-6xl mx-auto shadow-sm">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
      >
        {/* --- CỘT TRÁI --- */}
        <div className="space-y-5 flex flex-col">
          {/* Avatar FilePond */}
          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Ảnh đại diện
            </label>
            <div className="w-[180px] h-[180px]">
              <FilePond
                files={avatarFiles}
                onupdatefiles={setAvatarFiles}
                allowMultiple={false}
                name="avatar"
                labelIdle='<span class="text-4xl font-bold text-gray-500">+</span>'
                acceptedFileTypes={["image/*"]}
                stylePanelAspectRatio="1:1"
                imagePreviewHeight={180}
                className="filepond--root rounded-xl overflow-hidden shadow-sm"
                server={serverConfig} // ✅ Bật lại server load để hiển thị ảnh
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

          {/* ... Các trường khác giữ nguyên ... */}
          {/* Bạn copy lại phần danh mục, giá, tồn kho... vào đây */}
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
          {/* Giá */}
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
          {/* Tồn kho */}
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
          {/* Các trường khác bên trái... */}
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
              type="number"
              name="metacriticScore"
              value={form.metacriticScore}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Link Đánh Giá Metacritic
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
              type="number"
              name="ageConstraints"
              value={form.ageConstraints}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          {/* <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Options (Cách nhau bởi dấu phẩy)
            </label>
            <input
              type="text"
              name="options"
              value={form.options}
              onChange={handleChange}
              placeholder="Ví dụ: Standard Edition, Deluxe Edition"
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div> */}
        </div>

        {/* --- CỘT PHẢI --- */}
        <div className="space-y-5 flex flex-col">
          {/* Các trường bên phải... */}
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
          {/* ... Copy các input còn lại ... */}
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
              Platform
            </label>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            >
              <option value="PS5">PS5</option>
              <option value="Nintendo">Nintendo</option>
              <option value="Xbox">Xbox</option>
            </select>
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
              type="number"
              step="0.1"
              name="ignScore"
              value={form.ignScore}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Link Đánh Giá IGN
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
              Số người chơi tối đa
            </label>
            <input
              type="number"
              name="playerNumber"
              value={form.playerNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-600 block mb-2">
              Demo Video Link (Youtube Embed)
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

          {/* Product Images FilePond */}
          <div className="mt-auto">
            <label className="font-semibold text-gray-600 block mb-2">
              Ảnh sản phẩm
            </label>
            <div className="w-[180px] h-[180px]">
              <FilePond
                files={productImageFiles}
                onupdatefiles={setProductImageFiles}
                allowMultiple={true}
                maxFiles={10}
                name="productImage"
                labelIdle='<span class="text-4xl font-bold text-gray-500">+</span>'
                acceptedFileTypes={["image/*"]}
                stylePanelAspectRatio="1:1"
                imagePreviewHeight={180}
                className="filepond--root rounded-xl overflow-hidden shadow-sm"
                server={serverConfig} // ✅ Bật lại server load
              />
            </div>
          </div>
        </div>

        {/* --- MÔ TẢ & BUTTON --- */}
        <div className="col-span-2">
          <label className="font-semibold text-gray-600 block mb-2">
            Mô tả chi tiết
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-4 h-56 resize-none"
          />
        </div>

        <div className="col-span-2 flex items-center justify-center gap-4 mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>

        {message && (
          <div className="col-span-2 text-center text-red-600 font-medium">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
