-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_inspections" (
    "id" TEXT NOT NULL,
    "animal_id" TEXT NOT NULL,
    "inspection_date" TIMESTAMP(3) NOT NULL,
    "animal_weight" DOUBLE PRECISION NOT NULL,
    "drug_name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "food_given" TEXT NOT NULL,
    "balance_food_take_out" TEXT NOT NULL,
    "dopping_consistency" TEXT NOT NULL,
    "animal_behavior" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scientific" (
    "id" TEXT NOT NULL,
    "animal_id" TEXT NOT NULL,
    "animal_type" TEXT NOT NULL,
    "common_name" TEXT NOT NULL,
    "cage_number" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "reason_for_admission" TEXT NOT NULL,
    "date_of_entry" TIMESTAMP(3) NOT NULL,
    "date_of_discharge" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scientific_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratorium" (
    "id" TEXT NOT NULL,
    "test_type" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "attachment_file" TEXT,
    "test_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "drug_name" TEXT NOT NULL,
    "animal_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laboratorium_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "scientific_animal_id_key" ON "scientific"("animal_id");

-- AddForeignKey
ALTER TABLE "daily_inspections" ADD CONSTRAINT "daily_inspections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
