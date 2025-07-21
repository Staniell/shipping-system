import express from 'express'
import { addShipment, deleteShipment, updateShipment } from './shipments.logic'

const router = express.Router({ mergeParams: true })
const dbString = '../database.txt'

/** Adds a shipment to the workspace with the given ID and returns the updated workspace */
router.post('/', (req, res) => {
  const { workspaceId } = req.params as { workspaceId: string }
  const shipment = req.body
  res.json({ workspace: addShipment(dbString, workspaceId, shipment) })
})

/** Deletes a shipment in the given workspace */
router.delete('/:shipmentId', (req, res) => {
  const { workspaceId, shipmentId } = req.params as { workspaceId: string; shipmentId: string }
  res.json({ success: deleteShipment(dbString, workspaceId, shipmentId) })
})

/** Updates a shipment in the database and returns the updated workspace */
router.put('/:shipmentId', (req, res) => {
  const { workspaceId, shipmentId } = req.params as { workspaceId: string; shipmentId: string }
  const shipment = req.body
  res.json({ workspace: updateShipment(dbString, workspaceId, shipment) })
})

export default router
