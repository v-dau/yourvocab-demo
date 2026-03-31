import express from 'express';
import { getUserTags, updateTag, deleteTag } from '../controllers/tagController.js';

const router = express.Router();

// Get all tags for authenticated user
router.get('/', getUserTags);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;
