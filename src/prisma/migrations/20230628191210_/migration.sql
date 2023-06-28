-- AlterTable
ALTER TABLE "Transferencia" ALTER COLUMN "data_transferencia" SET DEFAULT timezone('UTC-03:00', now());
