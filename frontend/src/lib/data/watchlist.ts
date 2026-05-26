"use server";
import { prisma } from "@/lib/prisma";

export interface WatchlistItem {
	id: string;
	symbol: string;
	exchange: string;
	notes: string | null;
	createdAt: Date;
}

export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
	if (!userId) {
		return [];
	}

	const watchlist = await prisma.watchlist.findMany({
		where: {
			userId,
		},
		orderBy: [
			{
				symbol: "asc",
			},
			{
				exchange: "asc",
			},
		],
		select: {
			id: true,
			symbol: true,
			exchange: true,
			notes: true,
			createdAt: true,
		},
	});

	return watchlist;
}

export async function removeWatchlistItem(
	userId: string,
	symbol: string,
	exchange: string,
) {
	if (!userId || !symbol || !exchange)
		throw new Error("Missing required fields");

	return await prisma.watchlist.deleteMany({
		where: {
			userId,
			symbol,
			exchange,
		},
	});
}
