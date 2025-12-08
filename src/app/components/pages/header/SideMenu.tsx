"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Settings, Info, User, History } from "lucide-react";
import Image from "next/image";
import { api } from "@/app/services/api";

/* ---------------------------- TYPE DEFINITIONS ---------------------------- */
enum GameType {
  DIGITAL = "digital",
  PHYSICAL = "physical",
}

type Category = {
  _id: string;
  name: string;
  slug: string;
};

/* --------------------------- Main Side Menu Component --------------------------- */
export default function SideMenu({ onClose }: { onClose: () => void }) {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [categories, setCategories] = useState<
      { _id: string; name: string; description: string }[]
    >([]);
  const router = useRouter();

  // ✅ FETCH CATEGORY LIST TỪ API
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

  // ✅ TYPE SELECT
  const handleTypeSelect = (type: GameType) => {
    router.push(`/search?type=${type}`);
    onClose();
  };

  // ✅ CATEGORY SELECT
  const handleCategorySelect = (category: { id: string; name: string }) => {
    const { id, name } = category;

    router.push(
      `/search?categoryId=${id}&categoryName=${encodeURIComponent(name)}`
    );

    onClose();
  };


  return (
    <div className="flex h-full w-[300px] bg-[#1e1e1e] text-white flex-col justify-between relative">
      {/* Top logo & close */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
        <Image src="/icon/logo.png" alt="ARC Logo" width={110} height={36} />
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
          ✕
        </button>
      </div>

      {/* ---------------- MENU ---------------- */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 text-[17px]">
        {/* ✅ USER GROUP */}
        <MenuItem
          label="My Account"
          iconLeft={<User size={18} />}
          onClick={() => {
            router.push("/profile");
            onClose();
          }}
        />

        <MenuItem
          label="History Order"
          iconLeft={<History size={18} />}
          onClick={() => {
            router.push("/orders");
            onClose();
          }}
        />

        <Divider />

        {/* ✅ FILTER GROUP */}
        <MenuItem
          label="Type"
          iconRight={<ChevronDown size={16} />}
          onClick={() => setOpenPanel("TYPE")}
        />

        <MenuItem
          label="Category"
          iconRight={<ChevronDown size={16} />}
          onClick={() => setOpenPanel("CATEGORY")}
        />

        <Divider />

        {/* ✅ SYSTEM GROUP */}
        
      </nav>

      {/* Footer */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 text-[17px]">
        <MenuItem label="Settings" iconLeft={<Settings size={18} />} />
        <MenuItem label="About Us" iconLeft={<Info size={18} />} />
      </nav>
      <div className="py-3 border-t border-white/10 text-center text-xs text-gray-400">
        © 2025 ARC Studio
      </div>

      {/* ✅ TYPE PANEL */}
      {openPanel === "TYPE" && (
        <OptionPanel
          title="Product Type"
          options={[
            { label: "Digital", value: GameType.DIGITAL },
            { label: "Physical", value: GameType.PHYSICAL },
          ]}
          onBack={() => setOpenPanel(null)}
          onSelect={(value) => handleTypeSelect(value as GameType)}
        />
      )}

      {/* ✅ CATEGORY PANEL */}
      {openPanel === "CATEGORY" && (
        <OptionPanel
          title="Category"
          options={categories.map((c) => ({
            label: c.name,
            value: { id: c._id, name: c.name },
          }))}
          onBack={() => setOpenPanel(null)}
          onSelect={(category) => handleCategorySelect(category)}
        />
      )}
    </div>
  );
}

/* ----------------------------- Menu item ---------------------------- */
function MenuItem({
  label,
  iconLeft,
  iconRight,
  onClick,
}: {
  label: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between rounded-[12px] px-5 py-3 transition text-left hover:bg-white/10"
    >
      <div className="flex items-center gap-3">
        {iconLeft}
        <span>{label}</span>
      </div>
      {iconRight}
    </button>
  );
}

function Divider() {
  return <div className="border-t border-white/10 my-2" />;
}

/* ----------------------------- Slide-out Option Panel ---------------------------- */
function OptionPanel<T>({
  title,
  options,
  onBack,
  onSelect,
}: {
  title: string;
  options: { label: string; value: T }[];
  onBack: () => void;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="absolute top-0 left-[300px] h-full w-[260px] bg-black text-white shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#fe8c31] h-12 px-4 flex-shrink-0">
        <p className="font-semibold">{title}</p>
        <button onClick={onBack}>✕</button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <ul className="p-3 space-y-2">
          {options.map((opt) => (
            <li
              key={opt.label}
              onClick={() => onSelect(opt.value)}
              className="cursor-pointer py-2 px-3 border-b border-white/10 hover:bg-[#1e1e1e] rounded-md"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
