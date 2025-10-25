import Image from "next/image";

type CardProps = {
  title: string;
  genre: string;
  subtitle?: string | undefined;
  rating: number | string;
  price: number | string;
  image: string;
  tags?: string[];
};

export default function CardLayout({
  title,
  subtitle,
  genre,
  rating,
  price,
  image,
  tags,
}: CardProps) {
  return (
    <div className="bg-neutral-800 rounded-xl shadow-[0px_0px_4px_2px_#1e1e1e] overflow-hidden w-[180px] p-3 flex flex-col">
      {/* Image */}
      <div className="relative w-full h-[208px] rounded-md overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority
        />
      </div>

      {/* Text Info */}
      <div className="text-white text-left mt-3 flex flex-col gap-1 w-full">
        {/* Title */}
        <p className="text-sm font-semibold leading-tight w-full">{title}</p>

        {/* Genre + Rating in one line */}
        <div className="flex items-center gap-2 w-full">
          <p className="text-xs text-gray-400 flex-1">{genre}</p>
          <span className="border-2 border-[#fe8c31] rounded-full px-2 py-[2px] text-xs text-white shrink-0">
            {rating}
          </span>
        </div>

        {/* Price */}
        <p className="text-[#fe8c31] text-sm font-semibold mt-1 w-full">${price}</p>
      </div>

      {/* Button */}
      <button className="mt-3 w-full bg-[#fe8c31] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#ff9933] transition">
        Add to cart
      </button>
    </div>
  );
}
