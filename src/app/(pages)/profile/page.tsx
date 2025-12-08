"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/app/services/api";

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

  useEffect(() => {
    const loadProfile = async () => {
      const me = await api.get<UserDTO>("/api/users/me");
      setUser(me);
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await api.patch("/api/users/me", {
        name: user.name,
        phoneNumber: user.phoneNumber,
        address: user.address,
        avatar: user.avatar,
      });
      alert("✅ Profile updated");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="text-white p-6">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-white">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* ✅ Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border">
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="Avatar"
            fill
            className="object-cover"
          />
        </div>

        <input
          type="text"
          placeholder="Avatar URL"
          value={user.avatar || ""}
          onChange={(e) => setUser({ ...user, avatar: e.target.value })}
          className="bg-[#1e1e1e] px-3 py-2 rounded w-full"
        />
      </div>

      {/* ✅ Email (READ ONLY) */}
      <div>
        <label className="text-sm text-gray-400">Email (cannot change)</label>
        <input
          value={user.email}
          disabled
          className="bg-[#2a2a2a] px-3 py-2 rounded w-full text-gray-400 cursor-not-allowed"
        />
      </div>

      {/* ✅ Name */}
      <div>
        <label className="text-sm text-gray-400">Name</label>
        <input
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          className="bg-[#1e1e1e] px-3 py-2 rounded w-full"
        />
      </div>

      {/* ✅ Phone */}
      <div>
        <label className="text-sm text-gray-400">Phone</label>
        <input
          value={user.phoneNumber || ""}
          onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
          className="bg-[#1e1e1e] px-3 py-2 rounded w-full"
        />
      </div>

      {/* ✅ Address */}
      <div>
        <label className="text-sm text-gray-400">Address</label>
        <textarea
          value={user.address || ""}
          onChange={(e) => setUser({ ...user, address: e.target.value })}
          className="bg-[#1e1e1e] px-3 py-2 rounded w-full"
        />
      </div>

      {/* ✅ Save Button */}
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
