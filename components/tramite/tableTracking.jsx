import React, { Component } from 'react';
import Datatable from '../../components/datatable';
import Router from 'next/router';
import { Form, Button, Select, Checkbox, Pagination } from 'semantic-ui-react';
import Show from '../../components/show';
import { Body, Cardinfo, SimpleList } from '../../components/Utils';
import { authentication } from '../../services/apis';
import Swal from 'sweetalert2';
import ModalTracking from '../../components/tramite/modalTracking';
import ModalNextTracking from '../../components/tramite/modalNextTracking';
import ModalSend from '../../components/tramite/modalSend';
import ModalInfo from '../../components/tramite/modalInfo';


export default class TableTracking extends Component {

    state = {
        block: false,
        send: true,
        my_dependencias: [],
        option: {
            key: "",
            tracking: {}
        },
        form: {
            dependencia_id: "",
            status: "",
            query_search: ""
        }
    }

    componentDidMount = async () => {
        this.props.fireEntity({ render: true });
        this.props.fireLoading(true);
        await this.getMyDependencias(this.props.entity_id, 1, false);
        this.setting(this.props);
        this.props.fireLoading(false);
    }

    componentWillReceiveProps = (nextProps) => {
        let { entity_id } = this.props;
        if (entity_id != nextProps.entity_id) this.getMyDependencias(nextProps.entity_id, 1, false);
    }

    findDependenciaDefault = async (my_dependencias) => {
        let { query } = this.props;
        if (!query.dependencia_id) {
            if (my_dependencias.length) {
                let dep = my_dependencias[0];
                await this.handleInput({ name: 'dependencia_id', value: dep.value });
                await this.handleSearch();
            }
        }
        // habilitar send
        this.setState({ send: true });  
    }

    getMyDependencias = async (id, page = 1, up = true) => {
        if (id) {
            await authentication.get(`auth/dependencia/${id}?page=${page}`)
            .then(async res => {
                let { success, message, dependencia } = res.data;
                if (!success) throw new Error(message);
                let { lastPage, data } = dependencia;
                let newData = [];
                // add data
                await data.map(async d => await newData.push({
                    key: `my_dependencia-${d.id}`,
                    value: `${d.id}`,
                    text: `${d.nombre}`
                }));
                // setting data
                await this.setState(state => ({
                    my_dependencias: up ? [...state.my_dependencias, ...newData] : newData
                }));
                // obtener la primara dependencia
                let { my_dependencias } = this.state;
                this.findDependenciaDefault(my_dependencias);
                // validar request
                if (lastPage >= page + 1) await this.getMyDependencias(page + 1);
            })
            .catch(err => console.log(err.message));
        } else {
            this.setState({ my_dependencias: [] });
            this.handleInput({ name: 'dependencia_id', value: "" })
        }
    }

    setting = () => {
        this.setState((state, props) => {
            state.form.dependencia_id = props.query && props.query.dependencia_id || "";
            state.form.status = props.query && props.query.status || "PENDIENTE";
            state.form.query_search = props.query && props.query.query_search || "";
            return { form: state.form };
        })
    }

    handleInput = ({ name, value }) => {
        this.setState(state => {
            state.form[name] = value;
            return { form: state.form }
        });
    }

    handleSearch = () => {
        let { push, pathname, query } = Router;
        let { status, dependencia_id, query_search } = this.state.form;
        // validar send
        if (query.dependencia_id != dependencia_id) this.setState({ send: true });
        query.status = status;
        query.dependencia_id = dependencia_id;
        query.query_search = query_search || "";
        push({ pathname, query });
        // fireSearch
        if (typeof this.props.onSearch == 'function') this.props.onSearch(dependencia_id);
    }

    getOption = (obj, key, index) => {
        this.setState(state => {
            state.option.key = key;
            state.option.tracking = obj;
            return { option: state.option };
        });
    }

    handleStatus = async (status) => {
        await this.handleInput({ name: "status", value: status });
        await this.handleSearch();
    }

