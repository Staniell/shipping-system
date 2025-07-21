import WorkspaceList from './WorkspaceList'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ReadMe from './ReadMe'
import WorkspaceDetails from './WorkspaceDetails'

function Workspaces() {
  const navigate = useNavigate()

  return (
    <>
      <div
        className="cursor-pointer bg-[#000025] p-4 font-bold text-white"
        onClick={() => navigate('/')}
      >
        Dosspace
      </div>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/readme" element={<ReadMe />} />
          <Route path="*" element={<WorkspaceList />} />
          <Route path="/:workspaceId" element={<WorkspaceDetails />} />
        </Routes>
      </div>
    </>
  )
}

export default Workspaces
