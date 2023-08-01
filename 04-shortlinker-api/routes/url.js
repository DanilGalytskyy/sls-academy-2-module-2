import express from 'express';
import { urlShorter } from '../controllers/urlController.js';
import { urlFinder } from '../controllers/urlController.js';
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/short', urlShorter);
router.get('/:urlId', urlFinder);
export default router;