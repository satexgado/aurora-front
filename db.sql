-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           5.7.24 - MySQL Community Server (GPL)
-- SE du serveur:                Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Listage de la structure de la table express-courrier. cr_dossier
DROP TABLE IF EXISTS `cr_dossier`;
CREATE TABLE IF NOT EXISTS `cr_dossier` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle` varchar(191) NOT NULL,
  `objet` varchar(191) DEFAULT '#0866c6',
  `structure_id` bigint(20) unsigned DEFAULT NULL,
  `responsable_id` bigint(20) unsigned DEFAULT NULL,
  `inscription_id` bigint(20) unsigned DEFAULT NULL,
  `date_cloture` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cr_cr_dossier_inscription_id_foreign` (`inscription_id`),
  KEY `cr_cr_dossier_structure_id_foreign` (`structure_id`),
  KEY `cr_cr_dossier_responsable_id_foreign` (`responsable_id`),
  CONSTRAINT `cr_cr_dossier_inscription_id_foreign` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `cr_cr_dossier_responsable_id_foreign` FOREIGN KEY (`responsable_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `cr_cr_dossier_structure_id_foreign` FOREIGN KEY (`structure_id`) REFERENCES `structures` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Listage des données de la table express-courrier.cr_dossier : ~2 rows (environ)
DELETE FROM `cr_dossier`;
/*!40000 ALTER TABLE `cr_dossier` DISABLE KEYS */;
INSERT INTO `cr_dossier` (`id`, `libelle`, `objet`, `structure_id`, `responsable_id`, `inscription_id`, `date_cloture`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'new folder', 'test', NULL, NULL, 1, NULL, '2022-07-10 11:12:43', '2022-07-10 11:12:43', NULL),
	(2, 'Folder 2', 'details', NULL, NULL, 1, NULL, '2022-07-12 03:21:44', '2022-07-12 03:21:44', NULL);
/*!40000 ALTER TABLE `cr_dossier` ENABLE KEYS */;

-- Listage de la structure de la table express-courrier. mp_affectation_coordonnee_type_marche
DROP TABLE IF EXISTS `mp_affectation_coordonnee_type_marche`;
CREATE TABLE IF NOT EXISTS `mp_affectation_coordonnee_type_marche` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `type_marche_id` bigint(20) unsigned NOT NULL,
  `coordonnee_id` bigint(20) unsigned NOT NULL,
  `inscription_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mp_affectation_coordonnee_type_marche_coordonnee_foreign` (`coordonnee_id`),
  KEY `mp_affectation_coordonnee_type_marche_inscription_id_foreign` (`inscription_id`),
  KEY `mp_affectation_coordonnee_type_marche_type_marche_foreign` (`type_marche_id`),
  CONSTRAINT `mp_affectation_coordonnee_type_marche_coordonnee_foreign` FOREIGN KEY (`coordonnee_id`) REFERENCES `cr_coordonnee` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_affectation_coordonnee_type_marche_inscription_id_foreign` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_affectation_coordonnee_type_marche_type_marche_foreign` FOREIGN KEY (`type_marche_id`) REFERENCES `mp_marche_etape` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table express-courrier.mp_affectation_coordonnee_type_marche : ~0 rows (environ)
DELETE FROM `mp_affectation_coordonnee_type_marche`;
/*!40000 ALTER TABLE `mp_affectation_coordonnee_type_marche` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_affectation_coordonnee_type_marche` ENABLE KEYS */;

-- Listage de la structure de la table express-courrier. mp_affectation_etape_type_procedure
DROP TABLE IF EXISTS `mp_affectation_etape_type_procedure`;
CREATE TABLE IF NOT EXISTS `mp_affectation_etape_type_procedure` (
  `id_pivot` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `etape` bigint(20) unsigned NOT NULL,
  `type` bigint(20) unsigned NOT NULL,
  `inscription_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_pivot`),
  KEY `mp_affectation_etape_type_procedure_etape_foreign` (`etape`),
  KEY `mp_affectation_etape_type_procedure_inscription_id_foreign` (`inscription_id`),
  KEY `mp_affectation_etape_type_procedure_type_foreign` (`type`),
  CONSTRAINT `mp_affectation_etape_type_procedure_etape_foreign` FOREIGN KEY (`etape`) REFERENCES `mp_etape` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_affectation_etape_type_procedure_inscription_id_foreign` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_affectation_etape_type_procedure_type_foreign` FOREIGN KEY (`type`) REFERENCES `mp_type_procedure` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table express-courrier.mp_affectation_etape_type_procedure : ~0 rows (environ)
DELETE FROM `mp_affectation_etape_type_procedure`;
/*!40000 ALTER TABLE `mp_affectation_etape_type_procedure` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_affectation_etape_type_procedure` ENABLE KEYS */;

-- Listage de la structure de la table express-courrier. mp_affectation_marche_fichier
DROP TABLE IF EXISTS `mp_affectation_marche_fichier`;
CREATE TABLE IF NOT EXISTS `mp_affectation_marche_fichier` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `marche` bigint(20) unsigned NOT NULL,
  `fichier` bigint(20) unsigned NOT NULL,
  `inscription_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mp_affectation_marche_fichier_fichier_foreign` (`fichier`),
  KEY `mp_affectation_marche_fichier_inscription_id_foreign` (`inscription_id`),
  KEY `mp_affectation_marche_fichier_marche_foreign` (`marche`),
  CONSTRAINT `mp_affectation_marche_fichier_fichier_foreign` FOREIGN KEY (`fichier`) REFERENCES `fichier` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_affectation_marche_fichier_inscription_id_foreign` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_affectation_marche_fichier_marche_foreign` FOREIGN KEY (`marche`) REFERENCES `mp_marche_etape` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Listage des données de la table express-courrier.mp_affectation_marche_fichier : ~11 rows (environ)
DELETE FROM `mp_affectation_marche_fichier`;
/*!40000 ALTER TABLE `mp_affectation_marche_fichier` DISABLE KEYS */;
INSERT INTO `mp_affectation_marche_fichier` (`id`, `marche`, `fichier`, `inscription_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 1, 186, 1, NULL, NULL, NULL),
	(2, 2, 187, 1, NULL, NULL, NULL),
	(3, 2, 188, 1, NULL, NULL, NULL),
	(4, 2, 189, 1, NULL, NULL, NULL),
	(5, 2, 190, 1, NULL, NULL, NULL),
	(6, 3, 191, 1, NULL, NULL, NULL),
	(7, 13, 192, 1, NULL, NULL, NULL),
	(8, 13, 193, 1, NULL, NULL, NULL),
	(9, 13, 194, 1, NULL, NULL, NULL),
	(10, 13, 195, 1, NULL, NULL, NULL),
	(11, 13, 196, 1, NULL, NULL, NULL);
/*!40000 ALTER TABLE `mp_affectation_marche_fichier` ENABLE KEYS */;

-- Listage de la structure de la table express-courrier. mp_affectation_marche_fournisseur
DROP TABLE IF EXISTS `mp_affectation_marche_fournisseur`;
CREATE TABLE IF NOT EXISTS `mp_affectation_marche_fournisseur` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `marche` bigint(20) unsigned NOT NULL,
  `coordonnee` bigint(20) unsigned NOT NULL,
  `inscription_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mp_affectation_marche_fournisseur_coordonnee_foreign` (`coordonnee`),
  KEY `mp_affectation_marche_fournisseur_inscription_id_foreign` (`inscription_id`),
  KEY `mp_affectation_marche_fournisseur_marche_foreign` (`marche`),
  CONSTRAINT `mp_affectation_marche_fournisseur_coordonnee_foreign` FOREIGN KEY (`coordonnee`) REFERENCES `cr_coordonnee` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_affectation_marche_fournisseur_inscription_id_foreign` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_affectation_marche_fournisseur_marche_foreign` FOREIGN KEY (`marche`) REFERENCES `mp_marche` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table express-courrier.mp_affectation_marche_fournisseur : ~0 rows (environ)
DELETE FROM `mp_affectation_marche_fournisseur`;
/*!40000 ALTER TABLE `mp_affectation_marche_fournisseur` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_affectation_marche_fournisseur` ENABLE KEYS */;

-- Listage de la structure de la table express-courrier. mp_affectation_marche_partenaire
DROP TABLE IF EXISTS `mp_affectation_marche_partenaire`;
CREATE TABLE IF NOT EXISTS `mp_affectation_marche_partenaire` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `marche` bigint(20) unsigned NOT NULL,
  `coordonnee` bigint(20) unsigned NOT NULL,
  `inscription_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mp_affectation_marche_partenaire_coordonnee_foreign` (`coordonnee`),
  KEY `mp_affectation_marche_partenaire_inscription_id_foreign` (`inscription_id`),
  KEY `mp_affectation_marche_partenaire_marche_foreign` (`marche`),
  CONSTRAINT `mp_affectation_marche_partenaire_coordonnee_foreign` FOREIGN KEY (`coordonnee`) REFERENCES `cr_coordonnee` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_affectation_marche_partenaire_inscription_id_foreign` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_affectation_marche_partenaire_marche_foreign` FOREIGN KEY (`marche`) REFERENCES `mp_marche` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table express-courrier.mp_affectation_marche_partenaire : ~0 rows (environ)
DELETE FROM `mp_affectation_marche_partenaire`;
/*!40000 ALTER TABLE `mp_affectation_marche_partenaire` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_affectation_marche_partenaire` ENABLE KEYS */;

-- Listage de la structure de la table express-courrier. mp_etape
DROP TABLE IF EXISTS `mp_etape`;
CREATE TABLE IF NOT EXISTS `mp_etape` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle` varchar(191) NOT NULL,
  `description` text,
  `inscription_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mp_etape_inscription_id_foreign` (`inscription_id`),
  CONSTRAINT `mp_etape_inscription_id_foreign` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table express-courrier.mp_etape : ~0 rows (environ)
DELETE FROM `mp_etape`;
/*!40000 ALTER TABLE `mp_etape` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_etape` ENABLE KEYS */;

-- Listage de la structure de la table express-courrier. mp_marche
DROP TABLE IF EXISTS `mp_marche`;
CREATE TABLE IF NOT EXISTS `mp_marche` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle` varchar(191) NOT NULL,
  `service_contractant_id` bigint(20) unsigned DEFAULT NULL,
  `type_procedure_id` bigint(20) unsigned DEFAULT NULL,
  `type_marche_id` bigint(20) unsigned DEFAULT NULL,
  `inscription_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `date_execution` date DEFAULT NULL,
  `date_fermeture` date DEFAULT NULL,
  `source_financement` varchar(191) DEFAULT NULL,
  `cout` bigint(20) unsigned DEFAULT NULL,
  `fournisseur_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mp_marche_inscription_id_foreign` (`inscription_id`),
  KEY `mp_marche_service_contractant_id_foreign` (`service_contractant_id`),
  KEY `mp_marche_type_marche_id_foreign` (`type_marche_id`),
  KEY `mp_marche_type_procedure_id_foreign` (`type_procedure_id`),
  KEY `mp_marche_fournisseur_id_foreign` (`fournisseur_id`),
  CONSTRAINT `mp_marche_fournisseur_id_foreign` FOREIGN KEY (`fournisseur_id`) REFERENCES `cr_coordonnee` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_marche_inscription_id_foreign` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_marche_service_contractant_id_foreign` FOREIGN KEY (`service_contractant_id`) REFERENCES `structures` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_marche_type_marche_id_foreign` FOREIGN KEY (`type_marche_id`) REFERENCES `mp_type_marche` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_marche_type_procedure_id_foreign` FOREIGN KEY (`type_procedure_id`) REFERENCES `mp_type_procedure` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- Listage des données de la table express-courrier.mp_marche : ~8 rows (environ)
DELETE FROM `mp_marche`;
/*!40000 ALTER TABLE `mp_marche` DISABLE KEYS */;
INSERT INTO `mp_marche` (`id`, `libelle`, `service_contractant_id`, `type_procedure_id`, `type_marche_id`, `inscription_id`, `created_at`, `updated_at`, `deleted_at`, `date_execution`, `date_fermeture`, `source_financement`, `cout`, `fournisseur_id`) VALUES
	(1, 'Quisquam optio saepe ipsam ullam. Eaque dignissimos sit sint perferendis. Dolorem praesentium molestiae dolor provident fugiat velit et. Porro sunt ullam facere laborum ipsum aut quisquam.', 1, 6, 2, 1, '2022-06-27 12:17:31', '2022-06-27 12:17:31', NULL, NULL, NULL, NULL, NULL, NULL),
	(2, 'marché 2', 20, 1, 1, 1, '2022-06-30 13:09:15', '2022-07-14 16:34:14', NULL, NULL, NULL, NULL, NULL, 154),
	(3, 'M', 8, 1, 3, 1, '2022-07-04 13:43:44', '2022-07-05 16:36:52', '2022-07-05 16:36:52', NULL, NULL, NULL, NULL, NULL),
	(4, 'Marche 3', 2, 1, 4, 1, '2022-07-05 13:06:18', '2022-07-05 13:06:18', NULL, NULL, NULL, NULL, NULL, NULL),
	(5, 'M4', 1, 1, 1, 1, '2022-07-05 13:33:58', '2022-07-05 16:37:13', '2022-07-05 16:37:13', NULL, NULL, NULL, NULL, NULL),
	(16, 'M13', 6, 1, 2, 1, '2022-07-05 13:46:46', '2022-07-05 16:36:59', '2022-07-05 16:36:59', NULL, NULL, NULL, NULL, NULL),
	(17, 'M14', 17, 6, 4, 1, '2022-07-05 14:42:35', '2022-07-05 16:37:02', '2022-07-05 16:37:02', NULL, NULL, NULL, NULL, NULL),
	(18, 'M15', 1, 6, 1, 1, '2022-07-05 15:40:20', '2022-07-05 16:37:06', '2022-07-05 16:37:06', NULL, NULL, NULL, NULL, NULL);
/*!40000 ALTER TABLE `mp_marche` ENABLE KEYS */;

-- Listage de la structure de la table express-courrier. mp_marche_etape
DROP TABLE IF EXISTS `mp_marche_etape`;
CREATE TABLE IF NOT EXISTS `mp_marche_etape` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle` varchar(191) NOT NULL,
  `description` text,
  `position` bigint(20) unsigned DEFAULT '0',
  `marche_id` bigint(20) unsigned NOT NULL,
  `inscription_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mp_marche_etape_inscription_id_foreign` (`inscription_id`),
  KEY `mp_marche_etape_marche_id_foreign` (`marche_id`),
  CONSTRAINT `mp_marche_etape_inscription_id_foreign` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_marche_etape_marche_id_foreign` FOREIGN KEY (`marche_id`) REFERENCES `mp_marche` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8;

-- Listage des données de la table express-courrier.mp_marche_etape : ~121 rows (environ)
DELETE FROM `mp_marche_etape`;
/*!40000 ALTER TABLE `mp_marche_etape` DISABLE KEYS */;
INSERT INTO `mp_marche_etape` (`id`, `libelle`, `description`, `position`, `marche_id`, `inscription_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'LETTRE D\'INVITATION', NULL, 0, 1, 1, '2022-06-27 12:17:31', '2022-07-14 10:14:12', NULL),
	(2, 'PROPOSITION DE PRIX SUR FACTURE PROFORMA', NULL, 1, 1, 1, '2022-06-27 12:17:31', '2022-07-14 10:14:13', NULL),
	(3, 'PV D\'OUVERTURE DES OFFRES', NULL, 2, 1, 1, '2022-06-27 12:17:31', '2022-07-14 10:14:13', NULL),
	(4, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 3, 1, 1, '2022-06-27 12:17:31', '2022-07-14 10:14:13', NULL),
	(5, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 4, 1, 1, '2022-06-27 12:17:31', '2022-07-14 10:14:13', NULL),
	(6, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 5, 1, 1, '2022-06-27 12:17:31', '2022-07-14 10:14:13', NULL),
	(7, 'CONTRATS', NULL, 6, 1, 1, '2022-06-27 12:17:31', '2022-07-14 10:14:13', NULL),
	(8, 'BORDEREAU DE LIVRAISON', NULL, 7, 1, 1, '2022-06-27 12:17:31', '2022-07-14 10:14:13', NULL),
	(9, 'PV DE RECEPTIONS', NULL, 8, 1, 1, '2022-06-27 12:17:31', '2022-07-14 10:14:13', NULL),
	(10, 'FACTURE DEFINITIVE', NULL, 9, 1, 1, '2022-06-27 12:17:31', '2022-07-14 10:14:13', NULL),
	(11, 'PAIEMENT', NULL, 10, 1, 1, '2022-06-27 12:17:31', '2022-07-14 10:14:13', NULL),
	(12, 'LETTRE D\'INVITATION', NULL, 0, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(13, 'PUBLICATION DE L\'APPEL D\'OFFRE', NULL, 1, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(14, 'PROPOSITION DE PRIX SUR FACTURE PROFORMA', NULL, 2, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(15, 'PV D\'OUVERTURE DES OFFRES', NULL, 3, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(16, 'PV D\'OUVERTURE DES OFFRES', NULL, 4, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(17, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 5, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(18, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 6, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(19, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 7, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(20, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 8, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(21, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 9, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(22, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 10, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(23, 'PUBLICATION DE L\'AVIS D\'ATTRIBUTION PROVISOIRE', NULL, 11, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(24, 'CONTRATS', NULL, 12, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(25, 'CONTRATS', NULL, 13, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(26, 'BORDEREAU DE LIVRAISON', NULL, 14, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(27, 'BORDEREAU DE LIVRAISON', NULL, 15, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(28, 'PV DE RECEPTIONS', NULL, 16, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(29, 'PV DE RECEPTIONS', NULL, 17, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(30, 'FACTURE DEFINITIVE', NULL, 18, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(31, 'FACTURE DEFINITIVE', NULL, 19, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(32, 'PAIEMENT', NULL, 20, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(33, 'PAIEMENT', NULL, 21, 2, 1, '2022-06-30 13:09:15', '2022-07-05 12:33:00', NULL),
	(34, 'LETTRE D\'INVITATION', NULL, 0, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(35, 'PUBLICATION DE L\'APPEL D\'OFFRE', NULL, 1, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(36, 'PROPOSITION DE PRIX SUR FACTURE PROFORMA', NULL, 2, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(37, 'PV D\'OUVERTURE DES OFFRES', NULL, 3, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(38, 'PV D\'OUVERTURE DES OFFRES', NULL, 4, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(39, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 5, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(40, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 6, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(41, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 7, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(42, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 8, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(43, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 9, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(44, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 10, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(45, 'PUBLICATION DE L\'AVIS D\'ATTRIBUTION PROVISOIRE', NULL, 11, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(46, 'CONTRATS', NULL, 12, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(47, 'CONTRATS', NULL, 13, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(48, 'BORDEREAU DE LIVRAISON', NULL, 14, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(49, 'BORDEREAU DE LIVRAISON', NULL, 15, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(50, 'PV DE RECEPTIONS', NULL, 16, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(51, 'PV DE RECEPTIONS', NULL, 17, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(52, 'FACTURE DEFINITIVE', NULL, 18, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(53, 'FACTURE DEFINITIVE', NULL, 19, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(54, 'PAIEMENT', NULL, 20, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(55, 'PAIEMENT', NULL, 21, 3, 1, '2022-07-04 13:43:44', '2022-07-05 11:56:27', NULL),
	(56, 'LETTRE D\'INVITATION', NULL, 0, 4, 1, '2022-07-05 13:06:18', '2022-07-05 13:06:18', NULL),
	(57, 'PUBLICATION DE L\'APPEL D\'OFFRE', NULL, 0, 4, 1, '2022-07-05 13:06:18', '2022-07-05 13:06:18', NULL),
	(58, 'PROPOSITION DE PRIX SUR FACTURE PROFORMA', NULL, 1, 4, 1, '2022-07-05 13:06:18', '2022-07-05 13:06:18', NULL),
	(59, 'PV D\'OUVERTURE DES OFFRES', NULL, 1, 4, 1, '2022-07-05 13:06:18', '2022-07-05 13:06:18', NULL),
	(60, 'PV D\'OUVERTURE DES OFFRES', NULL, 2, 4, 1, '2022-07-05 13:06:18', '2022-07-05 13:06:18', NULL),
	(61, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 2, 4, 1, '2022-07-05 13:06:18', '2022-07-05 13:06:18', NULL),
	(62, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 3, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(63, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 3, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(64, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 4, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(65, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 4, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(66, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 5, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(67, 'PUBLICATION DE L\'AVIS D\'ATTRIBUTION PROVISOIRE', NULL, 5, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(68, 'CONTRATS', NULL, 6, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(69, 'CONTRATS', NULL, 6, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(70, 'BORDEREAU DE LIVRAISON', NULL, 7, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(71, 'BORDEREAU DE LIVRAISON', NULL, 7, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(72, 'PV DE RECEPTIONS', NULL, 8, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(73, 'PV DE RECEPTIONS', NULL, 8, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(74, 'FACTURE DEFINITIVE', NULL, 9, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(75, 'FACTURE DEFINITIVE', NULL, 9, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(76, 'PAIEMENT', NULL, 10, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(77, 'PAIEMENT', NULL, 10, 4, 1, '2022-07-05 13:06:19', '2022-07-05 13:06:19', NULL),
	(78, 'LETTRE D\'INVITATION', NULL, 0, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(79, 'PUBLICATION DE L\'APPEL D\'OFFRE', NULL, 0, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(80, 'PROPOSITION DE PRIX SUR FACTURE PROFORMA', NULL, 1, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(81, 'PV D\'OUVERTURE DES OFFRES', NULL, 1, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(82, 'PV D\'OUVERTURE DES OFFRES', NULL, 2, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(83, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 2, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(84, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 3, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(85, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 3, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(86, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 4, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(87, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 4, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(88, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 5, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(89, 'PUBLICATION DE L\'AVIS D\'ATTRIBUTION PROVISOIRE', NULL, 5, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(90, 'CONTRATS', NULL, 6, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(91, 'CONTRATS', NULL, 6, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(92, 'BORDEREAU DE LIVRAISON', NULL, 7, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(93, 'BORDEREAU DE LIVRAISON', NULL, 7, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(94, 'PV DE RECEPTIONS', NULL, 8, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(95, 'PV DE RECEPTIONS', NULL, 8, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(96, 'FACTURE DEFINITIVE', NULL, 9, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(97, 'FACTURE DEFINITIVE', NULL, 9, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(98, 'PAIEMENT', NULL, 10, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(99, 'PAIEMENT', NULL, 10, 5, 1, '2022-07-05 13:33:58', '2022-07-05 13:33:58', NULL),
	(100, 'PUBLICATION DE L\'APPEL D\'OFFRE', NULL, 0, 16, 1, '2022-07-05 13:46:46', '2022-07-05 13:46:46', NULL),
	(101, 'PV D\'OUVERTURE DES OFFRES', NULL, 1, 16, 1, '2022-07-05 13:46:46', '2022-07-05 13:46:46', NULL),
	(102, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 2, 16, 1, '2022-07-05 13:46:46', '2022-07-05 13:46:46', NULL),
	(103, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 3, 16, 1, '2022-07-05 13:46:46', '2022-07-05 13:46:46', NULL),
	(104, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 4, 16, 1, '2022-07-05 13:46:46', '2022-07-05 13:46:46', NULL),
	(105, 'PUBLICATION DE L\'AVIS D\'ATTRIBUTION PROVISOIRE', NULL, 5, 16, 1, '2022-07-05 13:46:46', '2022-07-05 13:46:46', NULL),
	(106, 'CONTRATS', NULL, 6, 16, 1, '2022-07-05 13:46:46', '2022-07-05 13:46:46', NULL),
	(107, 'BORDEREAU DE LIVRAISON', NULL, 7, 16, 1, '2022-07-05 13:46:46', '2022-07-05 13:46:46', NULL),
	(108, 'PV DE RECEPTIONS', NULL, 8, 16, 1, '2022-07-05 13:46:46', '2022-07-05 13:46:46', NULL),
	(109, 'FACTURE DEFINITIVE', NULL, 9, 16, 1, '2022-07-05 13:46:46', '2022-07-05 13:46:46', NULL),
	(110, 'PAIEMENT', NULL, 10, 16, 1, '2022-07-05 13:46:46', '2022-07-05 13:46:46', NULL),
	(111, 'LETTRE D\'INVITATION', NULL, 0, 17, 1, '2022-07-05 14:42:35', '2022-07-05 14:42:35', NULL),
	(112, 'PROPOSITION DE PRIX SUR FACTURE PROFORMA', NULL, 1, 17, 1, '2022-07-05 14:42:35', '2022-07-05 14:42:35', NULL),
	(113, 'PV D\'OUVERTURE DES OFFRES', NULL, 2, 17, 1, '2022-07-05 14:42:35', '2022-07-05 14:42:35', NULL),
	(114, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 3, 17, 1, '2022-07-05 14:42:35', '2022-07-05 14:42:35', NULL),
	(115, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 4, 17, 1, '2022-07-05 14:42:35', '2022-07-05 14:42:35', NULL),
	(116, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 5, 17, 1, '2022-07-05 14:42:35', '2022-07-05 14:42:35', NULL),
	(117, 'CONTRATS', NULL, 6, 17, 1, '2022-07-05 14:42:35', '2022-07-05 14:42:35', NULL),
	(118, 'BORDEREAU DE LIVRAISON', NULL, 7, 17, 1, '2022-07-05 14:42:35', '2022-07-05 14:42:35', NULL),
	(119, 'PV DE RECEPTIONS', NULL, 8, 17, 1, '2022-07-05 14:42:35', '2022-07-05 14:42:35', NULL),
	(120, 'FACTURE DEFINITIVE', NULL, 9, 17, 1, '2022-07-05 14:42:35', '2022-07-05 14:42:35', NULL),
	(121, 'PAIEMENT', NULL, 10, 17, 1, '2022-07-05 14:42:35', '2022-07-05 14:42:35', NULL),
	(122, 'LETTRE D\'INVITATION', NULL, 0, 18, 1, '2022-07-05 15:40:21', '2022-07-05 15:40:21', NULL),
	(123, 'PROPOSITION DE PRIX SUR FACTURE PROFORMA', NULL, 1, 18, 1, '2022-07-05 15:40:21', '2022-07-05 15:40:21', NULL),
	(124, 'PV D\'OUVERTURE DES OFFRES', NULL, 2, 18, 1, '2022-07-05 15:40:21', '2022-07-05 15:40:21', NULL),
	(125, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 3, 18, 1, '2022-07-05 15:40:21', '2022-07-05 15:40:21', NULL),
	(126, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 4, 18, 1, '2022-07-05 15:40:21', '2022-07-05 15:40:21', NULL),
	(127, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 5, 18, 1, '2022-07-05 15:40:21', '2022-07-05 15:40:21', NULL),
	(128, 'CONTRATS', NULL, 6, 18, 1, '2022-07-05 15:40:21', '2022-07-05 15:40:21', NULL),
	(129, 'BORDEREAU DE LIVRAISON', NULL, 7, 18, 1, '2022-07-05 15:40:21', '2022-07-05 15:40:21', NULL),
	(130, 'PV DE RECEPTIONS', NULL, 8, 18, 1, '2022-07-05 15:40:21', '2022-07-05 15:40:21', NULL),
	(131, 'FACTURE DEFINITIVE', NULL, 9, 18, 1, '2022-07-05 15:40:21', '2022-07-05 15:40:21', NULL),
	(132, 'PAIEMENT', NULL, 10, 18, 1, '2022-07-05 15:40:21', '2022-07-05 15:40:21', NULL),
	(133, 'UN NOUVEAU ELEMENT', NULL, 0, 18, 1, '2022-07-05 15:40:21', '2022-07-05 15:40:21', NULL),
	(134, 'TEST', NULL, 22, 2, 1, '2022-07-05 16:40:10', '2022-07-05 16:44:29', '2022-07-05 16:44:29');
/*!40000 ALTER TABLE `mp_marche_etape` ENABLE KEYS */;

-- Listage de la structure de la table express-courrier. mp_marche_financement
DROP TABLE IF EXISTS `mp_marche_financement`;
CREATE TABLE IF NOT EXISTS `mp_marche_financement` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `cout` bigint(20) unsigned NOT NULL,
  `coordonnee_id` bigint(20) unsigned NOT NULL,
  `inscription_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mp_marche_financement_inscription_id_foreign` (`inscription_id`),
  KEY `mp_marche_financement_coordonnee_id_foreign` (`coordonnee_id`),
  CONSTRAINT `mp_marche_financement_coordonnee_id_foreign` FOREIGN KEY (`coordonnee_id`) REFERENCES `cr_coordonnee` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_marche_financement_inscription_id_foreign` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Listage des données de la table express-courrier.mp_marche_financement : ~0 rows (environ)
DELETE FROM `mp_marche_financement`;
/*!40000 ALTER TABLE `mp_marche_financement` DISABLE KEYS */;
/*!40000 ALTER TABLE `mp_marche_financement` ENABLE KEYS */;

-- Listage de la structure de la table express-courrier. mp_type_marche
DROP TABLE IF EXISTS `mp_type_marche`;
CREATE TABLE IF NOT EXISTS `mp_type_marche` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle` varchar(191) NOT NULL,
  `inscription_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mp_type_marche_inscription_id_foreign` (`inscription_id`),
  CONSTRAINT `mp_type_marche_inscription_id_foreign` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Listage des données de la table express-courrier.mp_type_marche : ~2 rows (environ)
DELETE FROM `mp_type_marche`;
/*!40000 ALTER TABLE `mp_type_marche` DISABLE KEYS */;
INSERT INTO `mp_type_marche` (`id`, `libelle`, `inscription_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Services', 1, '2022-06-23 14:09:45', '2022-06-23 14:10:32', NULL),
	(2, 'Fournitures', 1, '2022-06-23 14:10:07', '2022-06-23 14:10:26', NULL),
	(3, 'Travaux', 1, '2022-06-23 14:10:21', '2022-06-23 14:10:21', NULL),
	(4, 'Prestation Intellectuelle', 1, '2022-07-05 11:12:15', '2022-07-05 11:12:15', NULL);
/*!40000 ALTER TABLE `mp_type_marche` ENABLE KEYS */;

-- Listage de la structure de la table express-courrier. mp_type_procedure
DROP TABLE IF EXISTS `mp_type_procedure`;
CREATE TABLE IF NOT EXISTS `mp_type_procedure` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle` varchar(191) NOT NULL,
  `inscription_id` bigint(20) unsigned NOT NULL,
  `type_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mp_type_procedure_inscription_id_foreign` (`inscription_id`),
  KEY `mp_type_procedure_type_id_foreign` (`type_id`),
  CONSTRAINT `mp_type_procedure_inscription_id_foreign` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_type_procedure_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `mp_type_procedure` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- Listage des données de la table express-courrier.mp_type_procedure : ~8 rows (environ)
DELETE FROM `mp_type_procedure`;
/*!40000 ALTER TABLE `mp_type_procedure` DISABLE KEYS */;
INSERT INTO `mp_type_procedure` (`id`, `libelle`, `inscription_id`, `type_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Appel d\'offre', 1, NULL, '2022-06-23 15:34:31', '2022-06-23 15:34:31', NULL),
	(2, 'DRP', 1, NULL, '2022-06-23 15:34:33', '2022-06-23 15:34:33', NULL),
	(3, 'Prestation Intellectuelle', 1, NULL, '2022-06-23 15:34:52', '2022-07-05 11:13:03', '2022-07-05 11:13:03'),
	(4, 'Entente directe', 1, NULL, '2022-06-23 15:35:09', '2022-06-28 13:45:02', NULL),
	(5, 'Appel d\'offre intellectuel', 1, NULL, '2022-06-23 15:35:19', '2022-07-04 13:41:44', '2022-07-04 13:41:44'),
	(6, 'Competition Simple', 1, 2, '2022-06-23 15:35:43', '2022-06-23 15:35:43', NULL),
	(7, 'Competition Restrainte', 1, 2, '2022-06-23 15:35:51', '2022-06-23 15:35:51', NULL),
	(8, 'Competition Ouverte', 1, 2, '2022-06-23 15:36:17', '2022-06-23 15:36:17', NULL),
	(9, 'MOI', 1, 2, '2022-07-04 13:47:18', '2022-07-04 13:48:56', '2022-07-04 13:48:56');
/*!40000 ALTER TABLE `mp_type_procedure` ENABLE KEYS */;

-- Listage de la structure de la table express-courrier. mp_type_procedure_etape
DROP TABLE IF EXISTS `mp_type_procedure_etape`;
CREATE TABLE IF NOT EXISTS `mp_type_procedure_etape` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `libelle` varchar(191) NOT NULL,
  `description` text,
  `position` bigint(20) unsigned DEFAULT '0',
  `type_procedure_id` bigint(20) unsigned NOT NULL,
  `inscription_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `mp_type_procedure_etape_inscription_id_foreign` (`inscription_id`),
  KEY `mp_type_procedure_etape_type_procedure_id_foreign` (`type_procedure_id`),
  CONSTRAINT `mp_type_procedure_etape_inscription_id_foreign` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `mp_type_procedure_etape_type_procedure_id_foreign` FOREIGN KEY (`type_procedure_id`) REFERENCES `mp_type_procedure` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

-- Listage des données de la table express-courrier.mp_type_procedure_etape : ~25 rows (environ)
DELETE FROM `mp_type_procedure_etape`;
/*!40000 ALTER TABLE `mp_type_procedure_etape` DISABLE KEYS */;
INSERT INTO `mp_type_procedure_etape` (`id`, `libelle`, `description`, `position`, `type_procedure_id`, `inscription_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'LETTRE D\'INVITATION', NULL, 0, 2, 1, '2022-06-24 11:18:37', '2022-07-04 13:38:28', NULL),
	(2, 'PROPOSITION DE PRIX SUR FACTURE PROFORMA', NULL, 1, 2, 1, '2022-06-24 11:22:08', '2022-07-04 13:38:28', NULL),
	(3, 'PV D\'OUVERTURE DES OFFRES', NULL, 2, 2, 1, '2022-06-24 11:22:19', '2022-07-04 13:38:28', NULL),
	(4, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 3, 2, 1, '2022-06-24 11:22:30', '2022-07-04 13:38:28', NULL),
	(5, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 4, 2, 1, '2022-06-24 11:22:40', '2022-07-04 13:38:28', NULL),
	(6, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 5, 2, 1, '2022-06-24 11:22:52', '2022-07-04 13:38:28', NULL),
	(7, 'CONTRATS', NULL, 6, 2, 1, '2022-06-24 11:23:02', '2022-07-04 13:38:28', NULL),
	(8, 'BORDEREAU DE LIVRAISON', NULL, 7, 2, 1, '2022-06-24 11:23:12', '2022-07-04 13:38:28', NULL),
	(9, 'PV DE RECEPTIONS', NULL, 8, 2, 1, '2022-06-24 11:23:22', '2022-07-04 13:38:28', NULL),
	(10, 'FACTURE DEFINITIVE', NULL, 9, 2, 1, '2022-06-24 11:23:34', '2022-07-04 13:38:28', NULL),
	(11, 'PAIEMENT', NULL, 10, 2, 1, '2022-06-24 11:23:52', '2022-07-04 13:38:02', '2022-07-04 13:38:02'),
	(12, 'PUBLICATION DE L\'APPEL D\'OFFRE', NULL, 0, 1, 1, '2022-06-24 11:24:13', '2022-07-04 13:51:26', NULL),
	(13, 'PV D\'OUVERTURE DES OFFRES', NULL, 1, 1, 1, '2022-06-24 11:24:24', '2022-07-04 13:51:26', NULL),
	(14, 'RAPPORT D\'EVALUATION DES OFFRES', NULL, 2, 1, 1, '2022-06-24 11:24:34', '2022-07-04 13:51:26', NULL),
	(15, 'PV D\'ATTRIBUTION DES OFFRES', NULL, 3, 1, 1, '2022-06-24 11:24:47', '2022-07-04 13:51:26', NULL),
	(16, 'PV D\'ATTRIBUTION PROVISOIRES', NULL, 4, 1, 1, '2022-06-24 11:25:00', '2022-07-04 13:51:26', NULL),
	(17, 'PUBLICATION DE L\'AVIS D\'ATTRIBUTION PROVISOIRE', NULL, 5, 1, 1, '2022-06-24 11:25:10', '2022-07-04 13:51:26', NULL),
	(18, 'CONTRATS', NULL, 6, 1, 1, '2022-06-24 11:25:19', '2022-07-04 13:39:41', '2022-07-04 13:39:41'),
	(19, 'BORDEREAU DE LIVRAISON', NULL, 7, 1, 1, '2022-06-24 11:25:30', '2022-07-04 13:51:26', NULL),
	(20, 'PV DE RECEPTIONS', NULL, 8, 1, 1, '2022-06-24 11:25:38', '2022-07-04 13:51:26', NULL),
	(21, 'FACTURE DEFINITIVE', NULL, 9, 1, 1, '2022-06-24 11:25:49', '2022-07-04 13:51:26', NULL),
	(22, 'PAIEMENT', NULL, 10, 1, 1, '2022-06-24 11:26:02', '2022-07-04 13:51:26', NULL),
	(23, 'PAIEMENT', NULL, 10, 2, 1, '2022-07-04 13:38:08', '2022-07-04 13:38:28', NULL),
	(24, 'CONTRATS', NULL, 6, 1, 1, '2022-07-04 13:39:48', '2022-07-04 13:51:26', NULL),
	(25, 'UN NOUVEAU ELEMENT', NULL, 0, 6, 1, '2022-07-05 14:42:55', '2022-07-05 15:40:57', '2022-07-05 15:40:57'),
	(26, 'Etape', NULL, 0, 7, 1, '2022-07-05 15:16:01', '2022-07-05 15:41:03', '2022-07-05 15:41:03');
/*!40000 ALTER TABLE `mp_type_procedure_etape` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
