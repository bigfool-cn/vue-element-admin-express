/*
 Navicat Premium Data Transfer

 Source Server         : docker
 Source Server Type    : MySQL
 Source Server Version : 80017
 Source Host           : 127.0.0.1:3306
 Source Schema         : vue-element-admin

 Target Server Type    : MySQL
 Target Server Version : 80017
 File Encoding         : 65001

 Date: 30/05/2020 18:14:46
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for menus
-- ----------------------------
DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus`  (
  `menu_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL COMMENT '上级ID',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `sort` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `type` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '类型',
  `icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '图标',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '路由名称',
  `component` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '路由组件',
  `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '路由地址',
  `redirect` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '跳转地址',
  `permission` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '权限标识',
  `hidden` tinyint(1) NULL DEFAULT NULL COMMENT '隐藏',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  PRIMARY KEY (`menu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of menus
-- ----------------------------
INSERT INTO `menus` VALUES (7, 0, '系统管理', 0, 'M', 'component', 'System', 'Layout', '/system', '/system/user', NULL, 0, NULL, '2020-05-24 18:51:21');
INSERT INTO `menus` VALUES (8, 7, '菜单管理', 0, 'C', 'list', 'Menu', '/system/menu', '/system/menu', '', 'system:menu', 0, NULL, '2020-05-24 18:52:26');
INSERT INTO `menus` VALUES (9, 7, '角色管理', 0, 'C', 'peoples', 'Role', '/system/role', '/system/role', '', 'system:role', 0, NULL, '2020-05-24 18:53:31');
INSERT INTO `menus` VALUES (10, 7, '用户管理', 1, 'C', 'user', 'User', '/system/user', '/system/user', '', 'system:user', 0, '2020-05-24 18:58:01', '2020-05-24 18:54:26');
INSERT INTO `menus` VALUES (11, 7, '登录日志', 0, 'C', 'log', 'Log', '/system/log', '/system/log', '', 'system:log', 0, NULL, '2020-05-24 18:55:20');
INSERT INTO `menus` VALUES (12, 0, 'Demo', 0, 'M', 'example', 'Demo', 'Layout', '/demo', '', NULL, 0, '2020-05-30 15:00:24', '2020-05-25 20:31:21');
INSERT INTO `menus` VALUES (13, 12, 'Demo-1', 0, 'M', 'example', 'Demo1', '/demo/demo-1', '/demo/demo-1', '', NULL, 0, '2020-05-30 15:00:55', '2020-05-25 20:32:13');
INSERT INTO `menus` VALUES (14, 12, 'Demo-2', 0, 'M', 'example', 'Demo2', '/demo/demo-2', '/demo/demo-2', '', NULL, 0, NULL, '2020-05-25 20:32:54');
INSERT INTO `menus` VALUES (15, 13, 'Demo-1-1', 0, 'C', 'example', 'Demo11', '/demo/demo-1/demo-1-1', '/demo/demo-1/demo-1-1', '', NULL, 0, '2020-05-25 20:33:47', '2020-05-25 20:33:29');
INSERT INTO `menus` VALUES (16, 14, 'Demo-2-1', 0, 'C', 'example', 'Demo21', '/demo/demo-2/demo-2-1', '/demo/demo-2/demo-2-1', '', NULL, 0, '2020-05-25 20:35:12', '2020-05-25 20:34:43');

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `role_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色名称',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '状态',
  `menu_ids` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '菜单ID',
  `buttons` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '权限标识',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  PRIMARY KEY (`role_id`, `role_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, '管理员', '拥有全部权限', 1, '[7,10,8,9,11,12,13,15,14,16]', '[{\"menu_id\":10,\"btns\":[\"system:user:query\",\"system:user:add\",\"system:user:edit\",\"system:user:del\"]},{\"menu_id\":8,\"btns\":[\"system:menu:del\",\"system:menu:edit\",\"system:menu:add\",\"system:menu:query\"]},{\"menu_id\":9,\"btns\":[\"system:role:query\",\"system:role:add\",\"system:role:del\",\"system:role:edit\"]},{\"menu_id\":11,\"btns\":[\"system:log:query\",\"system:log:del\"]}]', '2020-05-25 20:48:44', '2020-05-16 21:14:50');
INSERT INTO `roles` VALUES (3, '观察者', NULL, 1, '[7,10,8,9,11,12,13,15,14,16]', '[{\"menu_id\":10,\"btns\":[\"system:user:query\"]},{\"menu_id\":8,\"btns\":[\"system:menu:query\"]},{\"menu_id\":11,\"btns\":[\"system:log:query\"]},{\"menu_id\":9,\"btns\":[\"system:role:query\"]}]', '2020-05-25 20:49:08', '2020-05-22 18:50:23');

-- ----------------------------
-- Table structure for user_logs
-- ----------------------------
DROP TABLE IF EXISTS `user_logs`;
CREATE TABLE `user_logs`  (
  `user_log_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `ip` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '登录IP',
  `ua` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'ua标识',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '登录时间',
  PRIMARY KEY (`user_log_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '帐号',
  `password` char(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '状态',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'bigfool', 'efd2708635b70c935fb9015e5fb28fe5', 1, '2020-05-25 20:48:26', '2020-05-16 21:15:43');
INSERT INTO `users` VALUES (3, 'usenav', '492a4d82c53b26c6e87be11a6dae3e70', 1, '2020-05-25 20:55:04', '2020-05-23 19:43:54');

-- ----------------------------
-- Table structure for users_roles
-- ----------------------------
DROP TABLE IF EXISTS `users_roles`;
CREATE TABLE `users_roles`  (
  `user_role_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  PRIMARY KEY (`user_role_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users_roles
-- ----------------------------
INSERT INTO `users_roles` VALUES (1, 1, 1, '2020-05-16 21:15:03');
INSERT INTO `users_roles` VALUES (14, 3, 3, '2020-05-24 11:19:35');

SET FOREIGN_KEY_CHECKS = 1;
