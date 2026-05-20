/**
 * gallery.js – AEMET Boletines
 * Carga imágenes automáticamente desde una carpeta dado un prefijo.
 * Uso: initGallery({ prefix, folder, maxImages, container })
 */
const MAX_SUBIMAGES = 9;

function initGallery({ prefix, folder, maxImages = 30, container = '#gallery-container' }) {
  const wrap = document.querySelector(container);
  if (!wrap) return;

  const extensions = ['png', 'jpg', 'jpeg', 'webp'];
  const steps = stepDescriptions[prefix] || {};
  const stepKeys = Object.keys(steps).map(Number).sort((a, b) => a - b);

  // 1. Renderizar todas las tarjetas como placeholder
  renderAllPlaceholders(wrap, prefix, stepKeys);

  stepKeys.forEach(index => {
    // Imagen principal: Boletines_6.png
    tryFile(`${prefix}_${index}`, index, null);
    // Sub-imágenes: Boletines_6-1.png … Boletines_6-9.png
    for (let sub = 1; sub <= MAX_SUBIMAGES; sub++) {
      tryFile(`${prefix}_${index}-${sub}`, index, sub);
    }
  });

  function tryFile(filename, stepIndex, subIndex) {
    tryExt(filename, stepIndex, subIndex, 0);
  }

  function tryExt(filename, stepIndex, subIndex, extIdx) {
    if (extIdx >= extensions.length) return;
    const ext = extensions[extIdx];
    const src = `${folder}${filename}.${ext}`;
    const img = new Image();
    img.onload = () => {
      addImageToCard(wrap, stepIndex, subIndex, src, prefix);
    };
    img.onerror = () => tryExt(filename, stepIndex, subIndex, extIdx + 1);
    img.src = src;
  }
}

