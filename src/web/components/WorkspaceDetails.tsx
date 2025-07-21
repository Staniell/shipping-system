import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DosspaceApi from '../api'

interface Shipment {
  id: string
  description: string
  orderNumber: string
  cost: number
}

interface ShipmentTable {
  id: string
  buildNumber: string
  shipments: Shipment[]
}

export interface DetailWorkspace {
  id: string
  title: string
  buildShipments: ShipmentTable[]
}

type WorkspaceDetailsParams = {
  workspaceId: string
}

/** Detail view of individual workspace */
export default function WorkspaceDetails() {
  const { workspaceId } = useParams() as WorkspaceDetailsParams
  const [workspace, setWorkspace] = useState<DetailWorkspace | null>(null)
  const navigate = useNavigate()

  // Fetch all workspaces from the API
  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await DosspaceApi.getWorkspace(workspaceId)
      setWorkspace(workspace)
    }

    fetchWorkspace()
  }, [workspaceId])

  return (
    <div>
      <h1>{workspace?.title}</h1>
      <button onClick={() => navigate(`/${workspaceId}/tables`)}>View Tables</button>
      <div>
        <h2>Shipment Details</h2>
        {workspace?.buildShipments.map((table) => (
          <div key={table.id}>
            <h3>Build Number: {table.buildNumber}</h3>
            <ul>
              {table.shipments.map((shipment) => (
                <li key={shipment.id}>
                  <p>Description: {shipment.description}</p>
                  <p>Order Number: {shipment.orderNumber}</p>
                  <p>Cost: ${shipment.cost}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
