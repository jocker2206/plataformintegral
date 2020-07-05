import React, { Component } from 'react';
import { Body, BtnBack } from '../../../components/Utils';
import { backUrl, parseOptions } from '../../../services/utils';
import Router from 'next/router';
import { Form, Button, Select } from 'semantic-ui-react'
import { unujobs } from '../../../services/apis';
import Show from '../../../components/show';
import Swal from 'sweetalert2';
import { AUTHENTICATE } from '../../../services/auth';


export default class CreateAfp extends Component
{

    static getInitialProps = async (ctx) => {
        await AUTHENTICATE(ctx);
        let { pathname, query } = ctx;
        return { pathname, query };
    }

    state = {
        ley: {},
        type_descuentos: [],
        block: false,
        loading: false,
        errors: {},
        form: { 
            private: 0
        }
    }

    componentDidMount = async () => {
        this.getTypeDescuentos();
    }

    getTypeDescuentos = async (page = 1) => {
        this.setState({ block: true });
        await unujobs.get(`type_descuento?page=${page}`)
        .then(async res => {
            let { data, current_page, last_page } = res.data;
            await this.setState(state => {
                return { type_descuentos: [...state.type_descuentos, ...data] }
            });
            // validar si continua
            if (current_page + 1 <= last_page) await this.getTypeDescuentos(current_page + 1);
        })
        .catch(err => console.log(err.message));
        this.setState({ block: false });
    }

    handleInput = ({ name, value }) => {
        this.setState(state => {
            state.form[name] = value;
            return { form: state.form };
        });
    }

    save = async () => {
        this.setState({ loading: true });
        let { form } = this.state;
        await unujobs.post('afp', form)
        .then(async res => {
            let { success, message } = res.data;
            if (!success) throw new Error(message);
            Swal.fire({ icon: 'success', text: message });
            await this.setState({ errors: {}, form: { private: 0 }, ley: {} });
        }).catch(err => {
            try {
                let response = err.response.data;
                Swal.fire({ icon: 'warning', text: response.message });
                this.setState({ errors: response.errors });
            } catch (error) {
                Swal.fire({ icon: 'error', text: err.message });
            }
        });
        this.setState({ loading: false });
    }