const stepDescriptions = {
  Boletines: {
    1:  "Listado principal de boletines. La tabla carga los registros mediante una llamada AJAX al MVCResourceCommand. Las columnas muestran tipo, fecha, estado y las acciones disponibles para cada boletín (ver, editar).",
    2:  "El módulo tiene dos portlets independientes: 'Boletines Provinciales' y 'Boletines Marítimos'. El selector entre ambos se encuentra en el menú horizontal de navegación del portal.",
    3:  "Detalle de un boletín provincial. La cabecera (título y subtítulo) se carga dinámicamente vía AJAX. Muestra el texto completo del boletín. Las acciones disponibles son validar, enviar, editar y descargar el PDF. El botón 'Editar' solo aparece si el boletín no está validado.",
    4:  "Detalle de un boletín marítimo de alta mar. Misma estructura que el provincial con el texto del aviso marítimo. Las acciones disponibles son validar, enviar, editar y descargar. El botón 'Editar' solo aparece si el boletín no está validado.",
    5:  "Detalle de un boletín marítimo NAVTEX. Muestra el mensaje codificado en formato NAVTEX y su decodificación estructurada por campos.",
    6:  "Formulario de edición de un boletín provincial. Los datos se precargan vía AJAX. Incluye el mapa interactivo Leaflet con las zonas afectadas para selección geográfica. La barra superior contiene los botones 'Cancelar' y 'Guardar cambios'.",
    7:  "Formulario de edición de un boletín marítimo. Misma estructura que el provincial con el mapa Leaflet adaptado a las zonas marítimas.",
    8:  "Vista del boletín tras ser editado y guardado. El sistema redirige al detalle actualizado con los nuevos datos.",
    9:  "Detalle del boletín con las opciones de validar y enviar disponibles según el estado del registro."
  },
  Certificados: {
    1:  "Listado principal de certificados. La tabla AG Grid carga los registros vía AJAX con columnas: id, fecha de emisión, tipo, localización, fenómeno, idioma, estado, validación y botones de acción. En la cabecera aparece el botón 'Nuevo certificado'.",
    2:  "Detalle de un certificado. La cabecera muestra el título y código del certificado cargados dinámicamente. Un acordeón 'Visualizar petición' permite expandir la descripción original de la solicitud. Desde aquí se puede validar, editar o descargar el PDF generado.",
    3:  "Formulario de creación de certificado — modo 'Texto libre'. Campos: selector de modo (radio: texto libre / adjuntar PDF), selector de tipo de petición y un área de texto donde pegar la descripción completa para que el sistema extraiga los datos del certificado. La segunda captura muestra la confirmación tras completar el proceso de creación.",
    4:  "Formulario de creación de certificado — modo 'Adjuntar PDF'. Al seleccionar este radio se oculta el área de texto y aparece un campo de subida de archivo PDF. El sistema extrae los datos del certificado a partir del documento adjunto.",
    5:  "Formulario de edición de un certificado existente. Los datos se precargan desde el backend. Permite corregir cualquier campo antes de volver a validar."
  },
  Informes: {
    1:  "Listado principal de informes. La tabla AG Grid carga los registros vía AJAX con columnas: id, emisión, tipo, localización, fenómeno, idioma, estado, validación y botones de acción. En la cabecera aparece el botón 'Crear informe'.",
    2:  "Detalle de un informe generado. Muestra la cabecera dinámica con título y subtítulo del informe y el contenido con los datos meteorológicos solicitados.",
    3:  "Formulario de creación de informe — modo 'Texto libre'. Campos: selector de modo (radio: texto libre / adjuntar PDF), selector de tipo de petición y un área de texto donde describir el informe requerido para que el sistema lo procese.",
    4:  "Formulario de creación de informe — modo 'Adjuntar PDF'. Al seleccionar este radio aparece el campo de subida de archivo. El sistema extrae los parámetros del informe a partir del documento adjunto.",
    5:  "Estado del informe tras ser creado. El sistema procesa la solicitud y el registro aparece en el listado con su estado actualizado.",
    6:  "Descarga del informe en PDF. Desde el detalle del informe el botón de descarga invoca el MVCResourceCommand que genera y sirve el archivo PDF.",
    7:  "Formulario de edición de un informe existente. Los datos se precargan desde el backend. Permite modificar cualquier campo y regenerar el informe.",
    8:  "Resultado de la edición. El sistema actualiza el informe y redirige al detalle con los datos renovados."
  },
  AdminUsuarios: {
    1: "Gestión de usuarios — listado. Tabla AG Grid que muestra todos los usuarios dados de alta con nombre, correo, rol asignado y estado. La cabecera incluye el botón 'Agregar usuario'.",
    2: "Formulario de alta de usuario. El campo de usuario es un selector con buscador que filtra los usuarios importados del LDAP corporativo. Otros campos: email (autocompletado al seleccionar usuario) y rol (selector obligatorio).",
    3: "Validaciones del formulario de alta: el usuario y el rol son obligatorios. Los mensajes de error aparecen inline bajo cada campo afectado.",
    4: "Resultado tras crear y editar un usuario. La primera captura muestra el listado con el nuevo usuario recién dado de alta; la segunda muestra el listado tras haber modificado sus datos, reflejando los cambios aplicados.",
    5: "Modal de confirmación de borrado de usuario. Muestra el nombre del usuario a eliminar, un aviso de advertencia en rojo y los botones 'Cancelar' y 'Eliminar'."
  },
  AdminZonificacion: {
    1: "Capa Administrativa. Vista del mapa de zonificación con la capa administrativa seleccionada. Muestra las divisiones oficiales del IGN.",
    2: "Capa Subzonas. Vista del mapa con la capa de subzonas seleccionada. Muestra las divisiones geográficas personalizadas del portal.",
    3: "Importar zonas. Sección desplegable para subir un fichero JSON con geometrías. Permite elegir la capa destino (Capa Subzonas o Alta Mar Subzonas) y decide qué hacer si ya existe información para esa zona.",
    4: "Comparar versiones. Panel que aparece al importar una zona que ya existe. Muestra dos mapas en paralelo (geometría existente vs. nueva) y opciones para mantener la existente, usar la nueva o eliminar la actual."
  },
  AdminDiccionarios: {
    1: "Reglas Provinciales — listado. Tabla con las reglas de redacción automática para boletines provinciales: condición meteorológica y texto predefinido asociado que el sistema puede insertar en el boletín.",
    2: "Reglas Provinciales — formulario. Permite crear o editar una regla provincial definiendo la condición y el texto que el sistema utilizará al generar o editar un boletín provincial.",
    3: "Reglas Marítimas — listado. Tabla equivalente para boletines marítimos con las reglas de redacción de avisos de alta mar y NAVTEX.",
    4: "Reglas Marítimas — formulario. Permite crear o editar una regla marítima aplicable a los distintos tipos de boletín (alta mar, NAVTEX)."
  },
  AdminLogs: {
    1: "Errores del sistema. Registro de errores producidos durante el funcionamiento del portal: tipo de error, fecha, módulo afectado y traza técnica para diagnóstico.",
    2: "Cambios en documentos. Historial de modificaciones realizadas sobre boletines, certificados e informes: campo modificado, valor anterior, valor nuevo, usuario y fecha."
  },
  AdminIndicadores: {
    1: "Indicadores de uso. Panel con estadísticas de actividad del portal.",
    2: "Vista detallada de indicadores. Segunda sección del panel con métricas adicionales o filtros por periodo.",
    3: ""
  },
  AreaPersonal: {
    1: "Acceso al área personal desde el menú de usuario situado en la cabecera del portal. Al hacer clic en el nombre o avatar del usuario se despliega el menú con el enlace al área personal.",
    2: "Vista del perfil de usuario. Muestra el nombre completo, dirección de correo electrónico y el rol asignado en el sistema (Usuario normal o Administrador)."
  }
};

