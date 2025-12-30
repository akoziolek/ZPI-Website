/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Topic_uuid_key" ON "Topic"("uuid");

-- CreateIndex
CREATE INDEX "Topic_uuid_idx" ON "Topic"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE INDEX "User_uuid_idx" ON "User"("uuid");
