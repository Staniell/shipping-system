import { v4 as uuidv4 } from 'uuid'
import { all, findOne, insert, update, deleteObj } from '../db/db'
import { NewShipment, Shipment, Workspace } from '../types'

/** Returns all workspaces in the database */
export function getWorkspaces(dbString: string): Workspace[] {
  return all(dbString, 'workspaces')
}

/** Returns the workspace with the given ID */
export function getWorkspace(dbString: string, id: string): Workspace {
  return findOne(dbString, 'workspaces', id)
}

/** Creates a new workspace in the database and returns it */
export function createWorkspace(dbString: string, title: string): Workspace {
  const workspace: Workspace = {
    id: uuidv4(),
    title,
    buildShipments: [],
  }
  insert(dbString, 'workspaces', workspace)
  return workspace
}

/** Updates the workspace with the given ID and returns the updated workspace */
export function updateWorkspace(dbString: string, workspace: Workspace): Workspace {
  update(dbString, 'workspaces', workspace.id, workspace)
  return findOne(dbString, 'workspaces', workspace.id)
}

/** Delete existing workspace  */
export function deleteWorkspace(dbString: string, id: string): boolean {
  deleteObj(dbString, 'workspaces', id)
  return true
}
