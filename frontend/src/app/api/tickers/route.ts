// src/app/api/tickers/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    if (!search) {
        return NextResponse.json({ results: [] });
    }

    // Safely pull the key on the server side
    const apiKey = process.env.POLYGON_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "API Key Configuration Missing" }, { status: 500 });
    }

    try {
        const res = await fetch(
            `https://api.polygon.io/v3/reference/tickers?search=${search}&active=true&limit=5&apiKey=${apiKey}`
        );

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch from Polygon" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error("Polygon proxy error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}