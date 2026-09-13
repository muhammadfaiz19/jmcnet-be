-- CreateTable
CREATE TABLE `reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reportNumber` VARCHAR(20) NOT NULL,
    `customerName` VARCHAR(100) NOT NULL,
    `customerPhone` VARCHAR(20) NOT NULL,
    `customerAddress` VARCHAR(500) NOT NULL,
    `customerId` VARCHAR(50) NULL,
    `category` ENUM('GANGGUAN_INTERNET', 'INTERNET_LAMBAT', 'GANGGUAN_ROUTER', 'TAGIHAN', 'LAINNYA') NOT NULL DEFAULT 'GANGGUAN_INTERNET',
    `description` TEXT NOT NULL,
    `photoUrl` VARCHAR(255) NULL,
    `status` ENUM('MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK') NOT NULL DEFAULT 'MENUNGGU',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `reports_reportNumber_key`(`reportNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `report_status_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reportId` INTEGER NOT NULL,
    `status` ENUM('MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK') NOT NULL,
    `message` TEXT NULL,
    `photoUrl` VARCHAR(255) NULL,
    `createdBy` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `report_status_logs` ADD CONSTRAINT `report_status_logs_reportId_fkey` FOREIGN KEY (`reportId`) REFERENCES `reports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
