-- CreateTable
CREATE TABLE "uploads" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileHash" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uploads_fileHash_key" ON "uploads"("fileHash");

-- CreateIndex
CREATE UNIQUE INDEX "uploads_transactionHash_key" ON "uploads"("transactionHash");

-- CreateIndex
CREATE INDEX "uploads_fileHash_idx" ON "uploads"("fileHash");
