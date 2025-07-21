import { all, findOne, insert, update } from './db/db'
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
