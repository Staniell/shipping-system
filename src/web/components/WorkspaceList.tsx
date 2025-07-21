import { useEffect, useState } from 'react'
import DosspaceApi from '../api'
import { DeleteIcon, EditIcon, Package } from 'lucide-react'
import { BuildShipment } from '../types/workspace'
import { componentModal } from '../helpers/modal'
import Button from './common/Button'
import WorkSpaceForm from './workspace/WorkSpaceForm'
import PromptForm from './common/PromptForm'
import WorkspaceDetails from './WorkspaceDetails'

export interface HomepageWorkspace {
  id: string
  title: string
  buildShipments: BuildShipment[]
}

/** Homepage list of all workspaces that have been created */
export default function WorkspaceList() {
  const [workspaces, setWorkspaces] = useState<HomepageWorkspace[]>([])
  const [activeWorkspaceTable, setActiveWorkspaceTable] = useState<HomepageWorkspace | null>(null)

  const handleShipmentDeleted = (updatedWorkspace: HomepageWorkspace) => {
    const newWorkspaces = workspaces.map((ws) =>
      ws.id === updatedWorkspace.id ? updatedWorkspace : ws
    )
    setWorkspaces(newWorkspaces)
    setActiveWorkspaceTable(updatedWorkspace)
  }

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
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="h-fit rounded-md border-2 border-gray-200 p-4 lg:w-[30%]">
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

        <div className="h-fit lg:w-[70%]">
          {activeWorkspaceTable && (
            <WorkspaceDetails workspace_id={activeWorkspaceTable?.id! as any} />
          )}
        </div>
      </div>
    </div>
  )
}
