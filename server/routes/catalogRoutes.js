import express from 'express'
import { getCatalog } from '../controllers/customItemsController.js'
const router = express.Router()
router.get('/catalog', getCatalog)
export default router
