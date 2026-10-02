import React from "react";
import { useNavigate } from "react-router-dom";
import { SiPuma, SiZara, SiNike, SiAdidas } from "react-icons/si";
import { MdBoy, MdGirl } from "react-icons/md";
import { GiWatch } from "react-icons/gi";
import { TbMoodKidFilled, TbBrandJuejin } from "react-icons/tb";
import { LuFootprints } from "react-icons/lu";
import { Card, CardContent } from "@/components/ui/card";

const categoriesWithIcon = [
  { id: "Men", label: "Men", icon: MdBoy },
  { id: "Women", label: "Women", icon: MdGirl },
  { id: "Kids", label: "Kids", icon: TbMoodKidFilled },
  { id: "Accessories", label: "Accessories", icon: GiWatch },
  { id: "Footwear", label: "Footwear", icon: LuFootprints },
];

const Category = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (id) => {
    navigate(`/allproduct?category=${encodeURIComponent(id)}`);
  };

  return (
    <div className="categories w-full px-4 md:px-8 bg-gray-50">
      <section className="py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map(({ id, label, icon: Icon }) => (
              <Card
                key={id}
                onClick={() => handleCategoryClick(id)}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-white rounded-xl border border-gray-200 p-4"
              >
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <Icon size={48} className="w-10 h-10 mb-3 text-gray-800" />
                  <span className="font-semibold text-md text-gray-900">
                    {label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Category;
