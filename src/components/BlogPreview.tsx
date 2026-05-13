import Link from "next/link";
import Image from "next/image";
import { blogs } from "@/data/blogs";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

const featured = blogs.filter((b) => b.featured).slice(0, 3);

export default function BlogPreview() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              Latest Articles
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Tips, Guides & Exam Updates
            </h2>
            <p className="text-gray-500 mt-1 text-sm">Expert advice to help you crack exams and choose the right college</p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:gap-2.5 transition-all"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-500">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {post.readTime} min read
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl text-sm"
          >
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
