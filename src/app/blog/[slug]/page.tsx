import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { blogs } from "@/data/blogs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowLeft, Clock, Calendar, Tag, ChevronRight, BookOpen, Share2,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function renderMarkdown(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-lg font-bold text-gray-800 mt-6 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={i} className="text-base font-bold text-gray-800 mt-4 mb-2">
          {line.slice(5)}
        </h4>
      );
    } else if (line.startsWith("|") && line.includes("|")) {
      // Table
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const headers = tableLines[0].split("|").filter(Boolean).map(s => s.trim());
      const rows = tableLines.slice(2).map(row => row.split("|").filter(Boolean).map(s => s.trim()));
      elements.push(
        <div key={i} className="overflow-x-auto my-5">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-50">
                {headers.map((h, hi) => (
                  <th key={hi} className="text-left px-4 py-2.5 font-semibold text-blue-800 border border-blue-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-gray-700 border border-gray-100">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      // List
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1.5 my-4 text-gray-700 text-sm leading-relaxed pl-2">
          {listItems.map((item, li) => (
            <li key={li} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </ul>
      );
      continue;
    } else if (line.match(/^\d+\. /)) {
      // Ordered list
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-1.5 my-4 text-gray-700 text-sm leading-relaxed pl-2">
          {listItems.map((item, li) => (
            <li key={li} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </ol>
      );
      continue;
    } else if (line.trim() === "") {
      // Skip empty lines
    } else {
      // Regular paragraph
      const html = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      elements.push(
        <p key={i} className="text-gray-700 text-sm leading-relaxed my-3" dangerouslySetInnerHTML={{ __html: html }} />
      );
    }
    i++;
  }
  return elements;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogs.find((b) => b.slug === slug);
  if (!post) notFound();

  const related = blogs
    .filter((b) => b.id !== post.id && b.category === post.category)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <div className="relative h-72 sm:h-96 w-full">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <div className="max-w-4xl mx-auto">
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-3 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Blog
              </Link>
              <div className="mb-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-3">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <Image
                    src={post.authorAvatar}
                    alt={post.author}
                    width={28}
                    height={28}
                    className="rounded-full object-cover border border-white/30"
                  />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTime} min read
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
                {/* Excerpt */}
                <p className="text-blue-700 bg-blue-50 border-l-4 border-blue-600 px-4 py-3 rounded-r-lg text-sm font-medium mb-6 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Content */}
                <div className="prose-sm max-w-none">
                  {renderMarkdown(post.content)}
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Author Box */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 mt-5">
                <div className="flex items-center gap-4">
                  <Image
                    src={post.authorAvatar}
                    alt={post.author}
                    width={64}
                    height={64}
                    className="rounded-full object-cover border-2 border-blue-100"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{post.author}</h3>
                    <p className="text-sm text-gray-500">{post.authorRole}</p>
                    <p className="text-xs text-blue-600 mt-1">Education Expert at CollegeForMe</p>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              {related.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {related.map((p) => (
                      <Link key={p.id} href={`/blog/${p.slug}`}>
                        <div className="bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all overflow-hidden group">
                          <div className="relative h-36 overflow-hidden">
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, 33vw"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-blue-600 font-semibold mb-1">{p.category}</p>
                            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {p.title}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-2 text-gray-400 text-xs">
                              <Clock className="w-3 h-3" />
                              {p.readTime} min read
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Share */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                  <Share2 className="w-4 h-4 text-blue-600" /> Share This Article
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "WhatsApp", color: "bg-green-500 hover:bg-green-600" },
                    { label: "LinkedIn", color: "bg-blue-600 hover:bg-blue-700" },
                    { label: "Twitter/X", color: "bg-gray-800 hover:bg-gray-900" },
                    { label: "Facebook", color: "bg-blue-800 hover:bg-blue-900" },
                  ].map((s) => (
                    <button key={s.label} className={`${s.color} text-white text-xs font-semibold py-2 rounded-lg transition-colors`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Article Info */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Article Info</h3>
                {[
                  { label: "Category", value: post.category },
                  { label: "Published", value: formatDate(post.publishedAt) },
                  { label: "Read Time", value: `${post.readTime} minutes` },
                  { label: "Author", value: post.author },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-400">{item.label}</span>
                    <span className="text-xs font-semibold text-gray-700">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Latest Articles */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-sm">Latest Articles</h3>
                  <Link href="/blog" className="text-xs text-blue-600 font-medium flex items-center gap-0.5 hover:gap-1.5 transition-all">
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {blogs
                    .filter((b) => b.id !== post.id)
                    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                    .slice(0, 5)
                    .map((p) => (
                      <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-3 group">
                        <div className="relative w-16 h-14 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                            {p.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {p.readTime}m
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

              {/* Topics */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Popular Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["JEE", "NEET", "CAT", "MBA", "CLAT", "Engineering", "Medical", "Scholarship", "Study Abroad", "Rankings", "Career"].map((t) => (
                    <Link
                      key={t}
                      href={`/blog`}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
                <h3 className="font-bold text-lg mb-1">Need Admission Help?</h3>
                <p className="text-blue-200 text-sm mb-4">Talk to our experts for free personalized guidance on your college admission.</p>
                <Link
                  href="/counselling"
                  className="flex items-center justify-center gap-2 bg-white text-blue-600 font-bold text-sm px-5 py-3 rounded-xl hover:bg-blue-50 transition-colors w-full"
                >
                  Book Free Counselling
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
