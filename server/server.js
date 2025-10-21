import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import itemsRouter from './routes/customItemsRoutes.js'
import catalogRouter from './routes/catalogRoutes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', catalogRouter)
app.use('/api', itemsRouter)

const PORT = process.env.PORT || 5174
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`))
