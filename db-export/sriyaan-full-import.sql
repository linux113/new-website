-- ============================================================
--  SRIYAAN METALS — complete database import
--  Target: MySQL 8 (Hostinger), database u391782884_sriyaanmetals
--
--  Use this file on an EMPTY database. If the database already has
--  tables, use sriyaan-reset-and-import.sql instead.
--
--  hPanel -> Databases -> phpMyAdmin -> select the database
--  -> Import tab -> choose this file -> Go
--
--  ADMIN LOGIN
--    URL       https://sriyaanmetals.com/admin/login
--    email     admin@sriyaanmetals.com
--    password  SriyaanAdmin2026!
--
--  Change that password immediately after your first sign-in.
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- SRIYAAN METALS — initial MySQL schema.
--
-- Generated from prisma/schema.prisma by scripts/gen-mysql-ddl.mjs.
-- Engine: InnoDB (required for foreign keys).
-- Charset: utf8mb4 / utf8mb4_unicode_ci (accented text, ₹, — and emoji;
-- the collation is case-insensitive, which is what the admin search relies on).


CREATE TABLE `SeoMeta` (
    `id` VARCHAR(191) NOT NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` TEXT NULL,
    `canonicalUrl` TEXT NULL,
    `ogTitle` VARCHAR(191) NULL,
    `ogDescription` TEXT NULL,
    `ogImageId` VARCHAR(191) NULL,
    `robots` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `SeoMeta_ogImageId_idx`(`ogImageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `AdminUser` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'EDITOR') NOT NULL DEFAULT 'EDITOR',
    `status` ENUM('ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `AdminUser_email_key`(`email`),
    INDEX `AdminUser_status_idx`(`status`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `AdminSession` (
    `id` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ip` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `AdminSession_tokenHash_key`(`tokenHash`),
    INDEX `AdminSession_userId_idx`(`userId`),
    INDEX `AdminSession_expiresAt_idx`(`expiresAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `MediaAsset` (
    `id` VARCHAR(191) NOT NULL,
    `storageProvider` VARCHAR(191) NOT NULL DEFAULT 'r2',
    `storageKey` VARCHAR(191) NOT NULL,
    `publicUrl` TEXT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `type` ENUM('IMAGE', 'VIDEO', 'DOCUMENT') NOT NULL DEFAULT 'IMAGE',
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `size` INTEGER NULL,
    `altText` TEXT NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `MediaAsset_storageProvider_storageKey_key`(`storageProvider`, `storageKey`),
    INDEX `MediaAsset_type_idx`(`type`),
    INDEX `MediaAsset_createdAt_idx`(`createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `imageId` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `seoId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `Category_slug_key`(`slug`),
    UNIQUE INDEX `Category_seoId_key`(`seoId`),
    INDEX `Category_status_sortOrder_idx`(`status`, `sortOrder`),
    INDEX `Category_imageId_idx`(`imageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `shortDescription` TEXT NULL,
    `description` TEXT NULL,
    `productCode` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `categoryId` VARCHAR(191) NOT NULL,
    `seoId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `Product_slug_key`(`slug`),
    UNIQUE INDEX `Product_productCode_key`(`productCode`),
    UNIQUE INDEX `Product_seoId_key`(`seoId`),
    INDEX `Product_categoryId_status_idx`(`categoryId`, `status`),
    INDEX `Product_status_featured_idx`(`status`, `featured`),
    INDEX `Product_status_sortOrder_idx`(`status`, `sortOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `ProductImage` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(191) NOT NULL,
    `altText` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `ProductImage_productId_mediaId_key`(`productId`, `mediaId`),
    INDEX `ProductImage_productId_sortOrder_idx`(`productId`, `sortOrder`),
    INDEX `ProductImage_mediaId_idx`(`mediaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `ProductSpecification` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    INDEX `ProductSpecification_productId_sortOrder_idx`(`productId`, `sortOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `ProductApplication` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `application` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    INDEX `ProductApplication_productId_sortOrder_idx`(`productId`, `sortOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `ProductDocument` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `mediaId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('DATASHEET', 'DRAWING', 'CATALOGUE', 'CERTIFICATE', 'OTHER') NOT NULL DEFAULT 'DATASHEET',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    INDEX `ProductDocument_productId_sortOrder_idx`(`productId`, `sortOrder`),
    INDEX `ProductDocument_mediaId_idx`(`mediaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `ProductRelation` (
    `id` VARCHAR(191) NOT NULL,
    `sourceProductId` VARCHAR(191) NOT NULL,
    `relatedProductId` VARCHAR(191) NOT NULL,
    `relationType` ENUM('RELATED', 'ALTERNATIVE', 'ACCESSORY') NOT NULL DEFAULT 'RELATED',
    PRIMARY KEY (`id`),
    UNIQUE INDEX `ProductRelation_sourceProductId_relatedProductId_relationTy_key`(`sourceProductId`, `relatedProductId`, `relationType`),
    INDEX `ProductRelation_relatedProductId_idx`(`relatedProductId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `BlogCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `BlogCategory_slug_key`(`slug`),
    INDEX `BlogCategory_sortOrder_idx`(`sortOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `BlogPost` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NULL,
    `featuredImageId` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `seoId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `BlogPost_slug_key`(`slug`),
    UNIQUE INDEX `BlogPost_seoId_key`(`seoId`),
    INDEX `BlogPost_status_publishedAt_idx`(`status`, `publishedAt` DESC),
    INDEX `BlogPost_categoryId_status_idx`(`categoryId`, `status`),
    INDEX `BlogPost_authorId_idx`(`authorId`),
    INDEX `BlogPost_featuredImageId_idx`(`featuredImageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `BlogTag` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `BlogTag_slug_key`(`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `BlogPostTag` (
    `postId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`postId`, `tagId`),
    INDEX `BlogPostTag_tagId_idx`(`tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `CompanyPage` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `seoId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `CompanyPage_key_key`(`key`),
    UNIQUE INDEX `CompanyPage_seoId_key`(`seoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `Capability` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,
    `metricValue` DECIMAL(12, 2) NULL,
    `metricPrefix` VARCHAR(191) NULL,
    `metricSuffix` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Capability_status_sortOrder_idx`(`status`, `sortOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `Industry` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `Industry_slug_key`(`slug`),
    INDEX `Industry_status_sortOrder_idx`(`status`, `sortOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `InfrastructureItem` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `caption` TEXT NULL,
    `mediaId` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `InfrastructureItem_status_sortOrder_idx`(`status`, `sortOrder`),
    INDEX `InfrastructureItem_mediaId_idx`(`mediaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `Certification` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `issuer` VARCHAR(191) NULL,
    `documentId` VARCHAR(191) NULL,
    `validFrom` DATETIME(3) NULL,
    `validUntil` DATETIME(3) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Certification_status_sortOrder_idx`(`status`, `sortOrder`),
    INDEX `Certification_documentId_idx`(`documentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `logoId` VARCHAR(191) NULL,
    `website` TEXT NULL,
    `consent` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Customer_status_sortOrder_idx`(`status`, `sortOrder`),
    INDEX `Customer_logoId_idx`(`logoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `Testimonial` (
    `id` VARCHAR(191) NOT NULL,
    `quote` TEXT NOT NULL,
    `personName` VARCHAR(191) NOT NULL,
    `personRole` VARCHAR(191) NULL,
    `customerId` VARCHAR(191) NULL,
    `avatarId` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Testimonial_status_sortOrder_idx`(`status`, `sortOrder`),
    INDEX `Testimonial_customerId_idx`(`customerId`),
    INDEX `Testimonial_avatarId_idx`(`avatarId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `GlobalCountry` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `direction` VARCHAR(191) NOT NULL DEFAULT 'export',
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `GlobalCountry_code_key`(`code`),
    INDEX `GlobalCountry_status_sortOrder_idx`(`status`, `sortOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `ImportExportCapability` (
    `id` VARCHAR(191) NOT NULL,
    `direction` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `ImportExportCapability_status_sortOrder_idx`(`status`, `sortOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `ProductEnquiry` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `whatsapp` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `requirement` TEXT NULL,
    `productId` VARCHAR(191) NULL,
    `status` ENUM('NEW', 'IN_PROGRESS', 'CONTACTED', 'CLOSED', 'SPAM') NOT NULL DEFAULT 'NEW',
    `source` VARCHAR(191) NOT NULL DEFAULT 'website',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `ProductEnquiry_status_createdAt_idx`(`status`, `createdAt` DESC),
    INDEX `ProductEnquiry_productId_idx`(`productId`),
    INDEX `ProductEnquiry_email_idx`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `ContactMessage` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `whatsapp` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('NEW', 'IN_PROGRESS', 'CONTACTED', 'CLOSED', 'SPAM') NOT NULL DEFAULT 'NEW',
    `source` VARCHAR(191) NOT NULL DEFAULT 'website',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `ContactMessage_status_createdAt_idx`(`status`, `createdAt` DESC),
    INDEX `ContactMessage_email_idx`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `VendorRequest` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `whatsapp` VARCHAR(191) NULL,
    `offering` TEXT NOT NULL,
    `message` TEXT NULL,
    `status` ENUM('NEW', 'IN_PROGRESS', 'CONTACTED', 'CLOSED', 'SPAM') NOT NULL DEFAULT 'NEW',
    `source` VARCHAR(191) NOT NULL DEFAULT 'website',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `VendorRequest_status_createdAt_idx`(`status`, `createdAt` DESC),
    INDEX `VendorRequest_email_idx`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `WebsiteSetting` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,
    `group` VARCHAR(191) NOT NULL DEFAULT 'general',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `WebsiteSetting_key_key`(`key`),
    INDEX `WebsiteSetting_group_idx`(`group`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `SocialLink` (
    `id` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `SocialLink_platform_key`(`platform`),
    INDEX `SocialLink_status_sortOrder_idx`(`status`, `sortOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `NavigationItem` (
    `id` VARCHAR(191) NOT NULL,
    `menu` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `href` TEXT NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'PUBLISHED',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `NavigationItem_menu_status_sortOrder_idx`(`menu`, `status`, `sortOrder`),
    INDEX `NavigationItem_parentId_idx`(`parentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `PageView` (
    `id` VARCHAR(191) NOT NULL,
    `visitorId` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `referrer` TEXT NULL,
    `dayKey` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    INDEX `PageView_createdAt_idx`(`createdAt`),
    INDEX `PageView_visitorId_createdAt_idx`(`visitorId`, `createdAt`),
    INDEX `PageView_sessionId_createdAt_idx`(`sessionId`, `createdAt`),
    INDEX `PageView_path_createdAt_idx`(`path`, `createdAt`),
    INDEX `PageView_dayKey_idx`(`dayKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


CREATE TABLE `VisitorPresence` (
    `sessionId` VARCHAR(191) NOT NULL,
    `visitorId` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `lastSeenAt` DATETIME(3) NOT NULL,
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`sessionId`),
    INDEX `VisitorPresence_lastSeenAt_idx`(`lastSeenAt`),
    INDEX `VisitorPresence_visitorId_idx`(`visitorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


ALTER TABLE `SeoMeta` ADD CONSTRAINT `SeoMeta_ogImageId_fkey` FOREIGN KEY (`ogImageId`) REFERENCES `MediaAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `AdminSession` ADD CONSTRAINT `AdminSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `AdminUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `Category` ADD CONSTRAINT `Category_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `MediaAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `Category` ADD CONSTRAINT `Category_seoId_fkey` FOREIGN KEY (`seoId`) REFERENCES `SeoMeta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE `Product` ADD CONSTRAINT `Product_seoId_fkey` FOREIGN KEY (`seoId`) REFERENCES `SeoMeta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `MediaAsset`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE `ProductSpecification` ADD CONSTRAINT `ProductSpecification_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `ProductApplication` ADD CONSTRAINT `ProductApplication_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `ProductDocument` ADD CONSTRAINT `ProductDocument_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `ProductDocument` ADD CONSTRAINT `ProductDocument_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `MediaAsset`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE `ProductRelation` ADD CONSTRAINT `ProductRelation_sourceProductId_fkey` FOREIGN KEY (`sourceProductId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `ProductRelation` ADD CONSTRAINT `ProductRelation_relatedProductId_fkey` FOREIGN KEY (`relatedProductId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `BlogPost` ADD CONSTRAINT `BlogPost_featuredImageId_fkey` FOREIGN KEY (`featuredImageId`) REFERENCES `MediaAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `BlogPost` ADD CONSTRAINT `BlogPost_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `AdminUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `BlogPost` ADD CONSTRAINT `BlogPost_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `BlogCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `BlogPost` ADD CONSTRAINT `BlogPost_seoId_fkey` FOREIGN KEY (`seoId`) REFERENCES `SeoMeta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `BlogPostTag` ADD CONSTRAINT `BlogPostTag_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `BlogPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `BlogPostTag` ADD CONSTRAINT `BlogPostTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `BlogTag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `CompanyPage` ADD CONSTRAINT `CompanyPage_seoId_fkey` FOREIGN KEY (`seoId`) REFERENCES `SeoMeta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `InfrastructureItem` ADD CONSTRAINT `InfrastructureItem_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `MediaAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `Certification` ADD CONSTRAINT `Certification_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `MediaAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `Customer` ADD CONSTRAINT `Customer_logoId_fkey` FOREIGN KEY (`logoId`) REFERENCES `MediaAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `Testimonial` ADD CONSTRAINT `Testimonial_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `Testimonial` ADD CONSTRAINT `Testimonial_avatarId_fkey` FOREIGN KEY (`avatarId`) REFERENCES `MediaAsset`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `ProductEnquiry` ADD CONSTRAINT `ProductEnquiry_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE `NavigationItem` ADD CONSTRAINT `NavigationItem_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `NavigationItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
--  DATA
-- ============================================================

-- MediaAsset (27 rows)
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztpd0000psnzp2q3nzbv', 'local', 'images/cat-coils.jpg', '/images/cat-coils.jpg', 'cat-coils.jpg', 'image/jpeg', 'IMAGE', 1536, 1024, NULL, 'Steel coils — representative imagery', NULL, '2026-09-05 08:16:36.385', '2026-09-05 08:16:36.385');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztpp0001psnz6vmv62r0', 'local', 'images/cat-sheets.jpg', '/images/cat-sheets.jpg', 'cat-sheets.jpg', 'image/jpeg', 'IMAGE', 1536, 1024, NULL, 'Steel sheets — representative imagery', NULL, '2026-09-05 08:16:36.397', '2026-09-05 08:16:36.397');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztps0002psnzz1h6e4ai', 'local', 'images/cat-bars.jpg', '/images/cat-bars.jpg', 'cat-bars.jpg', 'image/jpeg', 'IMAGE', 1536, 1024, NULL, 'Steel bars and fasteners — representative imagery', NULL, '2026-09-05 08:16:36.400', '2026-09-05 08:16:36.400');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztpv0003psnzr1b2y1iy', 'local', 'images/cat-pipes.jpg', '/images/cat-pipes.jpg', 'cat-pipes.jpg', 'image/jpeg', 'IMAGE', 1536, 1024, NULL, 'Steel pipes — representative imagery', NULL, '2026-09-05 08:16:36.403', '2026-09-05 08:16:36.403');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztpy0004psnzlq0lg4py', 'local', 'images/material-wide.jpg', '/images/material-wide.jpg', 'material-wide.jpg', 'image/jpeg', 'IMAGE', 1920, 1080, NULL, 'Metal stock — representative imagery', NULL, '2026-09-05 08:16:36.406', '2026-09-05 08:16:36.406');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztq20005psnz414ol932', 'local', 'images/material-detail.jpg', '/images/material-detail.jpg', 'material-detail.jpg', 'image/jpeg', 'IMAGE', 1536, 1024, NULL, 'Metal detail — representative imagery', NULL, '2026-09-05 08:16:36.410', '2026-09-05 08:16:36.410');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztq40006psnzj6mma9yi', 'local', 'images/products/hex-bolts.jpg', '/images/products/hex-bolts.jpg', 'hex-bolts.jpg', 'image/jpeg', 'IMAGE', 1200, 900, NULL, 'Stainless steel hex bolts', NULL, '2026-09-05 08:16:36.412', '2026-09-05 08:16:36.412');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztq60007psnzrbfe694o', 'local', 'images/products/stud-bolts.jpg', '/images/products/stud-bolts.jpg', 'stud-bolts.jpg', 'image/jpeg', 'IMAGE', 1200, 900, NULL, 'Stud bolts and threaded rods with matching nuts', NULL, '2026-09-05 08:16:36.414', '2026-09-05 08:16:36.414');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztq80008psnzozsnati6', 'local', 'images/products/screws.jpg', '/images/products/screws.jpg', 'screws.jpg', 'image/jpeg', 'IMAGE', 1200, 900, NULL, 'Assorted stainless steel machine screws', NULL, '2026-09-05 08:16:36.416', '2026-09-05 08:16:36.416');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztqb0009psnzafllp4gw', 'local', 'images/products/hex-nuts.jpg', '/images/products/hex-nuts.jpg', 'hex-nuts.jpg', 'image/jpeg', 'IMAGE', 1200, 900, NULL, 'Stainless steel hexagon nuts', NULL, '2026-09-05 08:16:36.419', '2026-09-05 08:16:36.419');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztqc000apsnznlkp1r78', 'local', 'images/products/washers.jpg', '/images/products/washers.jpg', 'washers.jpg', 'image/jpeg', 'IMAGE', 1200, 900, NULL, 'Stainless steel plain washers', NULL, '2026-09-05 08:16:36.420', '2026-09-05 08:16:36.420');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztqe000bpsnza4j8szow', 'local', 'images/products/anchor-bolts.jpg', '/images/products/anchor-bolts.jpg', 'anchor-bolts.jpg', 'image/jpeg', 'IMAGE', 1200, 900, NULL, 'J-type anchor foundation bolts with nuts and washers', NULL, '2026-09-05 08:16:36.422', '2026-09-05 08:16:36.422');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztqg000cpsnzdm3mcxtd', 'local', 'images/products/rivet-nuts.jpg', '/images/products/rivet-nuts.jpg', 'rivet-nuts.jpg', 'image/jpeg', 'IMAGE', 1200, 900, NULL, 'Steel rivet nuts and threaded inserts', NULL, '2026-09-05 08:16:36.424', '2026-09-05 08:16:36.424');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztqi000dpsnz3v2hyizv', 'local', 'images/products/pipe-fittings.jpg', '/images/products/pipe-fittings.jpg', 'pipe-fittings.jpg', 'image/jpeg', 'IMAGE', 1200, 900, NULL, 'Butt-weld pipe fittings — elbows, tees and reducers', NULL, '2026-09-05 08:16:36.426', '2026-09-05 08:16:36.426');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztqk000epsnzz4kjkp8t', 'local', 'images/products/pipe-flanges.jpg', '/images/products/pipe-flanges.jpg', 'pipe-flanges.jpg', 'image/jpeg', 'IMAGE', 1200, 900, NULL, 'Forged steel pipe flanges', NULL, '2026-09-05 08:16:36.428', '2026-09-05 08:16:36.428');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3ztqm000fpsnzm7t6k6w2', 'local', 'images/products/carbon-steel-pipes.jpg', '/images/products/carbon-steel-pipes.jpg', 'carbon-steel-pipes.jpg', 'image/jpeg', 'IMAGE', 1200, 900, NULL, 'Carbon steel pipes stacked with beveled ends', NULL, '2026-09-05 08:16:36.430', '2026-09-05 08:16:36.430');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3zuu3001gr3nzuu6596y1', 'local', 'documents/datasheet.pdf', NULL, 'datasheet.pdf', 'application/pdf', 'DOCUMENT', NULL, NULL, NULL, 'Product datasheet', NULL, '2026-09-05 08:16:37.851', '2026-09-05 08:16:37.851');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3zvuz0000scnz5wti13se', 'local', 'images/blog/blog-fasteners.jpg', '/images/blog/blog-fasteners.jpg', 'blog-fasteners.jpg', 'image/jpeg', 'IMAGE', 1200, 800, NULL, 'Hex bolts and nuts', NULL, '2026-09-05 08:16:39.179', '2026-09-05 08:16:39.179');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3zvv40001scnzisivph2o', 'local', 'images/blog/blog-stainless.jpg', '/images/blog/blog-stainless.jpg', 'blog-stainless.jpg', 'image/jpeg', 'IMAGE', 1200, 800, NULL, 'Brushed stainless finish', NULL, '2026-09-05 08:16:39.184', '2026-09-05 08:16:39.184');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3zvv60002scnzyb5lsujk', 'local', 'images/blog/blog-coil.jpg', '/images/blog/blog-coil.jpg', 'blog-coil.jpg', 'image/jpeg', 'IMAGE', 1200, 800, NULL, 'Steel coils in warehouse', NULL, '2026-09-05 08:16:39.186', '2026-09-05 08:16:39.186');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3zvv80003scnz95ab9y31', 'local', 'images/blog/blog-pipe.jpg', '/images/blog/blog-pipe.jpg', 'blog-pipe.jpg', 'image/jpeg', 'IMAGE', 1200, 800, NULL, 'Stacked steel pipes', NULL, '2026-09-05 08:16:39.188', '2026-09-05 08:16:39.188');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3zvva0004scnzrb15pux7', 'local', 'images/blog/blog-quality.jpg', '/images/blog/blog-quality.jpg', 'blog-quality.jpg', 'image/jpeg', 'IMAGE', 1200, 800, NULL, 'Caliper measuring steel', NULL, '2026-09-05 08:16:39.190', '2026-09-05 08:16:39.190');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3zvvc0005scnzdr3jx0ff', 'local', 'images/certs/cert-01.svg', '/images/certs/cert-01.svg', 'cert-01.svg', 'image/svg+xml', 'IMAGE', 800, 560, NULL, 'ISO 9001:2015 quality management certificate', NULL, '2026-09-05 08:16:39.192', '2026-09-05 08:16:39.192');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3zvvd0006scnzf8mvhuyl', 'local', 'images/certs/cert-02.svg', '/images/certs/cert-02.svg', 'cert-02.svg', 'image/svg+xml', 'IMAGE', 800, 560, NULL, 'EN 10204 material test report certificate', NULL, '2026-09-05 08:16:39.193', '2026-09-05 08:16:39.193');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3zvvf0007scnzdesi2cjg', 'local', 'images/certs/cert-03.svg', '/images/certs/cert-03.svg', 'cert-03.svg', 'image/svg+xml', 'IMAGE', 800, 560, NULL, 'IBR approval certificate', NULL, '2026-09-05 08:16:39.195', '2026-09-05 08:16:39.195');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3zvvh0008scnzxqzhwxn9', 'local', 'images/certs/cert-04.svg', '/images/certs/cert-04.svg', 'cert-04.svg', 'image/svg+xml', 'IMAGE', 800, 560, NULL, 'NACE MR-01-75 conformance certificate', NULL, '2026-09-05 08:16:39.197', '2026-09-05 08:16:39.197');
INSERT INTO `MediaAsset` (`id`, `storageProvider`, `storageKey`, `publicUrl`, `filename`, `mimeType`, `type`, `width`, `height`, `size`, `altText`, `metadata`, `createdAt`, `updatedAt`) VALUES ('cmto3zvvj0009scnzc4he38jr', 'local', 'images/certs/cert-05.svg', '/images/certs/cert-05.svg', 'cert-05.svg', 'image/svg+xml', 'IMAGE', 800, 560, NULL, 'Third-party inspection certificate', NULL, '2026-09-05 08:16:39.199', '2026-09-05 08:16:39.199');

-- SeoMeta (10 rows)
INSERT INTO `SeoMeta` (`id`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImageId`, `robots`, `createdAt`, `updatedAt`) VALUES ('cmto3zuu6001hr3nzzekylz8a', 'Bolts, Studs & Screws — SRIYAAN METALS', 'Hex bolts, hex screws, stud bolts and threaded rods in stainless steel, alloy steel, brass and copper.', NULL, NULL, NULL, NULL, NULL, '2026-09-05 08:16:37.854', '2026-09-05 08:16:37.854');
INSERT INTO `SeoMeta` (`id`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImageId`, `robots`, `createdAt`, `updatedAt`) VALUES ('cmto3zuvi001ir3nzvz53sdtw', 'Nuts & Washers — SRIYAAN METALS', 'Hex nuts, slotted nuts, coupling nuts and thin nuts, with plain washers in stainless and carbon steel.', NULL, NULL, NULL, NULL, NULL, '2026-09-05 08:16:37.902', '2026-09-05 08:16:37.902');
INSERT INTO `SeoMeta` (`id`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImageId`, `robots`, `createdAt`, `updatedAt`) VALUES ('cmto3zuw0001jr3nzxsb6bqcc', 'Anchors & Foundation Bolts — SRIYAAN METALS', 'Anchor bolts and J-type foundation bolts for concrete structures, pillars and columns.', NULL, NULL, NULL, NULL, NULL, '2026-09-05 08:16:37.920', '2026-09-05 08:16:37.920');
INSERT INTO `SeoMeta` (`id`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImageId`, `robots`, `createdAt`, `updatedAt`) VALUES ('cmto3zuwe001kr3nza7u90gn4', 'Rivets & Inserts — SRIYAAN METALS', 'Rivet nuts, threaded inserts and blind rivet nuts with a wide grip range tolerance.', NULL, NULL, NULL, NULL, NULL, '2026-09-05 08:16:37.934', '2026-09-05 08:16:37.934');
INSERT INTO `SeoMeta` (`id`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImageId`, `robots`, `createdAt`, `updatedAt`) VALUES ('cmto3zuws001lr3nzkwtfq7h9', 'Pipe Fittings & Flanges — SRIYAAN METALS', 'Butt-weld, socket-weld and threaded fittings plus forged pipe flanges to ASTM, ASME, DIN and JIS.', NULL, NULL, NULL, NULL, NULL, '2026-09-05 08:16:37.949', '2026-09-05 08:16:37.949');
INSERT INTO `SeoMeta` (`id`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImageId`, `robots`, `createdAt`, `updatedAt`) VALUES ('cmto3zux3001mr3nztopvpia9', 'Carbon Steel Pipes — SRIYAAN METALS', 'Carbon steel pipes with dimensions and weights per ASTM ANSI B36.10 / B36.19.', NULL, NULL, NULL, NULL, NULL, '2026-09-05 08:16:37.959', '2026-09-05 08:16:37.959');
INSERT INTO `SeoMeta` (`id`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImageId`, `robots`, `createdAt`, `updatedAt`) VALUES ('cmto3zuxs001nr3nzlj3lm10v', 'About SRIYAAN METALS — SRIYAAN METALS', 'SRIYAAN METALS company page.', NULL, NULL, NULL, NULL, NULL, '2026-09-05 08:16:37.984', '2026-09-05 08:16:37.984');
INSERT INTO `SeoMeta` (`id`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImageId`, `robots`, `createdAt`, `updatedAt`) VALUES ('cmto3zuyn001or3nzenvq3jlt', 'Quality — SRIYAAN METALS', 'SRIYAAN METALS company page.', NULL, NULL, NULL, NULL, NULL, '2026-09-05 08:16:38.015', '2026-09-05 08:16:38.015');
INSERT INTO `SeoMeta` (`id`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImageId`, `robots`, `createdAt`, `updatedAt`) VALUES ('cmto3zuz4001pr3nzpyksenv6', 'Manufacturing & Infrastructure — SRIYAAN METALS', 'SRIYAAN METALS company page.', NULL, NULL, NULL, NULL, NULL, '2026-09-05 08:16:38.032', '2026-09-05 08:16:38.032');
INSERT INTO `SeoMeta` (`id`, `metaTitle`, `metaDescription`, `canonicalUrl`, `ogTitle`, `ogDescription`, `ogImageId`, `robots`, `createdAt`, `updatedAt`) VALUES ('cmto3zuzg001qr3nzz0go1c2d', 'Global Reach — SRIYAAN METALS', 'SRIYAAN METALS company page.', NULL, NULL, NULL, NULL, NULL, '2026-09-05 08:16:38.044', '2026-09-05 08:16:38.044');

-- Category (6 rows)
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `imageId`, `status`, `sortOrder`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztr6000gpsnzhmygaiq2', 'Bolts, Studs & Screws', 'bolts-studs-screws', 'Hex bolts, hex screws, stud bolts and threaded rods in stainless steel, alloy steel, brass and copper.', 'cmto3ztq40006psnzj6mma9yi', 'PUBLISHED', 0, 'cmto3zuu6001hr3nzzekylz8a', '2026-09-05 08:16:36.450', '2026-09-05T08:16:37.896Z');
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `imageId`, `status`, `sortOrder`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztr9000hpsnz3e5ob2nx', 'Nuts & Washers', 'nuts-washers', 'Hex nuts, slotted nuts, coupling nuts and thin nuts, with plain washers in stainless and carbon steel.', 'cmto3ztqb0009psnzafllp4gw', 'PUBLISHED', 1, 'cmto3zuvi001ir3nzvz53sdtw', '2026-09-05 08:16:36.453', '2026-09-05T08:16:37.912Z');
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `imageId`, `status`, `sortOrder`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztra000ipsnzphscvrei', 'Anchors & Foundation Bolts', 'anchors-foundation', 'Anchor bolts and J-type foundation bolts for concrete structures, pillars and columns.', 'cmto3ztqe000bpsnza4j8szow', 'PUBLISHED', 2, 'cmto3zuw0001jr3nzxsb6bqcc', '2026-09-05 08:16:36.454', '2026-09-05T08:16:37.929Z');
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `imageId`, `status`, `sortOrder`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztrc000jpsnzrso3sy1h', 'Rivets & Inserts', 'rivets-inserts', 'Rivet nuts, threaded inserts and blind rivet nuts with a wide grip range tolerance.', 'cmto3ztqg000cpsnzdm3mcxtd', 'PUBLISHED', 3, 'cmto3zuwe001kr3nza7u90gn4', '2026-09-05 08:16:36.456', '2026-09-05T08:16:37.942Z');
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `imageId`, `status`, `sortOrder`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztre000kpsnzbjgajrn9', 'Pipe Fittings & Flanges', 'pipe-fittings-flanges', 'Butt-weld, socket-weld and threaded fittings plus forged pipe flanges to ASTM, ASME, DIN and JIS.', 'cmto3ztqi000dpsnz3v2hyizv', 'PUBLISHED', 4, 'cmto3zuws001lr3nzkwtfq7h9', '2026-09-05 08:16:36.458', '2026-09-05T08:16:37.954Z');
INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `imageId`, `status`, `sortOrder`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztrg000lpsnzh3recna7', 'Carbon Steel Pipes', 'carbon-steel-pipes', 'Carbon steel pipes with dimensions and weights per ASTM ANSI B36.10 / B36.19.', 'cmto3ztqm000fpsnzm7t6k6w2', 'PUBLISHED', 5, 'cmto3zux3001mr3nztopvpia9', '2026-09-05 08:16:36.460', '2026-09-05T08:16:37.972Z');

-- Product (11 rows)
INSERT INTO `Product` (`id`, `name`, `slug`, `shortDescription`, `description`, `productCode`, `status`, `featured`, `sortOrder`, `categoryId`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztro000mpsnz4xkl4vyl', 'Hex Bolts & Hex Screws', 'hex-bolts', 'Hex bolts and hex screws manufactured from stainless steel, alloy steel, brass and copper, in customised sizes and shapes.', 'Hex bolts and hex screws manufactured from stainless steel, alloy steel, brass and copper, in customised sizes and shapes.', 'SM-BLT-001', 'PUBLISHED', 1, 0, 'cmto3ztr6000gpsnzhmygaiq2', NULL, '2026-09-05 08:16:36.468', '2026-09-05 08:16:36.468');
INSERT INTO `Product` (`id`, `name`, `slug`, `shortDescription`, `description`, `productCode`, `status`, `featured`, `sortOrder`, `categoryId`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztsm000upsnz4b71tpo5', 'Stud Bolts & Threaded Rods', 'stud-bolts-threaded-rods', 'Properly coated, corrosion-resistant stud bolts and threaded rods for industrial fastening applications.', 'Properly coated, corrosion-resistant stud bolts and threaded rods for industrial fastening applications.', 'SM-BLT-002', 'PUBLISHED', 0, 1, 'cmto3ztr6000gpsnzhmygaiq2', NULL, '2026-09-05 08:16:36.502', '2026-09-05 08:16:36.502');
INSERT INTO `Product` (`id`, `name`, `slug`, `shortDescription`, `description`, `productCode`, `status`, `featured`, `sortOrder`, `categoryId`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztsv0011psnzelg6dic9', 'Screws', 'screws', 'Screw fasteners with least decarburization, manufactured from premium grade material in various sizes and dimensions.', 'Screw fasteners with least decarburization, manufactured from premium grade material in various sizes and dimensions.', 'SM-SCR-001', 'PUBLISHED', 0, 2, 'cmto3ztr6000gpsnzhmygaiq2', NULL, '2026-09-05 08:16:36.511', '2026-09-05 08:16:36.511');
INSERT INTO `Product` (`id`, `name`, `slug`, `shortDescription`, `description`, `productCode`, `status`, `featured`, `sortOrder`, `categoryId`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3zttb0017psnzozmln7m6', 'Hex, Slotted & Coupling Nuts', 'nuts', 'Hex nuts, slotted nuts, break nuts, hexagon coupling nuts and thin nuts — superlative quality and precision dimensions for extreme working conditions.', 'Hex nuts, slotted nuts, break nuts, hexagon coupling nuts and thin nuts — superlative quality and precision dimensions for extreme working conditions.', 'SM-NUT-001', 'PUBLISHED', 1, 3, 'cmto3ztr9000hpsnz3e5ob2nx', NULL, '2026-09-05 08:16:36.527', '2026-09-05 08:16:36.527');
INSERT INTO `Product` (`id`, `name`, `slug`, `shortDescription`, `description`, `productCode`, `status`, `featured`, `sortOrder`, `categoryId`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3zttl001dpsnz6bg2iv48', 'Washers — SS & CS Plain', 'washers', 'Stainless steel and carbon steel plain washers, manufactured in different grades of metals and alloys.', 'Stainless steel and carbon steel plain washers, manufactured in different grades of metals and alloys.', 'SM-WSH-001', 'PUBLISHED', 0, 4, 'cmto3ztr9000hpsnz3e5ob2nx', NULL, '2026-09-05 08:16:36.537', '2026-09-05 08:16:36.537');
INSERT INTO `Product` (`id`, `name`, `slug`, `shortDescription`, `description`, `productCode`, `status`, `featured`, `sortOrder`, `categoryId`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztud001jpsnzk5zomql8', 'Anchor Bolts', 'anchor-bolts', 'Anchor bolts and threaded rods used across industries for fastening applications, coated for corrosion resistance and higher output.', 'Anchor bolts and threaded rods used across industries for fastening applications, coated for corrosion resistance and higher output.', 'SM-ANC-001', 'PUBLISHED', 1, 5, 'cmto3ztra000ipsnzphscvrei', NULL, '2026-09-05 08:16:36.565', '2026-09-05 08:16:36.565');
INSERT INTO `Product` (`id`, `name`, `slug`, `shortDescription`, `description`, `productCode`, `status`, `featured`, `sortOrder`, `categoryId`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztul001ppsnzuypgfu67', 'Foundation Bolts (J-Type)', 'foundation-bolts', 'Foundation bolts for engineering structures — tower foundations with concrete, erection of pillars and columns; strong, corrosion resistant and cost effective.', 'Foundation bolts for engineering structures — tower foundations with concrete, erection of pillars and columns; strong, corrosion resistant and cost effective.', 'SM-FDN-001', 'PUBLISHED', 0, 6, 'cmto3ztra000ipsnzphscvrei', NULL, '2026-09-05 08:16:36.573', '2026-09-05 08:16:36.573');
INSERT INTO `Product` (`id`, `name`, `slug`, `shortDescription`, `description`, `productCode`, `status`, `featured`, `sortOrder`, `categoryId`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztus001vpsnzrhldml2u', 'Rivet Nuts & Threaded Inserts', 'rivet-nuts-inserts', 'Rivet nuts (threaded inserts / blind rivet nuts) with wide grip range tolerance, installed entirely from one side of the material.', 'Rivet nuts (threaded inserts / blind rivet nuts) with wide grip range tolerance, installed entirely from one side of the material.', 'SM-RIV-001', 'PUBLISHED', 1, 7, 'cmto3ztrc000jpsnzrso3sy1h', NULL, '2026-09-05 08:16:36.580', '2026-09-05 08:16:36.580');
INSERT INTO `Product` (`id`, `name`, `slug`, `shortDescription`, `description`, `productCode`, `status`, `featured`, `sortOrder`, `categoryId`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztuz0021psnzhli7omg1', 'Butt-Weld Pipe Fittings', 'butt-weld-pipe-fittings', 'Butt-weld pipe fittings manufactured to ASTM / ASME / DIN / JIS with EN 10204 3.1 & 3.2 test certificates and NACE MR-01-75 conformance.', 'Butt-weld pipe fittings manufactured to ASTM / ASME / DIN / JIS with EN 10204 3.1 & 3.2 test certificates and NACE MR-01-75 conformance.', 'SM-FIT-001', 'PUBLISHED', 1, 8, 'cmto3ztre000kpsnzbjgajrn9', NULL, '2026-09-05 08:16:36.587', '2026-09-05 08:16:36.587');
INSERT INTO `Product` (`id`, `name`, `slug`, `shortDescription`, `description`, `productCode`, `status`, `featured`, `sortOrder`, `categoryId`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztv70028psnz05p2jxgb', 'Pipe Flanges', 'pipe-flanges', 'Forged pipe flanges and branch connections from an ISO 9001:2015 and IBR approved manufacturer.', 'Forged pipe flanges and branch connections from an ISO 9001:2015 and IBR approved manufacturer.', 'SM-FLG-001', 'PUBLISHED', 0, 9, 'cmto3ztre000kpsnzbjgajrn9', NULL, '2026-09-05 08:16:36.595', '2026-09-05 08:16:36.595');
INSERT INTO `Product` (`id`, `name`, `slug`, `shortDescription`, `description`, `productCode`, `status`, `featured`, `sortOrder`, `categoryId`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3ztvg002epsnzyicv1bpk', 'Carbon Steel Pipes', 'carbon-steel-pipes', 'Carbon steel pipes with dimensions and weights per metre as per ASTM ANSI B36.10 / B36.19.', 'Carbon steel pipes with dimensions and weights per metre as per ASTM ANSI B36.10 / B36.19.', 'SM-PIP-001', 'PUBLISHED', 1, 10, 'cmto3ztrg000lpsnzh3recna7', NULL, '2026-09-05 08:16:36.604', '2026-09-05 08:16:36.604');

-- ProductImage (11 rows)
INSERT INTO `ProductImage` (`id`, `productId`, `mediaId`, `altText`, `sortOrder`) VALUES ('cmto3ztrv000npsnzcu3ivgqc', 'cmto3ztro000mpsnz4xkl4vyl', 'cmto3ztq40006psnzj6mma9yi', 'Hex Bolts & Hex Screws', 0);
INSERT INTO `ProductImage` (`id`, `productId`, `mediaId`, `altText`, `sortOrder`) VALUES ('cmto3ztso000vpsnzq58m3zed', 'cmto3ztsm000upsnz4b71tpo5', 'cmto3ztq60007psnzrbfe694o', 'Stud Bolts & Threaded Rods', 0);
INSERT INTO `ProductImage` (`id`, `productId`, `mediaId`, `altText`, `sortOrder`) VALUES ('cmto3ztsx0012psnz4z562bqp', 'cmto3ztsv0011psnzelg6dic9', 'cmto3ztq80008psnzozsnati6', 'Screws', 0);
INSERT INTO `ProductImage` (`id`, `productId`, `mediaId`, `altText`, `sortOrder`) VALUES ('cmto3zttd0018psnz7mbo8aky', 'cmto3zttb0017psnzozmln7m6', 'cmto3ztqb0009psnzafllp4gw', 'Hex, Slotted & Coupling Nuts', 0);
INSERT INTO `ProductImage` (`id`, `productId`, `mediaId`, `altText`, `sortOrder`) VALUES ('cmto3ztto001epsnzninw83p7', 'cmto3zttl001dpsnz6bg2iv48', 'cmto3ztqc000apsnznlkp1r78', 'Washers — SS & CS Plain', 0);
INSERT INTO `ProductImage` (`id`, `productId`, `mediaId`, `altText`, `sortOrder`) VALUES ('cmto3ztuf001kpsnze8qgvuog', 'cmto3ztud001jpsnzk5zomql8', 'cmto3ztqe000bpsnza4j8szow', 'Anchor Bolts', 0);
INSERT INTO `ProductImage` (`id`, `productId`, `mediaId`, `altText`, `sortOrder`) VALUES ('cmto3ztun001qpsnzahb5lnra', 'cmto3ztul001ppsnzuypgfu67', 'cmto3ztqe000bpsnza4j8szow', 'Foundation Bolts (J-Type)', 0);
INSERT INTO `ProductImage` (`id`, `productId`, `mediaId`, `altText`, `sortOrder`) VALUES ('cmto3ztuu001wpsnzypp04ni0', 'cmto3ztus001vpsnzrhldml2u', 'cmto3ztqg000cpsnzdm3mcxtd', 'Rivet Nuts & Threaded Inserts', 0);
INSERT INTO `ProductImage` (`id`, `productId`, `mediaId`, `altText`, `sortOrder`) VALUES ('cmto3ztv10022psnz72oqarle', 'cmto3ztuz0021psnzhli7omg1', 'cmto3ztqi000dpsnz3v2hyizv', 'Butt-Weld Pipe Fittings', 0);
INSERT INTO `ProductImage` (`id`, `productId`, `mediaId`, `altText`, `sortOrder`) VALUES ('cmto3ztva0029psnzi8nvlkui', 'cmto3ztv70028psnz05p2jxgb', 'cmto3ztqk000epsnzz4kjkp8t', 'Pipe Flanges', 0);
INSERT INTO `ProductImage` (`id`, `productId`, `mediaId`, `altText`, `sortOrder`) VALUES ('cmto3ztvi002fpsnzub9dn6fq', 'cmto3ztvg002epsnzyicv1bpk', 'cmto3ztqm000fpsnzm7t6k6w2', 'Carbon Steel Pipes', 0);

-- ProductSpecification (26 rows)
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztsa000opsnzffouuucb', 'cmto3ztro000mpsnz4xkl4vyl', 'Size range', 'M6 – M42, customised sizes on request', NULL, 0);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztsa000ppsnz09v01vec', 'cmto3ztro000mpsnz4xkl4vyl', 'Materials', 'SS 304 / 316, alloy steel, brass, copper', NULL, 1);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztsa000qpsnzbamj5080', 'cmto3ztro000mpsnz4xkl4vyl', 'Grades', 'Hastelloy, Inconel, Monel, Duplex', NULL, 2);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztsa000rpsnzy9drapw9', 'cmto3ztro000mpsnz4xkl4vyl', 'Standards', 'DIN / ASTM / IS', NULL, 3);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztsr000wpsnz93tj10zi', 'cmto3ztsm000upsnz4b71tpo5', 'Coating', 'Corrosion-resistant coating', NULL, 0);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztsr000xpsnz7y15p4to', 'cmto3ztsm000upsnz4b71tpo5', 'Sizes', 'Customised sizes and shapes', NULL, 1);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztsr000ypsnzthip5ef4', 'cmto3ztsm000upsnz4b71tpo5', 'Materials', 'SS / alloy steel / brass', NULL, 2);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztt60013psnzmmwgsg7r', 'cmto3ztsv0011psnzelg6dic9', 'Materials', 'Stainless steel, alloy steel, brass, copper', NULL, 0);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztt60014psnz3cy55txh', 'cmto3ztsv0011psnzelg6dic9', 'Sizes', 'Various sizes and dimensions', NULL, 1);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3zttg0019psnz34s63mdh', 'cmto3zttb0017psnzozmln7m6', 'Types', 'Hex, slotted, break, hexagon coupling, hexagon thin, steel coupling, steel thin', NULL, 0);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3zttg001apsnznfisstrl', 'cmto3zttb0017psnzozmln7m6', 'Performance', 'Withstands extreme working conditions and pressure', NULL, 1);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztu0001fpsnzekfrg5zh', 'cmto3zttl001dpsnz6bg2iv48', 'Types', 'SS washers, CS washers, SS plain, CS plain', NULL, 0);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztu0001gpsnzbbj2ptau', 'cmto3zttl001dpsnz6bg2iv48', 'Sizes', 'Customised sizes and shapes', NULL, 1);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztuh001lpsnzrj7l8ne4', 'cmto3ztud001jpsnzk5zomql8', 'Finish', 'Properly coated, corrosion resistant', NULL, 0);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztuh001mpsnz614aevib', 'cmto3ztud001jpsnzk5zomql8', 'Sizes', 'Customised sizes and shapes', NULL, 1);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztup001rpsnzdi2shpzj', 'cmto3ztul001ppsnzuypgfu67', 'Types', 'J-type foundation bolts', NULL, 0);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztup001spsnz8h8axxrh', 'cmto3ztul001ppsnzuypgfu67', 'Material', 'Stainless steel (strong, corrosion resistant)', NULL, 1);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztuw001xpsnz81shrorq', 'cmto3ztus001vpsnzrhldml2u', 'Grip range', 'Wide range of material thicknesses', NULL, 0);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztuw001ypsnzfez9i6it', 'cmto3ztus001vpsnzrhldml2u', 'Type', 'One-piece threaded counter-bored tubular rivet', NULL, 1);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztv30023psnz4e70o4yj', 'cmto3ztuz0021psnzhli7omg1', 'Standards', 'JIS / ISS / BSS / DIN / ASTM / ASME', NULL, 0);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztv30024psnzri776asc', 'cmto3ztuz0021psnzhli7omg1', 'Certification', 'EN 10204 3.1 & 3.2, third-party inspection', NULL, 1);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztv30025psnzhy9t7yc9', 'cmto3ztuz0021psnzhli7omg1', 'Compliance', 'NACE MR-01-75', NULL, 2);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztvc002apsnzrn5nwy97', 'cmto3ztv70028psnz05p2jxgb', 'Standards', 'ASTM A350, DIN, JIS', NULL, 0);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztvc002bpsnz0kpolwq0', 'cmto3ztv70028psnz05p2jxgb', 'Approval', 'ISO 9001:2015, IBR', NULL, 1);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztvk002gpsnzb39pdl0b', 'cmto3ztvg002epsnzyicv1bpk', 'Dimensions', 'ASTM ANSI B36.10 / B36.19', NULL, 0);
INSERT INTO `ProductSpecification` (`id`, `productId`, `name`, `value`, `unit`, `sortOrder`) VALUES ('cmto3ztvk002hpsnzhgf0yeo5', 'cmto3ztvg002epsnzyicv1bpk', 'Supply', 'Third-party inspection certificates', NULL, 1);

-- BlogCategory (3 rows)
INSERT INTO `BlogCategory` (`id`, `name`, `slug`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztza0032psnzkfouofvi', 'Updates', 'updates', 0, '2026-09-05 08:16:36.742', '2026-09-05 08:16:36.742');
INSERT INTO `BlogCategory` (`id`, `name`, `slug`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3zvw3000ascnztl8xr8kz', 'Fastener Guides', 'guides', 1, '2026-09-05 08:16:39.219', '2026-09-05 08:16:39.219');
INSERT INTO `BlogCategory` (`id`, `name`, `slug`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3zvw5000bscnzskg2lqne', 'Industry Knowledge', 'knowledge', 2, '2026-09-05 08:16:39.221', '2026-09-05 08:16:39.221');

-- BlogPost (7 rows)
INSERT INTO `BlogPost` (`id`, `title`, `slug`, `excerpt`, `content`, `featuredImageId`, `authorId`, `categoryId`, `status`, `publishedAt`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3zvwn000iscnztc8qvrsa', 'How to specify fasteners for structural work', 'how-to-specify-fasteners', 'A buyer''s checklist for grade, coating and standard when ordering bolts, nuts and washers.', '## Specifying fasteners

Grade, coating and standard decide performance in structural work. Confirm the material grade (SS 304/316, alloy steel), the coating for corrosion resistance, and the governing standard (DIN / ASTM / IS) before ordering.

### What to confirm

- Material grade and manufacturer''s test certificate
- Coating and finish
- Size range and thread standard', 'cmto3zvuz0000scnz5wti13se', NULL, 'cmto3zvw3000ascnztl8xr8kz', 'PUBLISHED', '2026-09-02 08:16:39.237', NULL, '2026-09-05 08:16:39.239', '2026-09-05 08:16:39.239');
INSERT INTO `BlogPost` (`id`, `title`, `slug`, `excerpt`, `content`, `featuredImageId`, `authorId`, `categoryId`, `status`, `publishedAt`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3zvwu000jscnz3y4u5tv0', 'Stainless grades: 304 vs 316', 'stainless-grades-304-316', 'What the two common austenitic grades mean for corrosion resistance and cost.', '## 304 vs 316

Grade 304 suits general fabrication; 316 adds molybdenum for chloride resistance, making it the default for chemical, petrochemical and coastal applications.', 'cmto3zvv40001scnzisivph2o', NULL, 'cmto3zvw3000ascnztl8xr8kz', 'PUBLISHED', '2026-08-28 08:16:39.246', NULL, '2026-09-05 08:16:39.246', '2026-09-05 08:16:39.246');
INSERT INTO `BlogPost` (`id`, `title`, `slug`, `excerpt`, `content`, `featuredImageId`, `authorId`, `categoryId`, `status`, `publishedAt`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3zvx2000kscnz71xmqb81', 'Carbon steel pipe dimensions and weights', 'carbon-steel-pipe-dimensions', 'Reading the ASTM ANSI B36.10 / B36.19 dimension and weight tables.', '## Dimensions per ASTM

Carbon steel pipes are supplied with dimensions and weights per metre as per ASTM ANSI B36.10 / B36.19. Schedule numbers govern wall thickness; confirm schedule and end finish with your order.', 'cmto3zvv80003scnz95ab9y31', NULL, 'cmto3zvw3000ascnztl8xr8kz', 'PUBLISHED', '2026-08-23 08:16:39.254', NULL, '2026-09-05 08:16:39.254', '2026-09-05 08:16:39.254');
INSERT INTO `BlogPost` (`id`, `title`, `slug`, `excerpt`, `content`, `featuredImageId`, `authorId`, `categoryId`, `status`, `publishedAt`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3zvxa000lscnzi46ypyyz', 'EN 10204 3.1 vs 3.2 test certificates', 'en-10204-test-certificates', 'The difference between manufacturer''s and third-party certified material.', '## EN 10204

A 3.1 certificate is issued by the manufacturer; a 3.2 is validated by an independent third-party inspection body. Fittings and flanges are supplied with either, per project requirement.', 'cmto3zvva0004scnzrb15pux7', NULL, 'cmto3zvw3000ascnztl8xr8kz', 'PUBLISHED', '2026-08-18 08:16:39.262', NULL, '2026-09-05 08:16:39.262', '2026-09-05 08:16:39.262');
INSERT INTO `BlogPost` (`id`, `title`, `slug`, `excerpt`, `content`, `featuredImageId`, `authorId`, `categoryId`, `status`, `publishedAt`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3zvxe000mscnzah057xi5', 'Butt-weld, socket-weld and threaded fittings', 'choosing-between-forged-fittings', 'Where each fitting type fits in a piping system.', '## Fitting types

Butt-weld suits larger, permanent lines; socket-weld and threaded fittings serve smaller bore instrumentation and maintenance-friendly joints. All are available to ASTM / ASME / DIN / JIS.', 'cmto3zvv80003scnz95ab9y31', NULL, 'cmto3zvw3000ascnztl8xr8kz', 'PUBLISHED', '2026-08-13 08:16:39.266', NULL, '2026-09-05 08:16:39.266', '2026-09-05 08:16:39.266');
INSERT INTO `BlogPost` (`id`, `title`, `slug`, `excerpt`, `content`, `featuredImageId`, `authorId`, `categoryId`, `status`, `publishedAt`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3zvxn000nscnzpwnzl63s', 'J-type foundation bolts in structural work', 'j-type-foundation-bolts', 'Why J-type bolts are used with concrete foundations.', '## Foundation bolts

Part of the bolt is sunk into concrete as the structure is developed, making it less prone to corrosion. J-type bolts are chosen depending on the application nature.', 'cmto3zvuz0000scnz5wti13se', NULL, 'cmto3zvw3000ascnztl8xr8kz', 'PUBLISHED', '2026-08-08 08:16:39.275', NULL, '2026-09-05 08:16:39.275', '2026-09-05 08:16:39.275');
INSERT INTO `BlogPost` (`id`, `title`, `slug`, `excerpt`, `content`, `featuredImageId`, `authorId`, `categoryId`, `status`, `publishedAt`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3zvxv000oscnzfem9bsoy', 'Export documentation for metal consignments', 'export-documentation-basics', 'What moves with an export shipment from Mumbai.', '## Export documents

Invoice, packing list and certificate of origin move with the consignment; material test certificates follow the goods. Documentation is coordinated with dispatch.', 'cmto3zvv60002scnzyb5lsujk', NULL, 'cmto3zvw3000ascnztl8xr8kz', 'PUBLISHED', '2026-08-03 08:16:39.282', NULL, '2026-09-05 08:16:39.283', '2026-09-05 08:16:39.283');

-- Certification (5 rows)
INSERT INTO `Certification` (`id`, `name`, `issuer`, `documentId`, `validFrom`, `validUntil`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztwu002qpsnz1bm2w87k', 'ISO 9001:2015 Quality Management', 'ISO', 'cmto3zvvc0005scnzdr3jx0ff', NULL, NULL, 'PUBLISHED', 0, '2026-09-05 08:16:36.655', '2026-09-05T08:16:39.207Z');
INSERT INTO `Certification` (`id`, `name`, `issuer`, `documentId`, `validFrom`, `validUntil`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztxd002rpsnzs17p0nve', 'IBR Approval', 'Indian Boiler Regulations', 'cmto3zvvf0007scnzdesi2cjg', NULL, NULL, 'PUBLISHED', 2, '2026-09-05 08:16:36.674', '2026-09-05T08:16:39.211Z');
INSERT INTO `Certification` (`id`, `name`, `issuer`, `documentId`, `validFrom`, `validUntil`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztxh002spsnz0b2ymkqt', 'EN 10204 3.1 & 3.2 Test Certificates', 'Manufacturer / third party', 'cmto3zvvd0006scnzf8mvhuyl', NULL, NULL, 'PUBLISHED', 1, '2026-09-05 08:16:36.677', '2026-09-05T08:16:39.209Z');
INSERT INTO `Certification` (`id`, `name`, `issuer`, `documentId`, `validFrom`, `validUntil`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztxm002tpsnzrbo5qmlz', 'NACE MR-01-75 Conformance', 'NACE', 'cmto3zvvh0008scnzxqzhwxn9', NULL, NULL, 'PUBLISHED', 3, '2026-09-05 08:16:36.682', '2026-09-05T08:16:39.213Z');
INSERT INTO `Certification` (`id`, `name`, `issuer`, `documentId`, `validFrom`, `validUntil`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztxq002upsnzz8e2yyqd', 'Third-Party Inspection Certificates', 'TPI agencies', 'cmto3zvvj0009scnzc4he38jr', NULL, NULL, 'PUBLISHED', 4, '2026-09-05 08:16:36.686', '2026-09-05T08:16:39.215Z');

-- Industry (4 rows)
INSERT INTO `Industry` (`id`, `name`, `slug`, `description`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3zunq0000r3nzp9eoz4bq', 'Construction', 'construction', 'Structural steel, reinforcement and fixing hardware for building projects.', 'PUBLISHED', 0, '2026-09-05 08:16:37.622', '2026-09-05 08:16:37.622');
INSERT INTO `Industry` (`id`, `name`, `slug`, `description`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3zunw0001r3nz7oozxvt0', 'Automotive', 'automotive', 'Grades and finishes suited to automotive component manufacturing.', 'PUBLISHED', 1, '2026-09-05 08:16:37.628', '2026-09-05 08:16:37.628');
INSERT INTO `Industry` (`id`, `name`, `slug`, `description`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3zunz0002r3nz3sfytq6s', 'Engineering', 'engineering', 'Stock for general engineering, fabrication and machine shops.', 'PUBLISHED', 2, '2026-09-05 08:16:37.631', '2026-09-05 08:16:37.631');
INSERT INTO `Industry` (`id`, `name`, `slug`, `description`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3zuo10003r3nzqo5u4yaz', 'Infrastructure', 'infrastructure', 'Material for roads, bridges, utilities and public works.', 'PUBLISHED', 3, '2026-09-05 08:16:37.633', '2026-09-05 08:16:37.633');

-- InfrastructureItem (2 rows)
INSERT INTO `InfrastructureItem` (`id`, `title`, `caption`, `mediaId`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztyw0030psnzdxy76tbp', 'Warehousing', 'Covered storage with material segregation.', NULL, 'PUBLISHED', 0, '2026-09-05 08:16:36.728', '2026-09-05 08:16:36.728');
INSERT INTO `InfrastructureItem` (`id`, `title`, `caption`, `mediaId`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztz40031psnzlnttxz3v', 'Logistics coordination', 'Dispatch coordination across India.', NULL, 'PUBLISHED', 1, '2026-09-05 08:16:36.736', '2026-09-05 08:16:36.736');

-- Capability (3 rows)
INSERT INTO `Capability` (`id`, `label`, `note`, `metricValue`, `metricPrefix`, `metricSuffix`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3zuo80004r3nzbz7tzghq', 'Product lines', 'Fasteners, fittings, flanges & pipes', 6, NULL, ' categories', 'PUBLISHED', 1, '2026-09-05 08:16:37.640', '2026-09-05T08:16:37.644Z');
INSERT INTO `Capability` (`id`, `label`, `note`, `metricValue`, `metricPrefix`, `metricSuffix`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3zuog0005r3nzu4zbkzxx', 'Materials', 'SS, CS, alloy, brass, copper, nickel alloys', 15, NULL, '+ grades', 'PUBLISHED', 2, '2026-09-05 08:16:37.648', '2026-09-05 08:16:37.648');
INSERT INTO `Capability` (`id`, `label`, `note`, `metricValue`, `metricPrefix`, `metricSuffix`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3zuok0006r3nzwz561bwc', 'Dispatch', 'Against confirmed orders', 48, NULL, ' hr', 'PUBLISHED', 3, '2026-09-05 08:16:37.652', '2026-09-05 08:16:37.652');

-- Customer (6 rows)
INSERT INTO `Customer` (`id`, `name`, `logoId`, `website`, `consent`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztvt002kpsnzj6f38yra', 'Apex Engineering', NULL, 'https://example.com', 1, 'PUBLISHED', 0, '2026-09-05 08:16:36.617', '2026-09-05 08:16:36.617');
INSERT INTO `Customer` (`id`, `name`, `logoId`, `website`, `consent`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztw4002lpsnzvya9lydj', 'Coastal Infra', NULL, 'https://example.com', 1, 'PUBLISHED', 1, '2026-09-05 08:16:36.628', '2026-09-05 08:16:36.628');
INSERT INTO `Customer` (`id`, `name`, `logoId`, `website`, `consent`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztw6002mpsnzl60kq5ma', 'Precision Tools Co', NULL, 'https://example.com', 1, 'PUBLISHED', 2, '2026-09-05 08:16:36.630', '2026-09-05 08:16:36.630');
INSERT INTO `Customer` (`id`, `name`, `logoId`, `website`, `consent`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztwb002npsnzmdrwtt5t', 'Metro Buildwell', NULL, 'https://example.com', 1, 'PUBLISHED', 3, '2026-09-05 08:16:36.635', '2026-09-05 08:16:36.635');
INSERT INTO `Customer` (`id`, `name`, `logoId`, `website`, `consent`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztwd002opsnzyhzqhhib', 'Orbit Industries', NULL, 'https://example.com', 1, 'PUBLISHED', 4, '2026-09-05 08:16:36.637', '2026-09-05 08:16:36.637');
INSERT INTO `Customer` (`id`, `name`, `logoId`, `website`, `consent`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztwg002ppsnzwe5taeb3', 'Sterling Projects', NULL, 'https://example.com', 1, 'PUBLISHED', 5, '2026-09-05 08:16:36.640', '2026-09-05 08:16:36.640');

-- GlobalCountry (5 rows)
INSERT INTO `GlobalCountry` (`id`, `code`, `label`, `direction`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztxy002vpsnzjluox5fb', 'ae', 'Middle East', 'export', 'PUBLISHED', 0, '2026-09-05 08:16:36.694', '2026-09-05 08:16:36.694');
INSERT INTO `GlobalCountry` (`id`, `code`, `label`, `direction`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3zty5002wpsnzgkxkcgup', 'de', 'Europe', 'export', 'PUBLISHED', 1, '2026-09-05 08:16:36.701', '2026-09-05 08:16:36.701');
INSERT INTO `GlobalCountry` (`id`, `code`, `label`, `direction`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztyb002xpsnzlcymhkem', 'sg', 'Southeast Asia', 'export', 'PUBLISHED', 2, '2026-09-05 08:16:36.707', '2026-09-05 08:16:36.707');
INSERT INTO `GlobalCountry` (`id`, `code`, `label`, `direction`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztyh002ypsnzhvtiy4z1', 'za', 'Africa', 'export', 'PUBLISHED', 3, '2026-09-05 08:16:36.713', '2026-09-05 08:16:36.713');
INSERT INTO `GlobalCountry` (`id`, `code`, `label`, `direction`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES ('cmto3ztyk002zpsnzp39xyohj', 'us', 'Americas', 'export', 'PUBLISHED', 4, '2026-09-05 08:16:36.716', '2026-09-05 08:16:36.716');

-- CompanyPage (4 rows)
INSERT INTO `CompanyPage` (`id`, `key`, `title`, `content`, `status`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3zup20009r3nzgswvgm0n', 'about', 'About SRIYAAN METALS', '## About

SRIYAAN METALS is a Mumbai-based metals trading and import-export business operating from Platinum Arcade, JSS Road, Opera House. We supply fasteners, pipe fittings, flanges and carbon steel pipes to buyers across India and overseas.

- Fasteners in all grades — SS 304/316, alloy steel, brass, copper, Hastelloy, Inconel, Monel, Duplex
- Import and export coordination
- Enquiry-driven, specification-first supply', 'PUBLISHED', 'cmto3zuxs001nr3nzlj3lm10v', '2026-09-05 08:16:37.670', '2026-09-05T08:16:37.999Z');
INSERT INTO `CompanyPage` (`id`, `key`, `title`, `content`, `status`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3zup4000ar3nzv8z3xxxb', 'quality', 'Quality', '## Quality

Material is inspected against the order specification before acceptance. Products are supplied with manufacturer test certificates per EN 10204 3.1 & 3.2 under third-party inspection, conforming to NACE MR-01-75, from an ISO 9001:2015 and IBR approved manufacturer.', 'PUBLISHED', 'cmto3zuyn001or3nzenvq3jlt', '2026-09-05 08:16:37.672', '2026-09-05T08:16:38.028Z');
INSERT INTO `CompanyPage` (`id`, `key`, `title`, `content`, `status`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3zup6000br3nz10z4pk63', 'manufacturing', 'Manufacturing & Infrastructure', '## Infrastructure

In-house facilities include cutting, hot and cold forming, pressing, welding, heat treatment, machining, pickling, hydraulic testing, ball passing, passivation and anti-rust coating for protection and durable packaging. Covered warehousing with material segregation.', 'PUBLISHED', 'cmto3zuz4001pr3nzpyksenv6', '2026-09-05 08:16:37.674', '2026-09-05T08:16:38.041Z');
INSERT INTO `CompanyPage` (`id`, `key`, `title`, `content`, `status`, `seoId`, `createdAt`, `updatedAt`) VALUES ('cmto3zup7000cr3nz9dpn810f', 'global-reach', 'Global Reach', '## Global reach

Import and export operations run from Mumbai — integrated piping solutions with worldwide fulfilment capability, manufactured to DIN, ASTM A350 and JIS standards for oil and gas, petrochemical, chemical, plumbing and HVAC industries.', 'PUBLISHED', 'cmto3zuzg001qr3nzz0go1c2d', '2026-09-05 08:16:37.675', '2026-09-05T08:16:38.052Z');

-- WebsiteSetting (23 rows)
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zupe000dr3nz2zibny6h', 'contact.phone1', '"+91 96195 61657"', 'contact', '2026-09-05 08:16:37.682', '2026-09-05 08:16:37.682');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zupm000er3nz2tkg3hts', 'contact.phone2', '"+91 98190 33982"', 'contact', '2026-09-05 08:16:37.690', '2026-09-05 08:16:37.690');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zupo000fr3nz50hp00ra', 'contact.whatsapp1', '"+91 96195 61657"', 'contact', '2026-09-05 08:16:37.692', '2026-09-05 08:16:37.692');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zupp000gr3nzvru7qv7e', 'contact.whatsapp2', '"+91 98190 33982"', 'contact', '2026-09-05 08:16:37.693', '2026-09-05 08:16:37.693');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zupt000hr3nzunvwwca6', 'contact.email.info', '"info@sriyaanmetals.com"', 'contact', '2026-09-05 08:16:37.697', '2026-09-05 08:16:37.697');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zupv000ir3nztqfhbfwe', 'contact.email.sales', '"sales@sriyaanmetals.com"', 'contact', '2026-09-05 08:16:37.699', '2026-09-05 08:16:37.699');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zuq1000jr3nzd1ta3p42', 'contact.email.purchase', '"purchase@sriyaanmetals.com"', 'contact', '2026-09-05 08:16:37.705', '2026-09-05 08:16:37.705');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zuqa000kr3nz25sel0nz', 'contact.email.accounts', '"accounts@sriyaanmetals.com"', 'contact', '2026-09-05 08:16:37.714', '2026-09-05 08:16:37.714');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zuqd000lr3nz656q6hfy', 'contact.hours', '"10:00 AM – 7:00 PM"', 'contact', '2026-09-05 08:16:37.717', '2026-09-05 08:16:37.717');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zuql000mr3nzwurfjkz0', 'contact.address', '"Floor-2, 204, Plot No.96/98,\\nPlatinum Arcade, JSS Road,\\nCentral Plaza Cinema Charni Road,\\nOpera House, Mumbai - 400004"', 'contact', '2026-09-05 08:16:37.725', '2026-09-05 08:16:37.725');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zuqo000nr3nzyhi4ine7', 'contact.gst', '"GSTIN: 27CRKPS0693G1ZB"', 'contact', '2026-09-05 08:16:37.728', '2026-09-05 08:16:37.728');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zuqr000or3nzd80lcfm7', 'social.instagram', '"https://www.instagram.com/sriyaanmetals"', 'social', '2026-09-05 08:16:37.731', '2026-09-05 08:16:37.731');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zuqv000pr3nzdgxp2mfw', 'social.facebook', '"https://www.facebook.com/sriyaanmetals"', 'social', '2026-09-05 08:16:37.735', '2026-09-05 08:16:37.735');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zur7000qr3nzpdnc3fyb', 'content.hero.headline', '"Industrial Metal Supplier\\nin Mumbai for Fasteners, Pipes & Fittings"', 'content', '2026-09-05 08:16:37.747', '2026-09-05 08:16:37.747');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zur9000rr3nz8uimxrd4', 'content.hero.subline', '"Engineered supply for industrial buyers — exact specification, dependable delivery, direct communication."', 'content', '2026-09-05 08:16:37.749', '2026-09-05 08:16:37.749');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zurc000sr3nzomctcdt6', 'content.cta.headline', '"Send us your specification"', 'content', '2026-09-05 08:16:37.752', '2026-09-05 08:16:37.752');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zurf000tr3nz61chdjrq', 'content.cta.subline', '"Tell us the grade, size, quantity and delivery — we respond with a considered quote."', 'content', '2026-09-05 08:16:37.755', '2026-09-05 08:16:37.755');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zurh000ur3nzmus4uldt', 'content.footer.description', '"SRIYAAN METALS — Mumbai-based metals trading, import and export. Industrial fasteners, pipes, fittings and flanges supplied to specification."', 'content', '2026-09-05 08:16:37.757', '2026-09-05 08:16:37.757');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zurr000vr3nzxo7fe2y7', 'seo.default.title', '"SRIYAAN METALS | Metal Supplier, Fasteners, Pipes & Fittings in Mumbai"', 'seo', '2026-09-05 08:16:37.767', '2026-09-05 08:16:37.767');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zurt000wr3nzfmbe8yw5', 'seo.default.description', '"SRIYAAN METALS is a Mumbai-based metal trading, import and export company supplying industrial fasteners, bolts, nuts, pipes, pipe fittings, flanges and foundation bolts across India and global markets."', 'seo', '2026-09-05 08:16:37.769', '2026-09-05 08:16:37.769');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zurv000xr3nzb4datc0s', 'seo.home.title', '"SRIYAAN METALS | Metal Supplier, Fasteners, Pipes & Fittings in Mumbai"', 'seo', '2026-09-05 08:16:37.771', '2026-09-05 08:16:37.771');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zurw000yr3nzyjehge20', 'seo.home.description', '"SRIYAAN METALS is a Mumbai-based metal trading, import and export company supplying industrial fasteners, bolts, nuts, pipes, pipe fittings, flanges and foundation bolts across India and global markets."', 'seo', '2026-09-05 08:16:37.772', '2026-09-05 08:16:37.772');
INSERT INTO `WebsiteSetting` (`id`, `key`, `value`, `group`, `createdAt`, `updatedAt`) VALUES ('cmto3zurz000zr3nzszhstu1c', 'seo.robots', '"index,follow"', 'seo', '2026-09-05 08:16:37.775', '2026-09-05 08:16:37.775');

-- Admin login — change this password after your first sign-in.
INSERT INTO `AdminUser` (`id`, `name`, `email`, `passwordHash`, `role`, `status`, `createdAt`, `updatedAt`)
VALUES ('adm_sriyaan_0001', 'Administrator', 'admin@sriyaanmetals.com', '$2b$12$51mGlfWAHrppcvgUITEE7.mK3OmmMvcUCVj0ZucQExGBOA9Z8Gpz6', 'SUPER_ADMIN', 'ACTIVE', '2026-09-05 08:32:41', '2026-09-05 08:32:41');

SET FOREIGN_KEY_CHECKS = 1;
