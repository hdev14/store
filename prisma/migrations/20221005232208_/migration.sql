/*
  Warnings:

  - You are about to drop the column `clientId` on the `PurchaseOrder` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PurchaseOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,
    "voucherId" TEXT,
    "discountAmount" REAL NOT NULL,
    "totalAmount" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    CONSTRAINT "PurchaseOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PurchaseOrder_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Voucher" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PurchaseOrder" ("code", "createdAt", "discountAmount", "id", "status", "totalAmount", "voucherId") SELECT "code", "createdAt", "discountAmount", "id", "status", "totalAmount", "voucherId" FROM "PurchaseOrder";
DROP TABLE "PurchaseOrder";
ALTER TABLE "new_PurchaseOrder" RENAME TO "PurchaseOrder";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
