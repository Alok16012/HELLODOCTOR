"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CollegeCard from "./CollegeCard";
import { colleges } from "@/data/colleges";

const filterTabs = ["All", "Engineering", "Medical", "Management", "Law", "Design"];

export default function FeaturedColleges() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? colleges.slice(0, 8)
      : colleges.filter((c) => c.streams.includes(activeTab)).slice(0, 8);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Top Colleges</p>
            <h2 className="text-3xl font-bold text-gray-900">Featured Colleges Across India</h2>
            <p className="text-gray-500 mt-2">Handpicked colleges with best placements and academic excellence</p>
          </div>
          <Link href="/colleges" className="hidden sm:flex items-center gap-1 text-blue-600 text-sm font-medium hover:gap-2 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* College Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-colors"
          >
            View All Colleges <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
