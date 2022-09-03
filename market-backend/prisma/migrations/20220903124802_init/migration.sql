-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ongoing', 'revoked', 'finished');

-- CreateTable
CREATE TABLE "Offer" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "seller" TEXT NOT NULL,
    "buyer" TEXT,
    "status" "Status" NOT NULL,
    "tokenCreator" TEXT NOT NULL,
    "tokenCollection" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "creator" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_creator_collection_name_key" ON "Token"("creator", "collection", "name");

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_tokenCreator_tokenCollection_tokenName_fkey" FOREIGN KEY ("tokenCreator", "tokenCollection", "tokenName") REFERENCES "Token"("creator", "collection", "name") ON DELETE RESTRICT ON UPDATE CASCADE;
