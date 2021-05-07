"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Dummy = require('../models/Dummy');
const Superuser = require('../models/Superuser');
const auth = require('../middleware/auth');
// Fetches Dummy Products Of a Given Gategory (Unprotected Route)
router.get('/fetchAll/:cat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dummies = yield Dummy.find({ tags: { $all: [req.params.cat] } });
        res.status(200).json({ message: dummies });
    }
    catch (e) {
        res.status(404).json({ message: 'Unable to fetch products' });
    }
}));
// Fetches Dummy Products
router.get('/fetchDummies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dummies = yield Dummy.find();
        res.status(200).json({ message: dummies });
    }
    catch (e) {
        res.status(404).json({ message: 'Unable to fetch products' });
    }
}));
// add a Dummy Product to the DB
router.post('/submit', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Authenticating Superuser
    const superuserFound = yield Superuser.findById(req.body.user.id);
    if (!superuserFound)
        return res.status(404).json({ message: 'Token is not valid (sneak)' });
    // Creating new Dummy Product
    const { color, company, description, imgs, name, tags, unit_price, unit_weight } = req.body;
    const newDummy = new Dummy({ color, company, description, imgs, name, tags, unit_price, unit_weight });
    try {
        const savedDummy = yield newDummy.save();
        res.status(200).json({ ok: true, message: 'Dummy Product Added' });
    }
    catch (_a) {
        res.status(400).json({ ok: false, message: 'Unable to Create Product' });
    }
}));
// Deletes a dummy product
router.delete('/deleteDummy/:id', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Authenticating Superuser
    const superuserFound = yield Superuser.findById(req.body.user.id);
    if (!superuserFound)
        return res.status(404).json({ message: 'Token is not valid (sneak)' });
    // Deleting the Dummy Product
    const product = yield Dummy.findById(req.params.id);
    if (!product)
        res.status(404).json({ ok: false, message: 'Dummy Product does not exist' });
    else
        product.remove().then(() => res.status(200).json({ ok: true, message: 'Dummy Product Deleted' }));
}));
module.exports = router;
