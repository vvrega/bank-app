-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `type` ENUM('Deposit', 'Withdraw', 'Transfer', 'Exchange') NOT NULL DEFAULT 'Deposit';
