const router = require("express").Router()
const express = require("express")

router.use("/components", express.static(__dirname + "/components"));

router.use("/login", express.static(__dirname + "/login"))
router.use("/auth", express.static(__dirname + "/auth"))
router.use("/register", express.static(__dirname + "/register"))

router.use("/app", express.static(__dirname + "/app/root"))
router.use("/app/create", express.static(__dirname + "/app/create"))
router.use("/app/dashboard", express.static(__dirname + "/app/dashboard"))

router.use("/user", express.static(__dirname + "/user/root"))

router.use("/lib", express.static(__dirname + "/lib"))

module.exports = router