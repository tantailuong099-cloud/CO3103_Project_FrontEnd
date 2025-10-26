"use client";

import Image from "next/image";
import { useState } from "react";

export default function DetailSection() {
  const details = [
    { label: "Genre", value: "Action, Adventure" },
    { label: "Platform", value: "Nintendo Switch 2, PS5, XBOX" },
    { label: "ESRB", value: "Everyone" },
    { label: "Year Production", value: "2023" },
    { label: "Manufacturer", value: "ABC" },
    { label: "Game file size", value: "ABC" },
    { label: "Players", value: "8" },
    { label: "Supported play modes", value: "TV mode, Tabletop mode, Handheld mode" },
    { label: "Supported languages", value: "..." },
  ];

  // Base + extra story paragraphs
  const storyParagraphs = [
    "As the lethal hunter Hornet, explore an ancient kingdom of insects haunted by silk and song.",
    "Captured and brought to this unfamiliar land, you must battle foes and solve mysteries as you ascend on a deadly pilgrimage to the kingdom’s peak.",
  ];
  const moreStory = [
    "Hollow Knight: Silksong is the epic sequel to Hollow Knight, the award-winning action-adventure. Journey to all-new lands, discover new powers and uncover ancient secrets tied to your nature and your past.",
    "Forge deadly new tools, master acrobatic combat and outwit terrifying new foes across vast, hand-crafted environments.",
  ];

  const [expanded, setExpanded] = useState(false);

  return (
    <section className="w-full bg-[#262626] text-white">
      {/* Header */}
      <div className="flex items-center bg-gradient-to-r from-[#fe8c31] to-[#f9393a] h-8 px-6 md:px-10 mb-6 rounded-sm">
        <p className="text-sm md:text-base font-bold tracking-wide">PRODUCT DETAILS</p>
      </div>

      {/* Trailer + Table */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-6 md:gap-8 px-6 md:px-10 mb-12">
        {/* Trailer */}
        <div className="w-full lg:w-[480px] aspect-video rounded-md overflow-hidden shadow-md">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/6XGeJwsUP9c"
            title="Hollow Knight: Silksong Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-md"
          />
        </div>

        {/* Details Table */}
        <div className="w-full lg:w-[640px] border border-[#e8e7e7] rounded-md overflow-hidden">
          {details.map((d, i) => (
            <div key={i} className="flex border-b border-[#e8e7e7] last:border-b-0">
              <div className="w-[220px] bg-[#1e1e1e] text-center font-semibold text-xs md:text-sm py-2.5 md:py-3 border-r border-[#e8e7e7]">
                {d.label}
              </div>
              <div className="flex-1 text-center text-[#bababa] text-xs md:text-sm py-2.5 md:py-3 bg-[#2b2b2b]">
                {d.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Section (with See more) */}
      <div className="relative w-full overflow-hidden rounded-lg">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/silksong_story_bg.webp"
            alt="Story Section Background"
            fill
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1d1d1dcc] to-[#262626]" />
        </div>

        {/* Foreground */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-10 py-10 md:py-12">
          {/* Logo */}
          <Image
            src="/images/silksong_logo.png"
            alt="Silksong Logo"
            width={560}
            height={200}
            className="object-contain mb-6 md:mb-8"
          />

          {/* Visible story */}
          <div className="max-w-3xl space-y-4 md:space-y-5 text-sm md:text-base leading-7 md:leading-8 text-[#eaeaea]">
            {storyParagraphs.map((text, i) => (
              <p key={`base-${i}`}>{text}</p>
            ))}
          </div>

          {/* Collapsible extra story */}
          <div
            className={`max-w-3xl overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
              expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
            aria-hidden={!expanded}
          >
            <div className="mt-4 md:mt-5 space-y-4 md:space-y-5 text-sm md:text-base leading-7 md:leading-8 text-[#eaeaea]">
              {moreStory.map((text, i) => (
                <p key={`more-${i}`}>{text}</p>
              ))}
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-6 md:mt-8 flex items-center gap-2 text-white hover:text-[#fe8c31] transition"
          >
            <span className="font-light text-sm md:text-base">
              {expanded ? "See less" : "See more"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