    render() {

        let { pathname, query } = this.props;
        let { form, ley, block, type_descuentos, loading, errors } = this.state;
        let validate = Object.keys(ley).length;

        return (
            <div className="col-md-12">
                <Body>
                    <div className="card-header">
                        <BtnBack onClick={(e) => Router.push(backUrl(pathname))}/> Crear Ley Social
                    </div>
                    <div className="card-body">
                        <Form className="row justify-content-center">
                            <div className="col-md-10 mb-4 mt-4">
                                <Button disabled={loading}>
                                    <i className="fas fa-plus"></i> {validate ? 'Cambiar Ley Social' : 'Asignar Ley Social'}
                                </Button>
                            </div>

                            <div className="col-md-10">
                                <hr/>
                            </div>

                            <div className="col-md-10">
                                <div className="row justify-content-end">
                                    <div className="col-md-4 mb-3">
                                        <Form.Field error={errors.afp_id && errors.afp_id[0] || false}>
                                            <label htmlFor="">ID-MANUAL</label>
                                            <input type="number"
                                                name="afp_id"
                                                value={form.afp_id || ""}
                                                placeholder="Ingrese un identificador para la Ley Social"
                                                onChange={(e) => this.handleInput(e.target)}
                                                disabled={loading}
                                            />
                                            <label>{errors.afp_id && errors.afp_id[0]}</label>
                                        </Form.Field>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <Form.Field error={errors.afp && errors.afp[0] || false}>
                                            <label htmlFor="">Descripción</label>
                                            <input type="text"
                                                name="afp"
                                                value={form.afp || ""}
                                                placeholder="Ingrese una descripción de la Ley Social"
                                                onChange={(e) => this.handleInput(e.target)}
                                                disabled={loading}
                                            />
                                            <label>{errors.afp && errors.afp[0]}</label>
                                        </Form.Field>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <Form.Field error={errors.type_afp_id && errors.type_afp_id[0] || false}>
                                            <label htmlFor="">ID-TIPO-MANUAL</label>
                                            <input type="number"
                                                name="type_afp_id"
                                                value={form.type_afp_id || ""}
                                                placeholder="Ingrese un identificador para el Tipo de Ley Social"
                                                onChange={(e) => this.handleInput(e.target)}
                                                disabled={loading}
                                            />
                                            <label>{errors.type_afp_id && errors.type_afp_id[0]}</label>
                                        </Form.Field>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <Form.Field error={errors.type_afp && errors.type_afp[0] || false}>
                                            <label htmlFor="">Tipo</label>
                                            <input type="text"
                                                name="type_afp"
                                                value={form.type_afp || ""}
                                                placeholder="Ingrese un descripción para el Tipo de Ley Social"
                                                onChange={(e) => this.handleInput(e.target)}
                                                disabled={loading}
                                            />
                                            <label>{errors.type_afp && errors.type_afp[0]}</label>
                                        </Form.Field>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <Form.Field error={errors.type_descuento_id && errors.type_descuento_id[0] || false}>
                                            <label htmlFor="">Tip. Descuento</label>
                                            <Select
                                                options={parseOptions(type_descuentos, ["select-type", "", "Seleccionar Tip. Descuento"], ["id", "id", "descripcion"])}
                                                placeholder="Seleccionar Tip. Descuento"
                                                name="type_descuento_id"
                                                value={form.type_descuento_id || ""}
                                                disabled={block || loading}
                                                onChange={(e, obj) => this.handleInput(obj)}
                                            />
                                            <label>{errors.type_descuento_id && errors.type_descuento_id[0]}</label>
                                        </Form.Field>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <Form.Field>
                                            <label htmlFor="">Porcentaje (%)</label>
                                            <input type="number"
                                                name="porcentaje"
                                                value={form.porcentaje || ""}
                                                placeholder="Ingrese el porcentaje"
                                                onChange={(e) => this.handleInput(e.target)}
                                                disabled={loading}
                                            />
                                        </Form.Field>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <Form.Field>
                                            <label htmlFor="">Modo</label>
                                            <Select
                                                placeholder="Select. Entidad"
                                                options={[
                                                    { key: "private", value: true, text: "Privado" },
                                                    { key: "no-private", value: false, text: "Público" }
                                                ]}
                                                onChange={(e, obj) => this.handleInput({ name: obj.name, value: obj.value ? 1 : 0 })}
                                                value={form.private ? true : false}
                                                name="private"
                                                disabled={loading}
                                            />
                                        </Form.Field>
                                    </div>

                                    <Show condicion={form.private}>
                                        <h5 className="col-md-12 mb-3">
                                            <hr/>
                                            <i className="fas fa-cogs"></i> Configuración Aporte Obligatorio
                                            <hr/>
                                        </h5>

                                        <div className="col-md-4 mb-3">
                                            <Form.Field>
                                                <label htmlFor="">Clave</label>
                                                <Select
                                                    options={parseOptions(type_descuentos, ["select-type-aporte", "", "Seleccionar clave"], ["id", "id", "key"])}
                                                    placeholder="Seleccionar Tip. Descuento"
                                                    name="aporte_descuento_id"
                                                    value={form.aporte_descuento_id || ""}
                                                    disabled={block || loading}
                                                    onChange={(e, obj) => this.handleInput(obj)}
                                                />
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <Form.Field>
                                                <label htmlFor="">Tip. Descuento</label>
                                                <Select
                                                    options={parseOptions(type_descuentos, ["select-type-aporte-desct", "", "Seleccionar Tip. Descuento"], ["id", "id", "descripcion"])}
                                                    placeholder="Seleccionar Tip. Descuento"
                                                    name="aporte_descuento_id"
                                                    value={form.aporte_descuento_id || ""}
                                                    disabled={block || loading}
                                                    onChange={(e, obj) => this.handleInput(obj)}
                                                />
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <Form.Field>
                                                <label htmlFor="">Aporte (%)</label>
                                                <input type="number"
                                                    name="aporte"
                                                    placeholder="Ingrese el Porcentaje"
                                                    value={form.aporte || ""}
                                                    onChange={(e) => this.handleInput(e.target)}
                                                    disabled={loading}
                                                />
                                            </Form.Field>
                                        </div>

                                        <h5 className="col-md-12 mb-3">
                                            <hr/>
                                            <i className="fas fa-cogs"></i> Configuración Prima Seguro
                                            <hr/>
                                        </h5>

                                        <div className="col-md-4 mb-3">
                                            <Form.Field>
                                                <label htmlFor="">Clave</label>
                                                <Select
                                                    options={parseOptions(type_descuentos, ["select-type-prim", "", "Seleccionar clave"], ["id", "id", "key"])}
                                                    placeholder="Seleccionar Tip. Descuento"
                                                    name="prima_descuento_id"
                                                    value={form.prima_descuento_id || ""}
                                                    disabled={block || loading}
                                                    onChange={(e, obj) => this.handleInput(obj)}
                                                />
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <Form.Field>
                                                <label htmlFor="">Tip. Descuento</label>
                                                <Select
                                                    options={parseOptions(type_descuentos, ["select-type-prima-desct", "", "Seleccionar Tip. Descuento"], ["id", "id", "descripcion"])}
                                                    placeholder="Seleccionar Tip. Descuento"
                                                    name="prima_descuento_id"
                                                    value={form.prima_descuento_id || ""}
                                                    disabled={block || loading}
                                                    onChange={(e, obj) => this.handleInput(obj)}
                                                />
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <Form.Field>
                                                <label htmlFor="">Prima (%)</label>
                                                <input type="number"
                                                    name="prima"
                                                    placeholder="Ingrese el Porcentaje"
                                                    value={form.prima || ""}
                                                    onChange={(e) => this.handleInput(e.target)}
                                                    disabled={loading}
                                                />
                                            </Form.Field>
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <Form.Field>
                                                <label htmlFor="">Prima Limite</label>
                                                <input type="number"
                                                    name="prima_limite"
                                                    placeholder="Ingrese el monto Limite de la Prima Seguro"
                                                    value={form.prima_limite || ""}
                                                    onChange={(e) => this.handleInput(e.target)}
                                                    disabled={loading}
                                                />
                                            </Form.Field>
                                        </div>
                                    </Show>

                                    <div className="col-md-12">
                                        <hr/>
                                    </div>

                                    <div className="col-md-2">
                                        <Button color="teal" fluid
                                            onClick={this.save}
                                            disabled={loading}
                                            loading={loading}
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