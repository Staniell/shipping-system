import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DosspaceApi from '../api'
import Table, { ColumnDef } from './common/Table'
import Box from './common/Box'
import { DeleteIcon, DollarSign, Edit, Eye, Package, Plus, Truck, Download } from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import Button from './common/Button'
import WorkspacePDF from './workspace/WorkspacePDF'
import ShipmentForm from './workspace/ShipmentForm'
import { componentModal } from '../helpers/modal'
import { BuildShipment, NewShipment, Shipment, WorkSpaceType } from '../types/workspace'
import { kFormatter } from '../helpers/number'
import PromptForm from './common/PromptForm'

const buildShipmentColumns: ColumnDef<BuildShipment>[] = [
  { title: 'Build Number', accessorKey: 'buildNumber' },
  {
    title: 'Number of Shipments',
    id: 'numberOfShipments',
    accessorKey: 'shipments',
    cell: ({ value }) => (value as Shipment[]).length,
  },
  {
    title: 'Total Cost',
    id: 'totalCost',
    accessorKey: 'shipments',
    cell: ({ value }) => {
      const totalCost = (value as Shipment[]).reduce(
        (total: number, shipment: Shipment) => total + shipment.cost,
        0
      )
      return `$${kFormatter(totalCost)}`
    },
  },
]

