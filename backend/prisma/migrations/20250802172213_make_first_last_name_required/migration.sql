-- Update existing NULL values with default values
UPDATE "users" SET "firstName" = 'User' WHERE "firstName" IS NULL;
UPDATE "users" SET "lastName" = 'User' WHERE "lastName" IS NULL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "aboutMe" TEXT,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "birthdate" DATETIME
);
INSERT INTO "new_users" ("aboutMe", "birthdate", "city", "createdAt", "email", "firstName", "id", "lastName", "password", "state", "street", "updatedAt", "zip") SELECT "aboutMe", "birthdate", "city", "createdAt", "email", "firstName", "id", "lastName", "password", "state", "street", "updatedAt", "zip" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
