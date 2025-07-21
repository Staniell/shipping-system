import express from 'express'
import cors from 'cors'
import { reset } from './db/db'
import workspaceRoutes from './workspaces/workspaces.routes'
import shipmentRoutes from './shipments/shipments.routes'
import buildShipmentRoutes from './buildShipments/buildShipments.routes'

const app = express()
app.use(cors())
app.use(express.json())

const port = 8080
const dbString = '../database.txt'

/** Admin endpoint for resetting the database */
app.get('/reset', (req, res) => {
  reset(dbString)
  res.send('Reset database')
})

app.use('/', workspaceRoutes)
app.use('/:workspaceId/shipments', shipmentRoutes)
app.use('/:workspaceId/build-shipments', buildShipmentRoutes)

module.exports = app

app.listen(port, () => {
  console.log(`Dosspace is running on port ${port}.`)
})
