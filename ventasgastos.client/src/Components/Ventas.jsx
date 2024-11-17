import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import BotonExcelDefault from "./BotonExcelDefault.jsx";
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Button
} from "reactstrap";

function Ventas() {

    const { register: registerAgregar, handleSubmit: handleSubmitAgregar, reset: resetAgregar } = useForm();
    const { register: registerEditar, handleSubmit: handleSubmitEditar, reset: resetEditar } = useForm();

    const [ventas5, setVentas5] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [buscar, setBuscar] = useState("");
    const [tiendas, setTiendas] = useState([]);
    const [formasDePago, setFormasDePago] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [modalAgregar, setModalAgregar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    //const [resultados, setResultados] = useState([])

    //Evitar doble click
    const [isSubmitting, setIsSubmitting] = useState(false);

    // para lo de cesar
    const [fecha, setFecha] = useState("");
    const [tienda, setTienda] = useState("");
    const [vendedor, setVendedor] = useState("");
    const [totales, setTotales] = useState({
        TotalEfectivo: 0,
        TotalTarjeta: 0,
        TotalTransferencia: 0,
        TotalDeposito: 0
    });

    const hoy = new Date(); //obtenemos la fecha actual siempre
    const fechaActual = hoy.toISOString().split('T')[0]; //Formato valido
    const [fechaInicio, setFechaInicio] = useState(fechaActual);
    const [fechaFin, setFechaFin] = useState(fechaActual);
    const [gestorSeleccionado, setGestorSeleccionado] = useState({
        idVenta: "",
        fecha: "",
        tienda: "",
        monto: "",
        nota: "",
        vendedor: "",
        formaDePago: "",
        comentario: "",
        marcaTemporal: ""
    })

    const seleccionarGestor = (item, caso) => {
        setGestorSeleccionado(item);
        caso == 'Editar' ? setModalEditar(true) : setModalEliminar(true);
    }

    const handleFechaInicioChange = (e) => setFechaInicio(e.target.value);
    const handleFechaFinChange = (e) => setFechaFin(e.target.value);

    const mostrar5VentasSP = async () => {
        try {
            const response = await fetch("/api/sp/mostrar5ventas");
            setVentas5(await response.json());
        }
        catch (error) {
            console.error("Error en mostrar5Ventas", error);
        }
    }

    const mostrarVentasSP = async () => {
        const data = {
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        }
        try {
            const response = await fetch("/api/sp/mostrarventas", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setVentas(await response.json());
        }
        catch (error) {
            console.error('Error en mostrarVentasSP', error);
        }
    }

    const cerrarModalAgregar = () => {
        resetAgregar();
        setModalAgregar(false);
    }

    const mostrarTiendasSP = async () => {
        try {
            const responce = await fetch("/api/sp/mostrartiendas");
            setTiendas(await responce.json());
        }
        catch (error) {
            console.error('Error en mostrarTiendasSP', error)
        }
    }

    const mostrarFormasDePagoSP = async () => {
        try {
            const responce = await fetch("/api/sp/mostrarformasdepago")
            setFormasDePago(await responce.json());
        } catch (error) {
            console.error('Error en mostrarFormasDePagoSP', error);
        }
    }

    const mostrarVendedoresSP = async () => {
        try {
            const responce = await fetch("/api/sp/mostrarvendedores");
            setVendedores(await responce.json());
        } catch (error) {
            console.error("Error en mostrarVendedoresSP", error);
        }
    }

    const onSubmitAgregar = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/sp/ingresarventa", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            resetAgregar({
                fecha: data.fecha,
                vendedor: data.vendedor,
                tienda: data.tienda,
                formaDePago: data.formaDePago,
                monto: "",
                nota: "",
                comentario: ""
            });
            mostrar5VentasSP();
            obtenerTotales(fecha, tienda, vendedor);
        }
        finally {
            setIsSubmitting(false);
        }
    }

    const editarSP = async (data) => {
        const datosCompletos = {  //Para garantizar la union de datos anteriores y datos modificados en el formulario
            ...gestorSeleccionado,
            ...Object.keys(data).reduce((acc, key) => {
                if (data[key] !== '' && data[key] !== null && data[key] !== undefined) {
                    acc[key] = data[key];
                }
                return acc;
            }, {})
        };
        try {
            const response = await fetch("/api/sp/editarventa", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosCompletos)
            });
            if (response.ok) {
                setModalEditar(false);
                mostrar5VentasSP();
                mostrarVentasSP();
                resetEditar();
                obtenerTotales(fecha, tienda, vendedor);
            } else {
                console.error('Error en editarSP')
            }
        }
        catch (error) {
            console.error('Error en editarSP', error)
        }
    }

    const eliminarSP = async () => {
        const dato = {
            idVenta: gestorSeleccionado.idVenta
        }
        try {
            const response = await fetch("/api/sp/eliminarventa", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dato)
            });
            if (response.ok) {
                setModalEliminar(false);
                mostrar5VentasSP();
                mostrarVentasSP();
            } else {
                console.error('Error en el if de eliminarSP')
            }
        }
        catch (error) {
            console.error('Error en eliminarSP', error)
        }
    }

    const obtenerTotales = async (fecha, tienda, vendedor) => {
        try {
            const response = await fetch(
                `/api/sp/totalesformadepago?fecha=${fecha}&tienda=${tienda}&vendedor=${vendedor}`
            );
            if (!response.ok) {
                throw new Error('Error al obtener los totales.');
            }
            setTotales((await response.json())[0]);
        } catch (error) {
            console.error(error.message);
        }
    };

    //buscador por texto
    const search = (e) => {
        setBuscar(e.target.value);
    }
    const results = buscar
        ? ventas.filter((dato) =>
            dato.vendedor.toLowerCase().includes(buscar.toLowerCase())
            || dato.tienda.toLowerCase().includes(buscar.toLowerCase())
            || dato.nota.toString().includes(buscar)
        )
        : [];

    useEffect(() => {
        mostrar5VentasSP();
        mostrarVentasSP();
        mostrarTiendasSP();
        mostrarFormasDePagoSP();
        mostrarVendedoresSP();
    }, []);

    useEffect(() => {
        mostrarVentasSP();
    }, [fechaInicio, fechaFin]); // Buscador por fechas

    return (
        <div className="container mt-4">
            <h1>Ventas</h1>
            <button onClick={() => setModalAgregar(true)} className="btn btn-primary">Ingresar Venta</button>

            <table className="table">
                <thead>
                    <tr>
                        <th>Vendedor</th>
                        <th>Forma de Pago</th>
                        <th>Monto</th>
                        <th>Nota</th>
                        <th>Tienda</th>
                        <th>Comentario</th>
                        <th>Marca Temporal</th>
                        <th>Fecha</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        ventas5.map(item => (
                            <tr key={item.idVenta}>
                                <td>{item.vendedor}</td>
                                <td>{item.formaDePago}</td>
                                <td>{item.monto}</td>
                                <td>{item.nota}</td>
                                <td>{item.tienda}</td>
                                <td>{item.comentario}</td>
                                <td>{item.marcaTemporal.replace('T', ' 🐶 ')}</td>
                                <td>{item.fecha}</td>
                                <td>
                                    <button onClick={() => seleccionarGestor(item, 'Editar')} className="btn">✏</button>
                                    <button onClick={() => seleccionarGestor(item, 'Eliminar')} className="btn">🗑</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <div>
                <div style={{ display: "flex", width: "100%", gap: "1rem", marginBottom: "1rem" }}>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        placeholder="Fecha"
                        style={{ flex: 1 }}
                    />

                    <select
                        required
                        value={tienda}
                        onChange={(e) => setTienda(e.target.value)}
                        className="form-select"
                        id="tienda"
                        style={{ flex: 1 }}
                        aria-label="Registro de tienda"
                    >
                        <option value=""></option>
                        {
                            tiendas.map(item => (
                                <option key={item.idTienda} value={item.tienda}>{item.tienda}</option>
                            ))
                        }
                    </select>

                    <select
                        required
                        value={vendedor}
                        onChange={(e) => setVendedor(e.target.value)}
                        className="form-select"
                        id="vendedor"
                        style={{ flex: 1 }}
                        aria-label="Registro de tienda"
                    >
                        <option value=""></option>
                        {
                            vendedores.map(item => (
                                <option key={item.idVendedor} value={item.vendedor}>{item.vendedor}</option>
                            ))
                        }
                    </select>

                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            if (fecha && tienda && vendedor) {
                                obtenerTotales(fecha, tienda, vendedor);
                            }
                        }}
                    >
                        Obtener Totales
                    </button>
                </div>
                <div>
                    <p className="mb-1" >Efectivo: {totales.totalEfectivo?.toLocaleString('es-US') ?? 0}</p>
                    <p className="mb-1" >Tarjeta: {totales.totalTarjeta?.toLocaleString('es-US') ?? 0}</p>
                    <p className="mb-1" >Transferencia: {totales.totalTransferencia?.toLocaleString('es-US') ?? 0}</p>
                    <p>Depósito: {totales.totalDeposito?.toLocaleString('es-US') ?? 0}</p>
                </div>

            </div>

            <div className="row mt-5">
                <div className="col-12 col-sm-6 col-md-5">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="🔎  Buscar... Vendedor, Tienda, Nota"
                        style={{ backgroundColor: 'rgb(211, 211, 211)' }}
                        onChange={search}
                    />
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                    <input
                        type="date"
                        className="form-control"
                        placeholder=""
                        id="inputFechaInicio"
                        name="inputFechaInicio"
                        style={{ backgroundColor: 'rgb(211, 211, 211)' }}
                        value={fechaInicio}
                        onChange={handleFechaInicioChange}
                        max={fechaFin} // Limita la selección de fecha de inicio
                    />
                </div>
                <div className="col-12 col-sm-6 col-md-3">
                    <input
                        type="date"
                        className="form-control"
                        placeholder=""
                        id="inputFechaFin"
                        name="inputFechaFin"
                        style={{ backgroundColor: 'rgb(211, 211, 211)' }}
                        value={fechaFin}
                        onChange={handleFechaFinChange}
                        min={fechaInicio} // Limita la selección de fecha de fin
                    />
                </div> 
                <div className="col-12 col-sm-6 col-md-1">
                    <BotonExcelDefault resultados={results} />
                </div>
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Vendedor</th>
                        <th>Forma de Pago</th>
                        <th>Monto</th>
                        <th>Nota</th>
                        <th>Tienda</th>
                        <th>Comentario</th>
                        <th>Marca Temporal</th>
                        <th>Fecha</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        results.map(item => (
                            <tr key={item.idVenta}>
                                <td>{item.vendedor}</td>
                                <td>{item.formaDePago}</td>
                                <td>{item.monto}</td>
                                <td>{item.nota}</td>
                                <td>{item.tienda}</td>
                                <td>{item.comentario}</td>
                                <td>{item.marcaTemporal.replace('T', ' * ')}</td>
                                <td>{item.fecha}</td>
                                <td>
                                    <button onClick={() => seleccionarGestor(item, 'Editar')} className="btn">✏</button>
                                    <button onClick={() => seleccionarGestor(item, 'Eliminar')} className="btn">🗑</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            
            <Modal isOpen={modalAgregar}
                className="custom-modal"
            >
                <ModalHeader>
                    <div>
                        <h3>Ingresar Venta</h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmitAgregar(onSubmitAgregar)}>
                        <div className="row g-2 mb-2">
                            <div className="col-md">
                                <div className="form-floating">
                                    <input
                                        required
                                        type="date"
                                        className="form-control"
                                        id="inputFecha"
                                        name="inputFecha"
                                        placeholder=""
                                        {...registerAgregar("fecha")}
                                    />
                                    <label htmlFor="inputFecha">Fecha</label>
                                </div>
                            </div>
                            <div className="col-md">
                                <div className="form-floating">
                                    <select
                                        required
                                        className="form-select"
                                        id="inputVendedor"
                                        aria-label="Registro de vendedor"
                                        {...registerAgregar("vendedor")}>
                                        <option value=""></option>
                                        {
                                            vendedores.map(item => (
                                                <option key={item.idVendedor} value={item.vendedor}>{item.vendedor}</option>
                                            ))
                                        }
                                    </select>
                                    <label htmlFor="floatingSelectGrid">Vendedor</label>
                                </div>
                            </div>
                        </div>
                        <div className="row g-2 mb-2">
                            <div className="col-md">
                                <div className="form-floating">
                                    <select
                                        required
                                        className="form-select"
                                        id="inputTienda"
                                        aria-label="Registro de tienda"
                                        {...registerAgregar("tienda")}>
                                        <option value=""></option>
                                        {
                                            tiendas.map(item => (
                                                <option key={item.idTienda} value={item.tienda}>{item.tienda}</option>
                                            ))
                                        }
                                    </select>
                                    <label htmlFor="floatingSelectGrid">Tiendas</label>
                                </div>
                            </div>
                            <div className="col-md">
                                <div className="form-floating">
                                    <select
                                        required
                                        className="form-select"
                                        id="inputFormaDePago"
                                        aria-label="Registro de Forma de Pago"
                                        {...registerAgregar("formaDePago")}>
                                        <option value=""></option>
                                        {
                                            formasDePago.map(item => (
                                                <option key={item.idFormaDePago} value={item.formaDePago}>{item.formaDePago}</option>
                                            ))
                                        }
                                    </select>
                                    <label htmlFor="floatingSelectGrid">Forma De Pago</label>
                                </div>
                            </div>
                        </div>
                        <div className="row g-2 mb-2">
                            <div className="col-md">
                                <div className="form-floating">
                                    <input
                                        required
                                        type="number"
                                        className="form-control"
                                        id="inputNota"
                                        name="inputNota"
                                        placeholder=""
                                        min="0"
                                        {...registerAgregar("nota")}
                                    />
                                    <label htmlFor="inputNota">Nota</label>
                                </div>
                            </div>
                            <div className="col-md">
                                <div className="form-floating">
                                    <input
                                        required
                                        type="number"
                                        className="form-control"
                                        id="inputMonto"
                                        name="inputMonto"
                                        placeholder=""
                                        min="0"
                                        step="0.01"
                                        {...registerAgregar("monto")}
                                    />
                                    <label htmlFor="inputMonto">Monto</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-floating">
                                <select
                                    type="text"
                                    list="opciones"
                                    className="form-control"
                                    id="inputClave"
                                    name="inputClave"
                                    placeholder=""
                                    {...registerAgregar("comentario")}>
                                    <option value=""></option>
                                    <option value="CANCELADO">CANCELADO</option>
                                    <option value="ONLINE">ONLINE</option>
                                </select>
                                <label htmlFor="inputClave">Comentario</label>
                                <datalist id="opciones">
                                </datalist>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary" >Agregar</button>
                            <button type="button" onClick={cerrarModalAgregar} className="btn btn-danger">Cerrar</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            <Modal isOpen={modalEditar}>
                <ModalHeader>
                    <div>
                        <h3>Editar Venta # {gestorSeleccionado.nota}</h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmitEditar(editarSP)}>
                        <div className="row g-2 mb-2">
                            <div className="col-md">
                                <p className="mb-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>Fecha</p>
                                <div className="form-floating">
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="inputFecha"
                                        name="inputFecha"
                                        placeholder=""
                                        {...registerEditar("fecha")}
                                    />
                                    <label htmlFor="inputFecha">{gestorSeleccionado.fecha}</label>
                                </div>
                            </div>
                            <div className="col-md">
                                <p className="mb-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>Vendedor</p>
                                <div className="form-floating">
                                    <select
                                        className="form-select"
                                        id="inputVendedor"
                                        aria-label="Registro de vendedor"
                                        {...registerEditar("vendedor")}>
                                        <option value=""></option>
                                        {
                                            vendedores.map(item => (
                                                <option key={item.idVendedor} value={item.vendedor}>{item.vendedor}</option>
                                            ))
                                        }
                                    </select>
                                    <label htmlFor="floatingSelectGrid">{gestorSeleccionado.vendedor}</label>
                                </div>
                            </div>
                        </div>
                        <div className="row g-2 mb-2">
                            <div className="col-md">
                                <p className="mb-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>Tienda</p>
                                <div className="form-floating">
                                    <select
                                        className="form-select"
                                        id="inputTienda"
                                        aria-label="Registro de tienda"
                                        {...registerEditar("tienda")}>
                                        <option value=""></option>
                                        {
                                            tiendas.map(item => (
                                                <option key={item.idTienda} value={item.tienda}>{item.tienda}</option>
                                            ))
                                        }
                                    </select>
                                    <label htmlFor="floatingSelectGrid">{gestorSeleccionado.tienda}</label>
                                </div>
                            </div>
                            <div className="col-md">
                                <p className="mb-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>Forma de Pago</p>
                                <div className="form-floating">
                                    <select
                                        className="form-select"
                                        id="inputFormaDePago"
                                        aria-label="Registro de Forma de Pago"
                                        {...registerEditar("formaDePago")}>
                                        <option value=""></option>
                                        {
                                            formasDePago.map(item => (
                                                <option key={item.idFormaDePago} value={item.formaDePago}>{item.formaDePago}</option>
                                            ))
                                        }
                                    </select>
                                    <label htmlFor="floatingSelectGrid">{gestorSeleccionado.formaDePago}</label>
                                </div>
                            </div>
                        </div>
                        <div className="row g-2 mb-2">
                            <div className="col-md">
                                <p className="mb-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>Nota</p>
                                <div className="form-floating">
                                    <input

                                        type="number"
                                        className="form-control"
                                        id="inputNota"
                                        name="inputNota"
                                        placeholder={gestorSeleccionado.nota}
                                        min="0"
                                        {...registerEditar("nota")}
                                    />
                                    <label htmlFor="inputNota">{gestorSeleccionado.nota}</label>
                                </div>
                            </div>
                            <div className="col-md">
                                <p className="mb-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>Monto</p>
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="inputMonto"
                                        name="inputMonto"
                                        placeholder={gestorSeleccionado.monto}
                                        min="0"
                                        step="0.01"
                                        {...registerEditar("monto")}
                                    />
                                    <label htmlFor="inputMonto">{gestorSeleccionado.monto}</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md">
                            <p className="mb-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>Comentario</p>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputClave"
                                    name="inputClave"
                                    placeholder={gestorSeleccionado.comentario}
                                    {...registerEditar("comentario")}
                                />
                                <label htmlFor="inputClave">{gestorSeleccionado.comentario}</label>
                            </div>
                        </div>
                        <div className="modal-footer btn-group w-100" role="group">
                            <Button type="submit" color="primary" className="ms-2" >Editar</Button>
                            <Button type="button" color="danger" className="ms-2" onClick={() => setModalEditar(false)} >Cerrar</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            <Modal isOpen={modalEliminar}>
                <ModalHeader>
                    <div>
                        <h3>Eliminar Venta # {gestorSeleccionado.nota}</h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div>
                        <p>Esta accion no se puede  deshacer ...</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="btn-group w-100" role="group">
                        <Button className="ms-2" color="primary" onClick={eliminarSP} >Eliminar</Button>
                        <Button className="ms-2" color="danger" onClick={() => setModalEliminar(false)} >Cancelar</Button>
                    </div>
                </ModalFooter>
            </Modal>

        </div>
    );
}

export default Ventas;