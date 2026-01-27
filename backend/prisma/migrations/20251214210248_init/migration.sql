-- CreateTable
CREATE TABLE "Role" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Status" (
    "status_id" SERIAL NOT NULL,
    "status_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("status_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "surname" VARCHAR(50) NOT NULL,
    "mail" VARCHAR(255) NOT NULL,
    "last_login" TIMESTAMP(3),
    "logged_in" BOOLEAN NOT NULL DEFAULT false,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "AcademicEmployee" (
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "AcademicEmployee_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Student" (
    "user_id" INTEGER NOT NULL,
    "index" CHAR(6) NOT NULL,
    "ects_deficit" INTEGER NOT NULL,
    "topic_id" INTEGER,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "topic_id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" VARCHAR(1000) NOT NULL,
    "description" TEXT NOT NULL,
    "status_id" INTEGER NOT NULL,
    "employee_id" INTEGER,
    "declaration_id" INTEGER,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("topic_id")
);

-- CreateTable
CREATE TABLE "Opinion" (
    "opinion_id" SERIAL NOT NULL,
    "argumentation" TEXT NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,

    CONSTRAINT "Opinion_pkey" PRIMARY KEY ("opinion_id")
);

-- CreateTable
CREATE TABLE "Declaration" (
    "declaration_id" SERIAL NOT NULL,

    CONSTRAINT "Declaration_pkey" PRIMARY KEY ("declaration_id")
);

-- CreateTable
CREATE TABLE "Signature" (
    "user_id" INTEGER NOT NULL,
    "declaration_id" INTEGER NOT NULL,

    CONSTRAINT "Signature_pkey" PRIMARY KEY ("user_id","declaration_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_name_key" ON "Role"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "Status_status_name_key" ON "Status"("status_name");

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");

-- CreateIndex
CREATE INDEX "User_role_id_idx" ON "User"("role_id");

-- CreateIndex
CREATE INDEX "Student_topic_id_idx" ON "Student"("topic_id");

-- CreateIndex
CREATE INDEX "Topic_status_id_idx" ON "Topic"("status_id");

-- CreateIndex
CREATE INDEX "Topic_employee_id_idx" ON "Topic"("employee_id");

-- CreateIndex
CREATE INDEX "Topic_declaration_id_idx" ON "Topic"("declaration_id");

-- CreateIndex
CREATE UNIQUE INDEX "Opinion_topic_id_key" ON "Opinion"("topic_id");

-- CreateIndex
CREATE INDEX "Opinion_employee_id_idx" ON "Opinion"("employee_id");

-- CreateIndex
CREATE INDEX "Signature_declaration_id_idx" ON "Signature"("declaration_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicEmployee" ADD CONSTRAINT "AcademicEmployee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("topic_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Status"("status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "AcademicEmployee"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_declaration_id_fkey" FOREIGN KEY ("declaration_id") REFERENCES "Declaration"("declaration_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "AcademicEmployee"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "Topic"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_declaration_id_fkey" FOREIGN KEY ("declaration_id") REFERENCES "Declaration"("declaration_id") ON DELETE CASCADE ON UPDATE CASCADE;
