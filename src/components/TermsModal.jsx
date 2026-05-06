export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl my-4 sm:my-8">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 border-2 border-gray-900 text-white font-black text-lg brutal-shadow hover:bg-red-700 flex items-center justify-center z-20 transition-colors"
        >
          X
        </button>

        {/* Contenido con scroll */}
        <div className="bg-white border-4 border-gray-900 p-5 sm:p-6 brutal-shadow max-h-[85vh] overflow-y-auto">
          <h2 className="font-heavy text-2xl sm:text-3xl uppercase mb-6 border-b-4 border-gray-900 pb-2 text-gray-900">
            Términos y Condiciones
          </h2>

          <div className="space-y-6 text-sm sm:text-black text-gray-800 font-medium">
            <section>
              <h3 className="font-bold text-lg uppercase bg-gray-900 text-white px-2 py-1 inline-block border-2 border-gray-900 mb-2">
                1. Organización y Marco Legal
              </h3>
              <p>
                <strong>Razón social:</strong> Premios Romero S.A.C.
              </p>
              <p>
                <strong>Sitio oficial:</strong> premiosromero.com
              </p>
              <p>
                <strong>Periodicidad:</strong> Los sorteos se realizan el último día de cada mes.
              </p>
              <p>
                Todos los sorteos y promociones comerciales organizados por la empresa se rigen bajo la legislación peruana vigente, garantizando la equidad y transparencia en cada evento.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg uppercase bg-gray-900 text-white px-2 py-1 inline-block border-2 border-gray-900 mb-2">
                2. Participación y Registro
              </h3>
              <p className="mb-2">
                La participación es voluntaria y está sujeta al cumplimiento de los siguientes pasos:
              </p>
              <ul className="list-disc pl-5 space-y-1 mb-2">
                <li>Realizar el pago previo del ticket (S/ 10.00).</li>
                <li>
                  Tomar una captura de pantalla o guardar el voucher físico del pago emitido por la entidad financiera.
                </li>
                <li>
                  Completar el formulario en la web oficial con datos reales, exactos y actualizados.
                </li>
                <li>
                  Al momento de darle click en "SUBIR COMPROBANTE", usted está aceptando el cumplimiento de los presentes Términos y Condiciones y la Política de Privacidad.
                </li>
              </ul>
              <p>
                La participación está estrictamente limitada a personas mayores de 18 años. De comprobarse la falsedad en la declaración de edad o identidad, el ticket será invalidado sin derecho a reclamo o reembolso.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg uppercase bg-gray-900 text-white px-2 py-1 inline-block border-2 border-gray-900 mb-2">
                3. Validación y Seguridad de Tickets
              </h3>
              <ul className="space-y-2">
                <li>
                  <strong>✅ Registro Correcto:</strong> Los tickets deben estar correctamente registrados en nuestra base de datos y no presentar alteraciones de ningún tipo.
                </li>
                <li>
                  <strong>❌ Prohibición de Manipulación:</strong> No se permite la alteración, falsificación o manipulación de tickets físicos ni digitales (incluyendo comprobantes de pago).
                </li>
                <li>
                  <strong>🔍 Vigencia:</strong> Solo participarán tickets válidos que estén correctamente registrados en el sistema hasta la fecha del sorteo.
                </li>
                <li>
                  <strong>🧾 Verificación Obligatoria:</strong> El ganador acepta de manera irrevocable la verificación de su identidad, información proporcionada y tickets registrados antes de la entrega de cualquier premio.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg uppercase bg-gray-900 text-white px-2 py-1 inline-block border-2 border-gray-900 mb-2">
                4. Cierre de Inscripciones
              </h3>
              <p>
                El cierre de inscripciones y validación de tickets se realiza un (1) día antes de la fecha programada para el sorteo. Todo pago o registro posterior a este corte será asignado y registrado automáticamente para el sorteo del mes siguiente, sin excepciones.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg uppercase bg-gray-900 text-white px-2 py-1 inline-block border-2 border-gray-900 mb-2">
                5. Condiciones de Pagos
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  El valor oficial por ticket es de S/ 10.00 (Diez y 00/100 Soles), incluyendo los impuestos de ley.
                </li>
                <li>
                  Los comprobantes falsos, ilegibles o adulterados serán rechazados de inmediato y el participante será bloqueado de la plataforma.
                </li>
                <li>
                  No se realizan devoluciones por desistimiento, errores en la transferencia o equivocaciones en el registro cometidos por el participante.
                </li>
                <li>
                  La adquisición de un mayor número de tickets incrementa las probabilidades matemáticas, pero no garantiza bajo ninguna circunstancia la obtención de un premio.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg uppercase bg-gray-900 text-white px-2 py-1 inline-block border-2 border-gray-900 mb-2">
                6. Premios y Reglas Especiales
              </h3>
              <p className="mb-2">
                Los premios consisten en vehículos automotores y dinero en efectivo, cuyas especificaciones se publican previamente en la web oficial.
              </p>
              <h4 className="font-bold mt-3 mb-2 underline">Reglas de Asignación y Entrega</h4>
              <ul className="space-y-2">
                <li>
                  <strong>🚫 Restricción de Premio Consuelo:</strong> El participante que tenga más tickets a su nombre y que gane algún premio del sorteo ya no podrá llevarse el "premio consuelo", pasando automáticamente al siguiente participante con mayor cantidad de tickets válidos.
                </li>
                <li>
                  <strong>⚖️ Caso de Empate:</strong> En caso de empate en la mayor cantidad de tickets adquiridos para una bonificación específica, el premio será dividido en dos partes iguales y entregado en efectivo a ambos participantes.
                </li>
                <li>
                  <strong>🎁 Naturaleza del Premio:</strong> Los premios son de carácter estrictamente personal e intransferible. No podrán ser endosados a terceros.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg uppercase bg-gray-900 text-white px-2 py-1 inline-block border-2 border-gray-900 mb-2">
                7. Dinámica del Sorteo
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Los sorteos se llevan a cabo de forma pública y cuentan con la presencia de un notario público, quien da fe y legalidad de los resultados.
                </li>
                <li>
                  La transmisión se realiza en vivo y en directo a través de la página oficial de Facebook de Manuel Romero.
                </li>
                <li className="list-none mt-2">
                  <strong>⚖️ Decisión Final:</strong> La decisión del organizador, avalada por el notario público, respecto a la validez de los tickets y la declaración de los ganadores será final e inapelable.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg uppercase bg-gray-900 text-white px-2 py-1 inline-block border-2 border-gray-900 mb-2">
                8. Protección de Datos Personales
              </h3>
              <p className="mb-2">
                En estricto cumplimiento de la Ley N° 29733, Ley de Protección de Datos Personales, y su Reglamento (Decreto Supremo N° 003-2013-JUS), Premios Romero S.A.C. garantiza la confidencialidad y seguridad de la información proporcionada.
              </p>
              <h4 className="font-bold mt-3 mb-2 underline">Tratamiento de Datos</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Consentimiento:</strong> Al registrarse, el participante otorga su consentimiento libre, previo, expreso, inequívoco e informado para el tratamiento de sus datos.
                </li>
                <li>
                  <strong>Finalidad:</strong> La información recopilada será utilizada exclusivamente para la validación de identidad, gestión del sorteo, contacto en caso de resultar ganador y fines estadísticos internos.
                </li>
                <li>
                  <strong>Derechos ARCO:</strong> El usuario titular de los datos puede ejercer en cualquier momento sus derechos de Acceso, Rectificación, Cancelación y Oposición, enviando una solicitud formal a través de nuestros canales de contacto oficiales.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg uppercase bg-gray-900 text-white px-2 py-1 inline-block border-2 border-gray-900 mb-2">
                9. Protección al Consumidor
              </h3>
              <p className="mb-2">
                De conformidad con la Ley N° 29571, Código de Protección y Defensa del Consumidor, la empresa asegura la transparencia e idoneidad del servicio ofrecido.
              </p>
              <h4 className="font-bold mt-3 mb-2 underline">Garantías para el Usuario</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Información Clara:</strong> Las reglas, fechas, costos y descripciones de los premios son exhibidas de manera clara, veraz y oportuna, evitando cualquier práctica engañosa.
                </li>
                <li>
                  <strong>Atención de Reclamos:</strong> Contamos con un Libro de Reclamaciones Virtual, conforme a la normativa de INDECOPI, a disposición de los usuarios para registrar cualquier insatisfacción o queja sobre el desarrollo del sorteo.
                </li>
                <li>
                  <strong>Publicidad:</strong> Toda publicidad emitida respecto a los sorteos respeta los principios de lealtad y veracidad comercial exigidos por la ley peruana.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg uppercase bg-gray-900 text-white px-2 py-1 inline-block border-2 border-gray-900 mb-2">
                10. Responsabilidad y Prevención de Fraude
              </h3>
              <ul className="space-y-2">
                <li>
                  <strong>⚠️ Descalificación:</strong> Cualquier intento de fraude, suplantación de identidad, uso de bots, alteraciones de sistema o manipulación de datos resultará en la descalificación automática e inmediata del participante.
                </li>
                <li>
                  <strong>⚖️ Acciones Legales:</strong> Premios Romero S.A.C. se reserva el derecho absoluto de utilizar los datos recopilados para iniciar acciones legales, civiles o penales, ante las autoridades competentes frente a indicios de fraude, estafa o lavado de activos.
                </li>
                <li>
                  <strong>📌 Exoneración:</strong> La empresa no asume responsabilidad civil por interrupciones de conectividad, caídas del sistema bancario o errores tipográficos cometidos por el usuario durante su inscripción.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg uppercase bg-gray-900 text-white px-2 py-1 inline-block border-2 border-gray-900 mb-2">
                11. Contacto y Atención al Cliente
              </h3>
              <p>
                Para consultas, soporte técnico, ejercicio de derechos ARCO o acceso al Libro de Reclamaciones, por favor comuníquese mediante los canales oficiales publicados permanentemente en nuestra plataforma web: premiosromero.com.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="bg-gray-900 text-white font-heavy text-lg py-2 px-8 border-2 border-gray-900 brutal-shadow hover:bg-gray-800 transition-colors"
            >
              CERRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}