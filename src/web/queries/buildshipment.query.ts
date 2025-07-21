import axios from 'axios'
import { WorkSpaceType } from '../types/workspace'
import { BASE_URL } from '../constant/link'

/** The API for the app, for querying, creating and updating workspaces */
class BuildShipmentQuery {
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

export default BuildShipmentQuery
