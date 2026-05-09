import React, { useEffect, useState } from "react";
import { FiArrowRight, FiShield, FiTruck } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../LIBS";
import { useTheme } from "../../Context/themeContext";
import { useCategory } from "../../Context/categoryContext";
import ProductCard from "../Product/ProductCard";

const HomePage = () => {
  const { theme } = useTheme();
  const { categories } = useCategory();
  const navigate = useNavigate();
  const [recentlyViewedProduct, setRecentlyViewedProduct] = useState([]);
  const isDark = theme === "dark";

  const dynamicCategories =
    categories
      ?.filter((category) => category?.parentCategory === null)
      ?.map((mainCategory) => ({
        id: mainCategory?._id,
        value: mainCategory?.name,
      })) || [];

  const featuredCategories = dynamicCategories.slice(0, 6);

  useEffect(() => {
    setRecentlyViewedProduct(
      JSON.parse(localStorage?.getItem("recentlyViewed")) || []
    );
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 tablet:px-6 laptop:px-8">
        <section
          className={`rounded-[32px] border px-6 py-8 mobile:px-4 laptop:px-8 laptop:py-10 ${
            isDark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-white"
          }`}
        >
          <div className="grid gap-8 laptop:grid-cols-[minmax(0,1.2fr)_320px] laptop:items-center">
            <div className="max-w-3xl">
              <span
                className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${
                  isDark
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Browse Mart
              </span>

              <h1 className="mt-5 font-roboto text-4xl font-black leading-tight mobile:text-3xl tablet:text-5xl">
                A simpler way to discover and shop what you need.
              </h1>

              <p
                className={`mt-4 max-w-2xl text-sm leading-7 tablet:text-base ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Explore core categories, revisit products you viewed recently,
                and move through the store without visual clutter.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  btntext="Shop Products"
                  icon={<FiArrowRight />}
                  iconPosition="right"
                  className="rounded-2xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
                  onClick={() => navigate("/products")}
                />
                <Button
                  btntext="Seller Registration"
                  className={`rounded-2xl px-6 py-3 ${
                    isDark
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  onClick={() => navigate("/seller-registration")}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <div
                className={`rounded-[24px] border p-5 ${
                  isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-50"
                }`}
              >
                <p className={`text-xs uppercase tracking-[0.18em] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  Categories
                </p>
                <p className="mt-2 text-3xl font-black">{dynamicCategories.length}</p>
              </div>
              <div
                className={`rounded-[24px] border p-5 ${
                  isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-2xl p-3 ${
                      isDark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
                    }`}
                  >
                    <FiTruck />
                  </div>
                  <div>
                    <p className="font-semibold">Fast delivery</p>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Quick dispatch on supported orders.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`rounded-[24px] border p-5 ${
                  isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-2xl p-3 ${
                      isDark ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
                    }`}
                  >
                    <FiShield />
                  </div>
                  <div>
                    <p className="font-semibold">Secure checkout</p>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Smooth and protected buying flow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`rounded-[32px] border px-6 py-6 mobile:px-4 ${
            isDark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-3 small-device:flex-row small-device:items-end small-device:justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Categories
              </p>
              <h2 className="mt-2 font-roboto text-3xl font-bold mobile:text-2xl">
                Shop by category
              </h2>
            </div>
            <Link
              to="/products"
              className={`inline-flex items-center gap-2 text-sm font-semibold ${
                isDark ? "text-indigo-300" : "text-indigo-600"
              }`}
            >
              View all
              <FiArrowRight />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 mobile:grid-cols-2 tablet:grid-cols-3">
            {featuredCategories.map((category) => (
              <button
                key={category?.id}
                type="button"
                onClick={() =>
                  navigate(`/products?category=${encodeURIComponent(category?.value)}`)
                }
                className={`rounded-[24px] border px-5 py-5 text-left transition-all duration-300 ${
                  isDark
                    ? "border-gray-800 bg-gray-900 hover:bg-gray-800"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-roboto text-lg font-semibold">
                    {category?.value}
                  </h3>
                  <FiArrowRight
                    className={isDark ? "text-gray-500" : "text-gray-400"}
                  />
                </div>
              </button>
            ))}
          </div>
        </section>

        {recentlyViewedProduct.length > 0 ? (
          <section
            className={`rounded-[32px] border px-6 py-6 mobile:px-4 ${
              isDark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-white"
            }`}
          >
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Recently viewed
              </p>
              <h2 className="mt-2 font-roboto text-3xl font-bold mobile:text-2xl">
                Continue browsing
              </h2>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 mobile:grid-cols-2 small-device:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-4 desktop:grid-cols-6">
              {recentlyViewedProduct.map((item) => (
                <Link
                  to={`/product/${item?.id || item?._id}`}
                  className="h-full w-full"
                  key={item?.id || item?._id}
                >
                  <ProductCard product={item} />
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default HomePage;
