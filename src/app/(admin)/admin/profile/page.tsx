"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/app/services/api";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { useRouter } from "next/navigation";

// Import CSS (Nếu bạn đã import ở layout chung thì có thể bỏ qua)
// import "filepond/dist/filepond.min.css";
// import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

export default function ProfilePage() {
  const router = useRouter();

  // State Form
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    address: "",
    phoneNumber: "", // Thêm phone nếu DTO cho phép, dù JSON mẫu chưa có
  });

  // State FilePond (Avatar)
  const [avatarFiles, setAvatarFiles] = useState<any[]>([]);

  // UI States
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  // 1. Fetch dữ liệu User hiện tại
  useEffect(() => {
    const fetchMe = async () => {
      try {
        setFetching(true);
        // Gọi API GET /api/users/me
        const user: any = await api.get("/api/users/me");

        // Fill dữ liệu vào form
        setForm({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "",
          address: user.address || "",
          phoneNumber: user.phoneNumber || "", // Nếu backend có trả về
        });

        // Xử lý Avatar cũ (Nếu backend có trả về field avatar)
        if (user.avatar) {
          setAvatarFiles([
            {
              source: user.avatar,
              options: {
                type: "local",
                metadata: { serverId: user.avatar },
              },
            },
          ]);
        }
      } catch (error) {
        console.error("Lỗi tải thông tin cá nhân:", error);
        setMessage("Không thể tải thông tin người dùng.");
        setMessageType("error");
      } finally {
        setFetching(false);
      }
    };

    fetchMe();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Submit cập nhật (PATCH /api/users/me)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      // Append các trường text cho phép sửa
      formData.append("name", form.name);
      formData.append("address", form.address);
      if (form.phoneNumber) formData.append("phoneNumber", form.phoneNumber);

      // Xử lý Avatar (FilePond logic tương tự Product)
      if (avatarFiles.length > 0) {
        const item = avatarFiles[0];
        const serverId = item.getMetadata("serverId");

        if (serverId) {
          // Ảnh cũ (nếu backend cần biết giữ nguyên ảnh cũ thì gửi link, hoặc không gửi gì tùy logic BE)
          formData.append("avatar", serverId);
        } else if (item.file instanceof File) {
          // Ảnh mới
          formData.append("avatar", item.file);
        }
      }

      // Gọi API PATCH /api/users/me
      await api.patch("/api/users/me", formData);

      setMessageType("success");
      setMessage("✅ Cập nhật hồ sơ thành công!");

      // Tải lại trang để cập nhật dữ liệu mới nhất (nếu cần hiển thị avatar ở header/sidebar)
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setMessageType("error");
      setMessage("❌ Lỗi cập nhật: " + (err.message || "Đã có lỗi xảy ra"));
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình load ảnh preview cho FilePond
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
          console.error("Lỗi load ảnh:", err);
          error("Lỗi tải ảnh");
        });
    },
  };

  if (fetching) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-500 animate-pulse">
        Đang tải thông tin cá nhân...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-black mb-[30px] font-[700] text-[32px]">
        Hồ Sơ Của Tôi
      </h1>

      <div className="bg-white border border-gray-300 rounded-2xl p-10 max-w-5xl mx-auto shadow-sm">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
        >
          {/* --- CỘT TRÁI: AVATAR --- */}
          <div className="md:col-span-1 flex flex-col items-center space-y-4">
            <div className="w-[200px] h-[200px]">
              <label className="font-semibold text-gray-600 block mb-2 text-center">
                Ảnh đại diện
              </label>
              <FilePond
                files={avatarFiles}
                onupdatefiles={setAvatarFiles}
                allowMultiple={false}
                name="avatar"
                labelIdle='<span class="text-sm text-gray-500">Kéo thả hoặc <span class="text-blue-500 underline cursor-pointer">chọn ảnh</span></span>'
                acceptedFileTypes={["image/*"]}
                stylePanelAspectRatio="1:1"
                imagePreviewHeight={200}
                //imageCropAspectRatio="1:1"
                stylePanelLayout="compact circle" // Làm tròn nếu muốn, hoặc bỏ đi để vuông
                className="filepond--root rounded-full overflow-hidden shadow-sm"
                server={serverConfig}
              />
            </div>
            {/* <p className="text-xs text-gray-400 text-center px-4">
              Hỗ trợ định dạng: JPG, PNG, JPEG. <br /> Dung lượng tối đa: 5MB.
            </p> */}
          </div>

          {/* --- CỘT PHẢI: THÔNG TIN --- */}
          <div className="md:col-span-2 grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tên hiển thị */}
              <div>
                <label className="font-semibold text-gray-600 block mb-2">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="font-semibold text-gray-600 block mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="Chưa cập nhật"
                  className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Email (Read only) */}
            <div>
              <label className="font-semibold text-gray-600 block mb-2">
                Email{" "}
                <span className="text-xs font-normal text-gray-400">
                  (Không thể thay đổi)
                </span>
              </label>
              <input
                type="email"
                value={form.email}
                disabled
                className="w-full border border-gray-200 bg-gray-200 text-gray-500 rounded-md p-3 cursor-not-allowed"
              />
            </div>

            {/* Vai trò (Read only) */}
            <div>
              <label className="font-semibold text-gray-600 block mb-2">
                Vai trò hệ thống
              </label>
              <input
                type="text"
                value={form.role}
                disabled
                className="w-full border border-gray-200 bg-gray-200 text-gray-500 rounded-md p-3 cursor-not-allowed uppercase font-bold text-sm"
              />
            </div>

            {/* Địa chỉ */}
            <div>
              <label className="font-semibold text-gray-600 block mb-2">
                Địa chỉ
              </label>
              <textarea
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                placeholder="Nhập địa chỉ của bạn..."
                className="w-full border border-gray-300 bg-gray-50 text-black rounded-md p-3 h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* --- Buttons --- */}
            <div className="flex items-center gap-4 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition shadow-md"
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>

            {/* --- Message --- */}
            {message && (
              <div
                className={`mt-4 p-3 rounded-lg text-center font-medium ${
                  messageType === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
