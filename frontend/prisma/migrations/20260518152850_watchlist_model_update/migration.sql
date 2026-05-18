/*
  Warnings:

  - You are about to drop the column `ticker` on the `Watchlist` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,symbol,exchange]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `exchange` to the `Watchlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `Watchlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Watchlist_userId_ticker_key";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "providerAvatarUrl" TEXT;

-- AlterTable
ALTER TABLE "Watchlist" DROP COLUMN "ticker",
ADD COLUMN     "exchange" TEXT NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Watchlist_symbol_idx" ON "Watchlist"("symbol");

-- CreateIndex
CREATE INDEX "Watchlist_exchange_idx" ON "Watchlist"("exchange");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_symbol_exchange_key" ON "Watchlist"("userId", "symbol", "exchange");
