"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/app/services/api";
import { useRouter } from "next/navigation";

// ✅ FilePond
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

type UserDTO = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Avatar FilePond state
  const [avatarFiles, setAvatarFiles] = useState<any[]>([]);

  const router = useRouter();

  // =========================
  // Load profile
  // =========================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const me = await api.get<UserDTO>("/api/users/me");
        setUser(me);

        // ✅ Load avatar cũ vào FilePond
        if (me.avatar) {
          setAvatarFiles([
            {
              source: me.avatar,
              options: {
                type: "local",
                metadata: {
                  serverId: me.avatar,
                },
              },
            },
          ]);
        }
      } catch (err: any) {
        console.error("❌ Not logged in:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =========================
  // Save profile
  // =========================
  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      if (user.phoneNumber) formData.append("phoneNumber", user.phoneNumber);
      if (user.address) formData.append("address", user.address);

      // ✅ Avatar logic (giữ ảnh cũ hoặc upload ảnh mới)
      if (avatarFiles.length > 0) {
        const item = avatarFiles[0];
        const serverId = item.getMetadata("serverId");

        if (serverId) {
          // giữ ảnh cũ
          formData.append("avatar", serverId);
        } else if (item.file instanceof File) {
          // upload ảnh mới
          formData.append("avatar", item.file);
        }
      }

      await api.patch("/api/users/me", formData);

      alert("✅ Profile updated");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // UI
  // =========================
  if (loading || !user) {
    return <div className="text-white p-6">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-white">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* ================= Avatar ================= */}
      <div className="flex items-center gap-4">
        <div className="w-24 h-24">
          <FilePond
            files={avatarFiles}
            onupdatefiles={setAvatarFiles}
            allowMultiple={false}
            acceptedFileTypes={["image/*"]}
            name="avatar"
            imagePreviewHeight={96}
            stylePanelAspectRatio="1:1"
            stylePanelLayout="compact circle"
            className="rounded-full overflow-hidden"
            server={{
              load: (source, load) => {
                fetch(source)
                  .then((res) => res.blob())
                  .then(load);
              },
            }}
          />
        </div>
      </div>

      {/* ================= Email (READ ONLY) ================= */}
      <div>
        <label className="text-sm text-gray-400">
          Email (cannot change)
        </label>
        <input
          value={user.email}
          disabled
          className="bg-[#2a2a2a] px-3 py-2 rounded w-full text-gray-400 cursor-not-allowed"
        />
      </div>

      {/* ================= Name ================= */}
      <div>
        <label className="text-sm text-gray-400">Name</label>
        <input
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          className="bg-[#1e1e1e] px-3 py-2 rounded w-full"
        />
      </div>

      {/* ================= Phone ================= */}
      <div>
        <label className="text-sm text-gray-400">Phone</label>
        <input
          value={user.phoneNumber || ""}
          onChange={(e) =>
            setUser({ ...user, phoneNumber: e.target.value })
          }
          className="bg-[#1e1e1e] px-3 py-2 rounded w-full"
        />
      </div>

      {/* ================= Address ================= */}
      <div>
        <label className="text-sm text-gray-400">Address</label>
        <textarea
          value={user.address || ""}
          onChange={(e) =>
            setUser({ ...user, address: e.target.value })
          }
          className="bg-[#1e1e1e] px-3 py-2 rounded w-full"
        />
      </div>

      {/* ================= Save ================= */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[#fe8c31] px-6 py-2 rounded font-semibold text-black hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
