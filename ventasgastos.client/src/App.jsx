import './App.css';
import NavBar from './Components/NavBar';
import Gastos from './Components/Gastos';
import Ventas from './Components/Ventas';
import Variables from './Components/Variables';
import { Routes, Route } from 'react-router-dom'

function App() {
    return (
        <div>
            <NavBar />
            <Routes>
                <Route path='/' element={<Ventas /> } />
                <Route path='*' element={<Ventas /> } />
                <Route path='/gastos' element={<Gastos /> } />
                <Route path='/variables' element={<Variables /> } />  
            </Routes>
        </div>
    );


}

export default App;