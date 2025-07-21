import express from 'express'
import cors from 'cors'
import {
  addShipment,
  createWorkspace,
  deleteShipment,
  deleteWorkspace,
  getWorkspace,
  getWorkspaces,
  updateShipment,
  updateWorkspace,
} from './util'
import { reset } from './db/db'
import { Workspace } from './types'

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

/** Returns the workspace with the given ID */
app.get('/:workspaceId', (req, res) => {
  res.json({ workspace: getWorkspace(dbString, req.params.workspaceId) })
})

/** Updates the workspace with the given ID and returns the updated workspace */
app.post('/:workspaceId', (req, res) => {
  const workspace = req.body
  res.json({ workspace: updateWorkspace(dbString, workspace) })
})

/** Delete existing workspace  */
app.delete('/:workspaceId', (req, res) => {
  const { workspaceId } = req.params
  res.json({ success: deleteWorkspace(dbString, workspaceId) })
})

/** Adds a shipment to the workspace with the given ID and returns the updated workspace */
app.post('/:workspaceId/shipments', (req, res) => {
  const { workspaceId } = req.params
  const shipment = req.body
  res.json({ workspace: addShipment(dbString, workspaceId, shipment) })
})

/** Deletes a shipment in the given workspace */
app.delete('/:workspaceId/shipments/:shipmentId', (req, res) => {
  const { workspaceId, shipmentId } = req.params
  res.json({ success: deleteShipment(dbString, workspaceId, shipmentId) })
})

/** Returns all workspaces in the database */
app.get('/', (req, res) => {
  const allWorkspaces = getWorkspaces(dbString)
  const workspaces = allWorkspaces.map((workspace: Workspace) => ({
    id: workspace.id,
    title: workspace.title,
    buildShipments: workspace.buildShipments,
  }))
  res.json({ workspaces })
})

/** Creates a new workspace in the database and returns it */
app.post('/', (req, res) => {
  res.json({ workspace: createWorkspace(dbString, req?.body?.title) })
})

/** Updates a shipment in the database and returns the updated workspace */
app.put('/:workspaceId/shipments/:shipmentId', (req, res) => {
  const { workspaceId, shipmentId } = req.params
  const shipment = req.body
  res.json({ workspace: updateShipment(dbString, workspaceId, shipment) })
})

module.exports = app

app.listen(port, () => {
  console.log(`Dosspace is running on port ${port}.`)
})
