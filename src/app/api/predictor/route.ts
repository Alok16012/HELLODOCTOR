import { NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.GOOGLE_CSE_CX;

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}&num=6`;

    const res = await fetch(searchUrl, { next: { revalidate: 3600 } });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Google CSE error:", res.status, errorText);
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }

    const data = await res.json();

    const colleges = (data.items || [])
      .filter((item: any) => item.title && item.snippet)
      .map((item: any) => ({
        name: item.title.replace(/ - .*$/, "").trim(),
        description: item.snippet,
        url: item.link,
      }));

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error("Predictor API error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
