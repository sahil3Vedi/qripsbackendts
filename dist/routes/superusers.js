"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Superuser = require('../models/Superuser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
router.get('/', (req, res) => {
    res.status(200).json({ message: 'We are on superusers' });
});
module.exports = router;
