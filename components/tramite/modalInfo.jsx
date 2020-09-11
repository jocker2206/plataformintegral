import React, { Component } from 'react'
import Modal from '../modal';
import { Button, Form, Dropdown, Tab } from 'semantic-ui-react';
import Router from 'next/router';
import { tramite } from '../../services/apis';

const Documento = ({ tramite }) => {
    return (
        <Form>
            <div className="row">
                <Form.Field className="col-md-12">
                    <label htmlFor="">Tipo Documento</label>
                    <input type="text" value={tramite.tramite_type && tramite.tramite_type.description}/>
                </Form.Field>

                <Form.Field className="col-md-6">
                    <label htmlFor="">N° Documento</label>
                    <input type="text" value={tramite.document_number} readOnly/>
                </Form.Field>

                <Form.Field className="col-md-6">
                    <label htmlFor="">N° Folios</label>
                    <input type="text" value={tramite.folio_count} readOnly/>
                </Form.Field>

                <Form.Field className="col-md-12">
                    <label htmlFor="">Asunto</label>
                    <textarea  value={tramite.asunto} readOnly/>
                </Form.Field>
            </div>
        </Form>
    )
}


const Remitente = ({ person }) => {
    return (
        <Form>
            <div className="row">
                <Form.Field className="col-md-12 text-center">
                    <img src={person && person.image_images && person.image_images.image_200x200} 
                        alt="foto de persona"
                        style={{ width: "150px", height: "150px", borderRadius: '50%' }}
                    />
                </Form.Field>

                <Form.Field className="col-md-6">
                    <label htmlFor="">Tipo Documento</label>
                    <input type="text" value={person && person.document_type_text} readOnly/>
                </Form.Field>

                <Form.Field className="col-md-6">
                    <label htmlFor="">N° Documento</label>
                    <input type="text" value={person && person.document_number} readOnly/>
                </Form.Field>

                <Form.Field className="col-md-12">
                    <label htmlFor="">Apellidos y Nombres</label>
                    <input type="text" value={person && person.fullname} readOnly/>
                </Form.Field>

                <Form.Field className="col-md-6">
                    <label htmlFor="">N° Teléfono</label>
                    <input type="text" value={person && person.phone} readOnly/>
                </Form.Field>

                <Form.Field className="col-md-6">
                    <label htmlFor="">Correo de Contacto</label>
                    <input type="text" value={person && person.email_contact} readOnly/>
                </Form.Field>

                <Form.Field className="col-md-12">
                    <label htmlFor="">Dirección</label>
                    <input type="text" value={person && person.address} readOnly/>
                </Form.Field>
            </div>
        </Form>
    );
}


const FileInfo = ({ files = [] }) => {

    const getMeta = (path) => {
        let key = path.split('.').pop()
        let metas = {
            pdf: { icon: "fas fa-file-pdf", className: "text-red" },
            docx: { icon: "fas fa-file-word", className: "text-primary" }
        };
        // response
        return metas[key];
    }

    return (
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Archivo</th>
                </tr>
            </thead>
            <tbody>
                {files.map((f, indexF) => 
                    <tr key={`file-tramite-${indexF}`}>
                        <th>
                            <i className={`${getMeta(f).icon} ${getMeta(f).className}`} /> {`${f}`.split('/').pop()}
                        </th>
                        <th>
                            <a href={f} target="_blank" rel="noopener noreferrer">
                                Ver
                            </a>
                        </th>
                    </tr>
                )}
            </tbody>
        </table>
    )
}


export default class ModalInfo extends Component
{

    state = {
        tramite: {},
        loading: false
    }

    componentDidMount = () => {
        this.getTramite();
    }

    getTramite = async () => {
        this.setState({ loading: true });
        let { tracking } = this.props;
        await tramite.get(`public/tramite/${tracking.slug}`)
            .then(res => {
                let { success, tramite, message } = res.data;
                if (!success) throw new Error(message);
                this.setState({ tramite });
            })
            .catch(err => console.log(err.message));
            this.setState({ loading: false });
    }
 
    render() {

        let { tramite, loading } = this.state;

        return (
            <Modal
                show={true}
                md="6"
                {...this.props}
                titulo={<span>Información del Documento</span>}
                classClose="text-white opacity-1"
            >
                <Form className="card-body" loading={loading}>
                    <div className="pl-4 mt-4 pr-4">
                        <div className="card">
                            <Tab panes={[
                                { menuItem: 'Información', render: () => <Tab.Pane><Documento tramite={tramite}/></Tab.Pane> },
                                { menuItem: 'Datos Remitente', render: () => <Tab.Pane><Remitente person={tramite.person}/></Tab.Pane> },
                                { menuItem: 'Archivos', render: () => <Tab.Pane><FileInfo files={tramite.files}/></Tab.Pane> }
                            ]}/>
                        </div>
                    </div>
                </Form>
            </Modal>
        );
    }

}