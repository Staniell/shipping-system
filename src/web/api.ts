import axios from 'axios'
import { WorkSpaceType, NewShipment, Shipment } from './types/workspace'

const BASE_URL = 'http://localhost:8080'

/** The API for the app, for querying, creating and updating workspaces */
class DosspaceApi {
  /** Creates a new workspace */
  static async createWorkspace(title: string): Promise<WorkSpaceType | null> {
    try {
      const req = await axios.post(BASE_URL, { title })
      return req.data.workspace
    } catch (e) {
      console.error(e)
      return null
    }
  }

  /** Updates existing workspace  */
  static async updateWorkspace(id: string, data: WorkSpaceType): Promise<WorkSpaceType | null> {
    try {
      const req = await axios.post(`${BASE_URL}/${id}`, { ...data })
      return req.data.workspace
    } catch (e) {
      console.error(e)
      return null
    }
  }

  /** Delete existing workspace  */
  static async deleteWorkspace(id: string): Promise<boolean> {
    try {
      await axios.delete(`${BASE_URL}/${id}`)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /** Returns the ID and other info of every existing workspace */
  static async getWorkspaces(): Promise<WorkSpaceType[]> {
    try {
      const req = await axios.get(BASE_URL)
      const { workspaces } = req.data
      return workspaces
    } catch (err) {
      throw new Error('Unable to fetch workspaces')
    }
  }

  /** Returns the details about the given workspace ID */
  static async getWorkspace(workspaceId: string): Promise<WorkSpaceType> {
    try {
      const req = await axios.get(`${BASE_URL}/${workspaceId}`)
      const { workspace } = req.data
      return workspace
    } catch (err) {
      throw new Error('Unable to fetch workspace')
    }
  }

  /** Adds a new shipment to the given workspace */
  static async addShipment(
    workspaceId: string,
    shipment: NewShipment
  ): Promise<WorkSpaceType | null> {
    try {
      const req = await axios.post(`${BASE_URL}/${workspaceId}/shipments`, shipment)
      return req.data.workspace
    } catch (e) {
      console.error(e)
      return null
    }
  }

  /** Updates a shipment in the given workspace */
  static async updateShipment(
    workspaceId: string,
    shipmentId: string,
    shipment: Partial<Shipment>
  ): Promise<WorkSpaceType | null> {
    try {
      const req = await axios.put(`${BASE_URL}/${workspaceId}/shipments/${shipmentId}`, shipment)
      return req.data.workspace
    } catch (e) {
      console.error(e)
      return null
    }
  }

  /** Deletes a shipment in the given workspace */
  static async deleteShipment(workspaceId: string, shipmentId: string): Promise<boolean> {
    try {
      await axios.delete(`${BASE_URL}/${workspaceId}/shipments/${shipmentId}`)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /** Updates a buildNumber in the given workspace */
  static async updateBuildShipment(
    workspaceId: string,
    buildShipmentId: string,
    buildNumber: string
  ): Promise<WorkSpaceType | null> {
    try {
      const req = await axios.put(`${BASE_URL}/${workspaceId}/build-shipments/${buildShipmentId}`, {
        buildNumber,
      })
      return req.data.workspace
    } catch (e) {
      console.error(e)
      return null
    }
  }

  /** Deletes a build shipment in the given workspace */
  static async deleteBuildShipment(workspaceId: string, buildShipmentId: string): Promise<boolean> {
    try {
      await axios.delete(`${BASE_URL}/${workspaceId}/build-shipments/${buildShipmentId}`)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}

export default DosspaceApi
