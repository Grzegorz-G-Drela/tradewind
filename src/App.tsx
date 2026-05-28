import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Map from './pages/Map'
import Trade from './pages/Trade'
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route element={<Layout></Layout>}>
        <Route path='/' element={<Home />}></Route>
        <Route path='/map' element={<Map />}></Route>
        <Route path='/trade' element={<Trade />}></Route>
      </Route>
    </Routes>
  )
}

export default App