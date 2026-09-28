import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.GOOGLE_CSE_CX;

// Returns recent web articles (cutoff news) for the predictor's "latest updates"
// panel. The prediction itself is computed client-side from src/data/neet-predictor.ts.
export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }
    if (!API_KEY || !CX) {
      return NextResponse.json({ colleges: [] });
    }

    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}&num=6&dateRestrict=y1`;

    const res = await fetch(searchUrl, { next: { revalidate: 3600 } });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Google CSE error:", res.status, errorText);
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }

    const data = await res.json();

    const colleges = (data.items || [])
      .filter((item: { title?: string; link?: string }) => item.title && item.link)
      .map((item: { title: string; snippet?: string; link: string }) => ({
        name: item.title,
        description: item.snippet ?? "",
        url: item.link,
      }));

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error("Predictor API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
