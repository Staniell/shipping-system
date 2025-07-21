import { v4 as uuidv4 } from 'uuid'
import { findOne, update } from '../db/db'
import { NewShipment, Shipment, Workspace } from '../types'

/** Adds a shipment to the workspace with the given ID and returns the updated workspace */
export function addShipment(
  dbString: string,
  workspaceId: string,
  shipment: NewShipment
): Workspace {
  const workspace: Workspace = findOne(dbString, 'workspaces', workspaceId)
  const buildShipment = workspace.buildShipments.find(
    (bs) => bs.buildNumber === shipment.buildNumber
  )

  const newShipment: Shipment = {
    id: uuidv4(),
    description: shipment.description,
    orderNumber: shipment.orderNumber,
    cost: parseInt(shipment.cost as any) || 0,
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

/** Updates a shipment in the database and returns the updated workspace */
export function updateShipment(
  dbString: string,
  workspaceId: string,
  shipment: Shipment
): Workspace {
  const workspace: Workspace = findOne(dbString, 'workspaces', workspaceId)
  const buildShipment = workspace.buildShipments.find((bs) =>
    bs.shipments.find((s) => s.id === shipment.id)
  )

  if (buildShipment) {
    const shipmentIndex = buildShipment.shipments.findIndex((s) => s.id === shipment.id)
    buildShipment.shipments[shipmentIndex] = shipment
  }

  update(dbString, 'workspaces', workspace.id, workspace)
  return findOne(dbString, 'workspaces', workspace.id)
}

/** Deletes a shipment in the given workspace */
export function deleteShipment(dbString: string, workspaceId: string, shipmentId: string): boolean {
  const workspace: Workspace = findOne(dbString, 'workspaces', workspaceId)
  const buildShipment = workspace.buildShipments.find((bs) =>
    bs.shipments.find((s) => s.id === shipmentId)
  )

  if (buildShipment) {
    buildShipment.shipments = buildShipment.shipments.filter((s) => s.id !== shipmentId)
  }

  update(dbString, 'workspaces', workspace.id, workspace)
  return true
}
