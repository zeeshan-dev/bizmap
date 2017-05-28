ALTER TABLE `bizmap`.`business` 
ADD COLUMN `userId` INT(11) NULL DEFAULT NULL COMMENT '' AFTER `mobile2`;

ALTER TABLE `bizmap`.`business` 
ADD COLUMN `approved` BIT(1) NULL DEFAULT 1 COMMENT '' AFTER `userId`;

