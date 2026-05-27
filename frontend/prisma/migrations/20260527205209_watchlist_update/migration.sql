/*
  Warnings:

  - Added the required column `currency` to the `Watchlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mic_code` to the `Watchlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Watchlist" ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "mic_code" TEXT NOT NULL;
