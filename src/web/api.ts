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
}

export default DosspaceApi