/** Detail view of individual workspace */
export default function WorkspaceDetails({ workspace }: { workspace?: WorkSpaceType }) {
  const { workspaceId } = useParams() as { workspaceId: string }
  const [activeWorkspaceTable, setActiveWorkspaceTable] = useState<WorkSpaceType | null>(null)
  const navigate = useNavigate()
  const tableOptions = ['Shipments', 'Build Shipments']
  const [activeTable, setActiveTable] = useState<string>(tableOptions[0])

  const shipments =
    activeWorkspaceTable?.buildShipments.flatMap((bs) =>
      bs.shipments.map((s) => ({ ...s, buildShipmentId: bs.id, buildNumber: bs.buildNumber }))
    ) ?? []

  const shipmentColumns: ColumnDef<Shipment & { buildShipmentId: string; buildNumber: string }>[] =
    [
      { title: 'Build Number', accessorKey: 'buildNumber' },
      { title: 'Description', accessorKey: 'description' },
      { title: 'Order Number', accessorKey: 'orderNumber' },
      {
        title: 'Cost',
        accessorKey: 'cost',
        cell: ({ value }) => `$${kFormatter(value as number)}`,
      },
      {
        title: '',
        id: 'edit',
        cell: ({ row }) => (
          <div className="flex items-center gap-x-3">
            <button
              onClick={() => {
                componentModal({
                  component: (
                    <PromptForm
                      label="Are you sure you want to delete this shipment?"
                      onNo={() => componentModal(null)}
                      onYes={async () => {
                        componentModal(null)
                        const success = await DosspaceApi.deleteShipment(
                          activeWorkspaceTable?.id!,
                          row.id
                        )

                        if (success) {
                          if (!activeWorkspaceTable) return

                          const updatedWorkspace = {
                            ...activeWorkspaceTable,
                            buildShipments: activeWorkspaceTable.buildShipments.map((bs) => {
                              if (bs.id === (row as any).buildShipmentId) {
                                return {
                                  ...bs,
                                  shipments: bs.shipments.filter((s) => s.id !== row.id),
                                }
                              }
                              return bs
                            }),
                          }
                          setActiveWorkspaceTable(updatedWorkspace)
                          // onShipmentDeleted(updatedWorkspace)
                        }
                      }}
                    />
                  ),
                })
              }}
              className="cursor-pointer text-red-500"
            >
              <DeleteIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                componentModal({
                  component: (
                    <ShipmentForm
                      shipment={row as Shipment & { buildNumber: string }}
                      onSubmit={async (val) => {
                        if (!activeWorkspaceTable?.id) return
                        const res = await DosspaceApi.updateShipment(
                          activeWorkspaceTable.id,
                          row.id,
                          {
                            id: row.id,
                            description: val.description,
                            orderNumber: val.orderNumber,
                            cost: val.cost,
                          }
                        )

                        if (res) {
                          setActiveWorkspaceTable(res)
                        }
                        componentModal(null)
                      }}
                    />
                  ),
                })
              }}
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
        ),
      },
    ]
  // Fetch all workspaces from the API
  useEffect(() => {
    if (!workspaceId) {
      return
    }
    async function fetchWorkspace() {
      const workspace = await DosspaceApi.getWorkspace(workspaceId)
      setActiveWorkspaceTable(workspace)
    }

    fetchWorkspace()
  }, [workspaceId])

  // Update active workspace table when workspace prop changes
  useEffect(() => {
    if (!workspace) {
      return
    }
    setActiveWorkspaceTable(workspace)
  }, [workspace])

  return (
    <div>
      <div className="h-fit rounded-md border-2 border-gray-200 p-4">
        {/* Header Info */}
        <div className="flex items-center justify-between gap-x-2">
          <div className="mb-6 flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
              <h2 className="text-lg font-bold 2xl:text-2xl">{activeWorkspaceTable?.title}</h2>
              <Eye
                className="h-4 w-4 cursor-pointer"
                onClick={() => {
                  navigate(`/${activeWorkspaceTable?.id}`)
                }}
              />
            </div>
            <p className=" text-gray-600">Workspace ID: {activeWorkspaceTable?.id}</p>
          </div>
          <div className="flex flex-col gap-y-2">
            <Button
              onClick={() => {
                componentModal({
                  component: (
                    <ShipmentForm
                      buildOptions={
                        activeWorkspaceTable?.buildShipments.map((buildShipment) => ({
                          id: buildShipment.buildNumber,
                          name: buildShipment.buildNumber,
                        })) ?? []
                      }
                      onSubmit={async (shipment: NewShipment) => {
                        if (!activeWorkspaceTable?.id) return

                        const updatedWorkspace = await DosspaceApi.addShipment(
                          activeWorkspaceTable.id,
                          {
                            buildNumber: shipment.buildNumber,
                            description: shipment.description,
                            orderNumber: shipment.orderNumber,
                            cost: parseInt(shipment.cost as any),
                          }
                        )

                        if (updatedWorkspace) {
                          setActiveWorkspaceTable(updatedWorkspace)
                          componentModal(null) // Close modal on success
                        }
                      }}
                    />
                  ),
                })
              }}
            >
              <Plus />
              <p> Add Shipment</p>
            </Button>
            {activeWorkspaceTable && (
              <PDFDownloadLink
                document={<WorkspacePDF workspace={activeWorkspaceTable} />}
                fileName={`${activeWorkspaceTable.title || 'workspace'}.pdf`}
              >
                {({ loading }: { loading: boolean }) => (
                  <Button disabled={loading}>
                    <Download />
                    <p>{loading ? 'Loading...' : 'Download PDF'}</p>
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>
        {/* Summary */}
        <div className="mt-4 flex w-full flex-col items-center gap-3 lg:flex-row">
          {/* Shipments */}
          <Box
            title="Build Shipments"
            count={activeWorkspaceTable?.buildShipments?.length ?? 0}
            icon={<Package className="text-blue-600" size={32} />}
            textColor="text-blue-700"
            bgColor="bg-blue-300/20"
          />
          {/* Total Shipments */}
          <Box
            title="Total Shipments"
            count={
              activeWorkspaceTable?.buildShipments
                ?.map((shipment) => shipment.shipments.length)
                .reduce((a, b) => a + b, 0) as any
            }
            icon={<Truck className="text-green-600" size={32} />}
            textColor="text-green-700"
            bgColor="bg-green-300/20"
          />

          {/* Total Cost */}
          <Box
            title="Total Cost"
            count={`$${kFormatter(
              activeWorkspaceTable?.buildShipments
                ?.flatMap((buildShipment) => buildShipment.shipments)
                .reduce((total, shipment) => total + shipment.cost, 0) as any
            )}`}
            icon={<DollarSign className="text-purple-600" size={32} />}
            textColor="text-purple-700"
            bgColor="bg-purple-300/20"
          />
        </div>
      </div>

      {/* Buttons Menu */}
      <div className="mt-4 flex w-full items-center  gap-x-2">
        {tableOptions?.map((option) => (
          <button
            key={option}
            onClick={() => setActiveTable(option)}
            className={`block w-full rounded-lg px-4 py-2.5 font-bold ${
              activeTable === option
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div key={activeWorkspaceTable?.id}>
        {activeTable === 'Shipments' ? (
          <div className="mt-4 rounded-md border-2 border-gray-200 p-4">
            <h2 className="text-lg font-bold 2xl:text-2xl">Shipments Overview</h2>
            <p className="text-gray-600">
              All shipments across build numbers in {activeWorkspaceTable?.title}
            </p>

            <Table columns={shipmentColumns} data={shipments} getRowId={(row) => row.id} />
          </div>
        ) : (
          <div className="mt-4 rounded-md border-2 border-gray-200 p-4">
            <h2 className="text-lg font-bold 2xl:text-2xl">Build Shipments Overview</h2>
            <p className="text-gray-600">
              Build shipment summary for {activeWorkspaceTable?.title}
            </p>
            <Table
              columns={buildShipmentColumns}
              data={activeWorkspaceTable?.buildShipments ?? []}
              getRowId={(row) => row.id}
            />
          </div>
        )}
      </div>
    </div>
  )
}
