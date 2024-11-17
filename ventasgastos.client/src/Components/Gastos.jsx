import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Button
} from "reactstrap";

function Gastos() {

    const { register: registerAgregar, handleSubmit: handleSubmitAgregar, reset: resetAgregar } = useForm();
    const { register: registerEditar, handleSubmit: handleSubmitEditar, reset: resetEditar } = useForm();

    const [gastos5, setGastos5] = useState([]);
    const [gastos, setGastos] = useState([]);
    const [buscar, setBuscar] = useState("");
    const [tiendas, setTiendas] = useState([]);
    const [conceptos, setConceptos] = useState([]);
    const [modalAgregar, setModalAgregar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);

    //Evitar doble click
    const [isSubmitting, setIsSubmitting] = useState(false);

    // para lo de cesar
    const [fecha, setFecha] = useState("");
    const [tienda, setTienda] = useState("");
    const [montoTotal, setMontoTotal] = useState("");

    const hoy = new Date(); //obtenemos la fecha actual siempre
    const fechaActual = hoy.toISOString().split('T')[0]; //Formato valido
    const [fechaInicio, setFechaInicio] = useState(fechaActual);
    const [fechaFin, setFechaFin] = useState(fechaActual);
    const [gestorSeleccionado, setGestorSeleccionado] = useState({
        idGasto: "",
        fecha: "",
        tienda: "",
        monto: "",
        concepto: "",
        f: "",
        s: "",
        r: "",
        comentario: "",
        marcaTemporal: ""
    })

    const seleccionarGestor = (item, caso) => {
        setGestorSeleccionado(item);
        caso == 'Editar' ? setModalEditar(true) : setModalEliminar(true);
    }

    const handleFechaInicioChange = (e) => setFechaInicio(e.target.value);
    const handleFechaFinChange = (e) => setFechaFin(e.target.value);

    const mostrar5GastosSP = async () => {
        try {
            const responce = await fetch("/api/sp/mostrar5gastos");
            setGastos5(await responce.json());
        }
        catch (error) {
            console.error("Error en mostrar5Gastos", error);
        }
    }

    const mostrarGastosSP = async () => {
        const data = {
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        }
        try {
            const response = await fetch("/api/sp/mostrargastos", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setGastos(await response.json());
        }
        catch (error) {
            console.error('Error en mostrarGastosSP', error);
        }
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

    const mostrarConceptosSP = async () => {
        try {
            const responce = await fetch("/api/sp/mostrarconceptos");
            setConceptos(await responce.json());
        } catch (error) {
            console.error("Error en mostrarVendedoresSP", error);
        }
    }

    const onSubmitAgregar = async (data) => {
        setIsSubmitting(true);
        // Asegúramos que los campos numéricos tengan un valor de 0 si están vacíos, evitando el error en SQL
        data.f = data.f || 0;
        data.s = data.s || 0;
        data.r = data.r || 0;
        try {
            const response = await fetch("/api/sp/ingresargasto", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            resetAgregar({
                fecha: data.fecha,
                tienda: data.tienda,
                concepto: "",
                monto: "",
                f: "",
                s: "",
                r: "",
                comentario: ""
            });
            mostrar5GastosSP();
            obtenerMontoTotal(fecha, tienda);
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
        // Asegúramos que los campos numéricos tengan un valor de 0 si están vacíos, evitando el error en SQL
        data.f = data.f || 0;
        data.s = data.s || 0;
        data.r = data.r || 0;
        try {
            const response = await fetch("/api/sp/editargasto", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosCompletos)
            });
            if (response.ok) {
                setModalEditar(false);
                mostrar5GastosSP();
                mostrarGastosSP();
                resetEditar();
                obtenerMontoTotal(fecha, tienda);
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
            idGasto: gestorSeleccionado.idGasto
        }
        try {
            const response = await fetch("/api/sp/eliminargasto", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dato)
            });
            if (response.ok) {
                setModalEliminar(false);
                mostrar5GastosSP();
                mostrarGastosSP();
            } else {
                console.error('Error en el if de eliminarSP')
            }
        }
        catch (error) {
            console.error('Error en eliminarSP', error)
        }
    }

    const obtenerMontoTotal = async (fecha, tienda) => {        
        try {
            const response = await fetch(
                `/api/sp/montototalgastos?fecha=${fecha}&tienda=${tienda}`
            );
            if (!response.ok) {
                throw new Error('Error al obtener el total.');
            }
            setMontoTotal((await response.json())[0]);
        } catch (error) {
            console.error(error.message);
        }
    }

    //buscador por texto
    const search = (e) => {
        setBuscar(e.target.value);
    }
    const results = buscar
        ? gastos.filter((dato) =>
            dato.concepto.toLowerCase().includes(buscar.toLowerCase())
            || dato.tienda.toLowerCase().includes(buscar.toLowerCase())
            || dato.monto.toFixed(2).toString().includes(buscar)
        )
        : [];

    useEffect(() => {
        mostrar5GastosSP();
        mostrarGastosSP();
        mostrarTiendasSP();
        mostrarConceptosSP();
    }, []);

    useEffect(() => {
        mostrarGastosSP();
    }, [fechaInicio, fechaFin]); // Buscador por fechas

    //console.log(montoTotal.totalMontos)

    return (
        <div className="container mt-4">
            <h1>Gastos</h1>
            <button onClick={()=>setModalAgregar(true)} className="btn btn-primary">Ingresar Gasto</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tienda</th>
                        <th>Monto</th>
                        <th>Concepto</th>
                        <th>F</th>
                        <th>S</th>
                        <th>R</th>
                        <th>Comentario</th>
                        <th>Marca Temporal</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        gastos5.map(item => (
                            <tr key={item.idGasto}>
                                <td>{item.fecha}</td>
                                <td>{item.tienda}</td>
                                <td>{item.monto}</td>
                                <td>{item.concepto}</td>
                                <td>{item.f}</td>
                                <td>{item.s}</td>
                                <td>{item.r}</td>
                                <td>{item.comentario}</td>
                                <td>{item.marcaTemporal.replace('T', ' * ')}</td>
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

                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            if (fecha && tienda) {
                                obtenerMontoTotal(fecha, tienda);
                            }
                        }}
                    >
                        Obtener Totales
                    </button>
                </div>
                <div>
                    <p>Monto Total: {montoTotal.totalMontos?.toLocaleString('es-US') ?? 0} </p>
                </div>

            </div>

            <div className="row mt-5">
                <div className="col-12 col-sm-6 col-md-6">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="🔎  Buscar ..."
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
            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tienda</th>
                        <th>Monto</th>
                        <th>Concepto</th>
                        <th>F</th>
                        <th>S</th>
                        <th>R</th>
                        <th>Comentario</th>
                        <th>Marca Temporal</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        results.map(item => (
                            <tr key={item.idGasto}>
                                <td>{item.fecha}</td>
                                <td>{item.tienda}</td>
                                <td>{item.monto}</td>
                                <td>{item.concepto}</td>
                                <td>{item.f}</td>
                                <td>{item.s}</td>
                                <td>{item.r}</td>
                                <td>{item.comentario}</td>
                                <td>{item.marcaTemporal.replace('T', ' * ')}</td>
                                <td>
                                    <button onClick={() => seleccionarGestor(item, 'Editar')} className="btn">✏</button>
                                    <button onClick={() => seleccionarGestor(item, 'Eliminar')} className="btn">🗑</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <Modal isOpen={modalAgregar}>
                <ModalHeader>
                    <div>
                        <h3>Ingresar Gasto</h3>
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
                        </div>
                        <div className="row g-2 mb-2">
                            <div className="col-md">
                                <div className="form-floating">
                                    <select
                                        className="form-select"
                                        id="inputConcepto"
                                        aria-label="Registro del Concepto"
                                        {...registerAgregar("concepto")}>
                                        <option value=""></option>
                                        {
                                            conceptos.map(item => (
                                                <option key={item.idConcepto} value={item.concepto}>{item.concepto}</option>
                                            ))
                                        }
                                    </select>
                                    <label htmlFor="floatingSelectGrid">Conceptos</label>
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
                        <div className="row g-2 mb-2">
                            <div className="col-md">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="inputF"
                                        name="inputF"
                                        placeholder=""
                                        min="0"
                                        step="0.01"
                                        {...registerAgregar("f")}
                                    />
                                    <label htmlFor="inputMonto">F</label>
                                </div>
                            </div>
                            <div className="col-md">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="inputS"
                                        name="inputS"
                                        placeholder=""
                                        min="0"
                                        step="0.01"
                                        {...registerAgregar("s")}
                                    />
                                    <label htmlFor="inputMonto">S</label>
                                </div>
                            </div>
                        </div>
                        <div className="row g-2 mb-2">   
                            <div className="col-md">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="inputR"
                                        name="inputR"
                                        placeholder=""
                                        min="0"
                                        {...registerAgregar("r")}
                                    />
                                    <label htmlFor="inputMonto">R</label>
                                </div>
                            </div>
                            <div className="col-md">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="inputClave"
                                        name="inputClave"
                                        placeholder=""
                                        {...registerAgregar("comentario")}
                                    />
                                    <label htmlFor="inputClave">Comentario</label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary" >Agregar</button>
                            <button type="button" onClick={() => setModalAgregar(false)} className="btn btn-danger">Cerrar</button>
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
                        </div>
                        <div className="row g-2 mb-2">
                            <div className="col-md">
                                <p className="mb-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>Concepto</p>
                                <div className="form-floating">
                                    <select
                                        className="form-select"
                                        id="inputConcepto"
                                        aria-label="Registro de concepto"
                                        {...registerEditar("concepto")}>
                                        <option value=""></option>
                                        {
                                            conceptos.map(item => (
                                                <option key={item.idConcepto} value={item.concepto}>{item.concepto}</option>
                                            ))
                                        }
                                    </select>
                                    <label htmlFor="floatingSelectGrid">{gestorSeleccionado.concepto}</label>
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
                        <div className="row g-2 mb-2">
                            <div className="col-md">
                                <p className="mb-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>F</p>
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="inputF"
                                        name="inputF"
                                        placeholder={gestorSeleccionado.f}
                                        min="0"
                                        step="0.01"
                                        {...registerEditar("f")}
                                    />
                                    <label htmlFor="inputf">{gestorSeleccionado.f}</label>
                                </div>
                            </div>
                            <div className="col-md">
                                <p className="mb-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>S</p>
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="inputS"
                                        name="inputS"
                                        placeholder={gestorSeleccionado.s}
                                        min="0"
                                        step="0.01"
                                        {...registerEditar("s")}
                                    />
                                    <label htmlFor="inputf">{gestorSeleccionado.s}</label>
                                </div>
                            </div>
                        </div>
                        <div className="row g-2 mb-2">
                            <div className="col-md">
                                <p className="mb-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>R</p>
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="inputR"
                                        name="inputR"
                                        placeholder={gestorSeleccionado.r}
                                        min="0"
                                        {...registerEditar("r")}
                                    />
                                    <label htmlFor="inputf">{gestorSeleccionado.r}</label>
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
                        <h3>Eliminar Gasto de: {gestorSeleccionado.concepto}</h3>
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

export default Gastos;