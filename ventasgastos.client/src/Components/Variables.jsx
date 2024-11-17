import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Button
} from "reactstrap";

function Variables() {

    const { register: registerConcepto, handleSubmit: handleSubmitConcepto, reset: resetConcepto } = useForm();
    const { register: registerEditarConcepto, handleSubmit: handleSubmitEditarConcepto, reset: resetEditarConcepto } = useForm();
    const { register: registerVendedor, handleSubmit: handleSubmitVendedor, reset: resetVendedor } = useForm();
    const { register: registerEditarVendedor, handleSubmit: handleSubmitEditarVendedor, reset: resetEditarVendedor } = useForm();

    const [conceptos, setConceptos] = useState([]);
    const [vendedores, setVendedores] = useState([]);
    const [modalConceptos, setModalConceptos] = useState(false);
    const [modalVendedores, setModalVendedores] = useState(false);
    const [modalEditarConcepto, setModalEditarConcepto] = useState(false);
    const [modalEliminarConcepto, setModalEliminarConcepto] = useState(false);
    const [modalEditarVendedor, setModalEditarVendedor] = useState(false);
    const [modalEliminarVendedor, setModalEliminarVendedor] = useState(false);
    const [vendedorSeleccionado, setVendedorSeleccionado] = useState({
        idVendedor: "",
        vendedor: ""
    });
    const [conceptoSeleccionado, setConceptoSeleccionado] = useState({
        idConcepto: "",
        concepto: ""
    })
    const seleccionarVendedor = (item, caso) => {
        setVendedorSeleccionado(item);        
        caso == 'Editar' ? setModalEditarVendedor(true) : setModalEliminarVendedor(true);
    }

    const seleccionarConcepto = (item, caso) => {
        setConceptoSeleccionado(item);
        caso == 'Editar' ? setModalEditarConcepto(true) : setModalEliminarConcepto(true);
    }

    const mostrarVendedoresSP = async () => {
        try {
            const responce = await fetch("/api/sp/mostrarvendedores");
            setVendedores(await responce.json());
        } catch (error) {
            console.error("Error en mostrarVendedoresSP", error);
        }
    }

    const mostrarConceptosSP = async () => {
        try {
            const responce = await fetch("/api/sp/mostrarconceptos");
            setConceptos(await responce.json());
        } catch (error) {
            console.error("Error en mostrarConceptosSP", error);
        }
    }

    const onSubmitVendedor = async (data) => {
        try {
            const response = await fetch("/api/sp/ingresarvendedor", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            resetVendedor();
            mostrarVendedoresSP();
            setModalVendedores(false);
        }
        catch (error) {
            console.error('Error en onSubmitVendedor', error)
        }
    }

    const onSubmitConcepto = async (data) => {
        try {
            const response = await fetch("/api/sp/ingresarconcepto", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            resetConcepto();
            mostrarConceptosSP();
            setModalConceptos(false);
        }
        catch (error) {
            console.error('Error en onSubmitConcepto', error)
        }
    }

    const editarVendedorSP = async (data) => {
        try {
            const response = await fetch("/api/sp/editarvendedor", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idVendedor: vendedorSeleccionado.idVendedor,
                    vendedor: data.vendedor,
                }),
            });
            if (response.ok) {
                setModalEditarVendedor(false);
                mostrarVendedoresSP();
                resetEditarVendedor();
            } else {
                throw new Error(`Error en la respuesta: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al editar el vendedor:', error);
        }
    };

    const editarConceptoSP = async (data) => {
        try {
            const response = await fetch("/api/sp/editarconcepto", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idConcepto: conceptoSeleccionado.idConcepto,
                    concepto: data.concepto,
                }),
            });
            if (response.ok) {
                setModalEditarConcepto(false);
                mostrarConceptosSP();
                resetEditarConcepto();
            } else {
                throw new Error(`Error en la respuesta: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al editar el concepto:', error);
        }
    }

    const eliminarVendedorSP = async () => {
        const dato = {
            idVendedor: vendedorSeleccionado.idVendedor
        }
        try {
            const response = await fetch("/api/sp/eliminarvendedor", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dato)
            });
            if (response.ok) {
                setModalEliminarVendedor(false);
                mostrarVendedoresSP();
            } else {
                console.error('Error en el if de eliminarVendedorSP')
            }
        }
        catch (error) {
            console.error('Error en eliminarVendedorSP', error)
        }
    }

    const eliminarConceptoSP = async () => {
        const dato = {
            idConcepto: conceptoSeleccionado.idConcepto
        }
        try {
            const response = await fetch("/api/sp/eliminarconcepto", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dato)
            });
            if (response.ok) {
                setModalEliminarConcepto(false);
                mostrarConceptosSP();
            } else {
                console.error('Error en el if de eliminarConceptoSP')
            }
        }
        catch (error) {
            console.error('Error en eliminarConceptoSP', error)
        }
    }

    const cerrarModalEditarConcepto = () => {
        resetEditarConcepto();
        setModalEditarConcepto(false);
    }

    const cerrarModalEditarVendedor = () => {
        resetEditarVendedor();
        setModalEditarVendedor(false);
    }

    useEffect(() => {
        mostrarConceptosSP();
        mostrarVendedoresSP();
    }, []);


    return (
        <div className="container mt-4">
            <h1 className="text-center me-5 mb-4">Variables</h1>
            <div className="d-flex justify-content-center flex-column flex-md-row">
                <div className="table-responsive mb-3 me-5">
                    <button onClick={() => setModalVendedores(true)} className="btn btn-primary">Agregar Vendedor</button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Vendedor</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                vendedores.map(item => (
                                    <tr key={item.idVendedor}>
                                        <td>{item.vendedor}</td>
                                        <td><button onClick={() => seleccionarVendedor(item, 'Editar')} className="btn" >✏</button></td>
                                        <td><button onClick={() => seleccionarVendedor(item, 'Eliminar')} className="btn" >🗑</button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className="table-responsive mb-3 me-5">
                    <button onClick={() => setModalConceptos(true)} className="btn btn-primary">Agregar Concepto</button>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Concepto</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                conceptos.map(item => (
                                    <tr key={item.idConcepto}>
                                        <td>{item.concepto}</td>
                                        <td><button onClick={() => seleccionarConcepto(item, 'Editar')} className="btn" >✏</button></td>
                                        <td><button onClick={() => seleccionarConcepto(item, 'Eliminar')} className="btn" >🗑</button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={modalConceptos} >
                <ModalHeader>
                    <div>
                        <h3>Agregar Concepto</h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmitConcepto(onSubmitConcepto)} >
                        <div className="col-md">
                            <div className="form-floating">
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    id="inputConcepto"
                                    name="inputConcepto"
                                    placeholder=""
                                    {...registerConcepto("concepto")}
                                />
                                <label htmlFor="inputConcepto">Ingresa el Concepto</label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary" >Agregar</button>
                            <button type="button" onClick={() => setModalConceptos(false)} className="btn btn-danger">Cerrar</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            <Modal isOpen={modalVendedores} >
                <ModalHeader>
                    <div>
                        <h3>Agregar Vendedor</h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmitVendedor(onSubmitVendedor)} >
                        <div className="col-md">
                            <div className="form-floating">
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    id="inputR"
                                    name="inputR"
                                    placeholder=""
                                    {...registerVendedor("vendedor")}
                                />
                                <label htmlFor="inputMonto">Ingresa el Vendedor</label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary" >Agregar</button>
                            <button type="button" onClick={() => setModalVendedores(false)} className="btn btn-danger">Cerrar</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            <Modal isOpen={modalEditarConcepto}>
                <ModalHeader>
                    <div>
                        <h3>Editar Concepto: {conceptoSeleccionado.concepto}</h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmitEditarConcepto(editarConceptoSP)}>
                        <div className="row g-2 mb-2">
                            <div className="col-md">
                                <div className="form-floating">
                                    <input
                                        className="form-control"
                                        id="inputConcepto"
                                        aria-label="Edicion de concepto"
                                        {...registerEditarConcepto("concepto")}
                                    />
                                    <label htmlFor="floatingSelectGrid">{conceptoSeleccionado.concepto}</label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer btn-group w-100" role="group">
                            <Button type="submit" color="primary" className="ms-2" >Editar</Button>
                            <Button type="button" onClick={cerrarModalEditarConcepto} className="btn btn-danger">Cerrar</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            <Modal isOpen={modalEditarVendedor}>
                <ModalHeader>
                    <div>
                        <h3>Editar Vendedor: {vendedorSeleccionado.vendedor}</h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmitEditarVendedor(editarVendedorSP)}>
                        <div className="row g-2 mb-2">
                            <div className="col-md">
                                <div className="form-floating">
                                    <input
                                        className="form-control"
                                        id="inputVendedor"
                                        aria-label="Edicion de vendedor"                                        
                                        {...registerEditarVendedor("vendedor")}
                                    />
                                    <label htmlFor="floatingSelectGrid">{vendedorSeleccionado.vendedor}</label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer btn-group w-100" role="group">
                            <Button type="submit" color="primary" className="ms-2" >Editar</Button>
                            <Button type="button" onClick={cerrarModalEditarVendedor} className="btn btn-danger">Cerrar</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            <Modal isOpen={modalEliminarConcepto}>
                <ModalHeader>
                    <div>
                        <h3>Eliminar: {conceptoSeleccionado.concepto} </h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div>
                        <p>Esta accion no se puede  deshacer ...</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="btn-group w-100" role="group">
                        <Button className="ms-2" color="primary" onClick={eliminarConceptoSP} >Eliminar</Button>
                        <Button className="ms-2" color="danger" onClick={() => setModalEliminarConcepto(false)} >Cancelar</Button>
                    </div>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modalEliminarVendedor}>
                <ModalHeader>
                    <div>
                        <h3>Eliminar: {vendedorSeleccionado.vendedor} </h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div>
                        <p>Esta accion no se puede  deshacer ...</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="btn-group w-100" role="group">
                        <Button className="ms-2" color="primary" onClick={eliminarVendedorSP} >Eliminar</Button>
                        <Button className="ms-2" color="danger" onClick={() => setModalEliminarVendedor(false)} >Cancelar</Button>
                    </div>
                </ModalFooter>
            </Modal>

        </div>
    );
}

export default Variables;