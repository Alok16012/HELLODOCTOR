export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: number;
  image: string;
  featured: boolean;
}

export const blogCategories = [
  { name: "All", slug: "all" },
  { name: "Admission Guide", slug: "admission-guide" },
  { name: "Entrance Exams", slug: "entrance-exams" },
  { name: "Rankings", slug: "rankings" },
  { name: "Career Advice", slug: "career-advice" },
  { name: "Scholarships", slug: "scholarships" },
  { name: "Study Abroad", slug: "study-abroad" },
  { name: "College Life", slug: "college-life" },
];
