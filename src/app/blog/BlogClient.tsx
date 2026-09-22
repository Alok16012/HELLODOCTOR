"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { blogCategories, type BlogPost } from "@/data/blogs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock, ChevronRight, BookOpen, TrendingUp, Bookmark } from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogClient({ blogs }: { blogs: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? blogs
    : blogs.filter((b) => b.category.toLowerCase().replace(/\s+/g, "-") === activeCategory);

  const featured = blogs.filter((b) => b.featured).slice(0, 3);
  const latest = blogs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <div className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 py-14 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-sm font-medium px-4 py-2 rounded-full mb-5 border border-blue-500/30">
              <BookOpen className="w-4 h-4" />
              Education Resources & Guides
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              College Admission <span className="text-blue-400">Blog</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              Expert guides, exam tips, college rankings analysis, and career advice to help you make the best decisions for your future.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-7 text-gray-400 text-sm">
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-blue-400" /> {blogs.length} Articles</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-green-400" /> Updated Weekly</span>
              <span className="flex items-center gap-1.5"><Bookmark className="w-4 h-4 text-yellow-400" /> Expert Authors</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Featured Posts */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
              <span className="text-sm text-gray-500">Hand-picked by our editors</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Big Featured */}
              <div className="lg:col-span-2">
                {featured[0] && (
                  <Link href={`/blog/${featured[0].slug}`}>
                    <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden group cursor-pointer">
                      <Image
                        src={featured[0].image}
                        alt={featured[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {featured[0].category}
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                          {featured[0].title}
                        </h3>
                        <p className="text-white/70 text-sm line-clamp-2 mb-3">{featured[0].excerpt}</p>
                        <div className="flex items-center gap-3 text-white/60 text-xs">
                          <span>{featured[0].author}</span>
                          <span>·</span>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{featured[0].readTime} min read</span>
                          <span>·</span>
                          <span>{formatDate(featured[0].publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Small Featured */}
              <div className="space-y-4">
                {featured.slice(1, 3).map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <div className="relative h-44 rounded-2xl overflow-hidden group cursor-pointer">
                      <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-600/90 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 text-white/60 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime} min</span>
                          <span>·</span>
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {blogCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.slug
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {cat.name}
                {cat.slug !== "all" && (
                  <span className={`ml-1.5 text-xs ${activeCategory === cat.slug ? "text-blue-200" : "text-gray-400"}`}>
                    ({blogs.filter((b) => b.category.toLowerCase().replace(/\s+/g, "-") === cat.slug).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* All Posts Grid */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                {activeCategory === "all" ? "All Articles" : blogCategories.find(c => c.slug === activeCategory)?.name}
                <span className="text-gray-400 font-normal text-base ml-2">({filtered.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden group h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                        <Image
                          src={post.authorAvatar}
                          alt={post.author}
                          width={28}
                          height={28}
                          className="rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{post.author}</p>
                          <p className="text-xs text-gray-400">{formatDate(post.publishedAt)}</p>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs shrink-0">
                          <Clock className="w-3 h-3" />
                          {post.readTime}m
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg">No articles in this category yet.</p>
              </div>
            )}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Stay Ahead with Latest Updates</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Get exam dates, admission alerts, scholarship deadlines, and expert articles directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl text-sm bg-white/15 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
              />
              <button className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm whitespace-nowrap">
                Subscribe Free
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
