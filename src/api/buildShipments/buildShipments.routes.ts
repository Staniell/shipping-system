import express from 'express'
import { updateBuildNumber, deleteBuildShipment } from './buildShipments.logic'

const router = express.Router({ mergeParams: true })
const dbString = '../database.txt'

/** Updates a buildNumber in the database and returns the updated workspace */
router.put('/:buildShipmentId', (req, res) => {
  const { workspaceId, buildShipmentId } = req.params as { workspaceId: string; buildShipmentId: string }
  const { buildNumber } = req.body
  res.json({
    workspace: updateBuildNumber(dbString, workspaceId, buildShipmentId, buildNumber),
  })
})

/** Deletes a build shipment in the given workspace */
router.delete('/:buildShipmentId', (req, res) => {
  const { workspaceId, buildShipmentId } = req.params as { workspaceId: string; buildShipmentId: string }
  res.json({ success: deleteBuildShipment(dbString, workspaceId, buildShipmentId) })
})

export default router
