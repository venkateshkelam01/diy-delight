// import { Routes, Route, Link } from 'react-router-dom'
// import ItemsList from './pages/ItemsList.jsx'
// import ItemDetail from './pages/ItemDetail.jsx'
// import CreateItem from './pages/CreateItem.jsx'
// import EditItem from './pages/EditItem.jsx'
// import './index.css'

// function NavBar() {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
//       <Link to="/"><h2>DIY Delight</h2></Link>
//       <div style={{ display: 'flex', gap: 8 }}>
//         <Link to="/"><button>All Items</button></Link>
//         <Link to="/create"><button>Create New</button></Link>
//       </div>
//     </div>
//   )
// }

// export default function App() {
//   return (
//     <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
//       <NavBar />
//       <Routes>
//         <Route path="/" element={<ItemsList />} />
//         <Route path="/items/:id" element={<ItemDetail />} />
//         <Route path="/create" element={<CreateItem />} />
//         <Route path="/items/:id/edit" element={<EditItem />} />
//         <Route path="*" element={<div>Not Found</div>} />
//       </Routes>
//     </div>
//   )
// }
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import ItemsList from './pages/ItemsList.jsx'
import ItemDetail from './pages/ItemDetail.jsx'
import CreateItem from './pages/CreateItem.jsx'
import EditItem from './pages/EditItem.jsx'

export default function App() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<ItemsList />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/create" element={<CreateItem />} />
        <Route path="/items/:id/edit" element={<EditItem />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </div>
  )
}
