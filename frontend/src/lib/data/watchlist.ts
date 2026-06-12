"use server";
import { prisma } from "@/lib/prisma";
import { WatchlistItem } from "@/types/DashboardTypes";
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
      mic_code: true,
      currency: true,
      notes: true,
      createdAt: true,
    },
  });

  return watchlist;
}

export async function addWatchlistItem(
  userId: string,
  item: {
    symbol: string;
    exchange: string;
    mic_code: string;
    currency: string;
  },
) {
  if (!userId) throw new Error("Missing userId");

  return await prisma.watchlist.upsert({
    where: {
      userId_symbol_exchange: {
        userId,
        symbol: item.symbol,
        exchange: item.exchange,
      },
    },
    update: {},
    create: {
      userId,
      symbol: item.symbol,
      exchange: item.exchange,
      mic_code: item.mic_code,
      currency: item.currency,
    },
  });
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