    render() {

        let { pathname, tracking, titulo, status_count, query } = this.props;
        let { form, my_dependencias, option, send } = this.state;

        return (
            <div className="col-md-12">
                <Body>
                    <Datatable titulo={titulo}
                        isFilter={false}
                        headers={ ["N° Seguimiento", "Tip. Trámite", "Asunto", "origen", "Fecha", "Estado"]}
                        index={
                            [
                                {
                                    key: "slug",
                                    type: "icon",
                                    bg: 'dark'
                                }, 
                                {
                                    key: "description",
                                    type: "text"
                                }, 
                                {
                                    key: 'asunto',
                                    type: 'text'
                                },
                                {
                                    key: "dependencia_origen.nombre",
                                    type: "icon",
                                    bg: "dark"
                                },
                                {
                                    key: "updated_at",
                                    type: "date"
                                },
                                {
                                    key: "status",
                                    type: "option",
                                    data: [
                                        { key: "REGISTRADO", className: 'badge-dark' },
                                        { key: "PENDIENTE", className: 'badge-orange' },
                                        { key: "DERIVADO", className: "badge-purple" },
                                        { key: "ACEPTADO", className: "badge-primary" },
                                        { key: "RECHAZADO", className: "badge-danger" },
                                        { key: "FINALIZADO", className: "badge-dark" },
                                        { key: "ANULADO", className: "badge-red" },
                                        { key: "COPIA", className: "badge-dark" }
                                    ]
                                }
                            ]
                        }
                        options={
                            [
                                {
                                    key: "TRACKING",
                                    icon: "fas fa-search",
                                    title: "Seguimiento del Tramite"
                                }, 
                                {
                                    key: "INFO",
                                    icon: "fas fa-info",
                                    title: "Más información"
                                },
                                {
                                    key: "NEXT",
                                    icon: "fas fa-arrow-right",
                                    title: "Continuar Trámite",
                                    rules: {
                                        key: "status",
                                        value: "REGISTRADO"
                                    }
                                },
                                {
                                    key: "NEXT",
                                    icon: "fas fa-arrow-right",
                                    title: "Continuar Trámite",
                                    rules: {
                                        key: "status",
                                        value: "PENDIENTE"
                                    }
                                }
                            ]
                        }
                        getOption={this.getOption}
                        data={tracking && tracking.data || []}>

                        <div className="mt-3 mb-4">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="list-group list-group-bordered">
                                        <SimpleList 
                                            icon="fas fa-table" 
                                            bg="dark" 
                                            title="Regístrados" 
                                            count={status_count && status_count.data && status_count.data.REGISTRADO}
                                            onClick={(e) => this.handleStatus("REGISTRADO")}
                                            active={form.status == 'REGISTRADO'}
                                        />

                                        <SimpleList 
                                            icon="fas fa-hourglass-start" 
                                            bg="orange" 
                                            title="Pendientes" 
                                            count={status_count && status_count.data && status_count.data.PENDIENTE}
                                            onClick={(e) => this.handleStatus("PENDIENTE")}
                                            active={form.status == 'PENDIENTE'}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="list-group list-group-bordered">
                                        <SimpleList 
                                            icon="fas fa-share" 
                                            bg="purple" 
                                            title="Derivados" 
                                            count={status_count && status_count.data && status_count.data.DERIVADO}
                                            onClick={(e) => this.handleStatus("DERIVADO")}
                                            active={form.status == 'DERIVADO'}
                                        />

                                        <SimpleList 
                                            icon="fas fa-bell" 
                                            bg="warning" 
                                            title="Entradas" 
                                            count={status_count && status_count.data && status_count.data.ENVIADO}
                                            onClick={(e) => this.getOption({}, 'ENVIADO', 0)}
                                            active={option.key == 'ENVIADO'}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="list-group list-group-bordered">
                                        <SimpleList 
                                            icon="fas fa-clipboard-list" 
                                            bgIcon="secundary" 
                                            bg="primary" 
                                            title="Aceptados" 
                                            count={status_count && status_count.data && status_count.data.ACEPTADO}
                                            onClick={(e) => this.handleStatus("ACEPTADO")}
                                            active={form.status == 'ACEPTADO'}
                                        />

                                        <SimpleList 
                                            icon="fas fa-exclamation" 
                                            bgIcon="secundary"
                                            bg="danger" 
                                            title="Rechazados" 
                                            count={status_count && status_count.data && status_count.data.RECHAZADO}
                                            onClick={(e) => this.handleStatus("RECHAZADO")}
                                            active={form.status == 'RECHAZADO'}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="list-group list-group-bordered">
                                        <SimpleList 
                                            icon="fas fa-clipboard-list" 
                                            title="Finalizados" 
                                            count={status_count && status_count.data && status_count.data.FINALIZADO}
                                            onClick={(e) => this.handleStatus("FINALIZADO")}
                                            active={form.status == 'FINALIZADO'}
                                        />

                                        <SimpleList 
                                            icon="fas fa-times" 
                                            bg="red" 
                                            title="Anulados" 
                                            count={status_count && status_count.data && status_count.data.ANULADO}
                                            onClick={(e) => this.handleStatus("ANULADO")}
                                            active={form.status == 'ANULADO'}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12">
                                <hr/>
                            </div>
                        </div>

                        <Form className="mb-3">
                            <div className="row">
                                <div className="col-md-4 mb-1 col-12 col-sm-5 col-xl-3">
                                    <Form.Field>
                                        <input
                                            placeholder="Ingres el código del trámite" 
                                            name="query_search"
                                            value={`${form.query_search}` || ""}
                                            disabled={this.props.isLoading}
                                            onChange={(e) => this.handleInput(e.target)}
                                        />
                                    </Form.Field>
                                </div>
                                <div className="col-md-5 mb-1 col-12 col-sm-6 col-xl-4">
                                    <Form.Field>
                                        <Select
                                            options={my_dependencias}
                                            placeholder="Select. Dependencia" 
                                            name="dependencia_id"
                                            value={`${form.dependencia_id}` || ""}
                                            disabled={this.props.isLoading}
                                            onChange={async (e, obj) => {
                                                await this.handleInput(obj)
                                                await this.handleSearch()
                                            }}
                                        />
                                    </Form.Field>
                                </div>
                                <div className="col-md-4 mb-1 col-12 col-sm-6 col-xl-2">
                                    <Form.Field>
                                        <Checkbox 
                                            className="mt-2" 
                                            label='Copia'
                                            toggle
                                            name="status"
                                            checked={form.status == 'COPIA'}
                                            onChange={async (e, obj) => {
                                                await this.handleInput({ name: obj.name, value: obj.checked ? 'COPIA' : 'PENDIENTE' });
                                                await this.handleSearch();
                                            }}
                                        />
                                    </Form.Field>
                                </div>
                                <div className="col-md-3 col-12 col-sm-12 col-xl-2 mb-1">
                                    <Button 
                                        fluid
                                        onClick={this.handleSearch}
                                        disabled={this.props.isLoading}
                                        color="blue"
                                    >
                                        <i className="fas fa-search mr-1"></i>
                                        <span>Buscar</span>
                                    </Button>
                                </div>
                            </div>
                            <hr/>
                        </Form>
                    </Datatable>
                    
                    <div className="table-response">
                        <hr/>
                        <div className="text-center">
                            <Pagination defaultActivePage={query.page || 1} 
                                totalPages={tracking && tracking.lastPage || 1}
                                enabled={this.state.loading}
                                activePage={query.page || 1}
                                onPageChange={this.handlePage}
                            />
                        </div>
                    </div>
                                            
                </Body>
                {/* options tracking */}
                <Show condicion={option.key == 'TRACKING'}>
                    <ModalTracking tramite={option.tracking}
                        isClose={(e) => this.getOption({}, "")}
                    />
                </Show>
                {/* tramites enviados */}
                <Show condicion={(send && status_count.data && status_count.data.ENVIADO) || option.key == 'ENVIADO'}>
                    <ModalSend onAction={this.getOption} {...this.props} isClose={async (e) => {
                        this.setState({ send: false });
                        this.getOption({}, '', 0);
                        await this.handleInput({ name:'status', value: 'PENDIENTE' });
                        await this.handleSearch();
                    }}/>
                </Show>
                {/* options next */}
                <Show condicion={option.key == 'NEXT'}>
                    <ModalNextTracking tramite={option.tracking}
                        isClose={async (e) => {
                            this.getOption({}, "")
                            await this.handleSearch();
                        }}
                        entity_id={this.props.entity_id || ""}
                    />
                </Show>
                {/* options info */}
                <Show condicion={option.key == 'INFO'}>
                    <ModalInfo tracking={option.tracking}
                        isClose={(e) => this.getOption({}, "")}
                    />
                </Show>
            </div>
        )
    }

}
