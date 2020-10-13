import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { GUEST } from '../services/auth';
import { authentication } from '../services/apis';
import Cookies from 'js-cookie';
import { BtnFloat } from '../components/Utils';
import Show from '../components/show';
import { connect } from 'react-redux';
import initStore from '../storage/store';
import { app } from '../env.json';
import Link from 'next/link';
import DownloadApps from '../components/downloadApps';


class Login extends Component
{

    static getInitialProps = async (ctx) => {
        let { query, pathname } = ctx;
        // verificar guest
        await GUEST(ctx)
        // response
        return { query, pathname };
    }

    state = {
        email: "",
        password: "",
        loading: true,
        errors: {},
        progress: 0,
        remember: null,
        show_app: false
    };

    componentDidMount = () => {
        this.setState({ loading: false });
        this.setting();
    }

    componentWillReceiveProps(nextProps) {
        this.setting();
    }

    setting = () => {
        let cache = Cookies.getJSON('old_user');
        this.setState({ remember: cache });
    }

    handleInput = (e) => {
        let { name, value } = e.target;
        this.setState({ [name]: value });
    }   


    handleSubmit = async (e) => {
        this.setState({ loading: true });
        let payload = { 
            email: this.state.email, 
            password: this.state.password
        };
        await authentication.post('login', payload)
        .then(async res => {
            let { success, message, token } = res.data;
            if (!success) throw new Error(message); 
            await Cookies.set('auth_token', token);
            localStorage.setItem('auth_token', token);
            history.go('/');
        })
        .catch(err => Swal.fire({icon: 'error', text: err.message}));
        this.setState({ loading: false });
    }


    render() {

        let { errors, email, password, loading, remember } = this.state;
        let { my_app } = this.props;

        return (
            <div className="auth" style={{ minHeight: "100vh" }}>

                <header
                    id="auth-header"
                    className={`auth-header bg-${app.theme}`}
                    style={{ paddingTop: "3em", backgroundImage: `url(${my_app.cover && my_app.cover || '/img/fondo.jpg'})` }}
                >

                    <a href={my_app && my_app.support}>
                        <img src={my_app && my_app.icon_images && my_app.icon_images.icon_200x200}
                            alt={my_app.name || "Integración"}
                            style={{ width: "120px", borderRadius: "0.5em", padding: '0.5em', background: '#fff' }}
                        />
                    </a>
                    
                    <h4 style={{ textShadow: "1px 1px #346cb0" }}>{my_app.name || "Integración"}</h4>

                    <h1>
                        <span className="sr-only">Iniciar Sesión</span>
                    </h1>
                    <p>
                        {" "}
                    </p>
                </header>

                <form
                    className="auth-form"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="form-group">
                        <div className="form-label-group">
                        <input
                            type="text"
                            id="inputUser"
                            className={`form-control`}
                            placeholder="Correo Electrónico"
                            name="email"
                            onChange={this.handleInput}
                            value={email}
                            disabled={loading}
                        />{" "}
                            <label htmlFor="inputUser">Correo</label>
                        </div>
                        <b className="text-danger">{errors.email && errors.email[0]}</b>
                    </div>

                    <div className="form-group">
                        <div className="form-label-group">
                        <input
                            type="password"
                            id="inputPassword"
                            className={`form-control`}
                            placeholder="Contraseña"
                            name="password"
                            onChange={this.handleInput}
                            value={password}
                            disabled={loading || !email}
                        />{" "}
                            <label htmlFor="inputPassword">Contraseña</label>
                        </div>
                        <b className="text-danger">{errors.password && errors.password[0]}</b>
                    </div>

                    <div className="form-group">
                        <button
                            disabled={loading || !password || !email}
                            className={`btn btn-lg btn-primary btn-block btn-${app.theme}`}
                            onClick={this.handleSubmit}
                        >
                            {loading ? "Verificando...." : "Iniciar Sesión"}
                            <i className="icon-circle-right2 ml-2"></i>
                        </button>
                    </div>

                    <div className="text-center pt-0">
                        <Link href="/recovery_password">
                            <a className="link">
                                Recuperar cuenta
                            </a>
                        </Link>

                        <br/>
                        <br/>

                        <a className="link" style={{ cursor: 'pointer' }} onClick={(e) => {
                            e.preventDefault();
                            this.setState({ show_app: true })
                        }}>
                            <i className="fa fa-box mr-1"></i> Más apps
                        </a>
                    </div>
                </form>

                <footer className="auth-footer text-center">
                    {" "}
                    © 2019 - {new Date().getFullYear()} {app.name} | Todos Los Derechos Reservados <a href="#">Privacidad</a> y
                    <a href="#">Terminos</a>
                </footer>

                <Show condicion={this.state.remember}>
                    <BtnFloat theme="btn-secundary" disabled={loading}>
                        <img src={remember && remember.person && remember.person.image ? `${authentication.path}/${remember.person.image}` : '/img/perfil.jpg'} 
                            alt={remember && remember.username}
                            style={{ "position": "absolute", top: "0px", left: "0px", width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </BtnFloat>
                </Show>

                <Show condicion={this.state.show_app}>
                    <DownloadApps isClose={(e) => this.setState({ show_app: false })}/>
                </Show>
            </div>
        )
    }

}


export default connect(initStore)(Login);