function renderAllPlaceholders(wrap, prefix, stepKeys) {
  const displayNames = {
    Boletines: 'Boletines', Certificados: 'Certificados',
    Informes: 'Informes', AreaPersonal: 'Área Personal',
    AdminUsuarios: 'Gestión de usuarios', AdminZonificacion: 'Zonificación',
    AdminDiccionarios: 'Diccionarios', AdminLogs: 'Logs',
    AdminIndicadores: 'Indicadores de uso'
  };
  const displayPrefix = displayNames[prefix] || prefix;
  const steps = stepDescriptions[prefix] || {};

  wrap.innerHTML = `
    ${stepKeys.map(i => `
      <div class="gallery-item" id="gallery-step-${prefix}-${i}" style="animation-delay:${(i-1)*0.06}s">
        <div class="gallery-item-header">
          <span class="gallery-item-step">PASO ${i}</span>
          <span class="gallery-item-title">${displayPrefix}</span>
        </div>
        <div class="gallery-img-wrap">
          <p style="margin-bottom:16px;font-size:0.95rem;color:var(--clr-text-muted);line-height:1.6;text-align:justify;">${steps[i] || ''}</p>
          <div id="gallery-imgs-${prefix}-${i}" class="gallery-imgs-container">
            <div class="gallery-placeholder-img">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>${prefix}_${i}.png</span>
            </div>
          </div>
        </div>
      </div>
    `).join('')}
  `;
}

function addImageToCard(wrap, stepIndex, subIndex, src, prefix) {
  const container = document.getElementById(`gallery-imgs-${prefix}-${stepIndex}`);
  if (!container) return;

  // Primera imagen que llega: ocultar el placeholder
  const ph = container.querySelector('.gallery-placeholder-img');
  if (ph) ph.style.display = 'none';

  const img = document.createElement('img');
  img.src = src;
  img.alt = `${prefix} paso ${stepIndex}${subIndex !== null ? '-' + subIndex : ''}`;
  img.loading = 'lazy';

  // Insertar en la posición correcta usando data-order
  const order = subIndex === null ? 0 : subIndex;
  img.dataset.order = order;

  // Insertar antes del primer img con order mayor, o al final
  const siblings = Array.from(container.querySelectorAll('img'));
  const after = siblings.find(s => parseInt(s.dataset.order) > order);
  if (after) container.insertBefore(img, after);
  else container.appendChild(img);
}

function appendCard(wrap, index, src, prefix) {
  const item = document.createElement('div');
  item.className = 'gallery-item';
  item.style.animationDelay = `${(index - 1) * 0.07}s`;

  const displayNames = {
    Boletines: 'Boletines',
    Certificados: 'Certificados',
    Informes: 'Informes',
    AreaPersonal: 'Área Personal',
    AdminUsuarios: 'Gestión de usuarios',
    AdminZonificacion: 'Zonificación',
    AdminDiccionarios: 'Diccionarios',
    AdminLogs: 'Logs',
    AdminIndicadores: 'Indicadores de uso'
  };

  const displayPrefix = displayNames[prefix] || prefix;
  const description = (stepDescriptions[prefix] && stepDescriptions[prefix][index])
    ? stepDescriptions[prefix][index]
    : `Paso ${index}`;

  item.innerHTML = `
    <div class="gallery-item-header">
      <span class="gallery-item-step">PASO ${index}</span>
      <span class="gallery-item-title">${displayPrefix}</span>
    </div>
    <div class="gallery-img-wrap">
      <p style="margin-bottom:16px;font-size:0.95rem;color:var(--clr-text-muted);line-height:1.6;text-align:justify;">${description}</p>
      <img src="${src}" alt="${displayPrefix} paso ${index}" loading="lazy" />
    </div>
  `;
  wrap.appendChild(item);
}

function showEmpty(wrap, prefix) {
  // La lógica principal ya renderiza los placeholders en renderAllPlaceholders.
  // Esta función se mantiene como fallback por si initGallery no puede ejecutarse.
}

/* ---- Lightbox ---- */
document.addEventListener('click', (e) => {
  const img = e.target.closest('.gallery-img-wrap img');
  if (!img) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';

  const clone = document.createElement('img');
  clone.src = img.src;
  clone.alt = img.alt;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '&#x2715;';
  closeBtn.setAttribute('aria-label', 'Cerrar');

  const close = () => overlay.remove();
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) close(); });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); }, { once: true });

  overlay.appendChild(clone);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);
});
