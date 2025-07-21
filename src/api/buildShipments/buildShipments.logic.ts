import { findOne, update } from '../db/db'
import { Workspace } from '../types'

/** Updates a buildNumber in the database and returns the updated workspace */
export function updateBuildNumber(
  dbString: string,
  workspaceId: string,
  buildShipmentId: string,
  buildNumber: string
): Workspace {
  const workspace: Workspace = findOne(dbString, 'workspaces', workspaceId)
  const buildShipment = workspace.buildShipments.find((bs) => bs.id === buildShipmentId)

  if (buildShipment) {
    buildShipment.buildNumber = buildNumber
  }

  update(dbString, 'workspaces', workspace.id, workspace)
  return findOne(dbString, 'workspaces', workspace.id)
}

/** Deletes a build shipment in the given workspace */
export function deleteBuildShipment(
  dbString: string,
  workspaceId: string,
  buildShipmentId: string
): boolean {
  const workspace: Workspace = findOne(dbString, 'workspaces', workspaceId)
  workspace.buildShipments = workspace.buildShipments.filter(
    (bs) => bs.id !== buildShipmentId
  )

  update(dbString, 'workspaces', workspace.id, workspace)
  return true
}
