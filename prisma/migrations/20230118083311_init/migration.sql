-- CreateTable
CREATE TABLE `client` (
    `id` VARCHAR(32) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `company_name` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `add_tc` BOOLEAN NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,
    `pay_method` INTEGER NOT NULL,
    `currency` ENUM('USD', 'CAD') NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'RETIRED') NOT NULL,

    PRIMARY KEY (`id`)
);

-- CreateTable
CREATE TABLE `vendor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `updatedAt` DATETIME(0) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `department` ENUM('DIGITIZING', 'VECTOR', 'PATCH') NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL,

    PRIMARY KEY (`id`)
);

-- CreateTable
CREATE TABLE `gmail_msg` (
    `thread_id` VARCHAR(16) NOT NULL,
    `inbox_msg_id` VARCHAR(16) NOT NULL,
    `job_id` VARCHAR(32) NOT NULL,
    `direction` VARCHAR(32) NOT NULL,

    INDEX `gmail_msgs_job_primary`(`job_id`),
    PRIMARY KEY (`thread_id`, `inbox_msg_id`, `job_id`)
);

-- CreateTable
CREATE TABLE `job` (
    `id` VARCHAR(32) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL,
    `client_id` VARCHAR(32) NOT NULL,
    `type` ENUM('JOB', 'REVISION', 'QUOTE') NOT NULL,
    `status` ENUM('PENDING', 'RUSH', 'COMPLETED', 'CANCELLED') NOT NULL,
    `vendor_id` VARCHAR(32) NOT NULL,

    PRIMARY KEY (`id`)
);

-- CreateTable
CREATE TABLE `purchase_order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `job_id` VARCHAR(32) NOT NULL,

    INDEX `job_id`(`job_id`),
    PRIMARY KEY (`id`)
);

-- CreateTable
CREATE TABLE `client_addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(2) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `zip` VARCHAR(16) NOT NULL,
    `client_id` VARCHAR(32) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,
    `vendorId` VARCHAR(32) NULL,

    INDEX `client_addresses_FK`(`client_id`),
    PRIMARY KEY (`id`)
);

-- CreateTable
CREATE TABLE `client_email` (
    `email` VARCHAR(100) NOT NULL,
    `client_id` VARCHAR(32) NOT NULL,
    `description` VARCHAR(100) NULL,
    `type` ENUM('JOB', 'INVOICE') NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,
    `vendorId` VARCHAR(32) NULL,

    INDEX `client_email_FK`(`client_id`),
    PRIMARY KEY (`email`, `client_id`)
);

-- CreateTable
CREATE TABLE `client_phone` (
    `phone` VARCHAR(100) NOT NULL,
    `client_id` VARCHAR(32) NOT NULL,
    `description` VARCHAR(100) NULL,
    `updatedAt` DATETIME(0) NOT NULL,
    `type` ENUM('PRIMARY', 'SECONDARY') NOT NULL,
    `vendorId` VARCHAR(32) NULL,

    INDEX `client_phone_FK`(`client_id`),
    PRIMARY KEY (`phone`, `client_id`)
);

-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(2) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `zip` VARCHAR(16) NOT NULL,
    `phone` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `website` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
);

-- AddForeignKey
ALTER TABLE `gmail_msg` ADD CONSTRAINT `gmail_msgs_job_primary` FOREIGN KEY (`job_id`) REFERENCES `job`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_addresses` ADD CONSTRAINT `client_addresses_FK` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_email` ADD CONSTRAINT `client_email_FK` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `client_phone` ADD CONSTRAINT `client_phone_FK` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
