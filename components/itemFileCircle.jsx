import React, { useState, useContext } from 'react';
import Router from 'next/router';
import { tramite } from '../services/apis';
import Show from './show';
import { AppContext } from '../contexts/AppContext';
import { Confirm } from '../services/utils';
import Swal from 'sweetalert2';
import axios from 'axios';
import PdfView from './pdfView';
import { PDFDocument } from 'pdf-lib';

const ItemFileCircle = ({ id, url, name, extname, is_observation = "", edit = false, hidden = [], onAction = null, onClick = null }) => {

    // add
    const app_context = useContext(AppContext);

    // estados
    const [pdf_url, setPdfUrl] = useState("");
    const [pdf_doc, setPdfDoc] = useState(undefined);
    const [pdf_blob, setPdfBlob] = useState(undefined);
    const [show_signed, setShowSigned] = useState(false);

    // eliminar archivo
    const deleteFile = async () => {
        let answer = await Confirm(`warning`, `¿Estás seguro en eliminar el archivo "${name}"?`);
        if (answer) {
            app_context.fireLoading(true);
            await tramite.post(`file/${id}/destroy`)
                .then(async res => {
                    app_context.fireLoading(false);
                    let { success, message } = res.data;
                    if (!success) throw new Error(message);
                    await Swal.fire({ icon: 'success', text: message });
                    if (typeof onAction == 'function') onAction('delete');
                }).catch(err => {
                    try {
                        app_context.fireLoading(false);
                        let { data } = err.response;
                        if (typeof data != 'object') throw new Error(err.message);
                        throw new Error(data.message);
                    } catch (error) {
                        Swal.fire({ icon: 'error', text: error.message });
                    }
                });
        }
    }

    // generar para pdf
    const generateVisorPDF = async (file, blob) => {
        let reader = new FileReader();
        await reader.readAsArrayBuffer(file);
        reader.onload = async () => {
            let url = await URL.createObjectURL(blob);
            let pdfDoc = await PDFDocument.load(reader.result);
            setPdfDoc(pdfDoc);
            setPdfBlob(file);
            setPdfUrl(url);
            setShowSigned(true);
        }
    }

    // generar firma al pdf
    const handleSignaturePDF = async () => {
        app_context.fireLoading(true);
        await axios.get(url, { responseType: 'blob' })
            .then(async res => {
                app_context.fireLoading(false);
                let blob = res.data;
                blob.lastModifiedDate = new Date();
                blob.name = name;
                let file = new File([blob], name);
                await generateVisorPDF(file, blob)
            }).catch(err => {
                app_context.fireLoading(false);
                Swal.fire({ icon: 'error', text: 'no se pudó obtener el archivo' })
                setShowSigned(false);
            });
    }

    // actualizar pdf firmado
    const signaturePDF = async (payload, blob) => {
        app_context.fireLoading(true);
        blob.lastModifiedDate = new Date();
        let file = new File([blob], name);
        let datos = new FormData();
        datos.append('file', file);
        await tramite.post(`file/${id}/update`, datos)
            .then(async res => {
                app_context.fireLoading(false);
                await Swal.fire({ icon: 'success', text: 'El archivo se firmó correctamente!' });
                if (typeof onAction == 'function') onAction('signature', file)
                await generateVisorPDF(file, blob);
            }).catch(err => {
                app_context.fireLoading(false);
                Swal.fire({ icon: 'error', text: 'No se pudo firmar el PDF' })
            });
    }

    // mostrar observación
    const showObservation = async () => Swal.fire({ icon: 'info', text: is_observation });

    // render
    return (
        <div style={{ position: 'relative', width: '100%' }} className={`${edit ? 'mb-3' : ''}`}>
            <a href={url || ""} 
                target="_blank" 
                className={`item-attach font-12 ${is_observation ? 'border-orange' : ''}`}
                title={name || ""}
                onClick={(e) => typeof onClick == 'function' ? onClick(e) : null}
            >
                <i className={`fas fa-file-${extname}`}></i> {name || ""} 
            </a>

            <Show condicion={edit}>
                <Show condicion={!hidden.includes('signature')}>
                    <span className="text-success"
                        title="Firmar Archivo"
                        style={{ position: 'absolute', left: '-20px', cursor: 'pointer' }}
                        onClick={handleSignaturePDF}
                    >
                        <i className="fas fa-signature"></i>
                    </span>
                </Show>

                <Show condicion={!hidden.includes('delete')}>
                    <span className="text-danger" 
                        title="Eliminar Archivo"
                        style={{ position: 'absolute', bottom: '-0px', left: '-20px', cursor: 'pointer' }}
                        onClick={deleteFile}
                    >
                        <i className="fas fa-times"></i>
                    </span>
                </Show>

                <Show condicion={is_observation}>
                    <span className="text-primary" 
                        title="Observación de archivo"
                        style={{ position: 'absolute', bottom: '-18px', right: '20px', cursor: 'pointer' }}
                        onClick={showObservation}
                    >
                        <i className="fas fa-info-circle"></i>
                    </span>
                </Show>
            </Show>

            <Show condicion={show_signed}>
                <PdfView
                    pdfUrl={pdf_url} 
                    pdfDoc={pdf_doc}
                    pdfBlob={pdf_blob}
                    onSigned={signaturePDF}
                    onClose={(e) => setShowSigned(false)}
                />
            </Show> 
        </div>
    )
}


// exportar
export default ItemFileCircle;