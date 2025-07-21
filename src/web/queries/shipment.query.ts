import axios from 'axios'
import { WorkSpaceType, NewShipment, Shipment } from '../types/workspace'
import { BASE_URL } from '../constant/link'

/** The API for the app, for querying, creating and updating workspaces */
class ShipmentQuery {
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
}

export default ShipmentQuery
