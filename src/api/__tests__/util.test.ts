import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  getWorkspaces,
  updateWorkspace,
} from '../workspaces/workspaces.logic'
import {
  addShipment,
  deleteShipment,
  updateShipment,
} from '../shipments/shipments.logic'
import {
  deleteBuildShipment,
  updateBuildNumber,
} from '../buildShipments/buildShipments.logic'
import { reset } from '../db/db'
import mock from 'mock-fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const testDbString = '../database.test.txt'

describe('Util tests', () => {
  function createMockUuid() {
    // Creates random unique ID for a mock object
    return uuidv4()
  }

  const workspaceId = createMockUuid()

  beforeEach(() => {
    mock({ [path.resolve(__dirname, testDbString)]: '' })
    reset(testDbString, workspaceId)
  })

  afterEach(() => {
    mock.restore()
  })

  describe('getWorkspaces', () => {
    it('returns the workspaces from the db', () => {
      const workspaces = getWorkspaces(testDbString)
      expect(workspaces).toBeDefined()
      expect(workspaces).toHaveLength(1)
      expect(workspaces[0].id).toBe(workspaceId)
      expect(workspaces[0].title).toEqual("Wiley's Shipping")
      expect(workspaces[0].buildShipments).toHaveLength(1)
      expect(workspaces[0].buildShipments[0].buildNumber).toEqual('A82D2-108')
      expect(workspaces[0].buildShipments[0].shipments).toHaveLength(1)
      expect(workspaces[0].buildShipments[0].shipments[0].description).toEqual('64 units')
    })
  })

  describe('getWorkspace', () => {
    it('returns the queried workspace from the db', () => {
      const workspace = getWorkspace(testDbString, workspaceId)
      expect(workspace).toBeDefined()
      expect(workspace.title).toEqual("Wiley's Shipping")
      expect(workspace.buildShipments).toHaveLength(1)
    })
  })

  describe('createWorkspace', () => {
    it('creates a new workspace', () => {
      const workspace = createWorkspace(testDbString, 'testing')
      expect(workspace).toBeDefined()
      expect(workspace.title).toEqual('testing')
      expect(workspace.buildShipments).toHaveLength(0)
    })
  })

  describe('updateWorkspace', () => {
    it('updates a workspace', () => {
      const workspace = createWorkspace(testDbString, 'testing')
      workspace.title = "Arnav's Shipping"
      updateWorkspace(testDbString, workspace)
      const updatedWorkspace = getWorkspace(testDbString, workspace.id)
      expect(updatedWorkspace.title).toEqual("Arnav's Shipping")
    })
  })

  describe('deleteWorkspace', () => {
    it('deletes a workspace', () => {
      const workspace = createWorkspace(testDbString, 'to be deleted')
      const initialWorkspaces = getWorkspaces(testDbString)
      const success = deleteWorkspace(testDbString, workspace.id)
      expect(success).toBe(true)
      const finalWorkspaces = getWorkspaces(testDbString)
      expect(finalWorkspaces.length).toBe(initialWorkspaces.length - 1)
    })
  })

  describe('addShipment', () => {
    it('adds a new shipment to an existing build', () => {
      const newShipment = {
        buildNumber: 'A82D2-108',
        description: '128 units',
        orderNumber: '121-5821131-5985043',
        cost: 215286,
      }
      const updatedWorkspace = addShipment(testDbString, workspaceId, newShipment)
      expect(updatedWorkspace.buildShipments[0].shipments).toHaveLength(2)
      expect(updatedWorkspace.buildShipments[0].shipments[1].description).toEqual('128 units')
    })

    it('adds a new shipment to a new build', () => {
      const newShipment = {
        buildNumber: 'B82D2-109',
        description: '256 units',
        orderNumber: '121-5821131-5985044',
        cost: 430572,
      }
      const updatedWorkspace = addShipment(testDbString, workspaceId, newShipment)
      expect(updatedWorkspace.buildShipments).toHaveLength(2)
      expect(updatedWorkspace.buildShipments[1].buildNumber).toEqual('B82D2-109')
      expect(updatedWorkspace.buildShipments[1].shipments[0].description).toEqual('256 units')
    })
  })

  describe('updateShipment', () => {
    it('updates an existing shipment', () => {
      const workspace = getWorkspace(testDbString, workspaceId)
      const shipmentToUpdate = workspace.buildShipments[0].shipments[0]
      shipmentToUpdate.description = '32 units'
      const updatedWorkspace = updateShipment(testDbString, workspaceId, shipmentToUpdate)
      expect(updatedWorkspace.buildShipments[0].shipments[0].description).toEqual('32 units')
    })
  })

  describe('deleteShipment', () => {
    it('deletes an existing shipment', () => {
      const workspace = getWorkspace(testDbString, workspaceId)
      const shipmentIdToDelete = workspace.buildShipments[0].shipments[0].id
      const success = deleteShipment(testDbString, workspaceId, shipmentIdToDelete)
      expect(success).toBe(true)
      const updatedWorkspace = getWorkspace(testDbString, workspaceId)
      expect(updatedWorkspace.buildShipments[0].shipments).toHaveLength(0)
    })
  })

  describe('updateBuildNumber', () => {
    it('updates the build number of a build shipment', () => {
      const workspace = getWorkspace(testDbString, workspaceId)
      const buildShipmentId = workspace.buildShipments[0].id
      const newBuildNumber = 'C82D2-110'
      const updatedWorkspace = updateBuildNumber(
        testDbString,
        workspaceId,
        buildShipmentId,
        newBuildNumber
      )
      expect(updatedWorkspace.buildShipments[0].buildNumber).toEqual(newBuildNumber)
    })
  })

  describe('deleteBuildShipment', () => {
    it('deletes an existing build shipment', () => {
      const workspace = getWorkspace(testDbString, workspaceId)
      const buildShipmentIdToDelete = workspace.buildShipments[0].id
      const success = deleteBuildShipment(testDbString, workspaceId, buildShipmentIdToDelete)
      expect(success).toBe(true)
      const updatedWorkspace = getWorkspace(testDbString, workspaceId)
      expect(updatedWorkspace.buildShipments).toHaveLength(0)
    })
  })
})
