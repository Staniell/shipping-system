import axios from 'axios'
import { WorkSpaceType } from '../types/workspace'
import { BASE_URL } from '../constant/link'

/** The API for the app, for querying, creating and updating workspaces */
class WorkspaceQuery {
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
}

export default WorkspaceQuery
