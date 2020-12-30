import React, { Component } from 'react';
import { Form, Select, Button, Icon, Divider } from 'semantic-ui-react';
import Show from '../../../components/show';
import { unujobs } from '../../../services/apis';
import { parseOptions, Confirm } from '../../../services/utils';
import Swal from 'sweetalert2';
import Router from 'next/router';
import { AUTHENTICATE } from '../../../services/auth';
import { Body, BtnBack } from '../../../components/Utils';
import { SelectPlanilla } from '../../../components/select/cronograma';

export default class RegisterCronograma extends Component
{

    static getInitialProps = async (ctx) => {
        await AUTHENTICATE(ctx);
        let { query, pathname } = ctx; 
        return { pathname, query };
    };

    state = {
        loading: false,
        planillas: [],
        planilla_id: "",
        year: 2020,
        mes: 6,
        dias: 30,
        observacion: "",
        adicional: 0,
        remanente: 0,
        copy_detalle: 0,
        errors: {},
        type_id: 0,
        types: [
            { key: "tipo-0", value: 0, text: "Planilla nueva" },
            { key: "tipo-1", value: 1, text: "Copiar del mes anterior"}
        ]
    }

    componentDidMount = async () => {
        this.props.fireLoading(true);
        this.props.fireEntity({ render: true });
        let newDate = new Date();
        this.setState({
            year: newDate.getFullYear(),
            mes: newDate.getMonth() + 1
        });
        this.props.fireLoading(false);
    }

    handleInput = ({ name, value }) => {
        this.setState({[name]: value});
    }

    readySend = () => {
        let { planilla_id, year, mes, dias } = this.state;
        return planilla_id && year && mes && dias;
    }

    saveAndContinue = async () => {
        let answer = await Confirm("warning", `¿Estás seguro en crear el cronograma?`, 'Crear')
        if (answer) {
            this.props.fireLoading(true);
            // send
            await unujobs.post('cronograma', this.state)
            .then(async res => {
                this.props.fireLoading(false);
                let { success, message } = res.data;
                if (!success) throw new Error(message);
                await Swal.fire({ icon: 'success', text: message });
            })
            .catch(err => {
                try {
                    let { data } = err.response;
                    Swal.fire({ icon: 'warning', text: 'Datos incorrectos!' });
                    this.setState({ errors: data });
                } catch (error) {
                    Swal.fire({ icon: 'error', text: err.message });
                }
            });
            this.props.fireLoading(false);
        }
    }

    handleClose = () => {
        let { push, pathname } = Router;
        let newPath = pathname.split('/');
        newPath.splice(-1, 1);
        push({  pathname: newPath.join('/') });
    }

    handleBack = async () => {
        let { pathname } = Router;
        let newBack = pathname.split('/');
        newBack.splice(-1, 1);
        Router.push({ pathname: newBack.join('/') });
    }

