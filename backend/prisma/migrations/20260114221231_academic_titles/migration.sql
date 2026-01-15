-- AlterTable
ALTER TABLE "AcademicEmployee" ADD COLUMN     "academic_title_id" INTEGER;

-- CreateTable
CREATE TABLE "AcademicTitle" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "shortcut" TEXT NOT NULL,

    CONSTRAINT "AcademicTitle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicTitle_full_name_key" ON "AcademicTitle"("full_name");

-- AddForeignKey
ALTER TABLE "AcademicEmployee" ADD CONSTRAINT "AcademicEmployee_academic_title_id_fkey" FOREIGN KEY ("academic_title_id") REFERENCES "AcademicTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
