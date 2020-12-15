import React, { useContext, useState, useEffect } from 'react';
import { Button, Form, Select } from 'semantic-ui-react';
import Modal from '../modal'
import Show from '../show';
import { AppContext } from '../../contexts/AppContext';
import { ProjectContext } from '../../contexts/project-tracking/ProjectContext'
import { Confirm } from '../../services/utils';
import { projectTracking } from '../../services/apis';
import currencyFormatter from 'currency-formatter'
import Swal from 'sweetalert2';

const defaultPage = {
    objective: {
        page: 1,
        loading: false
    },
    team: {
        page: 1,
        loading: false
    },
    activity: {
        page: 1,
        loading: false
    },
    presupuesto: {
        page: 1,
        loading: false
    }
};

const AnualPlanTrabajo = ({ plan_trabajo, isClose = null }) => {

    // app
    const app_context = useContext(AppContext);

    // project
    const { project } = useContext(ProjectContext);

    // estados
    const [form, setForm] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [current_page, setCurrentPage] = useState(defaultPage);
    const [current_objective, setCurrentObjective] = useState([]);
    const [current_team, setCurrentTeam] = useState([]);

    // cambiar form
    const handleInput = ({ name, value }) => {
        let newForm = Object.assign({}, form);
        newForm[name] = value;
        setForm(newForm);
    }

    // obtener objectivos
    const getObjective = async (nextPage = 1, add = false) => {
        let payload = Object.assign({}, current_page);
        payload.objective.loading = true;
        setCurrentPage(payload);
        await projectTracking.get(`project/${project.id}/objective?page=${nextPage}`)
            .then(res => {
                let { success, message, objectives } = res.data;
                if (!success) throw new Error(message);
                setCurrentObjective(add ? [...current_objective, ...objectives.data] : objectives.data);
                if (objectives.lastPage >= nextPage + 1) payload.objective.page = nextPage + 1;
            }).catch(err => console.log(err.message));
        payload.objective.loading = false;
        setCurrentPage(payload);
    }

    // obtener team
    const getTeam = async (nextPage = 1, add = false) => {
        let payload = Object.assign({}, current_page);
        payload.team.loading = true;
        setCurrentPage(payload);
        await projectTracking.get(`project/${project.id}/team?page=${nextPage}`)
            .then(res => {
                let { success, message, teams } = res.data;
                if (!success) throw new Error(message);
                setCurrentTeam(add ? [...current_team, ...teams.data] : teams.data);
                if (teams.lastPage >= nextPage + 1) payload.team.page = nextPage + 1;
            }).catch(err => console.log(err.message));
        payload.team.loading = false;
        setCurrentPage(payload);
    }

    // cargar datos
    useEffect(() => {
        if (project.id) {
            getObjective();
            getTeam();
        }
    }, []);

    // cargar datos de objective
    useEffect(() => {
        if (project.id && current_page.objective.page > 1) getObjective();
    }, [current_page.objective.page]);

    // cargar datos de team
    useEffect(() => {
        if (project.id && current_page.team.page > 1) getTeam();
    }, [current_page.team.page]);

    // render
    return (
        <Modal
            show={true}
            titulo={<span><i className="fas fa-file-alt"></i> Plan de Trabajo Anual</span>}
            md="9"
            isClose={isClose}
        >  
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Titulo: </th>
                                <td>{project.title}</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th colSpan="2" className="text-center">Información General</th>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <table className="table table-bordered">
                                        <tr>
                                            <th width="25%">Resolución de aprobación del proyecto: </th>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <th>Objectivo general: </th>
                                            <td>{project.general_object}</td>
                                        </tr>
                                        <tr>
                                            <th>Objectivo específico: </th>
                                            <td>
                                                <ol type="1">
                                                    {current_objective.map((obj, indexO) => 
                                                        <li key={`objective-datos-${indexO}`}>{obj.title}</li>
                                                    )}
                                                </ol>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Duración del proyecto: </th>
                                            <td>{project.duration} meses</td>
                                        </tr>
                                        <tr>
                                            <th>Costo del proyecto: </th>
                                            <td>{currencyFormatter.format(project.monto, { code: 'PEN' })}</td>
                                        </tr>
                                        {current_team.map((t, indexT) => 
                                            <tr key={`list-team-porject-${project.id}-${indexT}`}>
                                                <th>{t.role}: </th>
                                                <td className="uppercase font-12">{t.person && t.person.fullname || ""}</td>
                                            </tr>    
                                        )}
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <th colSpan="2" className="text-center">Avances programados y logrados</th>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <ol type="1">
                                        <li>
                                            <div>Marco lógico</div>
                                            <div className="table-responsive">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </div>
                                        </li>
                                    </ol>
                                </td>
                            </tr>
                            <tr>
                                <th colSpan="2" className="text-center">Métodos para ejecutar las actividades</th>
                            </tr>
                            <tr>
                                <th colSpan="2" className="text-center">Cronograma mensual de actividades</th>
                            </tr>
                            <tr>
                                <th colSpan="2" className="text-center">Presupuesto</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    )
}

export default AnualPlanTrabajo;