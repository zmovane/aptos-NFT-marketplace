/*
  Warnings:

  - You are about to drop the `Offer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_tokenCreator_tokenCollection_tokenName_fkey";

-- DropTable
DROP TABLE "Offer";

-- DropTable
DROP TABLE "Token";

-- CreateTable
CREATE TABLE "offers" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "seller" TEXT NOT NULL,
    "buyer" TEXT,
    "status" "Status" NOT NULL,
    "tokenCreator" TEXT NOT NULL,
    "tokenCollection" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "seqNum" BIGINT NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "creator" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_creator_collection_name_key" ON "tokens"("creator", "collection", "name");

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_tokenCreator_tokenCollection_tokenName_fkey" FOREIGN KEY ("tokenCreator", "tokenCollection", "tokenName") REFERENCES "tokens"("creator", "collection", "name") ON DELETE RESTRICT ON UPDATE CASCADE;
