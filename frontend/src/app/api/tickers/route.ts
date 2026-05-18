// src/app/api/tickers/route.ts

import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);

		const search = searchParams
			.get("search")
			?.trim();

		if (!search) {
			return NextResponse.json({ results: [] });
		}

		const apiKey = process.env.TD_API_KEY;

		if (!apiKey) {
			return NextResponse.json(
				{ error: "Missing API key" },
				{ status: 500 },
			);
		}

		const res = await fetch(
			`https://api.twelvedata.com/symbol_search?symbol=${encodeURIComponent(search)}&outputsize=8&apikey=${apiKey}`,
			{
				cache: "no-store",
			},
		);

		if (!res.ok) {
			throw new Error(`TwelveData error: ${res.status}`);
		}

		const data = await res.json();

		const results = (data.data || []).map(
			(item: {
				symbol: string;
				instrument_name: string;
				exchange: string;
				country: string;
				instrument_type: string;
			}) => ({
				symbol: item.symbol,
				name: item.instrument_name,
				exchange: item.exchange,
				country: item.country,
				type: item.instrument_type,
			}),
		);

		return NextResponse.json({ results });
	} catch (err) {
		console.error(err);

		return NextResponse.json(
			{ error: "Ticker search failed" },
			{ status: 500 },
		);
	}
}