    render() {

        return (
            <div className="col-md-12">
                <Body>                    
                    <div className="card- mt-3">
                        <div className="card-header">
                        <BtnBack
                            onClick={this.handleBack}
                        /> Registrar Nuevo Cronograma
                        </div>
                        <div className="card-body">
                            <div className="row justify-content-center">
                                <Form loading={this.state.loading} action="#" className="col-md-10" onSubmit={(e) => e.preventDefault()}>
                                    <div className="row justify-content-center">
                                            <Form.Field className="col-md-6">
                                                <label htmlFor="" className="text-left">Planilla</label>
                                                <SelectPlanilla
                                                    name="planilla_id"
                                                    value={this.state.planilla_id}
                                                    onChange={(e, obj) => this.handleInput(obj)}
                                                />
                                            </Form.Field>

                                            <Form.Field className="col-md-6">
                                                <Form.Input
                                                    className="text-left"
                                                    error={null}
                                                    fluid
                                                    label="Año"
                                                    name="year"
                                                    type="number"
                                                    value={this.state.year}  
                                                    onChange={(e, obj) => this.handleInput(obj)}
                                                    placeholder='Ingrese el año'
                                                    disabled
                                                />
                                            </Form.Field>

                                            <Form.Field className="col-md-6">
                                                <Form.Input
                                                    className="text-left"
                                                    error={null}
                                                    type="number"
                                                    fluid
                                                    label="Mes"
                                                    name="mes"
                                                    value={this.state.mes}  
                                                    onChange={(e, obj) => this.handleInput(obj)}
                                                    placeholder='Ingrese el mes'
                                                />
                                            </Form.Field>

                                            <Form.Field className="col-md-6">
                                                <Form.Input
                                                    className="text-left"
                                                    error={null}
                                                    type="number"
                                                    fluid
                                                    label="Dias"
                                                    name="dias"
                                                    value={this.state.dias}  
                                                    onChange={(e, obj) => this.handleInput(obj)}
                                                    placeholder='Ingrese los dias'
                                                    disabled={!this.state.adicional}
                                                />
                                            </Form.Field>

                                        <Show condicion={this.state.adicional == 0}>
                                            <Form.Field className="text-left col-md-6">
                                                <label htmlFor="">Modo de creación</label>
                                                <Select
                                                    options={this.state.types}
                                                    value={this.state.type_id}
                                                    name="type_id"
                                                    fluid
                                                    onChange={(e, obj) => this.handleInput(obj)}
                                                />
                                            </Form.Field>
                                        </Show>

                                        <Show condicion={this.state.adicional == 0 && this.state.type_id == 1}>
                                            <Form.Field className="text-left col-md-6">
                                                <label htmlFor="">Copiar Detallado</label>
                                                <Select
                                                    options={[
                                                        {key: "copy_detallado_si", value: 1, text: "Si"},
                                                        {key: "copy_detallado_no", value: 0, text: "No"}
                                                    ]}
                                                    value={this.state.copy_detalle}
                                                    name="copy_detalle"
                                                    fluid
                                                    onChange={(e, obj) => this.handleInput(obj)}
                                                />
                                            </Form.Field>
                                            
                                            <div className="col-md-6"></div>
                                        </Show>

                                        <Form.Field className="col-md-6">
                                            <label htmlFor="">¿Es una planilla adicional?</label>
                                            <Select
                                                name="adicional"
                                                value={this.state.adicional}
                                                placeholder="Select. Planilla Adicional"
                                                options={[
                                                    {key: "si", value: 1, text: "Si"},
                                                    {key: "no", value: 0, text: "No"}
                                                ]}
                                                onChange={(e, obj) => this.handleInput(obj)}
                                            />
                                        </Form.Field>

                                        <Show condicion={this.state.adicional == 1}>
                                            <Form.Field className="col-md-6">
                                                <label htmlFor="">¿Es una planilla remanente?</label>
                                                <Select
                                                    name="remanente"
                                                    value={this.state.remanente}
                                                    placeholder="Select. Planilla Remanente"
                                                    onChange={(e, obj) => this.handleInput(obj)}
                                                    options={[
                                                        {key: "si", value: 1, text: "Si"},
                                                        {key: "no", value: 0, text: "No"}
                                                    ]}
                                                />
                                            </Form.Field>

                                            <div className="col-md-6"></div>
                                        </Show>
                                    
                                        <Form.Field className="col-md-12">
                                            <label htmlFor="" className="text-left">Observación</label>
                                            <textarea name="observacion"
                                                rows="6"
                                                value={this.state.observacion}
                                                placeholder="Ingrese una observación para el cronograma"
                                                onChange={({ target }) => this.handleInput(target)}
                                            />
                                        </Form.Field>

                                        <Divider/>

                                
                                        <div className="col-md-12 text-right">
                                            <Button color="teal"
                                                disabled={!this.readySend() || this.state.loading}
                                                onClick={this.saveAndContinue}
                                                loading={this.state.loading}
                                            >
                                                <Icon name="save"/> Guardar y Continuar
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </Body>
            </div>
        )
    }

}