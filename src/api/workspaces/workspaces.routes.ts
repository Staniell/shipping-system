import express from 'express'
import {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from './workspaces.logic'
import { Workspace } from '../types'

const router = express.Router()
const dbString = '../database.txt'

/** Returns all workspaces in the database */
router.get('/', (req, res) => {
  const allWorkspaces = getWorkspaces(dbString)
  const workspaces = allWorkspaces.map((workspace: Workspace) => ({
    id: workspace.id,
    title: workspace.title,
    buildShipments: workspace.buildShipments,
  }))
  res.json({ workspaces })
})

/** Creates a new workspace in the database and returns it */
router.post('/', (req, res) => {
  res.json({ workspace: createWorkspace(dbString, req?.body?.title) })
})

/** Returns the workspace with the given ID */
router.get('/:workspaceId', (req, res) => {
  res.json({ workspace: getWorkspace(dbString, req.params.workspaceId) })
})

/** Updates the workspace with the given ID and returns the updated workspace */
router.post('/:workspaceId', (req, res) => {
  const workspace = req.body
  res.json({ workspace: updateWorkspace(dbString, workspace) })
})

/** Delete existing workspace  */
router.delete('/:workspaceId', (req, res) => {
  const { workspaceId } = req.params
  res.json({ success: deleteWorkspace(dbString, workspaceId) })
})

export default router
