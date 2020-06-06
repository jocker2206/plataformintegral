import React, { Component } from 'react';
import { Body, BtnBack } from '../../../components/Utils';
import { backUrl, parseOptions } from '../../../services/utils';
import Router from 'next/router';
import { Form, Button, Select } from 'semantic-ui-react'
import { unujobs } from '../../../services/apis';
import Swal from 'sweetalert2';


export default class CreateCargo extends Component
{

    static getInitialProps = (ctx) => {
        let { pathname, query } = ctx;
        return { pathname, query };
    }

    state = {
        loading: false,
        planillas: [],
        type_cargos: [],
        form: {},
        errors: {}
    }

    componentDidMount = () => {
        this.getPlanillas();
        this.getTypeCargos();
    }

    handleInput = ({ name, value }, obj = 'form') => {
        this.setState((state, props) => {
            let newObj = Object.assign({}, state[obj]);
            newObj[name] = value;
            state.errors[name] = "";
            return { [obj]: newObj, errors: state.errors };
        });
    }

    getPlanillas = async () => {
        this.setState({ loading: true });
        await unujobs.get('planilla')
        .then(res => this.setState({ planillas: res.data }))
        .catch(err => console.log(err.message));
        this.setState({ loading: false });
    }

    getTypeCargos = async () => {
        this.setState({ loading: true });
        await unujobs.get('type_cargo')
        .then(res => this.setState({ type_cargos: res.data }))
        .catch(err => console.log(err.message));
        this.setState({ loading: false });
    }

    save = async () => {
        this.setState({ loading: true });
        await unujobs.post('cargo', this.state.form)
        .then(async res => {
            let { success, message } = res.data;
            let icon = success ? 'success' : 'error';
            await Swal.fire({ icon, text: message });
            if (success) this.setState({ form: {}, errors: {} });
        })
        .catch(async err => {
            try {
                let { data } = err.response
                let { message, errors } = data;
                this.setState({ errors });
            } catch (error) {
                await Swal.fire({ icon: 'error', text: 'Algo salió mal' });
            }
        });
        this.setState({ loading: false });
    }

    render() {

        let { pathname, query } = this.props;
        let { form, errors } = this.state;

        return (
            <div className="col-md-12">
                <Body>
                    <div className="card-header">
                        <BtnBack onClick={(e) => Router.push(backUrl(pathname))}/> Crear Partición Presupuestal
                    </div>
                    <div className="card-body">
                        <Form className="row justify-content-center">
                            <div className="col-md-10">
                                <div className="row justify-content-end">
                                    <div className="col-md-4 mb-3">
                                        <Form.Field error={errors && errors.alias && errors.alias[0]}>
                                            <label htmlFor="">Alias <b className="text-red">*</b></label>
                                            <input type="text" 
                                                name="alias"
                                                placeholder="Ingrese un alias"
                                                value={form.alias}
                                                onChange={(e) => this.handleInput(e.target)}
                                            />
                                            <label>{errors && errors.alias && errors.alias[0]}</label>
                                        </Form.Field>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <Form.Field  error={errors && errors.descripcion && errors.descripcion[0]}>
                                            <label htmlFor="">Descripción <b className="text-red">*</b></label>
                                            <input type="text"
                                                name="descripcion"
                                                placeholder="Ingrese una descripción, similar al alias"
                                                onChange={(e) => this.handleInput(e.target)}
                                            />
                                            <label>{errors && errors.descripcion && errors.descripcion[0]}</label>
                                        </Form.Field>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <Form.Field  error={errors && errors.ext_pptto && errors.ext_pptto[0]}>
                                            <label htmlFor="">Exp Presupuestal <b className="text-red">*</b></label>
                                            <input type="text"
                                                placeholder="Ingrese una extensión presupuestal"
                                                name="ext_pptto"
                                                onChange={(e) => this.handleInput(e.target)}
                                            />
                                            <label>{errors && errors.ext_pptto && errors.ext_pptto[0]}</label>
                                        </Form.Field>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <Form.Field error={errors && errors.planilla_id && errors.planilla_id[0]}>
                                            <label htmlFor="">Planilla <b className="text-red">*</b></label>
                                            <Select
                                                placeholder="Select. Planilla"
                                                options={parseOptions(this.state.planillas, ["sel-pla", "", "Select. Planilla"], ["id", "id", "nombre"])}
                                                name="planilla_id"
                                                value={form.planilla_id}
                                                onChange={(e, obj) => this.handleInput(obj)}
                                            />
                                            <label>{errors && errors.planilla_id && errors.planilla_id[0]}</label>
                                        </Form.Field>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <Form.Field error={errors && errors.type_cargo_id && errors.type_cargo_id[0]}>
                                            <label htmlFor="">Tip. Cargo <b className="text-red">*</b></label>
                                            <Select
                                                placeholder="Select. Descuento"
                                                options={parseOptions(this.state.type_cargos, ["sel-pla", "", "Select. Tip. Cargo"], ["id", "id", "nombre"])}
                                                value={form.type_cargo_id}
                                                name="type_cargo_id"
                                                onChange={(e, obj) => this.handleInput(obj)}
                                            />
                                            <label>{errors && errors.type_cargo_id && errors.type_cargo_id[0]}</label>
                                        </Form.Field>
                                    </div>

                                    <div className="col-md-12">
                                        <hr/>
                                    </div>

                                    <div className="col-md-2">
                                        <Button color="teal" fluid
                                            loading={this.state.loading}
                                            onClick={this.save}
                                        >
                                            <i className="fas fa-save"></i> Guardar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </Body>
            </div>
        )
    }
    
}