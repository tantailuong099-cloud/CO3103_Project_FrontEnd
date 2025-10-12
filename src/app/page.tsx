//import Navbar from "./component_tuan/Navbar";
import Hero from "./component_tuan/Hero";
import ProductSection from "./component_tuan/ProductSection";
//import Footer from "./component_tuan/Footer";

const mockProducts = [
  {
    id: 1,
    title: "Elden Ring: Shadow Of The Erdtree",
    subtitle: "Action, Mystery",
    price: "$25",
    rating: "8.8",
    image: "/figma/main.png",
    tags: ["Action", "RPG"],
  },
  {
    id: 2,
    title: "Elden Ring: Shadow Of The Erdtree",
    subtitle: "Action, Mystery",
    price: "$25",
    rating: "8.8",
    image: "/figma/main.png",
    tags: ["Action", "RPG"],
  },
  {
    id: 3,
    title: "Elden Ring: Shadow Of The Erdtree",
    subtitle: "Action, Mystery",
    price: "$25",
    rating: "8.8",
    image: "/figma/main.png",
    tags: ["Action", "RPG"],
  },
  {
    id: 4,
    title: "Elden Ring: Shadow Of The Erdtree",
    subtitle: "Action, Mystery",
    price: "$25",
    rating: "8.8",
    image: "/figma/main.png",
    tags: ["Action", "RPG"],
  },
  {
    id: 5,
    title: "Elden Ring: Shadow Of The Erdtree",
    subtitle: "Action, Mystery",
    price: "$25",
    rating: "8.8",
    image: "/figma/main.png",
    tags: ["Action", "RPG"],
  },
  {
    id: 6,
    title: "Elden Ring: Shadow Of The Erdtree",
    subtitle: "Action, Mystery",
    price: "$25",
    rating: "8.8",
    image: "/figma/main.png",
    tags: ["Action", "RPG"],
  },
  {
    id: 7,
    title: "Elden Ring: Shadow Of The Erdtree",
    subtitle: "Action, Mystery",
    price: "$25",
    rating: "8.8",
    image: "/figma/main.png",
    tags: ["Action", "RPG"],
  },
];

export default function Home() {
  return (
    <div className="space-y-24 pb-24 pt-12">
      <Hero />

      <ProductSection
        title="FLASH SALE"
        products={mockProducts}
        variant="flash-sale"
      />

      <ProductSection title="TOP PICKS FOU YOU" products={mockProducts} />

      <ProductSection title="MOST POPULAR" products={mockProducts} />
    </div>
  );
}