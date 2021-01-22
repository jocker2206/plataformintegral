import React, { Fragment } from 'react';
import ItemFileCircle from './itemFileCircle';
import moment from 'moment';
import Show from './show';


const datos = {
    VERDE: 'badge badge-success',
    AMARILLO: 'badge badge-warning',
    ROJO: 'badge badge-danger'
};


const ItemTable = ({ current = true, 
    slug, 
    title, 
    files = [], 
    remitente, 
    lugar, 
    fecha, 
    day,
    semaforo,
    status, 
    statusClassName, 
    onClickItem = null, 
    onClickFile = null 
}) => {

    const handleClick = (onClick, ...args) => {
        if (typeof onClick == 'function') onClick(...args)
    }

    // obtener color del semaforo
    const getSemaforo = () => datos[semaforo] || {};

    // render
    return (
        <Fragment>
            <tr className={`table-select table-item ${current ? '' : 'disabled'}`}>
                <th width="10%" onClick={(e) => handleClick(onClickItem, e)}>
                    <span className="badge badge-dark font-13">
                        {slug || ""}
                    </span>
                </th>
                <td width="90%">
                    <table className="w-100 table table-borderless">
                        <tr>
                            <td>
                                <div className="text-ellipsis cursor-pointer" onClick={(e) => handleClick(onClickItem, e)}>
                                    <b>{title || ""}</b>
                                </div>
                            </td>
                            <th width="20%" onClick={(e) => handleClick(onClickItem, e)}>
                                <span className="capitalize">{remitente || ""}</span>
                            </th>
                            <th width="20%" onClick={(e) => handleClick(onClickItem, e)}>
                                <span className="capitalize">
                                    {lugar || ""}
                                </span>
                            </th>
                            <th width="15%" onClick={(e) => handleClick(onClickItem, e)}>
                                {fecha ? moment(fecha).format('DD/MM/YYYY hh:ss a') : ''}
                            </th>
                            <th width="5%" onClick={(e) => handleClick(onClickItem, e)}>
                                <span className={`uppercase badge ${statusClassName}`}>{status}</span>
                            </th>
                            <th width="5%" onClick={(e) => handleClick(onClickItem, e)}>
                                <span className={`uppercase badge ${getSemaforo()}`}>{day}</span>
                            </th>
                        </tr>
                        {/* mostrar archivos */}
                        <Show condicion={files && files.length}>
                            <tr>
                                <td colSpan="5">
                                    <div className="row">
                                        {files.map((f, indexF) => 
                                            <div className="col-xs" key={`item-tramite-${indexF}`}>
                                                <ItemFileCircle
                                                    id={f.id}
                                                    url={f.url}
                                                    is_observation={f.observation}
                                                    name={f.name}
                                                    extname={f.extname}
                                                    onClick={(e) => handleClick(onClickFile, e, f)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </Show>
                    </table>
                </td>
            </tr>
        </Fragment>
    );
}

// exportar
export default ItemTable;