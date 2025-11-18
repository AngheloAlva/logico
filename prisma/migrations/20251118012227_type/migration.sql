/*
  Warnings:

  - Added the required column `type` to the `movement` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('ENTREGA', 'ENTREGA_CON_RECETA', 'REINTENTO', 'ENTREGA_VARIAS_DIRECCIONES');

-- AlterTable
ALTER TABLE "movement" ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "retryHistory" JSONB,
ADD COLUMN     "type" "MovementType" NOT NULL;
