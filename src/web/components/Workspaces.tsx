import WorkspaceList from './WorkspaceList'
import '../style/Workspaces.css'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ReadMe from './ReadMe'
import WorkspaceDetails from './WorkspaceDetails'

function Workspaces() {
  const navigate = useNavigate()

  return (
    <>
      <div
        className="p-4 bg-[#000025] text-white font-bold cursor-pointer"
        onClick={() => navigate('/')}
      >
        Dosspace
      </div>
      <div className="p-4 container mx-auto">
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
