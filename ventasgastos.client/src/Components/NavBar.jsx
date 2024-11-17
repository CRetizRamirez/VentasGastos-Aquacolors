import { useNavigate } from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <h4 className="navbar-brand" onClick={() => handleNavigate('/')}>Aquacolors</h4>
                    <div className="collapse navbar-collapse text-center" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <button className="nav-link active btn btn-link" onClick={() => handleNavigate('/ventas')}>Ventas</button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link active btn btn-link" onClick={() => handleNavigate('/gastos')}>Gastos</button>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link active btn btn-link" onClick={() => handleNavigate('/variables')}>Variables</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default NavBar;
