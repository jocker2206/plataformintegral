import React, { useState } from 'react';
import Show from '../show';
import datos from './datos.json';
const current_status = datos.status;

const CardInfoTramite = ({ remitente, email, dependencia, status, image, revisado = 0 }) => {

    // obtener status
    const getStatus = () => current_status[status] || {};

    // render
    return (
        <div className="row">
            <Show condicion={image}>
                <div className="ml-4 col-xs mb-2">
                    <img 
                        style={{ 
                            width: "80px", height: "100px", 
                            objectFit: 'cover', 
                            border: "5px solid #fff", 
                            boxShadow: "0px 0px 1px 1px rgba(0,0,0,0.2) inset, 0px 0px 1px 1px rgba(0,0,0,0.1)",
                            borderRadius: '0.5em'
                        }}
                        src={image || "/img/perfil.jpg"} 
                        alt="persona"
                    />
                </div>
            </Show>
                                                        
            <div className="col-xs mb-2">
                <div className="ml-2">
                    <b className="font-15 lowercase">
                        <span className="capitalize">{remitente || ""}</span>
                    </b>
                    <div className="text-primary font-12 lowercase">
                        <u className="capitalize">{dependencia || ""}</u>
                    </div>
                    <div className="text-muted font-12">{email || ""}</div>
                    <Show condicion={status}>
                        <div>
                            <b title={getStatus().title} className={`badge ${getStatus().className}`}>
                                {getStatus().text}
                            </b>
                            <span className={`text-${revisado ? 'success' : 'danger'} ml-2`}>
                                <i className={`fas fa-${revisado ? 'check' : 'times'}`}></i>
                            </span>
                        </div>
                    </Show>
                </div>
            </div>
        </div>
    )
}

// exportar
export default CardInfoTramite;