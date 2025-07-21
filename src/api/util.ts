import { all, deleteObj, findOne, insert, update } from './db/db'
import { NewShipment, Shipment, Workspace } from './types'
import { v4 as uuidv4 } from 'uuid'

/** Returns a list of all workspaces in the database */
export function getWorkspaces(dbString: string): Workspace[] {
  return all(dbString, 'workspaces')
}

/** Returns a single workspace from the database */
export function getWorkspace(dbString: string, id: string): Workspace {
  return findOne(dbString, 'workspaces', id)
}

/** Create a workspace in the database */
export function createWorkspace(dbString: string, title: string): Workspace {
  const workspace: Workspace = {
    id: uuidv4(),
    title: title,
    buildShipments: [
      {
        id: uuidv4(),
        buildNumber: '',
        // Initialize the workspace with a single empty build shipment
        shipments: [{ id: uuidv4(), description: '', orderNumber: '', cost: 0 }],
      },
    ],
  }
  insert(dbString, 'workspaces', workspace)
  return workspace
}

/** Update a workspace in the database */
export function updateWorkspace(dbString: string, workspace: Workspace): Workspace {
  update(dbString, 'workspaces', workspace.id, workspace)
  return findOne(dbString, 'workspaces', workspace.id)
}

/** Delete existing workspace  */
export function deleteWorkspace(dbString: string, id: string): boolean {
  deleteObj(dbString, 'workspaces', id)
  return true
}

/** Add a shipment to a workspace in the database */
export function addShipment(
  dbString: string,
  workspaceId: string,
  shipment: NewShipment
): Workspace {
  const workspace = findOne(dbString, 'workspaces', workspaceId)
  const buildShipment = workspace.buildShipments.find(
    (bs) => bs.buildNumber === shipment.buildNumber
  )

  const newShipment: Shipment = {
    id: uuidv4(),
    description: shipment.description,
    orderNumber: shipment.orderNumber,
    cost: Number(shipment.cost) || 0,
  }

  if (buildShipment) {
    buildShipment.shipments.push(newShipment)
  } else {
    workspace.buildShipments.push({
      id: uuidv4(),
      buildNumber: shipment.buildNumber,
      shipments: [newShipment],
    })
  }

  update(dbString, 'workspaces', workspace.id, workspace)
  return findOne(dbString, 'workspaces', workspace.id)
}

/** Update a shipment in the database */
export function updateShipment(
  dbString: string,
  workspaceId: string,
  shipment: Shipment
): Workspace {
  const workspace = findOne(dbString, 'workspaces', workspaceId)
  for (const buildShipment of workspace.buildShipments) {
    const shipmentIndex = buildShipment.shipments.findIndex((s) => s.id === shipment.id)

    if (shipmentIndex !== -1) {
      // Update the existing shipment
      const existingShipment = buildShipment.shipments[shipmentIndex]
      buildShipment.shipments[shipmentIndex] = {
        ...existingShipment,
        ...shipment,
        cost: Number(shipment.cost) || existingShipment.cost,
      }
      break
    }
  }

  update(dbString, 'workspaces', workspace.id, workspace)
  return findOne(dbString, 'workspaces', workspace.id)
}

/** Delete a shipment in the database */
export function deleteShipment(dbString: string, workspaceId: string, shipmentId: string): boolean {
  const workspace = findOne(dbString, 'workspaces', workspaceId)
  for (const buildShipment of workspace.buildShipments) {
    const shipmentIndex = buildShipment.shipments.findIndex((s) => s.id === shipmentId)

    if (shipmentIndex !== -1) {
      // Delete the existing shipment
      buildShipment.shipments.splice(shipmentIndex, 1)
      break
    }
  }

  update(dbString, 'workspaces', workspace.id, workspace)
  return true
}

/** Update a buildNumber in the database */
export function updateBuildNumber(
  dbString: string,
  workspaceId: string,
  buildShipmentId: string,
  buildNumber: string
): Workspace {
  const workspace = findOne(dbString, 'workspaces', workspaceId)
  const buildShipment = workspace.buildShipments.find((bs) => bs.id === buildShipmentId)

  if (buildShipment) {
    buildShipment.buildNumber = buildNumber
  } else {
    throw new Error(`Could not find buildShipment with id "${buildShipmentId}"`)
  }

  update(dbString, 'workspaces', workspace.id, workspace)
  return findOne(dbString, 'workspaces', workspace.id)
}

/** Delete a build shipment in the database */
export function deleteBuildShipment(
  dbString: string,
  workspaceId: string,
  buildShipmentId: string
): boolean {
  const workspace = findOne(dbString, 'workspaces', workspaceId)
  const buildShipmentIndex = workspace.buildShipments.findIndex((bs) => bs.id === buildShipmentId)

  if (buildShipmentIndex !== -1) {
    // Delete the existing build shipment
    workspace.buildShipments.splice(buildShipmentIndex, 1)
    update(dbString, 'workspaces', workspace.id, workspace)
    return true
  }

  return false
}
