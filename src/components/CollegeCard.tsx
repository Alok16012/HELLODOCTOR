import Link from "next/link";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { College } from "@/data/colleges";

interface CollegeCardProps {
  college: College;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const typeColors: Record<string, string> = {
    Government: "bg-green-100 text-green-700",
    Private: "bg-orange-100 text-orange-700",
    Deemed: "bg-blue-100 text-blue-700",
  };

  return (
    <Link href={`/colleges/${college.id}`}>
      <div className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-44 overflow-hidden shrink-0">
          <Image
            src={college.image}
            alt={college.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-blue-600">
            {college.nirfRank.split(" ")[0]}
          </div>
          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${typeColors[college.type]}`}>
            {college.type}
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-gray-800">{college.rating}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
            {college.name}
          </h3>
          <span className="inline-block text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium mb-2 self-start">
            {college.accreditation}
          </span>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{college.location}</span>
          </div>

          {/* Stream tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {college.streams.slice(0, 3).map((s) => (
              <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
            ))}
            {college.streams.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{college.streams.length - 3}</span>
            )}
          </div>

          {/* Entrance Exam tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {college.exams.slice(0, 2).map((e) => (
              <span key={e} className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-full font-medium">
                {e}
              </span>
            ))}
          </div>

          {/* Stats footer */}
          <div className="mt-auto border-t border-gray-100 pt-3 grid grid-cols-3 gap-1">
            <div>
              <p className="text-xs text-gray-400">Fees/yr</p>
              <p className="text-xs font-bold text-blue-600">{college.feesDisplay}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Avg Pkg</p>
              <p className="text-xs font-bold text-green-600">₹{(college.placements.avgPackage / 100000).toFixed(1)}L</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Reviews</p>
              <p className="text-xs font-semibold text-gray-700">{(college.reviewCount / 1000).toFixed(1)}K</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
