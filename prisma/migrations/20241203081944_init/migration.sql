/*
  Warnings:

  - You are about to drop the column `dokterId` on the `JadwalDokter` table. All the data in the column will be lost.
  - You are about to drop the column `jamPraktek` on the `JadwalDokter` table. All the data in the column will be lost.
  - You are about to drop the column `kodeHari` on the `JadwalDokter` table. All the data in the column will be lost.
  - You are about to drop the column `jadwalDokterId` on the `Pendaftaran` table. All the data in the column will be lost.
  - You are about to drop the column `assesment` on the `SOAP` table. All the data in the column will be lost.
  - You are about to drop the column `instruksi` on the `SOAP` table. All the data in the column will be lost.
  - You are about to drop the column `objective` on the `SOAP` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `SOAP` table. All the data in the column will be lost.
  - You are about to drop the column `subjective` on the `SOAP` table. All the data in the column will be lost.
  - Added the required column `doctorId` to the `JadwalDokter` table without a default value. This is not possible if the table is not empty.
  - Made the column `isAktif` on table `JadwalDokter` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `doctorId` to the `Pendaftaran` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConsultationType" AS ENUM ('online', 'offline');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('online', 'offline');

-- CreateEnum
CREATE TYPE "paymentMethod" AS ENUM ('online', 'offline');

-- DropForeignKey
ALTER TABLE "JadwalDokter" DROP CONSTRAINT "JadwalDokter_dokterId_fkey";

-- DropForeignKey
ALTER TABLE "Pendaftaran" DROP CONSTRAINT "Pendaftaran_jadwalDokterId_fkey";

-- AlterTable
ALTER TABLE "BillPasienDetail" ALTER COLUMN "deskripsi" DROP NOT NULL;

-- AlterTable
ALTER TABLE "JadwalDokter" DROP COLUMN "dokterId",
DROP COLUMN "jamPraktek",
DROP COLUMN "kodeHari",
ADD COLUMN     "doctorId" INTEGER NOT NULL,
ALTER COLUMN "hari" DROP NOT NULL,
ALTER COLUMN "hari" SET DATA TYPE TEXT,
ALTER COLUMN "isAktif" SET NOT NULL;

-- AlterTable
ALTER TABLE "MasterTarif" ADD COLUMN     "doctorId" INTEGER,
ALTER COLUMN "penjamin" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Pendaftaran" DROP COLUMN "jadwalDokterId",
ADD COLUMN     "doctorId" INTEGER NOT NULL,
ADD COLUMN     "nomorAsuransi" VARCHAR(50);

-- AlterTable
ALTER TABLE "PoliKlinik" ADD COLUMN     "voiceId" INTEGER;

-- AlterTable
ALTER TABLE "SOAP" DROP COLUMN "assesment",
DROP COLUMN "instruksi",
DROP COLUMN "objective",
DROP COLUMN "plan",
DROP COLUMN "subjective";

-- CreateTable
CREATE TABLE "AntrianPasien" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "pendaftaranId" INTEGER,
    "jumlahPanggil" INTEGER NOT NULL,
    "nomor" TEXT NOT NULL,
    "idFasyankes" TEXT NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AntrianPasien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AntrianAdmisi" (
    "id" SERIAL NOT NULL,
    "nomor" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "jumlahPanggil" INTEGER NOT NULL,
    "idFasyankes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AntrianAdmisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterAssessment" (
    "id" SERIAL NOT NULL,
    "idFasyankes" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentAnswer" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" SERIAL NOT NULL,
    "uniqueCode" TEXT NOT NULL,
    "meetingId" INTEGER,
    "customerId" INTEGER NOT NULL,
    "doctorId" INTEGER,
    "outletId" INTEGER,
    "doctorAvailableSlotsId" INTEGER,
    "type" "ConsultationType" NOT NULL,
    "totalCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "deletedAt" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailSOAP" (
    "id" SERIAL NOT NULL,
    "subjective" JSONB NOT NULL,
    "objective" JSONB NOT NULL,
    "assessment" JSONB NOT NULL,
    "plan" JSONB NOT NULL,
    "instruction" JSONB NOT NULL,
    "soapId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetailSOAP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorAvailableDays" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "sun" TEXT,
    "mon" TEXT,
    "tue" TEXT,
    "thu" TEXT,
    "fri" TEXT,
    "sat" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "slot" INTEGER NOT NULL,
    "wed" TEXT,

    CONSTRAINT "DoctorAvailableDays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorAvailableSlots" (
    "id" SERIAL NOT NULL,
    "is_booked" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "doctorId" INTEGER NOT NULL,
    "doctor_available_times_id" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "consultation_id" INTEGER,

    CONSTRAINT "DoctorAvailableSlots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorAvailableTimes" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorAvailableTimes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorCosts" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "baseFee" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "consultation" TEXT DEFAULT '0',
    "emergency" TEXT DEFAULT '0',

    CONSTRAINT "DoctorCosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "unit" TEXT,
    "idFasyankes" TEXT,
    "str" TEXT,
    "sip" TEXT,
    "isAktif" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'active',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "idPoliKlinik" INTEGER,
    "idProfile" INTEGER,
    "avatar" TEXT,

    CONSTRAINT "Doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterInstruction" (
    "id" SERIAL NOT NULL,
    "idFasyankes" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstructionAnswer" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstructionAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chats" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "conversations" JSONB,
    "deletedAt" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channels" (
    "id" SERIAL NOT NULL,
    "uniqueCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelUser" (
    "id" SERIAL NOT NULL,
    "channelId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChannelUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveChat" (
    "id" SERIAL NOT NULL,
    "channelCode" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isFromUser" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelCustomer" (
    "id" SERIAL NOT NULL,
    "channelId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "deletedAt" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChannelCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterAsuransi" (
    "id" SERIAL NOT NULL,
    "kodeAsuransi" TEXT NOT NULL,
    "namaAsuransi" TEXT NOT NULL,
    "namaPic" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "picEmail" TEXT NOT NULL,
    "picPhone" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "isAktif" BOOLEAN NOT NULL,
    "idFasyankes" TEXT NOT NULL,

    CONSTRAINT "MasterAsuransi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterObjective" (
    "id" SERIAL NOT NULL,
    "idFasyankes" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterObjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectiveAnswer" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ObjectiveAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterPlan" (
    "id" SERIAL NOT NULL,
    "idFasyankes" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanAnswer" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatPendaftaran" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "hari" TEXT,
    "availableTimeId" INTEGER NOT NULL,
    "pendaftaranId" INTEGER NOT NULL,
    "isAktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "idFasyankes" VARCHAR(30),

    CONSTRAINT "RiwayatPendaftaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterSubjective" (
    "id" SERIAL NOT NULL,
    "idFasyankes" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterSubjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectiveAnswer" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectiveAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "consultationId" INTEGER NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "tax" INTEGER NOT NULL DEFAULT 0,
    "paymentMethod" "paymentMethod" NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterVoicePoli" (
    "id" SERIAL NOT NULL,
    "idFasyankes" TEXT,
    "url" TEXT NOT NULL,
    "namaPoli" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" DATE,

    CONSTRAINT "MasterVoicePoli_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meetings" (
    "id" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,
    "agenda" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "startUrl" TEXT NOT NULL,
    "joinUrl" TEXT NOT NULL,
    "deletedAt" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meetings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AntrianPasien_pendaftaranId_key" ON "AntrianPasien"("pendaftaranId");

-- CreateIndex
CREATE UNIQUE INDEX "DetailSOAP_soapId_key" ON "DetailSOAP"("soapId");

-- CreateIndex
CREATE UNIQUE INDEX "Channels_uniqueCode_key" ON "Channels"("uniqueCode");

-- CreateIndex
CREATE UNIQUE INDEX "MasterAsuransi_kodeAsuransi_key" ON "MasterAsuransi"("kodeAsuransi");

-- CreateIndex
CREATE UNIQUE INDEX "MasterAsuransi_picEmail_key" ON "MasterAsuransi"("picEmail");

-- CreateIndex
CREATE UNIQUE INDEX "RiwayatPendaftaran_pendaftaranId_key" ON "RiwayatPendaftaran"("pendaftaranId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_uniqueId_key" ON "Transaction"("uniqueId");

-- AddForeignKey
ALTER TABLE "AntrianPasien" ADD CONSTRAINT "AntrianPasien_pendaftaranId_fkey" FOREIGN KEY ("pendaftaranId") REFERENCES "Pendaftaran"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AntrianPasien" ADD CONSTRAINT "AntrianPasien_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MasterAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailSOAP" ADD CONSTRAINT "DetailSOAP_soapId_fkey" FOREIGN KEY ("soapId") REFERENCES "SOAP"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAvailableDays" ADD CONSTRAINT "DoctorAvailableDays_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAvailableSlots" ADD CONSTRAINT "DoctorAvailableSlots_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAvailableSlots" ADD CONSTRAINT "DoctorAvailableSlots_doctor_available_times_id_fkey" FOREIGN KEY ("doctor_available_times_id") REFERENCES "DoctorAvailableTimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAvailableTimes" ADD CONSTRAINT "DoctorAvailableTimes_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctors" ADD CONSTRAINT "Doctors_idPoliKlinik_fkey" FOREIGN KEY ("idPoliKlinik") REFERENCES "PoliKlinik"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctors" ADD CONSTRAINT "Doctors_idProfile_fkey" FOREIGN KEY ("idProfile") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructionAnswer" ADD CONSTRAINT "InstructionAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MasterInstruction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoliKlinik" ADD CONSTRAINT "PoliKlinik_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "MasterVoicePoli"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalDokter" ADD CONSTRAINT "JadwalDokter_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectiveAnswer" ADD CONSTRAINT "ObjectiveAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MasterObjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanAnswer" ADD CONSTRAINT "PlanAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MasterPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pendaftaran" ADD CONSTRAINT "Pendaftaran_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPendaftaran" ADD CONSTRAINT "RiwayatPendaftaran_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPendaftaran" ADD CONSTRAINT "RiwayatPendaftaran_availableTimeId_fkey" FOREIGN KEY ("availableTimeId") REFERENCES "DoctorAvailableTimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPendaftaran" ADD CONSTRAINT "RiwayatPendaftaran_pendaftaranId_fkey" FOREIGN KEY ("pendaftaranId") REFERENCES "Pendaftaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectiveAnswer" ADD CONSTRAINT "SubjectiveAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "MasterSubjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterTarif" ADD CONSTRAINT "MasterTarif_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
