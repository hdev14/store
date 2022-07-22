-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "amount" REAL NOT NULL,
    "image" TEXT NOT NULL,
    "stockQuantity" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "height" REAL NOT NULL,
    "width" REAL NOT NULL,
    "depth" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" INTEGER NOT NULL
);
