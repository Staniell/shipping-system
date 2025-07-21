import { useEffect, useState } from 'react'
import '../style/WorkspaceList.css'
import DosspaceApi from '../api'
import { DeleteIcon, DollarSign, EditIcon, Package, Plus, Truck } from 'lucide-react'
import { BuildShipment, NewShipment, Shipment } from '../types/workspace'
import { Edit } from 'lucide-react'
import { kFormatter } from '../helpers/number'
import Table, { ColumnDef } from './common/Table'
import Box from './common/Box'
import { componentModal } from '../helpers/modal'
import Button from './common/Button'
import ShipmentForm from './workspace/ShipmentForm'
import WorkSpaceForm from './workspace/WorkSpaceForm'
import PromptForm from './common/PromptForm'

export interface HomepageWorkspace {
  id: string
  title: string
  buildShipments: BuildShipment[]
}

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

/** Homepage list of all workspaces that have been created */
export default function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState<HomepageWorkspace[]>([])
  const [activeWorkspaceTable, setActiveWorkspaceTable] = useState<HomepageWorkspace | null>(null)

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
                          const newWorkspaces = workspaces.map((ws) => {
                            if (ws.id === activeWorkspaceTable?.id) {
                              const updatedBuildShipments = ws.buildShipments.map(
                                (bs: BuildShipment) => {
                                  if (bs.id === row.buildShipmentId) {
                                    return {
                                      ...bs,
                                      shipments: bs.shipments.filter(
                                        (s: Shipment) => s.id !== row.id
                                      ),
                                    }
                                  }
                                  return bs
                                }
                              )
                              return { ...ws, buildShipments: updatedBuildShipments }
                            }
                            return ws
                          })
                          setWorkspaces(newWorkspaces)
                          setActiveWorkspaceTable(
                            newWorkspaces.find((ws) => ws.id === activeWorkspaceTable?.id) ?? null
                          )
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
                          setWorkspaces((prev) => prev.map((ws) => (ws.id === res.id ? res : ws)))
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
    async function fetchWorkspaces() {
      const workspaces = await DosspaceApi.getWorkspaces()
      setWorkspaces(workspaces)
      setActiveWorkspaceTable(workspaces[0])
    }

    fetchWorkspaces()
  }, [])

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold 2xl:text-3xl">Doss Workspace Viewer</h1>
      <p className="mb-4 text-gray-600">Manage and visualize your supply chain workspaces</p>
      <div className="flex gap-x-4">
        <div className="h-fit w-[30%] rounded-md border-2 border-gray-200 p-4">
          <div className="flex items-center gap-x-2">
            <Package />
            <h2 className="text-lg font-bold 2xl:text-2xl">Workspaces</h2>
          </div>

          <p className="mb-6 text-gray-600">{workspaces.length} workspaces available</p>

          <div className="flex max-h-[50vh] flex-col gap-y-1 overflow-y-auto">
            <div className="mx-auto mb-2 block w-fit">
              <Button
                onClick={() => {
                  componentModal({
                    component: (
                      <WorkSpaceForm
                        onSubmit={async (title) => {
                          componentModal(null)
                          const res = await DosspaceApi.createWorkspace(title)
                          setWorkspaces((prevWorkspaces: any) => [...prevWorkspaces, res])
                        }}
                      />
                    ),
                  })
                }}
              >
                Add Workspace
              </Button>
            </div>
            {workspaces.map((workspace) => {
              const activeWorkspace = activeWorkspaceTable?.id === workspace.id
              return (
                <div className="flex items-center gap-x-3">
                  <button
                    key={workspace.id}
                    onClick={() => {
                      setActiveWorkspaceTable(workspace)
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left font-bold ${
                      activeWorkspace ? 'bg-gray-900 text-white' : 'text-black hover:bg-gray-200'
                    }`}
                  >
                    <div>
                      <h2 className="font-bold">{workspace.title}</h2>
                      <p
                        className={`text-sm ${activeWorkspace ? 'text-gray-200' : 'text-gray-600'}`}
                      >
                        {workspace?.buildShipments?.length} shipments
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-x-2">
                    <EditIcon
                      className="cursor-pointer"
                      onClick={(e: any) => {
                        e.preventDefault()
                        componentModal({
                          component: (
                            <WorkSpaceForm
                              data={workspace}
                              onSubmit={async (title) => {
                                componentModal(null)
                                const res = await DosspaceApi.updateWorkspace(workspace.id, {
                                  id: workspace.id,
                                  title,
                                  buildShipments: workspace.buildShipments,
                                })
                                if (!res) return
                                setWorkspaces((prevWorkspaces: any) =>
                                  prevWorkspaces.map((ws: any) => (ws.id === res.id ? res : ws))
                                )
                                setActiveWorkspaceTable(res)
                              }}
                            />
                          ),
                        })
                      }}
                      size={18}
                    />
                    <DeleteIcon
                      className="cursor-pointer text-red-500"
                      onClick={(e: any) => {
                        e.preventDefault()
                        componentModal({
                          component: (
                            <PromptForm
                              onNo={() => componentModal(null)}
                              onYes={async () => {
                                componentModal(null)
                                const res: any = await DosspaceApi.deleteWorkspace(workspace.id)

                                if (!res) return
                                setWorkspaces((prevWorkspaces: any) =>
                                  prevWorkspaces.filter((ws: any) => ws.id !== workspace.id)
                                )
                                if (workspaces.length > 0) setActiveWorkspaceTable(workspaces[0])
                                else setActiveWorkspaceTable(null)
                              }}
                            />
                          ),
                        })
                      }}
                      size={18}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="h-fit w-[70%] ">
          <div className="h-fit rounded-md border-2 border-gray-200 p-4">
            {/* Header Info */}
            <div className="flex items-center justify-between gap-x-2">
              <div className="mb-6 flex flex-col gap-y-2">
                <h2 className="text-lg font-bold 2xl:text-2xl">{activeWorkspaceTable?.title}</h2>
                <p className=" text-gray-600">Workspace ID: {activeWorkspaceTable?.id}</p>
              </div>
              <div>
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
                              setWorkspaces((prevWorkspaces) =>
                                prevWorkspaces.map((ws: HomepageWorkspace) =>
                                  ws.id === updatedWorkspace.id ? updatedWorkspace : ws
                                )
                              )
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
              </div>
            </div>
            {/* Summary */}
            <div className="flex w-full items-center gap-3">
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
      </div>
    </div>
  )
}
