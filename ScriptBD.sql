--=========================================================
-- SCHEMA
--=========================================================

-- CREATE SCHEMA IF NOT EXISTS Sistema Eval. Nuevos Prod y/o Fab;
-- SET search_path TO Sistema Eval. Nuevos Prod y/o Fab;


-- ========================================================
-- HABILITAR EXTENSIONES NECESARIAS
-- ========================================================

-- Ejecutar primero como superusuario o con permisos de creación de extensiones:
--CREATE EXTENSION IF NOT EXISTS pg_trgm;
--CREATE EXTENSION IF NOT EXISTS btree_gin; -- Opcional, para índices GIN en múltiples tipos
--CREATE EXTENSION IF NOT EXISTS unaccent;

--COMMENT ON EXTENSION pg_trgm IS 'Soporte para búsqueda de texto usando trigramas';
--COMMENT ON EXTENSION unaccent IS 'Elimina acentos de texto para búsquedas insensibles';


--=========================================================
-- ENUMS
--=========================================================

-- Origen de la solicitud
CREATE TYPE origin_request_enum AS ENUM (
    'BioCubaFarma (BCF)', 
    'Cliente', 
    'Proveedor', 
    'NM', 
    'No Procede (NP)',
    'Extraplan', 
    'Cliente (Extraplan)', 
    'Proveedor (Extraplan)'
);
COMMENT ON TYPE origin_request_enum IS 'Origen de la solicitud de evaluación';


-- Tipo de producto
CREATE TYPE product_type_enum AS ENUM (
    'Materia Prima (Ingrediente Farmacéutico Activo)',
    'Materia Prima (Excipiente Farmacéutico)',
    'Materia Prima (Cápsula)',
    'Material de Envase',
    'Reactivo',
    'Dispositivo'
);
COMMENT ON TYPE product_type_enum IS 'Tipos de productos que pueden ser evaluados';


-- Rol de entidad comercial
CREATE TYPE entity_role_enum AS ENUM (
    'Fabricante', 
    'Proveedor'
);
COMMENT ON TYPE entity_role_enum IS 'Roles que puede tener una entidad comercial';


-- Tipo de documento técnico
CREATE TYPE document_type_enum AS ENUM (
    'COA', 
    'Ficha Técnica', 
    'Permiso Sanitario', 
    'Otro'
);
COMMENT ON TYPE document_type_enum IS 'Tipos de documentos técnicos requeridos';


-- Resultado de evaluación de muestra
CREATE TYPE result_sample_evaluation_enum AS ENUM (
    'Conforme', 
    'No Conforme'
);
COMMENT ON TYPE result_sample_evaluation_enum IS 'Resultados posibles de evaluación de muestras';


-- Estado de compra industrial
CREATE TYPE state_industrial_purchasing_enum AS ENUM (
    'Concluida', 
    'Parcialmente Concluida', 
    'Pendiente de Embarque'
);
COMMENT ON TYPE state_industrial_purchasing_enum IS 'Estados de las compras industriales';


-- Resultado de análisis industrial
CREATE TYPE result_industrial_analysis_enum AS ENUM (
    'Buen Desempeño', 
    'Defectuoso', 
    'No Informado'
);
COMMENT ON TYPE result_industrial_analysis_enum IS 'Resultados del análisis industrial';


-- Estado final del fabricante
CREATE TYPE evaluation_state_manufacturer_enum AS ENUM (
    'Aprobado',
    'No Aprobado',
    'Pendiente de Evaluación',
    'Pendiente de Documentación',
    'Pendiente de Muestra',
    'Pendiente de Decisión de Escala Industrial',
    'Pendiente de Compra Industrial',
    'Pendiente de Evaluación Industrial',
    'Pendiente de Informe',
    'Contrato a Riesgo (COA o muestras)'
);
COMMENT ON TYPE evaluation_state_manufacturer_enum IS 'Estados de evaluación del fabricante según el flujo del proceso';


-- Rol de usuario
CREATE TYPE user_role_enum AS ENUM (
    'Administrador', 
    'Observador', 
    'Administrador de Base de Datos',
    'Analista de Precios'
);
COMMENT ON TYPE user_role_enum IS 'Roles de usuario en el sistema';


-- Estado de ciclo de vida
CREATE TYPE lifecycle_state_enum AS ENUM (
    'Activo', 
    'Archivado'
);
COMMENT ON TYPE lifecycle_state_enum IS 'Estados del ciclo de vida de registros';


-- Razón de archivado
CREATE TYPE archive_reason_enum AS ENUM (
    'Solicitud no seleccionada para evaluar',
    'Oferta no competitiva',
    'Evaluación concluida exitosamente',
    'Evaluación cancelada',
    'Documentación no aprobada',
    'Muestras no conformes',
    'Otro'
);
COMMENT ON TYPE archive_reason_enum IS 'Razones específicas para archivar solicitudes o procesos';


--=========================================================
-- TABLAS PRINCIPALES
--========================================================= */

-- CLIENTE
CREATE TABLE client (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_country VARCHAR(100) NOT NULL
);

COMMENT ON TABLE client IS 'Clientes o empresas solicitantes que realizan solicitudes de evaluación.';
COMMENT ON COLUMN client.client_name IS 'Nombre del cliente o empresa solicitante.';
COMMENT ON COLUMN client.client_country IS 'País de origen del cliente.';

CREATE UNIQUE INDEX uq_client_ci ON client (lower(/*unaccent(*/client_name/*)*/), lower(/*unaccent(*/client_country/*)*/));
--CREATE INDEX idx_client_name_search ON client USING gin(lower(unaccent(client_name)) gin_trgm_ops);


-- ENTIDAD COMERCIAL
CREATE TABLE commercial_entity (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_name VARCHAR(255) NOT NULL,
    entity_country VARCHAR(100) NOT NULL
);

COMMENT ON TABLE commercial_entity IS 'Representa empresas con las que FARMACUBA mantiene relaciones (pueden ser fabricantes o proveedores).';
COMMENT ON COLUMN commercial_entity.entity_name IS 'Nombre de la entidad comercial.';
COMMENT ON COLUMN commercial_entity.entity_country IS 'País de la entidad comercial.';

CREATE UNIQUE INDEX uq_commercial_entity_ci ON commercial_entity (lower(/*unaccent(*/entity_name/*)*/), lower(/*unaccent(*/entity_country/*)*/));
--CREATE INDEX idx_commercial_entity_name ON commercial_entity USING gin(lower(unaccent(entity_name)) gin_trgm_ops);


-- ROL DE ENTIDAD COMERCIAL
CREATE TABLE commercial_entity_role (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    commercial_entity INTEGER NOT NULL,
    role_type entity_role_enum NOT NULL,
    CONSTRAINT uq_entity_role UNIQUE (commercial_entity, role_type),
    FOREIGN KEY (commercial_entity)
        REFERENCES commercial_entity (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE commercial_entity_role IS 'Define los roles que puede asumir una entidad comercial (Fabricante o Proveedor).';
COMMENT ON COLUMN commercial_entity_role.commercial_entity IS 'FK a commercial_entity. Entidad comercial que cumple con este rol.';
COMMENT ON COLUMN commercial_entity_role.role_type IS 'Rol desempeñado por la entidad comercial (Fabricante o Proveedor).';


-- PRODUCTO
CREATE TABLE product (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    product_type product_type_enum NOT NULL,
    exclusive_use BOOLEAN NOT NULL DEFAULT false,
    priority INTEGER NOT NULL CHECK (priority IN (1,2,3))
);

COMMENT ON TABLE product IS 'Productos solicitados para evaluación.';
COMMENT ON COLUMN product.description IS 'Descripción del producto según nomenclador/propuesta del proveedor.';
COMMENT ON COLUMN product.product_type IS 'Tipo de producto (MP, ME, R, D).';
COMMENT ON COLUMN product.exclusive_use IS 'Indica si el producto es de uso exclusivo o compartido.';
COMMENT ON COLUMN product.priority IS 'Nivel de prioridad de atención o evaluación (1,2,3).';

CREATE UNIQUE INDEX uq_product_ci ON product (lower(/*unaccent(*/description/*)*/), product_type);
--CREATE INDEX idx_product_description_search ON product USING gin(lower(unaccent(description)) gin_trgm_ops);
CREATE INDEX idx_product_priority ON product (priority);


-- PRODUCTO-FABRICANTE
CREATE TABLE maker_product (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id INTEGER NOT NULL,
    maker_entity_id INTEGER NOT NULL,
    FOREIGN KEY (product_id)
        REFERENCES product (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (maker_entity_id)
        REFERENCES commercial_entity (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE maker_product IS 'Relaciona productos con sus fabricantes.';
COMMENT ON COLUMN maker_product.product_id IS 'FK a product. Producto que es fabricado por el Fabricante.';
COMMENT ON COLUMN maker_product.maker_entity_id IS 'FK a commercial_entity que actúa como Fabricante: empresa que produce materiales o productos farmacéuticos.';

CREATE UNIQUE INDEX uq_maker_product ON maker_product (product_id, maker_entity_id);
CREATE INDEX idx_maker_product_product ON maker_product (product_id);
CREATE INDEX idx_maker_product_maker ON maker_product (maker_entity_id);


-- SUMINISTRO
CREATE TABLE supply (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    supplier_entity_id INTEGER NOT NULL,
    maker_product_id INTEGER NOT NULL,
    FOREIGN KEY (supplier_entity_id)
        REFERENCES commercial_entity (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (maker_product_id)
        REFERENCES maker_product (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE supply IS 'Registro del proveedor que suministra un producto de determinado fabricante.';
COMMENT ON COLUMN supply.supplier_entity_id IS 'FK a commercial_entity que actúa como Proveedor: empresa o persona encargada de suministrar productos o servicios.';
COMMENT ON COLUMN supply.maker_product_id IS 'FK a maker_product (producto-fabricante).';

CREATE UNIQUE INDEX uq_supply ON supply (supplier_entity_id, maker_product_id);
CREATE INDEX idx_supply_supplier ON supply (supplier_entity_id);
CREATE INDEX idx_supply_maker_product ON supply (maker_product_id);


--=========================================================
-- SOLICITUD Y PROCESO DE EVALUACIÓN
--=========================================================

-- SOLICITUD
CREATE TABLE application (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    application_number INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    origin origin_request_enum NOT NULL,
    receipt_date DATE NOT NULL,
    is_selected BOOLEAN,
    lifecycle_state lifecycle_state_enum NOT NULL DEFAULT 'Activo',
    archive_date DATE,
    archive_reason archive_reason_enum,
    FOREIGN KEY (client_id)
        REFERENCES client (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE application IS 'Solicitud principal del cliente que inicia el proceso de evaluación.';
COMMENT ON COLUMN application.application_number IS 'Número identificador de la solicitud.';
COMMENT ON COLUMN application.client_id IS 'FK a client. Cliente que realiza la solicitud del producto.';
COMMENT ON COLUMN application.origin IS 'Origen de la solicitud (BCF, Cliente, Proveedor, ...).';
COMMENT ON COLUMN application.receipt_date IS 'Fecha de recepción de la solicitud.';
COMMENT ON COLUMN application.is_selected IS 'Indica si la solicitud fue seleccionada para tramitarse.';
COMMENT ON COLUMN application.lifecycle_state IS 'Estado del ciclo de vida de la solicitud: Activo (en proceso) o Archivado (completada, cancelada o rechazada).';
COMMENT ON COLUMN application.archive_date IS 'Fecha en que la solicitud fue archivada.';
COMMENT ON COLUMN application.archive_reason IS 'Razón por la cual la solicitud fue archivada (ej: completada, rechazada, cancelada).';

CREATE UNIQUE INDEX uq_application_number ON application (application_number);
CREATE UNIQUE INDEX uq_application_client ON application (client_id, receipt_date);

CREATE INDEX idx_application_client ON application (client_id);
CREATE INDEX idx_application_receipt_date ON application (receipt_date);
CREATE INDEX idx_application_selected ON application (is_selected) WHERE is_selected = true;
CREATE INDEX idx_application_active ON application (lifecycle_state) WHERE lifecycle_state = 'Activo';
CREATE INDEX idx_application_archived ON application (lifecycle_state, archive_date) WHERE lifecycle_state = 'Archivado';


-- SOLICITUD-PRODUCTO
CREATE TABLE application_product (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    application_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    FOREIGN KEY (application_id)
        REFERENCES application (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (product_id)
        REFERENCES product (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE application_product IS 'Relaciona las solicitudes de los clientes con los productos solicitados.';
COMMENT ON COLUMN application_product.application_id IS 'FK a application. Solicitud del producto.';
COMMENT ON COLUMN application_product.product_id IS 'FK a product. Producto solicitado por el cliente.';

CREATE UNIQUE INDEX uq_application_product ON application_product (application_id, product_id);
CREATE INDEX idx_app_product_app ON application_product (application_id);
CREATE INDEX idx_app_product_product ON application_product (product_id);


-- PROCESO DE EVALUACIÓN
CREATE TABLE evaluation_process (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	application_id INTEGER NOT NULL,
    supply_id INTEGER NOT NULL,
    lifecycle_state lifecycle_state_enum NOT NULL DEFAULT 'Activo',
    archive_date DATE,
    archive_reason archive_reason_enum,
    FOREIGN KEY (application_id)
        REFERENCES application (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (supply_id)
        REFERENCES supply (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- CONSTRAINTS ADICIONALES
    CONSTRAINT chk_eval_process_archive CHECK (
        (lifecycle_state = 'Archivado' AND archive_date IS NOT NULL AND archive_reason IS NOT NULL) OR
        (lifecycle_state = 'Activo' AND archive_date IS NULL AND archive_reason IS NULL)
    )
);

COMMENT ON TABLE evaluation_process IS 'Centraliza el proceso de evaluación para cada combinación solicitud-suminsitro. Mantiene historial de ciclo de vida.';
COMMENT ON COLUMN evaluation_process.id IS 'Identificador único del proceso de evaluación.';
COMMENT ON COLUMN evaluation_process.application_id IS 'FK a application. Solicitud a la que corresponde esta evaluación.';
COMMENT ON COLUMN evaluation_process.supply_id IS 'FK a supply. Suministro a evaluar.';
COMMENT ON COLUMN evaluation_process.lifecycle_state IS 'Estado del ciclo de vida del proceso: Activo (en evaluación) o Archivado (completado/cancelado).';
COMMENT ON COLUMN evaluation_process.archive_date IS 'Fecha en que el proceso fue archivado. NULL si está activo.';
COMMENT ON COLUMN evaluation_process.archive_reason IS 'Razón específica por la cual el proceso fue archivado. NULL si está activo.';

-- ÍNDICES
CREATE UNIQUE INDEX uq_evaluation_process_active ON evaluation_process (application_id, supply_id) 
WHERE lifecycle_state = 'Activo';

CREATE INDEX idx_evaluation_process_app ON evaluation_process (application_id);
CREATE INDEX idx_evaluation_process_supply ON evaluation_process (supply_id);
CREATE INDEX idx_evaluation_process_state ON evaluation_process (lifecycle_state);
CREATE INDEX idx_evaluation_process_archived ON evaluation_process (archive_date) WHERE lifecycle_state = 'Archivado';

-- Índice compuesto para búsquedas frecuentes
CREATE INDEX idx_eval_process_app_state_date ON evaluation_process (application_id, lifecycle_state);


--=========================================================
-- COMPRA A PROVEEDOR Y OFERTA EXPLORATORIA
--=========================================================

-- COMPRA A PROVEEDOR
CREATE TABLE supplier_purchase (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id INTEGER NOT NULL,
    supplier_id INTEGER NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    purchase_date DATE NOT NULL,
    FOREIGN KEY (product_id)
        REFERENCES product (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    FOREIGN KEY (supplier_id)
        REFERENCES commercial_entity (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

COMMENT ON TABLE supplier_purchase IS 'Compras históricas realizadas a proveedores, usadas como referencia para análisis de ofertas.';
COMMENT ON COLUMN supplier_purchase.product_id IS 'FK a product. Producto adquirido.';
COMMENT ON COLUMN supplier_purchase.supplier_id IS 'FK a commercial_entity que actúa como Proveedor, del cual es el que vende el producto.';
COMMENT ON COLUMN supplier_purchase.unit_price IS 'Precio unitario de compra.';
COMMENT ON COLUMN supplier_purchase.purchase_date IS 'Fecha de la compra.';

CREATE UNIQUE INDEX uq_supplier_purchase ON supplier_purchase (product_id, supplier_id, purchase_date);
CREATE INDEX idx_supp_purchase_product ON supplier_purchase (product_id);
CREATE INDEX idx_supp_purchase_supplier ON supplier_purchase (supplier_id);
CREATE INDEX idx_supp_purchase_date ON supplier_purchase (purchase_date);
CREATE INDEX idx_supp_purchase_price ON supplier_purchase (unit_price);


-- OFERTA EXPLORATORIA
CREATE TABLE exploratory_offer (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    evaluation_process_id INTEGER NOT NULL,
    offered_price NUMERIC(12,2) NOT NULL,
    reference_purchase_id INTEGER NOT NULL,
    price_difference NUMERIC(12,2) NOT NULL,
    percentage_difference NUMERIC(6,2) NOT NULL,
    analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
	is_competitive BOOLEAN NOT NULL,
    FOREIGN KEY (evaluation_process_id)
        REFERENCES evaluation_process (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (reference_purchase_id)
        REFERENCES supplier_purchase (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE exploratory_offer IS 'Oferta exploratoria asociada a un proceso de evaluación.';
COMMENT ON COLUMN exploratory_offer.evaluation_process_id IS 'FK a evaluation_process.';
COMMENT ON COLUMN exploratory_offer.offered_price IS 'Precio que ofrece el proveedor por el producto.';
COMMENT ON COLUMN exploratory_offer.reference_purchase_id IS 'FK a supplier_purchase. Última compra realiza del producto en la empresa.';
COMMENT ON COLUMN exploratory_offer.price_difference IS 'Diferencia entre el precio del nuevo proveedor y el precio de la última compra.';
COMMENT ON COLUMN exploratory_offer.percentage_difference IS 'Diferencia en porciento.';
COMMENT ON COLUMN exploratory_offer.analysis_date IS 'Fecha del análisis de la oferta exploratoria.';
COMMENT ON COLUMN exploratory_offer.is_competitive IS 'Decisión final de evaluar el nuevo suministro o no.';

CREATE UNIQUE INDEX uq_exploratory_offer ON exploratory_offer (evaluation_process_id);
CREATE INDEX idx_exploratory_eval_process ON exploratory_offer (evaluation_process_id);
CREATE INDEX idx_exploratory_ref_purchase ON exploratory_offer (reference_purchase_id);
CREATE INDEX idx_exploratory_analysis_date ON exploratory_offer (analysis_date);
CREATE INDEX idx_exploratory_competitive ON exploratory_offer (is_competitive) WHERE is_competitive = true;


--=========================================================
-- DOCUMENTOS TÉCNICOS
--========================================================= 

-- DOCUMENTO TÉCNICO
CREATE TABLE technical_document ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
	supply_id INTEGER NOT NULL,
	document_name VARCHAR(255) NOT NULL,
    document_type document_type_enum NOT NULL,
    version VARCHAR(100) NOT NULL,
	file_path VARCHAR(500),
    request_date DATE,
    receipt_date DATE,
	FOREIGN KEY (supply_id) 
	    REFERENCES supply (id) 
	    ON UPDATE CASCADE 
	    ON DELETE CASCADE
); 

COMMENT ON TABLE technical_document IS 'Documentos técnicos asociados a un suministro (COA, ficha técnica, permisos, etc.).';
COMMENT ON COLUMN technical_document.supply_id IS 'FK a supply. Suminstro al que pertenece el documento técnico.';
COMMENT ON COLUMN technical_document.document_name IS 'Nombre del documento.';
COMMENT ON COLUMN technical_document.document_type IS 'Tipo de documento (COA, Ficha, Permiso...).';
COMMENT ON COLUMN technical_document.version IS 'Versión o identificación del documento.';
COMMENT ON COLUMN technical_document.file_path IS 'Directorio del documento.';
COMMENT ON COLUMN technical_document.request_date IS 'Fecha en que se solicitó el documento técnico.';
COMMENT ON COLUMN technical_document.receipt_date IS 'Fecha de recepción del documento técnico.';

CREATE UNIQUE INDEX uq_technical_document ON technical_document (supply_id, lower(/*unaccent(*/document_name/*)*/), document_type, version);
CREATE INDEX idx_tech_doc_supply ON technical_document (supply_id);
CREATE INDEX idx_tech_doc_version ON technical_document (version);
CREATE INDEX idx_tech_doc_type ON technical_document (document_type);
CREATE INDEX idx_tech_doc_request_date ON technical_document (request_date);


-- EVALUACIÓN DE DOCUMENTO
CREATE TABLE document_evaluation ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
	evaluation_process_id INTEGER NOT NULL,
    technical_document_id INTEGER NOT NULL,
	send_date DATE NOT NULL,
    evaluation_date DATE,
    is_approved BOOLEAN,
	FOREIGN KEY (evaluation_process_id) 
	    REFERENCES evaluation_process (id) 
	    ON UPDATE CASCADE 
	    ON DELETE CASCADE,
	FOREIGN KEY (technical_document_id) 
	    REFERENCES technical_document(id) 
	    ON UPDATE CASCADE 
	    ON DELETE CASCADE 
);

COMMENT ON TABLE document_evaluation IS 'Registra la evaluación individual que realiza cada cliente sobre los documentos técnicos de un suministro.';
COMMENT ON COLUMN document_evaluation.evaluation_process_id IS 'FK a evaluation_process.';
COMMENT ON COLUMN document_evaluation.technical_document_id IS 'FK a technical_document. Documento Técnico que se evalúa.';
COMMENT ON COLUMN document_evaluation.send_date IS 'Fecha de envío del documento al cliente.';
COMMENT ON COLUMN document_evaluation.evaluation_date IS 'Fecha de evaluación del documento.';
COMMENT ON COLUMN document_evaluation.is_approved IS 'Resultado de la evaluación del documento.';

CREATE UNIQUE INDEX uq_document_evaluation ON document_evaluation (evaluation_process_id, technical_document_id);
CREATE INDEX idx_doc_eval_process ON document_evaluation (evaluation_process_id);
CREATE INDEX idx_doc_eval_tech_doc ON document_evaluation (technical_document_id);
CREATE INDEX idx_doc_eval_approved ON document_evaluation (is_approved) WHERE is_approved = true;
CREATE INDEX idx_doc_eval_send_date ON document_evaluation (send_date);

--=========================================================
-- MUESTRAS
--========================================================= 

-- MUESTRA
CREATE TABLE sample ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
	supply_id INTEGER NOT NULL,
    request_date DATE NOT NULL,
    send_date_supplier DATE,
    date_receipt_warehouse DATE,
    date_receipt_client DATE,
    quantity NUMERIC(12, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    sample_code VARCHAR(100) NOT NULL,
	FOREIGN KEY (supply_id) 
	    REFERENCES supply (id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE
); 

COMMENT ON TABLE sample IS 'Registro de muestras enviadas/recibidas.';
COMMENT ON COLUMN sample.supply_id IS 'FK a supply.';
COMMENT ON COLUMN sample.request_date IS 'Fecha de solicitud de la muestra.';
COMMENT ON COLUMN sample.send_date_supplier IS 'Fecha de envío de la muestra al proveedor.';
COMMENT ON COLUMN sample.date_receipt_warehouse IS 'Fecha de recepción en el almacén.';
COMMENT ON COLUMN sample.date_receipt_client IS 'Fecha de recepción por el cliente.';
COMMENT ON COLUMN sample.quantity IS 'Cantidad de muestra recibida.';
COMMENT ON COLUMN sample.unit IS 'Unidad de medida de la muestra.';
COMMENT ON COLUMN sample.sample_code IS 'Código interno asignado a la muestra por FARMACUBA.';

CREATE UNIQUE INDEX uq_sample_code ON sample (sample_code);
CREATE UNIQUE INDEX uq_sample_logical ON sample (supply_id, request_date, quantity, unit);
CREATE INDEX idx_sample_supply ON sample (supply_id);
CREATE INDEX idx_sample_request_date ON sample (request_date);
CREATE INDEX idx_sample_receipt_client ON sample (date_receipt_client);
--CREATE INDEX idx_sample_code_search ON sample USING gin(lower(sample_code) gin_trgm_ops);


-- ANÁLISIS DE MUESTRA
CREATE TABLE sample_analysis ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
	sample_id INTEGER NOT NULL,
    performed_by_client INTEGER NOT NULL,
    analysis_date DATE,
	analysis_name VARCHAR(200),
	analysis_result_details TEXT,  -- Resultados detallados (JSON o texto)
    raw_data_path VARCHAR(500),
	FOREIGN KEY (sample_id) 
	    REFERENCES sample (id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (performed_by_client) 
	    REFERENCES client (id) 
		ON UPDATE CASCADE 
		ON DELETE RESTRICT
); 

COMMENT ON TABLE sample_analysis IS 'Análisis realizados sobre una muestra. Puede ser realizado por un cliente.';
COMMENT ON COLUMN sample_analysis.sample_id IS 'FK a sample: muestra a la que se realizó el análisis.';
COMMENT ON COLUMN sample_analysis.performed_by_client IS 'FK a client: cliente que realizó el análisis (si aplica).';
COMMENT ON COLUMN sample_analysis.analysis_date IS 'Fecha en la que se realizó el análisis).';
COMMENT ON COLUMN sample_analysis.analysis_name IS 'Nombre del analista que realizó el análisis.';
COMMENT ON COLUMN sample_analysis.analysis_result_details IS 'Resultados detallados del análisis (JSON o texto).';
COMMENT ON COLUMN sample_analysis.raw_data_path IS 'Ruta a los datos brutos del análisis.';

CREATE UNIQUE INDEX uq_sample_analysis ON sample_analysis (sample_id, performed_by_client, analysis_date);
CREATE INDEX idx_sample_analysis_sample ON sample_analysis (sample_id);
CREATE INDEX idx_sample_analysis_client ON sample_analysis (performed_by_client);
CREATE INDEX idx_sample_analysis_date ON sample_analysis (analysis_date);


-- EVALUACIÓN DE MUESTRA
CREATE TABLE sample_evaluation ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	evaluation_process_id INTEGER NOT NULL,
    sample_analysis_id INTEGER NOT NULL,
	self_performed BOOLEAN NOT NULL,
	send_analysis_date DATE,
    evaluation_date DATE,
	result result_sample_evaluation_enum,
    decision_continue BOOLEAN,
	FOREIGN KEY (evaluation_process_id) 
	    REFERENCES evaluation_process (id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (sample_analysis_id) 
	    REFERENCES sample_analysis (id) 
		ON UPDATE CASCADE 
		ON DELETE RESTRICT
); 

COMMENT ON TABLE sample_evaluation IS 'Cada cliente evalúa muestras del suministro; puede usar su propio análisis o adoptar el de otro cliente.';
COMMENT ON COLUMN sample_evaluation.evaluation_process_id IS 'FK a evaluation_process.';
COMMENT ON COLUMN sample_evaluation.sample_analysis_id IS 'FK a sample_analysis. Análisis de la muestra a evaluar.';
COMMENT ON COLUMN sample_evaluation.self_performed IS 'TRUE si el cliente realizó el análisis; FALSE si lo adoptó de otro cliente.';
COMMENT ON COLUMN sample_evaluation.send_analysis_date IS 'Fecha de envío del análisis de la muestra al cliente, si este no realizó el análisis.';
COMMENT ON COLUMN sample_evaluation.evaluation_date IS 'Fecha de evaluación del análisis de la muestra.';
COMMENT ON COLUMN sample_evaluation.result IS 'Indica si el cliente está conforme o no con el resultado del análisis.';
COMMENT ON COLUMN sample_evaluation.decision_continue IS 'Indica si el cliente decide continuar el proceso.';

CREATE UNIQUE INDEX uq_sample_evaluation ON sample_evaluation (evaluation_process_id, sample_analysis_id);
CREATE INDEX idx_sample_eval_process ON sample_evaluation (evaluation_process_id);
CREATE INDEX idx_sample_eval_analysis ON sample_evaluation (sample_analysis_id);
CREATE INDEX idx_sample_eval_conform ON sample_evaluation (result) WHERE result = 'Conforme';
CREATE INDEX idx_sample_eval_continue ON sample_evaluation (decision_continue) WHERE decision_continue = true;


--=========================================================
-- INDUSTRIAL EVALUATION
--=========================================================

-- COMPRA INDUSTRIAL
CREATE TABLE industrial_purchase ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
	evaluation_process_id INTEGER NOT NULL,
    request_date DATE NOT NULL,
    purchase_status state_industrial_purchasing_enum NOT NULL,
	FOREIGN KEY (evaluation_process_id)
        REFERENCES evaluation_process (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
); 

COMMENT ON TABLE industrial_purchase IS 'Registro de la compra de los tres lotes por parte del cliente para la evalución a escala industrial.';
COMMENT ON COLUMN industrial_purchase.evaluation_process_id IS 'FK a evaluation_process.';
COMMENT ON COLUMN industrial_purchase.request_date IS 'Fecha de solicitud de la compra de los tres lotes.';
COMMENT ON COLUMN industrial_purchase.purchase_status IS 'Estado de la compra (Concluida, Parcialmente concluida, ...).';

CREATE UNIQUE INDEX uq_industrial_purchase ON industrial_purchase (evaluation_process_id);
CREATE INDEX idx_ind_purchase_process ON industrial_purchase (evaluation_process_id);
CREATE INDEX idx_ind_purchase_status ON industrial_purchase (purchase_status);
CREATE INDEX idx_ind_purchase_request_date ON industrial_purchase (request_date);


-- EVALUACIÓN INDUSTRIAL
CREATE TABLE industrial_evaluation ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
	industrial_purchase_id INTEGER NOT NULL,
    send_batch_date DATE NOT NULL,
    reception_batch_date DATE,
    analysis_result result_industrial_analysis_enum,
    report_delivery_date DATE,
	FOREIGN KEY (industrial_purchase_id) 
	    REFERENCES industrial_purchase(id) 
	    ON UPDATE CASCADE 
	    ON DELETE CASCADE 
); 

COMMENT ON TABLE industrial_evaluation IS 'Resultado de la evaluación industrial de los lotes.';
COMMENT ON COLUMN industrial_evaluation.industrial_purchase_id IS 'FK a industrial_purchase. Registro de la compra de los lotes.';
COMMENT ON COLUMN industrial_evaluation.send_batch_date IS 'Fecha de envío de los lotes.';
COMMENT ON COLUMN industrial_evaluation.reception_batch_date IS 'Fecha de recepción de lotes por parte del cliente.';
COMMENT ON COLUMN industrial_evaluation.analysis_result IS 'Resultado: Buen desempeño, Defectuoso, No informado.';
COMMENT ON COLUMN industrial_evaluation.report_delivery_date IS 'Indica la fecha de entrega del informe. Si es NULL, el cliente no ha entregado el informe.';

CREATE UNIQUE INDEX uq_industrial_evaluation ON industrial_evaluation (industrial_purchase_id);
CREATE INDEX idx_ind_eval_purchase ON industrial_evaluation (industrial_purchase_id);
CREATE INDEX idx_ind_eval_send_date ON industrial_evaluation (send_batch_date);
CREATE INDEX idx_ind_eval_report_date ON industrial_evaluation (report_delivery_date);
CREATE INDEX idx_ind_eval_result ON industrial_evaluation (analysis_result);


--=========================================================
-- OBSERVACIONES
--=========================================================

-- OBSERVACIÓN
CREATE TABLE observation (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    observation_text TEXT NOT NULL,
    observation_date DATE NOT NULL DEFAULT CURRENT_DATE
);

COMMENT ON TABLE observation IS 'Observaciones textuales que pueden asociarse a solicitudes, ofertas, análisis, etc.';
COMMENT ON COLUMN observation.observation_text IS 'Texto de la observación.';
COMMENT ON COLUMN observation.observation_date IS 'Fecha en que se registró la observación.';

CREATE INDEX idx_observation_date ON observation (observation_date);
--CREATE INDEX idx_observation_text_search ON observation USING gin(to_tsvector('spanish', observation_text));


-- OBSERVACIÓN DE SOLICITUD
CREATE TABLE request_observation (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    application_id INTEGER NOT NULL,
    observation_id INTEGER NOT NULL,
    FOREIGN KEY (application_id)
        REFERENCES application (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (observation_id)
        REFERENCES observation (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT uq_req_obs UNIQUE (application_id, observation_id)
);

COMMENT ON TABLE request_observation IS 'Observaciones asociadas a una solicitud específica.';
COMMENT ON COLUMN request_observation.application_id IS 'FK a application.';
COMMENT ON COLUMN request_observation.observation_id IS 'FK a observation.';

CREATE INDEX idx_req_obs_application ON request_observation (application_id);
CREATE INDEX idx_req_obs_observation ON request_observation (observation_id);


-- OBSERVACIÓN DE OFERTA EXPLORATORIA
CREATE TABLE exploratory_offer_observation (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    exploratory_offer_id INTEGER NOT NULL,
    observation_id INTEGER NOT NULL,
    FOREIGN KEY (exploratory_offer_id)
        REFERENCES exploratory_offer (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (observation_id)
        REFERENCES observation (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT uq_eo_obs UNIQUE (exploratory_offer_id, observation_id)
);

COMMENT ON TABLE exploratory_offer_observation IS 'Observaciones aplicadas a las ofertas exploratorias durante su análisis.';
COMMENT ON COLUMN exploratory_offer_observation.exploratory_offer_id IS 'FK a exploratory_offer.';
COMMENT ON COLUMN exploratory_offer_observation.observation_id IS 'FK a observation.';

CREATE INDEX idx_eo_obs_offer ON exploratory_offer_observation (exploratory_offer_id);
CREATE INDEX idx_eo_obs_observation ON exploratory_offer_observation (observation_id);


-- OBSERVACIÓN DE EVALUACIÓN DE DOCUMENTO
CREATE TABLE document_evaluation_observation (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    document_evaluation_id INTEGER NOT NULL,
    observation_id INTEGER NOT NULL,
    FOREIGN KEY (document_evaluation_id)
        REFERENCES document_evaluation (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (observation_id)
        REFERENCES observation (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT uq_de_obs UNIQUE (document_evaluation_id, observation_id)
);

COMMENT ON TABLE document_evaluation_observation IS 'Observaciones aplicadas a las evaluaciones de los documentos.';
COMMENT ON COLUMN document_evaluation_observation.document_evaluation_id IS 'FK a document_evaluation.';
COMMENT ON COLUMN document_evaluation_observation.observation_id IS 'FK a observation.';

CREATE INDEX idx_de_obs_doc_eval ON document_evaluation_observation (document_evaluation_id);
CREATE INDEX idx_de_obs_observation ON document_evaluation_observation (observation_id);
	

-- OBSERVACIÓN DE COMPRA INDUSTRIAL
CREATE TABLE industrial_purchase_observation (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    industrial_purchase_id INTEGER NOT NULL,
    observation_id INTEGER NOT NULL,
    FOREIGN KEY (industrial_purchase_id)
        REFERENCES industrial_purchase (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (observation_id)
        REFERENCES observation (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT uq_ip_obs UNIQUE (industrial_purchase_id, observation_id)
);

COMMENT ON TABLE industrial_purchase_observation IS 'Observaciones aplicadas a las compras industriales.';
COMMENT ON COLUMN industrial_purchase_observation.industrial_purchase_id IS 'FK a industrial_purchase.';
COMMENT ON COLUMN industrial_purchase_observation.observation_id IS 'FK a observation.';

CREATE INDEX idx_ip_obs_purchase ON industrial_purchase_observation (industrial_purchase_id);
CREATE INDEX idx_ip_obs_observation ON industrial_purchase_observation (observation_id);


-- OBSERVACIÓN DE EVALUACIÓN INDUSTRIAL
CREATE TABLE industrial_evaluation_observation (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    industrial_evaluation_id INTEGER NOT NULL,
    observation_id INTEGER NOT NULL,
    FOREIGN KEY (industrial_evaluation_id)
        REFERENCES industrial_evaluation (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (observation_id)
        REFERENCES observation (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT uq_ie_obs UNIQUE (industrial_evaluation_id, observation_id)
);

COMMENT ON TABLE industrial_evaluation_observation IS 'Observaciones aplicadas a las evaluaciones industriales de los lotes.';
COMMENT ON COLUMN industrial_evaluation_observation.industrial_evaluation_id IS 'FK a industrial_evaluation.';
COMMENT ON COLUMN industrial_evaluation_observation.observation_id IS 'FK a observation.';

CREATE INDEX idx_ie_obs_evaluation ON industrial_evaluation_observation (industrial_evaluation_id);
CREATE INDEX idx_ie_obs_observation ON industrial_evaluation_observation (observation_id);


-- OBSERVACIÓN DE ANÁLISIS DE MUESTRA
CREATE TABLE sample_analysis_observation (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sample_analysis_id INTEGER NOT NULL,
    observation_id INTEGER NOT NULL,
    FOREIGN KEY (sample_analysis_id)
        REFERENCES sample_analysis (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (observation_id)
        REFERENCES observation (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT uq_sa_obs UNIQUE (sample_analysis_id, observation_id)
);

COMMENT ON TABLE sample_analysis_observation IS 'Observaciones aplicadas a los análisis de muestras.';
COMMENT ON COLUMN sample_analysis_observation.sample_analysis_id IS 'FK a sample_analysis.';
COMMENT ON COLUMN sample_analysis_observation.observation_id IS 'FK a observation.';

CREATE INDEX idx_sa_obs_analysis ON sample_analysis_observation (sample_analysis_id);
CREATE INDEX idx_sa_obs_observation ON sample_analysis_observation (observation_id);
	

-- OBSERVACIÓN DE EVALUACIÓN DE MUESTRA
CREATE TABLE sample_evaluation_observation (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sample_evaluation_id INTEGER NOT NULL,
    observation_id INTEGER NOT NULL,
    FOREIGN KEY (sample_evaluation_id)
        REFERENCES sample_evaluation (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (observation_id)
        REFERENCES observation (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT uq_se_obs UNIQUE (sample_evaluation_id, observation_id)
);

COMMENT ON TABLE sample_evaluation_observation IS 'Observaciones aplicadas a las evaluaciones de muestras.';
COMMENT ON COLUMN sample_evaluation_observation.sample_evaluation_id IS 'FK a sample_evaluation.';
COMMENT ON COLUMN sample_evaluation_observation.observation_id IS 'FK a observation.';

CREATE INDEX idx_se_obs_evaluation ON sample_evaluation_observation (sample_evaluation_id);
CREATE INDEX idx_se_obs_observation ON sample_evaluation_observation (observation_id);


--=========================================================
-- MANUFACTURER STATUS
--========================================================= 

-- MANUFACTURER_STATUS
CREATE TABLE manufacturer_status (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    maker_product_id INTEGER NOT NULL,           -- Relación con fabricante-producto
    start_date DATE NOT NULL,                    -- Fecha inicio del estado
    evaluation_state evaluation_state_manufacturer_enum NOT NULL DEFAULT 'Pendiente de Evaluación',
    end_date DATE,                               -- NULL = estado actual, tiene fecha = histórico
    evaluation_process_id INTEGER NULL,          -- NULL = estado global, tiene ID = estado por proceso
    FOREIGN KEY (maker_product_id) 
        REFERENCES maker_product (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (evaluation_process_id) 
        REFERENCES evaluation_process (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

COMMENT ON TABLE manufacturer_status IS 'Estado de evaluación y aprobación del fabricante para un producto específico. Permite estados por proceso (evaluation_process_id not null) y estados globales (evaluation_process_id null).';
COMMENT ON COLUMN manufacturer_status.maker_product_id IS 'FK a maker_product. Identifica la combinación fabricante-producto.';
COMMENT ON COLUMN manufacturer_status.start_date IS 'Fecha de inicio de este estado específico.';
COMMENT ON COLUMN manufacturer_status.evaluation_state IS 'Estado actual de la evaluación.';
COMMENT ON COLUMN manufacturer_status.end_date IS 'Fecha de fin del estado. NULL indica estado actual activo.';
COMMENT ON COLUMN manufacturer_status.evaluation_process_id IS 'FK a evaluation_process. NULL para estado global, not null para estado específico de un proceso.';

-- Índice para búsqueda rápida por fabricante-producto
CREATE INDEX idx_manufacturer_status_maker_product ON manufacturer_status (maker_product_id);
-- Índice para búsqueda por proceso
CREATE INDEX idx_manufacturer_status_process ON manufacturer_status (evaluation_process_id);
-- Índice para consultas históricas
CREATE INDEX idx_manufacturer_status_dates ON manufacturer_status (start_date, end_date);
-- Índice único para estado activo por proceso (no permite duplicados por proceso)
CREATE UNIQUE INDEX uq_manufacturer_status_active_per_process ON manufacturer_status (maker_product_id, evaluation_process_id) WHERE end_date IS NULL AND evaluation_process_id IS NOT NULL;
-- Índice único para estado global activo (solo un estado global activo por fabricante-producto)
CREATE UNIQUE INDEX uq_manufacturer_status_global_active ON manufacturer_status (maker_product_id) WHERE end_date IS NULL AND evaluation_process_id IS NULL;


--=========================================================
-- USER ACCOUNT
--=========================================================

-- USER_ACCOUNT
CREATE TABLE user_account (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'Observador',
	full_name VARCHAR(255) NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT true
);

COMMENT ON TABLE user_account IS 'Usuarios del sistema con roles y permisos.';
COMMENT ON COLUMN user_account.username IS 'Nombre de usuario para login.';
COMMENT ON COLUMN user_account.password IS 'Contraseña de acceso del usuario.';
COMMENT ON COLUMN user_account.role IS 'Rol del usuario.';
COMMENT ON COLUMN user_account.full_name IS 'Nombre completo del usuario.';
COMMENT ON COLUMN user_account.is_active IS 'Indica si el usuario esta activo o no.';

CREATE UNIQUE INDEX uq_user_account_username ON user_account (lower(username));
CREATE INDEX idx_user_account_role ON user_account (role);
CREATE INDEX idx_user_account_active ON user_account (is_active) WHERE is_active = true;


--=========================================================
-- ÍNDICES ADICIONALES PARA RENDIMIENTO
--=========================================================

-- Índices para estadísticas
CREATE INDEX idx_exploratory_price ON exploratory_offer (offered_price, is_competitive);
CREATE INDEX idx_sample_status ON sample (request_date, date_receipt_client);
CREATE INDEX idx_offers_client_date ON exploratory_offer (evaluation_process_id, analysis_date);
CREATE INDEX idx_samples_supplier_date ON sample (supply_id, request_date, date_receipt_client);

-- Índices para búsquedas por supply_id
CREATE INDEX idx_sample_supply_id ON sample(supply_id);
CREATE INDEX idx_evaluation_process_supply_id ON evaluation_process(supply_id);
CREATE INDEX idx_sample_evaluation_process_supply ON sample_evaluation(evaluation_process_id, sample_analysis_id);
CREATE INDEX idx_sample_analysis_sample_id ON sample_analysis(sample_id);
CREATE INDEX idx_technical_document_supply_id ON technical_document(supply_id);


--=========================================================
-- PROCEDIMIENTOS ALMACENADOS
--=========================================================

-- PROCEDIMIENTO PARA ARCHIVAR SOLICITUD
CREATE OR REPLACE PROCEDURE archive_application(
    p_application_id INTEGER,
    p_reason archive_reason_enum DEFAULT NULL,
    p_archive_processes BOOLEAN DEFAULT TRUE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_application_exists BOOLEAN;
    v_current_state lifecycle_state_enum;
    v_affected_rows INTEGER;
    v_reason_text TEXT;
    v_processes_count INTEGER := 0;
    v_observation_id INTEGER;
    v_has_lifecycle_state BOOLEAN;
BEGIN
    -- 1. VALIDAR QUE LA SOLICITUD EXISTA
    SELECT EXISTS (SELECT 1 FROM application WHERE id = p_application_id)
    INTO v_application_exists;
    
    IF NOT v_application_exists THEN
        RAISE EXCEPTION 'La solicitud con ID % no existe', p_application_id;
    END IF;
    
    -- 2. OBTENER ESTADO ACTUAL
    SELECT lifecycle_state INTO v_current_state
    FROM application
    WHERE id = p_application_id;
    
    -- 3. VALIDAR QUE NO ESTÉ YA ARCHIVADA
    IF v_current_state = 'Archivado' THEN
        RAISE NOTICE 'La solicitud % ya está archivada', p_application_id;
        RETURN;
    END IF;
    
    -- 4. DETERMINAR LA RAZÓN DE ARCHIVO
    IF p_reason IS NULL THEN
        IF EXISTS (
            SELECT 1 FROM application 
            WHERE id = p_application_id AND is_selected = false
        ) THEN
            v_reason_text := 'Solicitud no seleccionada para evaluar';
        ELSE
            v_reason_text := 'Archivado manualmente';
        END IF;
    ELSE
        v_reason_text := p_reason::TEXT;
    END IF;
    
    -- 5. VERIFICAR SI evaluation_process TIENE COLUMNA lifecycle_state
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'evaluation_process' 
          AND column_name = 'lifecycle_state'
    ) INTO v_has_lifecycle_state;
    
    -- 6. INICIAR TRANSACCIÓN IMPLÍCITA
    BEGIN
        -- 7. ARCHIVAR LA SOLICITUD
        UPDATE application
        SET 
            lifecycle_state = 'Archivado',
            archive_date = CURRENT_DATE,
            archive_reason = v_reason_text::archive_reason_enum
        WHERE id = p_application_id
          AND lifecycle_state = 'Activo'
        RETURNING 1 INTO v_affected_rows;
        
        IF v_affected_rows = 0 THEN
            RAISE EXCEPTION 'No se pudo archivar la solicitud % (posiblemente ya fue modificada por otro usuario)', p_application_id;
        END IF;
        
        -- 8. ARCHIVAR LOS PROCESOS DE EVALUACIÓN ASOCIADOS (SI SE SOLICITA)
        IF p_archive_processes THEN
            IF v_has_lifecycle_state THEN
                WITH archived_processes AS (
                    UPDATE evaluation_process
                    SET 
                        lifecycle_state = 'Archivado',
                        archive_date = CURRENT_DATE,
                        archive_reason = CONCAT('Archivado con solicitud ', p_application_id)::archive_reason_enum
                    WHERE application_id = p_application_id
                      AND lifecycle_state = 'Activo'
                    RETURNING id
                )
                SELECT COUNT(*) INTO v_processes_count FROM archived_processes;
            ELSE
                SELECT COUNT(*) INTO v_processes_count
                FROM evaluation_process
                WHERE application_id = p_application_id;
                
                RAISE WARNING 'La tabla evaluation_process no tiene columna lifecycle_state. % procesos NO archivados.', v_processes_count;
            END IF;
        END IF;
        
        -- 9. REGISTRAR OBSERVACIÓN DEL ARCHIVO
        INSERT INTO observation (observation_text, observation_date)
        VALUES (
            'Solicitud archivada. Razón: ' || v_reason_text || 
            ' | ID Solicitud: ' || p_application_id || 
            ' | Procesos afectados: ' || v_processes_count || 
            CASE WHEN p_archive_processes AND v_has_lifecycle_state THEN ' (archivados)' 
                 WHEN p_archive_processes THEN ' (no archivados - sin columna lifecycle_state)' 
                 ELSE ' (no archivados - configuración)' 
            END,
            CURRENT_DATE
        )
        RETURNING id INTO v_observation_id;
        
        INSERT INTO request_observation (application_id, observation_id)
        VALUES (p_application_id, v_observation_id);
        
        -- 10. NOTIFICAR ÉXITO
        IF p_archive_processes AND v_has_lifecycle_state THEN
            RAISE NOTICE '✅ Solicitud % archivada exitosamente. Razón: %. % procesos archivados.', 
                p_application_id, v_reason_text, v_processes_count;
        ELSIF p_archive_processes THEN
            RAISE NOTICE '⚠️ Solicitud % archivada. Razón: %. % procesos NO archivados (falta columna lifecycle_state).', 
                p_application_id, v_reason_text, v_processes_count;
        ELSE
            RAISE NOTICE 'ℹ️ Solicitud % archivada. Razón: %. Procesos no archivados (configuración).', 
                p_application_id, v_reason_text;
        END IF;
        
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION '❌ Error al archivar solicitud %: %', p_application_id, SQLERRM;
    END;
END;
$$;

COMMENT ON PROCEDURE archive_application IS 'Archiva una solicitud y opcionalmente sus procesos de evaluación asociados, con validaciones y trazabilidad.';


-- PROCEDIMIENTO PARA ACTUALIZACIÓN MANUAL DE ESTADO DEL FABRICANTE (CORREGIDO)
CREATE OR REPLACE PROCEDURE update_manufacturer_status_manual(
    p_maker_product_id INTEGER,
    p_evaluation_process_id INTEGER DEFAULT NULL,
    p_new_status evaluation_state_manufacturer_enum DEFAULT NULL,
    p_reason TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_status evaluation_state_manufacturer_enum;
    v_application_id INTEGER;
    v_observation_id INTEGER;
    v_is_global BOOLEAN;
    v_allowed_statuses evaluation_state_manufacturer_enum[];
    v_default_status evaluation_state_manufacturer_enum := 'Contrato a Riesgo (COA o muestras)';
BEGIN
    -- Validar parámetros requeridos
    IF p_maker_product_id IS NULL THEN
        RAISE EXCEPTION 'El ID del producto-fabricante no puede ser NULL';
    END IF;
    
    -- Si p_new_status es NULL, usar valor por defecto
    IF p_new_status IS NULL THEN
        p_new_status := v_default_status;
    END IF;
    
    -- Determinar si es actualización global o por proceso
    v_is_global := (p_evaluation_process_id IS NULL);
    
    -- Obtener estado actual
    SELECT evaluation_state INTO v_current_status
    FROM manufacturer_status
    WHERE maker_product_id = p_maker_product_id
      AND evaluation_process_id IS NOT DISTINCT FROM p_evaluation_process_id
      AND end_date IS NULL;
    
    -- Si no hay estado actual, crear uno nuevo (para nuevos registros)
    IF v_current_status IS NULL THEN
        v_current_status := 'Pendiente de Evaluación';
        
        -- Insertar estado inicial si no existe
        INSERT INTO manufacturer_status 
            (maker_product_id, evaluation_process_id, start_date, evaluation_state, end_date)
        VALUES 
            (p_maker_product_id, p_evaluation_process_id, CURRENT_DATE, v_current_status, NULL);
    END IF;
    
    -- Definir estados permitidos para actualización manual
    IF v_is_global THEN
        v_allowed_statuses := ARRAY[
            'Contrato a Riesgo (COA o muestras)'
        ]::evaluation_state_manufacturer_enum[];
    ELSE
        v_allowed_statuses := ARRAY[
            'Pendiente de Documentación',
            'Pendiente de Muestra',
            'Pendiente de Decisión de Escala Industrial',
            'Contrato a Riesgo (COA o muestras)'
        ]::evaluation_state_manufacturer_enum[];
    END IF;
    
    -- Verificar que el estado actual permita cambio manual
    IF v_current_status NOT IN ('Pendiente de Evaluación', 'Pendiente de Documentación') THEN
        RAISE EXCEPTION 'No se puede actualizar manualmente desde el estado %', v_current_status;
    END IF;
    
    -- Verificar que el nuevo estado esté permitido
    IF p_new_status != ALL(v_allowed_statuses) THEN
        RAISE EXCEPTION 'Estado % no permitido para actualización manual. Estados permitidos: %', 
            p_new_status, array_to_string(v_allowed_statuses, ', ');
    END IF;
    
    -- Actualizar el estado usando la función con historial
    PERFORM update_manufacturer_status_with_history(
        p_maker_product_id,
        p_evaluation_process_id,
        COALESCE(p_new_status, 'Contrato a Riesgo (COA o muestras)')::evaluation_state_manufacturer_enum
    );
    
    -- Registrar observación (si se proporcionó razón o para tracking)
    IF p_reason IS NOT NULL OR TRUE THEN  -- Siempre registrar observación para trazabilidad
        -- Encontrar aplicación relacionada
        SELECT ep.application_id INTO v_application_id
        FROM evaluation_process ep
        JOIN supply s ON s.id = ep.supply_id
        JOIN maker_product mp ON mp.id = s.maker_product_id
        WHERE mp.id = p_maker_product_id
          AND (p_evaluation_process_id IS NULL OR ep.id = p_evaluation_process_id)
        LIMIT 1;
        
        IF v_application_id IS NOT NULL THEN
            INSERT INTO observation (observation_text, observation_date)
            VALUES (
                'Actualización manual de estado del fabricante: ' || 
                COALESCE(p_reason, 'Sin razón especificada') || 
                ' (Estado anterior: ' || COALESCE(v_current_status::text, 'Nuevo') || 
                ', Nuevo estado: ' || p_new_status::text || 
                CASE WHEN p_evaluation_process_id IS NOT NULL 
                     THEN ', Proceso: ' || p_evaluation_process_id 
                     ELSE ', Estado global' 
                END || ', Maker Product ID: ' || p_maker_product_id || ')',
                CURRENT_DATE
            )
            RETURNING id INTO v_observation_id;
            
            INSERT INTO request_observation (application_id, observation_id)
            VALUES (v_application_id, v_observation_id);
        ELSE
            -- Si no hay aplicación relacionada, registrar observación general
            INSERT INTO observation (observation_text, observation_date)
            VALUES (
                'Actualización manual de estado del fabricante: ' || 
                COALESCE(p_reason, 'Sin razón especificada') || 
                ' (Estado anterior: ' || COALESCE(v_current_status::text, 'Nuevo') || 
                ', Nuevo estado: ' || p_new_status::text || 
                CASE WHEN p_evaluation_process_id IS NOT NULL 
                     THEN ', Proceso: ' || p_evaluation_process_id 
                     ELSE ', Estado global' 
                END || ', Maker Product ID: ' || p_maker_product_id || ')',
                CURRENT_DATE
            );
        END IF;
    END IF;
    
    RAISE NOTICE '✅ Estado del fabricante % actualizado manualmente de % a %', 
        p_maker_product_id, v_current_status, p_new_status;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION '❌ Error al actualizar estado manualmente: %', SQLERRM;
END;
$$;

COMMENT ON PROCEDURE update_manufacturer_status_manual IS 'Permite actualizaciones manuales controladas del estado del fabricante. Todos los parámetros opcionales tienen valores por defecto.';


--=========================================================
-- FUNCIONES
--=========================================================

-- Función para obtener el fabricante-producto de un proceso de evaluación
CREATE OR REPLACE FUNCTION get_maker_product_from_process(
    p_evaluation_process_id INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_maker_product_id INTEGER;
BEGIN
    SELECT mp.id INTO v_maker_product_id
    FROM evaluation_process ep
    JOIN supply s ON s.id = ep.supply_id
    JOIN maker_product mp ON mp.id = s.maker_product_id
    WHERE ep.id = p_evaluation_process_id;
    
    RETURN v_maker_product_id;
END;
$$;

COMMENT ON FUNCTION get_maker_product_from_process IS 'Obtiene el ID del maker_product a partir de un evaluation_process_id';


-- FUNCIÓN PRINCIPAL - DETERMINA ESTADO POR PROCESO
CREATE OR REPLACE FUNCTION determine_manufacturer_status(
    p_maker_product_id INTEGER,
    p_evaluation_process_id INTEGER DEFAULT NULL
) 
RETURNS evaluation_state_manufacturer_enum
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_has_competitive_offer BOOLEAN;
    v_has_non_competitive_offer BOOLEAN;
    v_has_documents_requested BOOLEAN;
    v_all_documents_approved BOOLEAN;
    v_has_pending_documents BOOLEAN;
    v_has_rejected_documents BOOLEAN;
    v_has_samples_requested BOOLEAN;
    v_has_samples_evaluated BOOLEAN;
    v_all_samples_conforme BOOLEAN;
    v_has_non_conforme_samples BOOLEAN;
    v_decision_continue BOOLEAN;
    v_has_industrial_request BOOLEAN;
    v_industrial_status state_industrial_purchasing_enum;
    v_has_industrial_evaluation BOOLEAN;
    v_industrial_result result_industrial_analysis_enum;
    v_has_report BOOLEAN;
BEGIN
    -- 1. Verificar oferta exploratoria
    IF p_evaluation_process_id IS NOT NULL THEN
        -- Para proceso específico
        SELECT 
            EXISTS (SELECT 1 FROM exploratory_offer WHERE evaluation_process_id = p_evaluation_process_id AND is_competitive = true),
            EXISTS (SELECT 1 FROM exploratory_offer WHERE evaluation_process_id = p_evaluation_process_id AND is_competitive = false)
        INTO v_has_competitive_offer, v_has_non_competitive_offer;
    ELSE
        -- Para estado global
        SELECT 
            EXISTS (
                SELECT 1 FROM exploratory_offer eo
                JOIN evaluation_process ep ON ep.id = eo.evaluation_process_id
                JOIN supply s ON s.id = ep.supply_id
                WHERE s.maker_product_id = p_maker_product_id
                  AND eo.is_competitive = true
            ),
            EXISTS (
                SELECT 1 FROM exploratory_offer eo
                JOIN evaluation_process ep ON ep.id = eo.evaluation_process_id
                JOIN supply s ON s.id = ep.supply_id
                WHERE s.maker_product_id = p_maker_product_id
                  AND eo.is_competitive = false
            )
        INTO v_has_competitive_offer, v_has_non_competitive_offer;
    END IF;
    
    -- Lógica de ofertas
    IF v_has_non_competitive_offer THEN
        RETURN 'No Aprobado';
    ELSIF NOT v_has_competitive_offer THEN
        RETURN 'Pendiente de Evaluación';
    END IF;
    
    -- 2. Verificar documentos técnicos
    IF p_evaluation_process_id IS NOT NULL THEN
        -- Para proceso específico
        SELECT 
            EXISTS (
                SELECT 1 FROM technical_document td
                JOIN supply s ON s.id = td.supply_id
                JOIN evaluation_process ep ON ep.supply_id = s.id
                WHERE ep.id = p_evaluation_process_id
                  AND td.request_date IS NOT NULL
            ),
            NOT EXISTS (
                SELECT 1 FROM technical_document td
                JOIN supply s ON s.id = td.supply_id
                JOIN evaluation_process ep ON ep.supply_id = s.id
                WHERE ep.id = p_evaluation_process_id
                  AND td.request_date IS NOT NULL
                  AND NOT EXISTS (
                      SELECT 1 FROM document_evaluation de
                      WHERE de.technical_document_id = td.id
                        AND de.evaluation_process_id = p_evaluation_process_id
                        AND de.is_approved = true
                  )
            ),
            EXISTS (
                SELECT 1 FROM technical_document td
                JOIN supply s ON s.id = td.supply_id
                JOIN evaluation_process ep ON ep.supply_id = s.id
                WHERE ep.id = p_evaluation_process_id
                  AND td.request_date IS NOT NULL
                  AND NOT EXISTS (
                      SELECT 1 FROM document_evaluation de
                      WHERE de.technical_document_id = td.id
                        AND de.evaluation_process_id = p_evaluation_process_id
                  )
            ),
            EXISTS (
                SELECT 1 FROM document_evaluation de
                JOIN technical_document td ON td.id = de.technical_document_id
                JOIN supply s ON s.id = td.supply_id
                JOIN evaluation_process ep ON ep.supply_id = s.id
                WHERE ep.id = p_evaluation_process_id
                  AND de.is_approved = false
            )
        INTO v_has_documents_requested, v_all_documents_approved, 
             v_has_pending_documents, v_has_rejected_documents;
    ELSE
        -- Para estado global (lógica simplificada)
        SELECT 
            EXISTS (
                SELECT 1 FROM technical_document td
                JOIN supply s ON s.id = td.supply_id
                WHERE s.maker_product_id = p_maker_product_id
                  AND td.request_date IS NOT NULL
            )
        INTO v_has_documents_requested;
    END IF;
    
    -- Lógica de documentos
    IF NOT v_has_documents_requested THEN
        RETURN 'Pendiente de Documentación';
    END IF;
    
    IF v_has_rejected_documents THEN
        RETURN 'No Aprobado';
    END IF;
    
    IF v_has_pending_documents OR NOT v_all_documents_approved THEN
        RETURN 'Pendiente de Documentación';
    END IF;
    
    -- 3. Verificar muestras (solo para proceso específico)
    IF p_evaluation_process_id IS NOT NULL THEN
        -- 3.1. Verificar si hay muestras solicitadas
        SELECT EXISTS (
            SELECT 1 FROM sample s
            JOIN supply sup ON sup.id = s.supply_id
            JOIN evaluation_process ep ON ep.supply_id = sup.id
            WHERE ep.id = p_evaluation_process_id
              AND s.request_date IS NOT NULL
        ) INTO v_has_samples_requested;
        
        IF NOT v_has_samples_requested THEN
            RETURN 'Pendiente de Muestra';
        END IF;
        
        -- 3.2. Verificar si alguna muestra tiene evaluación NO conforme
        SELECT EXISTS (
            SELECT 1 FROM sample_evaluation se
            JOIN sample_analysis sa ON sa.id = se.sample_analysis_id
            JOIN sample smp ON smp.id = sa.sample_id
            JOIN supply s ON s.id = smp.supply_id
            JOIN evaluation_process ep ON ep.supply_id = s.id
            WHERE ep.id = p_evaluation_process_id
              AND se.result = 'No Conforme'
              AND se.evaluation_date IS NOT NULL
        ) INTO v_has_non_conforme_samples;
        
        IF v_has_non_conforme_samples THEN
            RETURN 'No Aprobado';
        END IF;
        
        -- 3.3. Verificar si TODAS las muestras tienen evaluación CONFORME
        -- Primero contar muestras solicitadas
        WITH sample_counts AS (
            SELECT 
                COUNT(DISTINCT s.id) as total_samples,
                COUNT(DISTINCT CASE 
                    WHEN se.result = 'Conforme' AND se.evaluation_date IS NOT NULL 
                    THEN s.id 
                END) as conforme_samples
            FROM sample s
            JOIN supply sup ON sup.id = s.supply_id
            JOIN evaluation_process ep ON ep.supply_id = sup.id
            LEFT JOIN sample_analysis sa ON sa.sample_id = s.id
            LEFT JOIN sample_evaluation se ON se.sample_analysis_id = sa.id
            WHERE ep.id = p_evaluation_process_id
              AND s.request_date IS NOT NULL
        )
        SELECT 
            conforme_samples > 0,
            total_samples = conforme_samples
        INTO v_has_samples_evaluated, v_all_samples_conforme
        FROM sample_counts;
        
        -- 3.4. Si no hay evaluaciones de muestra todavía
        IF NOT v_has_samples_evaluated THEN
            RETURN 'Pendiente de Muestra';
        END IF;
        
        -- 3.5. Si no todas las muestras están conformes
        IF NOT v_all_samples_conforme THEN
            -- Podría haber muestras pendientes de evaluación
            -- Verificar si hay muestras sin evaluación
            IF EXISTS (
                SELECT 1 FROM sample s
                JOIN supply sup ON sup.id = s.supply_id
                JOIN evaluation_process ep ON ep.supply_id = sup.id
                LEFT JOIN sample_analysis sa ON sa.sample_id = s.id
                LEFT JOIN sample_evaluation se ON se.sample_analysis_id = sa.id
                WHERE ep.id = p_evaluation_process_id
                  AND s.request_date IS NOT NULL
                  AND (sa.id IS NULL OR se.id IS NULL)
            ) THEN
                RETURN 'Pendiente de Muestra';
            ELSE
                -- Todas evaluadas pero no todas conformes (pero tampoco "No Conforme")
                -- Esto podría ser un estado intermedio
                RETURN 'Pendiente de Decisión de Escala Industrial';
            END IF;
        END IF;
        
    END IF;
    
    -- 4. Verificar decisión de continuar a escala industrial
    IF p_evaluation_process_id IS NOT NULL THEN
        SELECT EXISTS (
            SELECT 1 FROM sample_evaluation se
            JOIN evaluation_process ep ON ep.id = se.evaluation_process_id
            WHERE ep.id = p_evaluation_process_id
              AND se.decision_continue = true
              AND se.evaluation_date IS NOT NULL
        ) INTO v_decision_continue;
    ELSE
        -- Para estado global
        SELECT EXISTS (
            SELECT 1 FROM sample_evaluation se
            JOIN evaluation_process ep ON ep.id = se.evaluation_process_id
            JOIN supply s ON s.id = ep.supply_id
            WHERE s.maker_product_id = p_maker_product_id
              AND se.decision_continue = true
              AND se.evaluation_date IS NOT NULL
        ) INTO v_decision_continue;
    END IF;
    
    IF NOT v_decision_continue THEN
        RETURN 'Pendiente de Decisión de Escala Industrial';
    END IF;
    
    -- 5. Verificar compra industrial
    IF p_evaluation_process_id IS NOT NULL THEN
        SELECT 
            EXISTS (
                SELECT 1 FROM industrial_purchase ip
                WHERE ip.evaluation_process_id = p_evaluation_process_id
            ),
            COALESCE(
                (SELECT purchase_status 
                 FROM industrial_purchase ip
                 WHERE ip.evaluation_process_id = p_evaluation_process_id
                 ORDER BY ip.request_date DESC
                 LIMIT 1),
                'Pendiente de Embarque'::state_industrial_purchasing_enum
            )
        INTO v_has_industrial_request, v_industrial_status;
    ELSE
        SELECT 
            EXISTS (
                SELECT 1 FROM industrial_purchase ip
                JOIN evaluation_process ep ON ep.id = ip.evaluation_process_id
                JOIN supply s ON s.id = ep.supply_id
                WHERE s.maker_product_id = p_maker_product_id
            ),
            COALESCE(
                (SELECT purchase_status 
                 FROM industrial_purchase ip
                 JOIN evaluation_process ep ON ep.id = ip.evaluation_process_id
                 JOIN supply s ON s.id = ep.supply_id
                 WHERE s.maker_product_id = p_maker_product_id
                 ORDER BY ip.request_date DESC
                 LIMIT 1),
                'Pendiente de Embarque'::state_industrial_purchasing_enum
            )
        INTO v_has_industrial_request, v_industrial_status;
    END IF;
    
    IF NOT v_has_industrial_request THEN
        RETURN 'Pendiente de Compra Industrial';
    END IF;
    
    IF v_industrial_status != 'Concluida' THEN
        RETURN 'Pendiente de Compra Industrial';
    END IF;
    
    -- 6. Verificar evaluación industrial
    IF p_evaluation_process_id IS NOT NULL THEN
        SELECT 
            EXISTS (
                SELECT 1 FROM industrial_evaluation ie
                JOIN industrial_purchase ip ON ip.id = ie.industrial_purchase_id
                WHERE ip.evaluation_process_id = p_evaluation_process_id
            ),
            COALESCE(
                (SELECT analysis_result 
                 FROM industrial_evaluation ie
                 JOIN industrial_purchase ip ON ip.id = ie.industrial_purchase_id
                 WHERE ip.evaluation_process_id = p_evaluation_process_id
                 ORDER BY ie.reception_batch_date DESC
                 LIMIT 1),
                'No Informado'::result_industrial_analysis_enum
            )
        INTO v_has_industrial_evaluation, v_industrial_result;
    ELSE
        SELECT 
            EXISTS (
                SELECT 1 FROM industrial_evaluation ie
                JOIN industrial_purchase ip ON ip.id = ie.industrial_purchase_id
                JOIN evaluation_process ep ON ep.id = ip.evaluation_process_id
                JOIN supply s ON s.id = ep.supply_id
                WHERE s.maker_product_id = p_maker_product_id
            ),
            COALESCE(
                (SELECT analysis_result 
                 FROM industrial_evaluation ie
                 JOIN industrial_purchase ip ON ip.id = ie.industrial_purchase_id
                 JOIN evaluation_process ep ON ep.id = ip.evaluation_process_id
                 JOIN supply s ON s.id = ep.supply_id
                 WHERE s.maker_product_id = p_maker_product_id
                 ORDER BY ie.reception_batch_date DESC
                 LIMIT 1),
                'No Informado'::result_industrial_analysis_enum
            )
        INTO v_has_industrial_evaluation, v_industrial_result;
    END IF;
    
    IF NOT v_has_industrial_evaluation THEN
        RETURN 'Pendiente de Evaluación Industrial';
    END IF;
    
    IF v_industrial_result = 'No Informado' THEN
        RETURN 'Pendiente de Evaluación Industrial';
    END IF;
    
    -- 7. Verificar informe entregado
    IF p_evaluation_process_id IS NOT NULL THEN
        SELECT EXISTS (
            SELECT 1 FROM industrial_evaluation ie
            JOIN industrial_purchase ip ON ip.id = ie.industrial_purchase_id
            WHERE ip.evaluation_process_id = p_evaluation_process_id
              AND ie.report_delivery_date IS NOT NULL
        ) INTO v_has_report;
    ELSE
        SELECT EXISTS (
            SELECT 1 FROM industrial_evaluation ie
            JOIN industrial_purchase ip ON ip.id = ie.industrial_purchase_id
            JOIN evaluation_process ep ON ep.id = ip.evaluation_process_id
            JOIN supply s ON s.id = ep.supply_id
            WHERE s.maker_product_id = p_maker_product_id
              AND ie.report_delivery_date IS NOT NULL
        ) INTO v_has_report;
    END IF;
    
    IF NOT v_has_report THEN
        RETURN 'Pendiente de Informe';
    END IF;
    
    -- 8. Resultado final
    IF v_industrial_result = 'Buen Desempeño' THEN
        RETURN 'Aprobado';
    ELSE
        RETURN 'No Aprobado';
    END IF;
    
    -- Estado por defecto
    RETURN 'Pendiente de Evaluación';
EXCEPTION
    WHEN OTHERS THEN
        -- Si hay error, retornar estado por defecto
        RAISE WARNING 'Error en determine_manufacturer_status: %', SQLERRM;
        RETURN 'Pendiente de Evaluación';
END;
$$;

COMMENT ON FUNCTION determine_manufacturer_status IS 'Determina el estado actual de un fabricante-producto de forma robusta con manejo de errores.';


-- FUNCIÓN PARA DETERMINAR ESTADO GLOBAL
CREATE OR REPLACE FUNCTION determine_global_manufacturer_status(
    p_maker_product_id INTEGER
) 
RETURNS evaluation_state_manufacturer_enum
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_process_states evaluation_state_manufacturer_enum[];
    v_evaluation_states INTEGER;
    v_approved_count INTEGER;
    v_not_approved_count INTEGER;
    v_pending_evaluation_count INTEGER;
    v_worst_status evaluation_state_manufacturer_enum;
BEGIN
    -- Obtener todos los estados activos por proceso
    SELECT ARRAY_AGG(DISTINCT ms.evaluation_state),
           COUNT(*) FILTER (WHERE ms.evaluation_state IN ('Aprobado', 'No Aprobado')),
           COUNT(*) FILTER (WHERE ms.evaluation_state = 'Aprobado'),
           COUNT(*) FILTER (WHERE ms.evaluation_state = 'No Aprobado'),
           COUNT(*) FILTER (WHERE ms.evaluation_state = 'Pendiente de Evaluación')
    INTO v_process_states, v_evaluation_states, v_approved_count, 
         v_not_approved_count, v_pending_evaluation_count
    FROM manufacturer_status ms
    WHERE ms.maker_product_id = p_maker_product_id
      AND ms.evaluation_process_id IS NOT NULL
      AND ms.end_date IS NULL;
    
    -- Si no hay procesos activos
    IF v_process_states IS NULL THEN
        RETURN 'Pendiente de Evaluación';
    END IF;
    
    -- Lógica para determinar estado global:
    
    -- 1. Si algún proceso está "Aprobado" y ninguno "No Aprobado"
    IF v_approved_count > 0 AND v_not_approved_count = 0 THEN
        -- Verificar si hay procesos pendientes
        IF EXISTS (
            SELECT 1 FROM manufacturer_status ms
            WHERE ms.maker_product_id = p_maker_product_id
              AND ms.evaluation_process_id IS NOT NULL
              AND ms.end_date IS NULL
              AND ms.evaluation_state NOT IN ('Aprobado', 'No Aprobado')
        ) THEN
            RETURN 'Contrato a Riesgo (COA o muestras)';
        ELSE
            RETURN 'Aprobado';
        END IF;
    
    -- 2. Si hay algún "No Aprobado"
    ELSIF v_not_approved_count > 0 THEN
        -- Si todos los procesos están "No Aprobado"
        IF v_not_approved_count = array_length(v_process_states, 1) THEN
            RETURN 'No Aprobado';
        ELSE
            -- Si hay mezcla de estados
            RETURN 'Contrato a Riesgo (COA o muestras)';
        END IF;
    
    -- 3. Determinar el "peor" estado entre los procesos activos
    ELSE
        -- Jerarquía de estados (de peor a mejor para el fabricante)
        v_worst_status := CASE
            WHEN 'Pendiente de Evaluación' = ANY(v_process_states) THEN 
                'Pendiente de Evaluación'
            WHEN 'Pendiente de Documentación' = ANY(v_process_states) THEN 
                'Pendiente de Documentación'
            WHEN 'Pendiente de Muestra' = ANY(v_process_states) THEN 
                'Pendiente de Muestra'
            WHEN 'Pendiente de Decisión de Escala Industrial' = ANY(v_process_states) THEN 
                'Pendiente de Decisión de Escala Industrial'
            WHEN 'Pendiente de Compra Industrial' = ANY(v_process_states) THEN 
                'Pendiente de Compra Industrial'
            WHEN 'Pendiente de Evaluación Industrial' = ANY(v_process_states) THEN 
                'Pendiente de Evaluación Industrial'
            WHEN 'Pendiente de Informe' = ANY(v_process_states) THEN 
                'Pendiente de Informe'
            WHEN 'Contrato a Riesgo (COA o muestras)' = ANY(v_process_states) THEN 
                'Contrato a Riesgo (COA o muestras)'
            ELSE 'Pendiente de Evaluación'
        END;
        
        RETURN v_worst_status;
    END IF;
END;
$$;

COMMENT ON FUNCTION determine_global_manufacturer_status IS 'Determina el estado global de un fabricante considerando todos sus procesos activos.';


-- FUNCIÓN PARA ACTUALIZAR ESTADO CON HISTORIAL
-- CORREGIR LA FUNCIÓN update_manufacturer_status_with_history
CREATE OR REPLACE FUNCTION update_manufacturer_status_with_history(
    p_maker_product_id INTEGER,
    p_evaluation_process_id INTEGER DEFAULT NULL,
    p_new_status evaluation_state_manufacturer_enum DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_record_id INTEGER;
    v_new_record_id INTEGER;
    v_current_status evaluation_state_manufacturer_enum;
    v_current_start_date DATE;
    v_process_info TEXT;
    v_default_status evaluation_state_manufacturer_enum := 'Pendiente de Evaluación';
    v_new_end_date DATE;
BEGIN
    -- Validar parámetros requeridos
    IF p_maker_product_id IS NULL THEN
        RAISE EXCEPTION 'El ID del producto-fabricante no puede ser NULL';
    END IF;
    
    -- Si p_new_status es NULL, usar valor por defecto
    IF p_new_status IS NULL THEN
        p_new_status := v_default_status;
    END IF;
    
    -- 1. OBTENER el registro actual (end_date IS NULL)
    SELECT id, evaluation_state, start_date 
    INTO v_current_record_id, v_current_status, v_current_start_date
    FROM manufacturer_status
    WHERE maker_product_id = p_maker_product_id
      AND evaluation_process_id IS NOT DISTINCT FROM p_evaluation_process_id
      AND end_date IS NULL;
    
    -- 2. Si el estado no cambia, no hacer nada
    IF v_current_status IS NOT NULL AND v_current_status = p_new_status THEN
        RETURN COALESCE(v_current_record_id, 0);
    END IF;
    
    -- 3. Preparar información del proceso para logs
    IF p_evaluation_process_id IS NULL THEN
        v_process_info := 'Estado Global';
    ELSE
        v_process_info := 'Proceso ' || p_evaluation_process_id::TEXT;
    END IF;
    
    -- 4. CERRAR el registro actual (si existe)
    IF v_current_record_id IS NOT NULL THEN
        -- Calcular fecha de fin que sea al menos un día después de la fecha de inicio
        v_new_end_date := CURRENT_DATE;
        
        -- Si la fecha actual es igual o anterior a la fecha de inicio, usar un día después
        IF v_new_end_date <= v_current_start_date THEN
            v_new_end_date := v_current_start_date + INTERVAL '1 day';
        END IF;
        
        UPDATE manufacturer_status
        SET end_date = v_new_end_date
        WHERE id = v_current_record_id;
        
        RAISE NOTICE 'Cerrado registro % (estado: % -> % para %). Fecha: % -> %', 
            v_current_record_id, v_current_status, p_new_status, v_process_info,
            v_current_start_date, v_new_end_date;
    ELSE
        RAISE NOTICE 'No se encontró registro activo previo para %', v_process_info;
    END IF;
    
    -- 5. INSERTAR nuevo registro histórico
    INSERT INTO manufacturer_status 
        (maker_product_id, evaluation_process_id, start_date, evaluation_state, end_date)
    VALUES 
        (p_maker_product_id, p_evaluation_process_id, CURRENT_DATE, p_new_status, NULL)
    RETURNING id INTO v_new_record_id;
    
    RAISE NOTICE 'Creado nuevo registro % con estado % para %', 
        v_new_record_id, p_new_status, v_process_info;
    
    RETURN v_new_record_id;
EXCEPTION
    WHEN OTHERS THEN
        -- Manejar error específico de fecha
        IF SQLERRM LIKE '%fecha de fin no puede ser anterior%' OR SQLSTATE = '22008' THEN
            -- Intentar con fecha alternativa
            BEGIN
                IF v_current_record_id IS NOT NULL THEN
                    UPDATE manufacturer_status
                    SET end_date = COALESCE(v_current_start_date, CURRENT_DATE) + INTERVAL '1 day'
                    WHERE id = v_current_record_id;
                END IF;
                
                INSERT INTO manufacturer_status 
                    (maker_product_id, evaluation_process_id, start_date, evaluation_state, end_date)
                VALUES 
                    (p_maker_product_id, p_evaluation_process_id, CURRENT_DATE, p_new_status, NULL)
                RETURNING id INTO v_new_record_id;
                
                RETURN v_new_record_id;
            EXCEPTION
                WHEN OTHERS THEN
                    RAISE WARNING 'Error secundario: %', SQLERRM;
                    RETURN 0;
            END;
        ELSE
            RAISE EXCEPTION 'Error al actualizar estado para maker_product_id=%, evaluation_process_id=%: %', 
                p_maker_product_id, p_evaluation_process_id, SQLERRM;
        END IF;
END;
$$;

COMMENT ON FUNCTION update_manufacturer_status_with_history IS 'Actualiza el estado manteniendo historial completo. Cierra registro anterior y crea nuevo. Todos los parámetros opcionales tienen valores por defecto.';


-- FUNCIONES DE CONSULTA DE HISTORIAL
CREATE OR REPLACE FUNCTION get_manufacturer_status_history(
    p_maker_product_id INTEGER,
    p_evaluation_process_id INTEGER DEFAULT NULL,
    p_include_current BOOLEAN DEFAULT TRUE
)
RETURNS TABLE (
    registro_id INTEGER,
    estado evaluation_state_manufacturer_enum,
    fecha_inicio DATE,
    fecha_fin DATE,
    duracion_dias INTEGER,
    estado_siguiente evaluation_state_manufacturer_enum,
    dias_para_siguiente_estado INTEGER
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    WITH history AS (
        SELECT 
            ms.id,
            ms.evaluation_state,
            ms.start_date,
            ms.end_date,
            LEAD(ms.evaluation_state) OVER w as next_state,
            LEAD(ms.start_date) OVER w as next_start_date
        FROM manufacturer_status ms
        WHERE ms.maker_product_id = p_maker_product_id
          AND ms.evaluation_process_id IS NOT DISTINCT FROM p_evaluation_process_id
          AND (p_include_current OR ms.end_date IS NOT NULL)
        WINDOW w AS (ORDER BY ms.start_date)
        ORDER BY ms.start_date
    )
    SELECT 
        h.id,
        h.evaluation_state,
        h.start_date,
        h.end_date,
        CASE 
            WHEN h.end_date IS NOT NULL THEN
                (h.end_date - h.start_date)
            ELSE
                (CURRENT_DATE - h.start_date)
        END::INTEGER as duracion_dias,
        h.next_state as estado_siguiente,
        CASE 
            WHEN h.next_start_date IS NOT NULL THEN
                (h.next_start_date - h.start_date)
            ELSE NULL
        END::INTEGER as dias_para_siguiente_estado
    FROM history h;
END;
$$;

COMMENT ON FUNCTION get_manufacturer_status_history IS 'Devuelve el historial completo de estados de un fabricante, con duraciones y transiciones.';


CREATE OR REPLACE FUNCTION analyze_process_timeline(
    p_maker_product_id INTEGER,
    p_evaluation_process_id INTEGER
)
RETURNS TABLE (
    etapa evaluation_state_manufacturer_enum,
    fecha_inicio DATE,
    fecha_fin DATE,
    duracion_dias INTEGER,
    porcentaje_del_total NUMERIC(5,2),
    estado_siguiente evaluation_state_manufacturer_enum
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_total_days INTEGER;
BEGIN
    -- Calcular duración total del proceso
    SELECT COALESCE(
        MAX(end_date) - MIN(start_date),
        CURRENT_DATE - MIN(start_date)
    ) INTO v_total_days
    FROM manufacturer_status
    WHERE maker_product_id = p_maker_product_id
      AND evaluation_process_id = p_evaluation_process_id;
    
    -- Si no hay registros o duración es 0, usar 1 para evitar división por 0
    IF v_total_days IS NULL OR v_total_days = 0 THEN
        v_total_days := 1;
    END IF;
    
    RETURN QUERY
    SELECT 
        ms.evaluation_state as etapa,
        ms.start_date as fecha_inicio,
        ms.end_date as fecha_fin,
        CASE 
            WHEN ms.end_date IS NOT NULL THEN
                (ms.end_date - ms.start_date)
            ELSE
                (CURRENT_DATE - ms.start_date)
        END::INTEGER as duracion_dias,
        CASE 
            WHEN ms.end_date IS NOT NULL THEN
                ROUND(((ms.end_date - ms.start_date) * 100.0 / v_total_days)::NUMERIC, 2)
            ELSE
                ROUND(((CURRENT_DATE - ms.start_date) * 100.0 / v_total_days)::NUMERIC, 2)
        END as porcentaje_del_total,
        LEAD(ms.evaluation_state) OVER (ORDER BY ms.start_date) as estado_siguiente
    FROM manufacturer_status ms
    WHERE ms.maker_product_id = p_maker_product_id
      AND ms.evaluation_process_id = p_evaluation_process_id
    ORDER BY ms.start_date;
END;
$$;

COMMENT ON FUNCTION analyze_process_timeline IS 'Analiza la línea de tiempo de un proceso específico, mostrando duración y porcentaje de cada etapa.';


-- FUNCIÓN DE REPORTE
CREATE OR REPLACE FUNCTION get_manufacturer_status_report(
    p_fabricante_id INTEGER DEFAULT NULL,
    p_estado evaluation_state_manufacturer_enum DEFAULT NULL,
    p_tipo_estado VARCHAR DEFAULT 'TODOS'
)
RETURNS TABLE (
    fabricante_id INTEGER,
    fabricante_nombre VARCHAR(255),
    producto_id INTEGER,
    producto_descripcion VARCHAR(255),
    tipo_estado VARCHAR(20),
    proceso_id INTEGER,
    estado_actual evaluation_state_manufacturer_enum,
    fecha_inicio_estado DATE,
    dias_en_estado INTEGER,
    cliente VARCHAR(255),
    solicitud INTEGER
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ce.id as fabricante_id,
        ce.entity_name as fabricante_nombre,
        p.id as producto_id,
        p.description as producto_descripcion,
        CASE 
            WHEN ms.evaluation_process_id IS NULL THEN 'GLOBAL'
            ELSE 'PROCESO'
        END as tipo_estado,
        ms.evaluation_process_id as proceso_id,
        ms.evaluation_state as estado_actual,
        ms.start_date as fecha_inicio_estado,
        (CURRENT_DATE - ms.start_date)::INTEGER as dias_en_estado,
        c.client_name as cliente,
        a.application_number as solicitud
    FROM manufacturer_status ms
    JOIN maker_product mp ON mp.id = ms.maker_product_id
    JOIN product p ON p.id = mp.product_id
    JOIN commercial_entity ce ON ce.id = mp.maker_entity_id
    LEFT JOIN evaluation_process ep ON ep.id = ms.evaluation_process_id
    LEFT JOIN application a ON a.id = ep.application_id
    LEFT JOIN client c ON c.id = a.client_id
    WHERE ms.end_date IS NULL
      AND (p_fabricante_id IS NULL OR ce.id = p_fabricante_id)
      AND (p_estado IS NULL OR ms.evaluation_state = p_estado)
      AND (
          p_tipo_estado = 'TODOS' OR
          (p_tipo_estado = 'GLOBAL' AND ms.evaluation_process_id IS NULL) OR
          (p_tipo_estado = 'PROCESO' AND ms.evaluation_process_id IS NOT NULL)
      )
    ORDER BY ce.entity_name, p.description, 
        CASE WHEN ms.evaluation_process_id IS NULL THEN 0 ELSE 1 END,
        ms.evaluation_process_id;
END;
$$;

COMMENT ON FUNCTION get_manufacturer_status_report IS 'Genera reporte personalizable de estados de fabricantes, filtrando por fabricante, estado y tipo.';


-- FUNCIONES DE UTILIDAD

-- Función para verificar consistencia de estados
CREATE OR REPLACE FUNCTION verify_manufacturer_status_consistency()
RETURNS TABLE (
    maker_product_id INTEGER,
    problema VARCHAR(255),
    detalles TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    -- 1. Verificar múltiples estados activos por proceso
    SELECT 
        ms1.maker_product_id,
        'MÚLTIPLES ESTADOS ACTIVOS PARA MISMO PROCESO' as problema,
        'Proceso: ' || ms1.evaluation_process_id::text || 
        ', Estados: ' || STRING_AGG(ms1.evaluation_state::text, ', ') as detalles
    FROM manufacturer_status ms1
    WHERE ms1.end_date IS NULL
      AND ms1.evaluation_process_id IS NOT NULL
    GROUP BY ms1.maker_product_id, ms1.evaluation_process_id
    HAVING COUNT(*) > 1
    
    UNION ALL
    
    -- 2. Verificar múltiples estados globales activos
    SELECT 
        ms2.maker_product_id,
        'MÚLTIPLES ESTADOS GLOBALES ACTIVOS' as problema,
        'Estados: ' || STRING_AGG(ms2.evaluation_state::text, ', ') as detalles
    FROM manufacturer_status ms2
    WHERE ms2.end_date IS NULL
      AND ms2.evaluation_process_id IS NULL
    GROUP BY ms2.maker_product_id
    HAVING COUNT(*) > 1
    
    UNION ALL
    
    -- 3. Verificar solapamiento de fechas
    SELECT 
        ms3.maker_product_id,
        'SOLAPAMIENTO DE FECHAS' as problema,
        'Registros: ' || ms3.id::text || ' y ' || ms4.id::text as detalles
    FROM manufacturer_status ms3
    JOIN manufacturer_status ms4 ON ms3.maker_product_id = ms4.maker_product_id
        AND ms3.evaluation_process_id IS NOT DISTINCT FROM ms4.evaluation_process_id
        AND ms3.id < ms4.id
        AND ms3.start_date < COALESCE(ms4.end_date, 'infinity'::DATE)
        AND COALESCE(ms3.end_date, 'infinity'::DATE) > ms4.start_date;
END;
$$;

COMMENT ON FUNCTION verify_manufacturer_status_consistency IS 'Verifica la consistencia de los estados del fabricante, detectando problemas como múltiples estados activos o solapamiento de fechas.';


-- Función para obtener el estado actual de un fabricante
CREATE OR REPLACE FUNCTION get_current_manufacturer_status(
    p_maker_product_id INTEGER,
    p_evaluation_process_id INTEGER DEFAULT NULL
)
RETURNS evaluation_state_manufacturer_enum
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_status evaluation_state_manufacturer_enum;
BEGIN
    SELECT evaluation_state INTO v_status
    FROM manufacturer_status
    WHERE maker_product_id = p_maker_product_id
      AND evaluation_process_id IS NOT DISTINCT FROM p_evaluation_process_id
      AND end_date IS NULL;
    
    RETURN v_status;
END;
$$;

COMMENT ON FUNCTION get_current_manufacturer_status IS 'Devuelve el estado actual de un fabricante para un proceso específico o global.';


-- Función de validación mejorada para la estructura de muestras
CREATE OR REPLACE FUNCTION validate_sample_to_process_consistency(
    p_sample_id INTEGER,
    p_evaluation_process_id INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_sample_supply_id INTEGER;
    v_process_supply_id INTEGER;
BEGIN
    -- Obtener supply_id de la muestra
    SELECT supply_id INTO v_sample_supply_id
    FROM sample
    WHERE id = p_sample_id;
    
    -- Obtener supply_id del proceso
    SELECT supply_id INTO v_process_supply_id
    FROM evaluation_process
    WHERE id = p_evaluation_process_id;
    
    -- Retornar true si coinciden (o si alguno es NULL)
    RETURN v_sample_supply_id IS NOT DISTINCT FROM v_process_supply_id;
END;
$$;

COMMENT ON FUNCTION validate_sample_to_process_consistency IS 'Valida que una muestra pertenezca al mismo suministro que un proceso de evaluación';


--=========================================================
-- TRIGGERS
--=========================================================

-- TRIGGER: Función para validar consistencia de producto
CREATE OR REPLACE FUNCTION validate_product_consistency()
RETURNS TRIGGER AS $$
DECLARE
    v_application_product_id INTEGER;
    v_supply_product_id INTEGER;
BEGIN
    -- Obtener el producto del supply
    SELECT mp.product_id INTO v_supply_product_id
    FROM supply s
    JOIN maker_product mp ON mp.id = s.maker_product_id
    WHERE s.id = NEW.supply_id;
    
    -- Verificar si la aplicación incluye ese producto
    SELECT ap.id INTO v_application_product_id
    FROM application_product ap
    WHERE ap.application_id = NEW.application_id 
    AND ap.product_id = v_supply_product_id;
    
    IF v_application_product_id IS NULL THEN
        RAISE EXCEPTION 'El suministro (ID: %) no corresponde a ningún producto de la aplicación (ID: %)', 
        NEW.supply_id, NEW.application_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_evaluation_process
BEFORE INSERT OR UPDATE ON evaluation_process
FOR EACH ROW
EXECUTE FUNCTION validate_product_consistency();


-- TRIGGER: Función para calcular oferta exploratoria
CREATE OR REPLACE FUNCTION public.calculate_exploratory_offer()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_reference_price NUMERIC(12,2);
    v_supplier_id INTEGER;
    v_product_id INTEGER;
    v_reference_purchase_id INTEGER;
BEGIN
    -- DEBUG: Verificar valores de entrada
    RAISE NOTICE 'Trigger ejecutado para evaluation_process_id: %, offered_price: %, reference_purchase_id: %',
        NEW.evaluation_process_id, NEW.offered_price, NEW.reference_purchase_id;
    
    -- 1. Si reference_purchase_id fue proporcionado, usar ese
    IF NEW.reference_purchase_id IS NOT NULL THEN
        -- Obtener precio de la compra de referencia
        SELECT unit_price INTO v_reference_price
        FROM public.supplier_purchase
        WHERE id = NEW.reference_purchase_id;
        
        RAISE NOTICE 'Usando compra de referencia ID %: precio = %', 
            NEW.reference_purchase_id, v_reference_price;
    END IF;
    
    -- 2. Si no hay reference_purchase_id o no se encontró el precio,
    -- buscar la última compra para el producto y proveedor
    IF v_reference_price IS NULL THEN
        -- Obtener supplier_id y product_id del evaluation_process
        SELECT s.supplier_entity_id, mp.product_id 
        INTO v_supplier_id, v_product_id
        FROM public.evaluation_process ep
        JOIN public.supply s ON s.id = ep.supply_id
        JOIN public.maker_product mp ON mp.id = s.maker_product_id
        WHERE ep.id = NEW.evaluation_process_id;
        
        RAISE NOTICE 'Buscando supplier_id: %, product_id: %', v_supplier_id, v_product_id;
        
        -- Buscar la última compra para este producto y proveedor
        SELECT id, unit_price 
        INTO v_reference_purchase_id, v_reference_price
        FROM public.supplier_purchase
        WHERE product_id = v_product_id
          AND supplier_id = v_supplier_id
        ORDER BY purchase_date DESC
        LIMIT 1;
        
        IF v_reference_purchase_id IS NOT NULL THEN
            RAISE NOTICE 'Encontrada compra ID %: precio = %', 
                v_reference_purchase_id, v_reference_price;
            -- Asignar el reference_purchase_id encontrado
            NEW.reference_purchase_id := v_reference_purchase_id;
        END IF;
    END IF;
    
    -- 3. Calcular valores
    IF v_reference_price IS NULL THEN
        -- CASO 1: No hay compras previas de referencia
        RAISE NOTICE 'No hay compras previas. Usando offered_price como referencia.';
        v_reference_price := NEW.offered_price;
        NEW.price_difference := 0;
        NEW.percentage_difference := 0;
        NEW.is_competitive := true;
    ELSE
        -- CASO 2: Hay precio de referencia
        NEW.price_difference := NEW.offered_price - v_reference_price;
        NEW.percentage_difference := (NEW.price_difference / v_reference_price) * 100;
        -- Competitivo si es igual o menor al precio de referencia
        NEW.is_competitive := NEW.offered_price <= v_reference_price;
        
        RAISE NOTICE 'Cálculos: diferencia = %, porcentaje = %, competitivo = %',
            NEW.price_difference, NEW.percentage_difference, NEW.is_competitive;
    END IF;
    
    -- 4. Asegurar que analysis_date tenga valor
    IF NEW.analysis_date IS NULL THEN
        NEW.analysis_date := CURRENT_DATE;
    END IF;
    
    RAISE NOTICE '✅ Trigger completado exitosamente';
    RETURN NEW;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION '❌ Error en calculate_exploratory_offer: %', SQLERRM;
END;
$$;

CREATE TRIGGER trg_calculate_exploratory_offer
BEFORE INSERT OR UPDATE ON public.exploratory_offer
FOR EACH ROW
EXECUTE FUNCTION public.calculate_exploratory_offer();


-- TRIGGER: CALCULAR self_performed AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION calculate_self_performed()
RETURNS TRIGGER AS $$
DECLARE
    v_client_id INTEGER;
    v_analysis_client_id INTEGER;
BEGIN
    -- 1. Obtener el cliente del evaluation_process
    SELECT a.client_id INTO v_client_id
    FROM evaluation_process ep
    JOIN application a ON a.id = ep.application_id
    WHERE ep.id = NEW.evaluation_process_id;
    
    -- 2. Obtener el cliente que realizó el análisis
    SELECT sa.performed_by_client INTO v_analysis_client_id
    FROM sample_analysis sa
    WHERE sa.id = NEW.sample_analysis_id;
    
    -- 3. Calcular si es self_performed
    NEW.self_performed := (v_client_id = v_analysis_client_id);
    
    -- 4. Si NO es self_performed y send_analysis_date es NULL, establecer fecha actual
    IF NOT NEW.self_performed AND NEW.send_analysis_date IS NULL THEN
        NEW.send_analysis_date := CURRENT_DATE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_self_performed
BEFORE INSERT OR UPDATE ON sample_evaluation
FOR EACH ROW
EXECUTE FUNCTION calculate_self_performed();


-- TRIGGER: VERIFICAR consistencia antes de insertar
CREATE OR REPLACE FUNCTION validate_sample_evaluation()
RETURNS TRIGGER AS $$
DECLARE
    v_evaluation_process_client INTEGER;
    v_sample_analysis_client INTEGER;
    v_sample_supply_id INTEGER;
    v_evaluation_process_supply_id INTEGER;
BEGIN
    -- Obtener cliente del evaluation_process
    SELECT a.client_id INTO v_evaluation_process_client
    FROM evaluation_process ep
    JOIN application a ON a.id = ep.application_id
    WHERE ep.id = NEW.evaluation_process_id;
    
    -- Obtener cliente del análisis y supply_id de la muestra
    SELECT sa.performed_by_client, s.supply_id 
    INTO v_sample_analysis_client, v_sample_supply_id
    FROM sample_analysis sa
    JOIN sample s ON s.id = sa.sample_id
    WHERE sa.id = NEW.sample_analysis_id;
    
    -- Obtener supply_id del evaluation_process
    SELECT ep.supply_id INTO v_evaluation_process_supply_id
    FROM evaluation_process ep
    WHERE ep.id = NEW.evaluation_process_id;
    
    -- Verificar que la muestra pertenezca al mismo supply que el proceso
    IF v_sample_supply_id IS DISTINCT FROM v_evaluation_process_supply_id THEN
        RAISE EXCEPTION 'La muestra del análisis (ID: %) no pertenece al mismo suministro del proceso de evaluación (ID: %). Supply ID muestra: %, Supply ID proceso: %', 
            NEW.sample_analysis_id, NEW.evaluation_process_id, v_sample_supply_id, v_evaluation_process_supply_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_sample_evaluation
BEFORE INSERT OR UPDATE ON sample_evaluation
FOR EACH ROW
EXECUTE FUNCTION validate_sample_evaluation();


-- DISPARADORES PARA ACTUALIZACIÓN AUTOMÁTICA DE ESTADO DEL FABRICANTE

-- Disparador para cuando se crea un proceso de evaluación
CREATE OR REPLACE FUNCTION create_process_manufacturer_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_maker_product_id INTEGER;
BEGIN
    -- Obtener el maker_product_id del nuevo proceso
    SELECT mp.id INTO v_maker_product_id
    FROM supply s
    JOIN maker_product mp ON mp.id = s.maker_product_id
    WHERE s.id = NEW.supply_id;
    
    -- Crear estado inicial para ESTE proceso específico
    PERFORM update_manufacturer_status_with_history(
        v_maker_product_id,
        NEW.id,
        'Pendiente de Evaluación'
    );
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_create_process_status
AFTER INSERT ON evaluation_process
FOR EACH ROW
EXECUTE FUNCTION create_process_manufacturer_status();


-- Disparador principal para actualizar estados cuando hay cambios
CREATE OR REPLACE FUNCTION update_manufacturer_status_on_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_maker_product_id INTEGER;
    v_evaluation_process_id INTEGER;
    v_new_status evaluation_state_manufacturer_enum;
    v_should_update_global BOOLEAN := FALSE;
BEGIN
    -- Determinar IDs según la tabla que disparó el trigger
    IF TG_TABLE_NAME = 'exploratory_offer' THEN
        -- Obtener maker_product_id y evaluation_process_id
        SELECT mp.id, ep.id INTO v_maker_product_id, v_evaluation_process_id
        FROM evaluation_process ep
        JOIN supply s ON s.id = ep.supply_id
        JOIN maker_product mp ON mp.id = s.maker_product_id
        WHERE ep.id = NEW.evaluation_process_id;
        
    ELSIF TG_TABLE_NAME = 'technical_document' THEN
        -- Obtener del supply y encontrar el proceso relacionado
        SELECT mp.id, ep.id INTO v_maker_product_id, v_evaluation_process_id
        FROM supply s
        JOIN maker_product mp ON mp.id = s.maker_product_id
        JOIN evaluation_process ep ON ep.supply_id = s.id
        WHERE s.id = NEW.supply_id
        LIMIT 1;
        
    ELSIF TG_TABLE_NAME = 'document_evaluation' THEN
        -- Obtener del technical_document
        SELECT mp.id, ep.id INTO v_maker_product_id, v_evaluation_process_id
        FROM technical_document td
        JOIN supply s ON s.id = td.supply_id
        JOIN maker_product mp ON mp.id = s.maker_product_id
        JOIN evaluation_process ep ON ep.supply_id = s.id
        WHERE td.id = NEW.technical_document_id;
        
    ELSIF TG_TABLE_NAME = 'sample' THEN
        -- 1. Obtener maker_product_id del supply
        SELECT mp.id INTO v_maker_product_id
        FROM supply s
        JOIN maker_product mp ON mp.id = s.maker_product_id
        WHERE s.id = NEW.supply_id;

        -- 2. Obtener evaluation_process_id relacionado (si existe)
        SELECT ep.id INTO v_evaluation_process_id
        FROM evaluation_process ep
        WHERE ep.supply_id = NEW.supply_id
        LIMIT 1;
        
    ELSIF TG_TABLE_NAME = 'sample_evaluation' THEN
        -- Obtener del evaluation_process directamente
        SELECT mp.id, ep.id INTO v_maker_product_id, v_evaluation_process_id
        FROM evaluation_process ep
        JOIN supply s ON s.id = ep.supply_id
        JOIN maker_product mp ON mp.id = s.maker_product_id
        WHERE ep.id = NEW.evaluation_process_id;
        
    ELSIF TG_TABLE_NAME = 'industrial_purchase' THEN
        -- Obtener directamente del evaluation_process
        SELECT mp.id, ep.id INTO v_maker_product_id, v_evaluation_process_id
        FROM evaluation_process ep
        JOIN supply s ON s.id = ep.supply_id
        JOIN maker_product mp ON mp.id = s.maker_product_id
        WHERE ep.id = NEW.evaluation_process_id;
        
    ELSIF TG_TABLE_NAME = 'industrial_evaluation' THEN
        -- Obtener del industrial_purchase
        SELECT mp.id, ep.id INTO v_maker_product_id, v_evaluation_process_id
        FROM industrial_purchase ip
        JOIN evaluation_process ep ON ep.id = ip.evaluation_process_id
        JOIN supply s ON s.id = ep.supply_id
        JOIN maker_product mp ON mp.id = s.maker_product_id
        WHERE ip.id = NEW.industrial_purchase_id;
        
    ELSE
        RETURN NEW;
    END IF;
    
    -- Si tenemos los IDs, actualizar el estado
    IF v_maker_product_id IS NOT NULL AND v_evaluation_process_id IS NOT NULL THEN
        -- Determinar el nuevo estado para ESTE proceso específico
        v_new_status := determine_manufacturer_status(
            v_maker_product_id, 
            v_evaluation_process_id
        );
        
        -- Actualizar estado para este proceso
        PERFORM update_manufacturer_status_with_history(
            v_maker_product_id,
            v_evaluation_process_id,
            v_new_status
        );
        
        -- Si es estado final, también actualizar global
        IF v_new_status IN ('Aprobado', 'No Aprobado') THEN
            v_should_update_global := TRUE;
        END IF;
        
        -- Actualizar estado global si es necesario
        IF v_should_update_global THEN
            v_new_status := determine_global_manufacturer_status(v_maker_product_id);
            
            PERFORM update_manufacturer_status_with_history(
                v_maker_product_id,
                NULL,
                v_new_status
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;


-- Crear triggers para todas las tablas relevantes
DROP TRIGGER IF EXISTS trg_update_status_exploratory_offer ON exploratory_offer;
CREATE TRIGGER trg_update_status_exploratory_offer
AFTER INSERT OR UPDATE OF is_competitive ON exploratory_offer
FOR EACH ROW
EXECUTE FUNCTION update_manufacturer_status_on_change();

DROP TRIGGER IF EXISTS trg_update_status_technical_doc ON technical_document;
CREATE TRIGGER trg_update_status_technical_doc
AFTER INSERT OR UPDATE OF request_date ON technical_document
FOR EACH ROW
EXECUTE FUNCTION update_manufacturer_status_on_change();

DROP TRIGGER IF EXISTS trg_update_status_doc_eval ON document_evaluation;
CREATE TRIGGER trg_update_status_doc_eval
AFTER INSERT OR UPDATE OF is_approved ON document_evaluation
FOR EACH ROW
EXECUTE FUNCTION update_manufacturer_status_on_change();

DROP TRIGGER IF EXISTS trg_update_status_sample ON sample;
CREATE TRIGGER trg_update_status_sample
AFTER INSERT OR UPDATE OF request_date ON sample
FOR EACH ROW
EXECUTE FUNCTION update_manufacturer_status_on_change();

DROP TRIGGER IF EXISTS trg_update_status_sample_eval ON sample_evaluation;
CREATE TRIGGER trg_update_status_sample_eval
AFTER INSERT OR UPDATE OF result, decision_continue ON sample_evaluation
FOR EACH ROW
EXECUTE FUNCTION update_manufacturer_status_on_change();

DROP TRIGGER IF EXISTS trg_update_status_industrial_purchase ON industrial_purchase;
CREATE TRIGGER trg_update_status_industrial_purchase
AFTER INSERT OR UPDATE OF purchase_status ON industrial_purchase
FOR EACH ROW
EXECUTE FUNCTION update_manufacturer_status_on_change();

DROP TRIGGER IF EXISTS trg_update_status_industrial_eval ON industrial_evaluation;
CREATE TRIGGER trg_update_status_industrial_eval
AFTER INSERT OR UPDATE OF analysis_result, report_delivery_date ON industrial_evaluation
FOR EACH ROW
EXECUTE FUNCTION update_manufacturer_status_on_change();


-- TRIGGERS DE VALIDACIÓN DE DATOS

-- Función para validar fechas en documentos técnicos
CREATE OR REPLACE FUNCTION validate_document_dates()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar que la fecha de recepción sea posterior o igual a la de solicitud
    IF NEW.receipt_date IS NOT NULL AND NEW.request_date IS NOT NULL THEN
        IF NEW.receipt_date < NEW.request_date THEN
            RAISE EXCEPTION 'La fecha de recepción (%) no puede ser anterior a la fecha de solicitud (%)',
                NEW.receipt_date, NEW.request_date;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_document_dates
BEFORE INSERT OR UPDATE ON technical_document
FOR EACH ROW EXECUTE FUNCTION validate_document_dates();


-- Función para validar fechas de muestras
CREATE OR REPLACE FUNCTION validate_sample_dates()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar secuencia cronológica de fechas de muestra
    IF NEW.send_date_supplier IS NOT NULL AND NEW.request_date IS NOT NULL THEN
        IF NEW.send_date_supplier < NEW.request_date THEN
            RAISE EXCEPTION 'La fecha de envío al proveedor (%) no puede ser anterior a la fecha de solicitud (%)',
                NEW.send_date_supplier, NEW.request_date;
        END IF;
    END IF;
    
    IF NEW.date_receipt_warehouse IS NOT NULL AND NEW.send_date_supplier IS NOT NULL THEN
        IF NEW.date_receipt_warehouse < NEW.send_date_supplier THEN
            RAISE EXCEPTION 'La fecha de recepción en almacén (%) no puede ser anterior a la fecha de envío al proveedor (%)',
                NEW.date_receipt_warehouse, NEW.send_date_supplier;
        END IF;
    END IF;
    
    IF NEW.date_receipt_client IS NOT NULL AND NEW.date_receipt_warehouse IS NOT NULL THEN
        IF NEW.date_receipt_client < NEW.date_receipt_warehouse THEN
            RAISE EXCEPTION 'La fecha de recepción por cliente (%) no puede ser anterior a la fecha de recepción en almacén (%)',
                NEW.date_receipt_client, NEW.date_receipt_warehouse;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_sample_dates
BEFORE INSERT OR UPDATE ON sample
FOR EACH ROW EXECUTE FUNCTION validate_sample_dates();


-- Funcioner para validar que el precio sea positivo

-- Función específica para supplier_purchase
CREATE OR REPLACE FUNCTION validate_supplier_price()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.unit_price <= 0 THEN
        RAISE EXCEPTION 'El precio unitario debe ser mayor que cero';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función específica para exploratory_offer
CREATE OR REPLACE FUNCTION validate_exploratory_offer_price()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.offered_price <= 0 THEN
        RAISE EXCEPTION 'El precio ofertado debe ser mayor que cero';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers con funciones específicas
CREATE TRIGGER trg_validate_supplier_price
BEFORE INSERT OR UPDATE ON supplier_purchase
FOR EACH ROW EXECUTE FUNCTION validate_supplier_price();

CREATE TRIGGER trg_validate_offer_price
BEFORE INSERT OR UPDATE ON exploratory_offer
FOR EACH ROW EXECUTE FUNCTION validate_exploratory_offer_price();


-- Función para validar unidades de medida en muestras
CREATE OR REPLACE FUNCTION validate_sample_units()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar unidades válidas
    IF NEW.unit NOT IN ('kg', 'g', 'mg', 'L', 'mL', 'unidades', 'paquetes') THEN
        RAISE WARNING 'Unidad de medida no estándar: %', NEW.unit;
    END IF;
    
    -- Validar que la cantidad sea positiva
    IF NEW.quantity <= 0 THEN
        RAISE EXCEPTION 'La cantidad de muestra debe ser mayor que cero';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_sample_units
BEFORE INSERT OR UPDATE ON sample
FOR EACH ROW EXECUTE FUNCTION validate_sample_units();


-- (NO SEGURA) Función para validar que no se evalúe lo mismo dos veces
CREATE OR REPLACE FUNCTION prevent_duplicate_evaluation()
RETURNS TRIGGER AS $$
DECLARE
    existing_count INTEGER;
BEGIN
    -- Para document_evaluation
    IF TG_TABLE_NAME = 'document_evaluation' THEN
        SELECT COUNT(*) INTO existing_count
        FROM document_evaluation
        WHERE evaluation_process_id = NEW.evaluation_process_id
          AND technical_document_id = NEW.technical_document_id
          AND id != COALESCE(NEW.id, 0);
        
        IF existing_count > 0 THEN
            RAISE EXCEPTION 'Ya existe una evaluación para este documento en este proceso';
        END IF;
    END IF;
    
    -- Para sample_evaluation
    IF TG_TABLE_NAME = 'sample_evaluation' THEN
        SELECT COUNT(*) INTO existing_count
        FROM sample_evaluation
        WHERE evaluation_process_id = NEW.evaluation_process_id
          AND sample_analysis_id = NEW.sample_analysis_id
          AND id != COALESCE(NEW.id, 0);
        
        IF existing_count > 0 THEN
            RAISE EXCEPTION 'Ya existe una evaluación para este análisis en este proceso';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_duplicate_doc_eval
BEFORE INSERT ON document_evaluation
FOR EACH ROW EXECUTE FUNCTION prevent_duplicate_evaluation();

CREATE TRIGGER trg_prevent_duplicate_sample_eval
BEFORE INSERT ON sample_evaluation
FOR EACH ROW EXECUTE FUNCTION prevent_duplicate_evaluation();


-- (NO NECESARIO) Función para validar que las etapas se completen en orden
CREATE OR REPLACE FUNCTION validate_evaluation_stage_order()
RETURNS TRIGGER AS $$
DECLARE
    has_offer BOOLEAN;
    has_docs BOOLEAN;
    has_sample BOOLEAN;
BEGIN
    -- Para industrial_purchase: verificar que etapas anteriores estén completas
    IF TG_TABLE_NAME = 'industrial_purchase' THEN
        -- Verificar oferta exploratoria
        SELECT EXISTS (
            SELECT 1 FROM exploratory_offer eo
            WHERE eo.evaluation_process_id = NEW.evaluation_process_id
              AND eo.is_competitive = true
        ) INTO has_offer;
        
        IF NOT has_offer THEN
            RAISE EXCEPTION 'No se puede proceder a compra industrial sin oferta exploratoria competitiva';
        END IF;
        
        -- Verificar evaluación documental aprobada
        SELECT EXISTS (
            SELECT 1 FROM document_evaluation de
            WHERE de.evaluation_process_id = NEW.evaluation_process_id
              AND de.is_approved = true
        ) INTO has_docs;
        
        IF NOT has_docs THEN
            RAISE EXCEPTION 'No se puede proceder a compra industrial sin evaluación documental aprobada';
        END IF;
        
        -- Verificar evaluación de muestra conforme
        SELECT EXISTS (
            SELECT 1 FROM sample_evaluation se
            WHERE se.evaluation_process_id = NEW.evaluation_process_id
              AND se.result = 'Conforme'
              AND se.decision_continue = true
        ) INTO has_sample;
        
        IF NOT has_sample THEN
            RAISE EXCEPTION 'No se puede proceder a compra industrial sin evaluación de muestra conforme';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_industrial_purchase_order
BEFORE INSERT ON industrial_purchase
FOR EACH ROW EXECUTE FUNCTION validate_evaluation_stage_order();


-- Función para validar formato de usuario
CREATE OR REPLACE FUNCTION validate_user_account()
RETURNS TRIGGER AS $$
BEGIN
    -- Validación SIMPLIFICADA y MEJORADA
    -- 1. Longitud entre 3 y 50 caracteres
    IF LENGTH(NEW.username) < 3 OR LENGTH(NEW.username) > 50 THEN
        RAISE EXCEPTION 'El username debe tener entre 3 y 50 caracteres';
    END IF;
    
    -- 2. Solo caracteres permitidos: letras, números, punto, guión bajo, arroba
    IF NEW.username !~ '^[A-Za-z0-9._@-]+$' THEN
        RAISE EXCEPTION 'El username solo puede contener letras, números, punto (.), guión bajo (_), arroba (@) o guión (-)';
    END IF;
    
    -- 3. No puede empezar o terminar con punto o guión
    IF NEW.username ~ '^[._-]' OR NEW.username ~ '[._-]$' THEN
        RAISE EXCEPTION 'El username no puede empezar o terminar con punto (.), guión bajo (_) o guión (-)';
    END IF;
    
    -- 4. Validar contraseña (mínimo 8 caracteres)
    IF LENGTH(NEW.password) < 8 THEN
        RAISE EXCEPTION 'La contraseña debe tener al menos 8 caracteres';
    END IF;
    
    -- 5. Validar nombre completo
    IF TRIM(NEW.full_name) = '' THEN
        RAISE EXCEPTION 'El nombre completo no puede estar vacío';
    END IF;
    
    -- 6. Opcional: Convertir username a minúsculas para consistencia
    NEW.username := LOWER(NEW.username);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_user_account
BEFORE INSERT OR UPDATE ON user_account
FOR EACH ROW EXECUTE FUNCTION validate_user_account();


-- Función para validar que el fabricante tenga rol correcto
CREATE OR REPLACE FUNCTION validate_maker_role()
RETURNS TRIGGER AS $$
DECLARE
    is_maker BOOLEAN;
BEGIN
    -- Verificar que la entidad tenga rol de fabricante
    SELECT EXISTS (
        SELECT 1 FROM commercial_entity_role cer
        WHERE cer.commercial_entity = NEW.maker_entity_id
          AND cer.role_type = 'Fabricante'
    ) INTO is_maker;
    
    IF NOT is_maker THEN
        RAISE EXCEPTION 'La entidad comercial ID % no tiene rol de Fabricante', NEW.maker_entity_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_maker_role
BEFORE INSERT OR UPDATE ON maker_product
FOR EACH ROW EXECUTE FUNCTION validate_maker_role();


-- Función para validar que el proveedor tenga rol correcto
CREATE OR REPLACE FUNCTION validate_supplier_role()
RETURNS TRIGGER AS $$
DECLARE
    is_supplier BOOLEAN;
BEGIN
    -- Verificar que la entidad tenga rol de proveedor
    SELECT EXISTS (
        SELECT 1 FROM commercial_entity_role cer
        WHERE cer.commercial_entity = NEW.supplier_entity_id
          AND cer.role_type = 'Proveedor'
    ) INTO is_supplier;
    
    IF NOT is_supplier THEN
        RAISE EXCEPTION 'La entidad comercial ID % no tiene rol de Proveedor', NEW.supplier_entity_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_supplier_role
BEFORE INSERT OR UPDATE ON supply
FOR EACH ROW EXECUTE FUNCTION validate_supplier_role();


-- Función para validar transiciones de estado en manufacturer_status
CREATE OR REPLACE FUNCTION validate_manufacturer_status_transition()
RETURNS TRIGGER AS $$
DECLARE
    previous_state evaluation_state_manufacturer_enum;
    current_date DATE := CURRENT_DATE;
BEGIN
    -- Obtener el estado anterior (si existe)
    SELECT evaluation_state INTO previous_state
    FROM manufacturer_status
    WHERE maker_product_id = NEW.maker_product_id 
      AND end_date IS NULL
      AND id != COALESCE(NEW.id, 0);
    
    -- Validar que start_date no sea futura (excepto para casos especiales)
    IF NEW.start_date > current_date + INTERVAL '7 days' THEN
        RAISE EXCEPTION 'La fecha de inicio no puede ser más de 7 días en el futuro';
    END IF;
    
    -- Si hay un estado anterior, cerrarlo
    IF previous_state IS NOT NULL AND NEW.end_date IS NULL THEN
        UPDATE manufacturer_status
        SET end_date = NEW.start_date - INTERVAL '1 day'
        WHERE maker_product_id = NEW.maker_product_id 
          AND end_date IS NULL
          AND id != NEW.id;
    END IF;
    
    -- Validar que end_date sea posterior a start_date si ambos están presentes
    IF NEW.end_date IS NOT NULL AND NEW.end_date < NEW.start_date THEN
        RAISE EXCEPTION 'La fecha de fin no puede ser anterior a la fecha de inicio';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_manufacturer_status
BEFORE INSERT OR UPDATE ON manufacturer_status
FOR EACH ROW EXECUTE FUNCTION validate_manufacturer_status_transition();


--=========================================================
-- VISTAS
--=========================================================

-- Vista para ver el estado actual de todos los fabricantes
CREATE OR REPLACE VIEW vw_current_manufacturer_status AS
SELECT 
    ms.id as estado_id,
    mp.id as maker_product_id,
    p.description as producto,
    p.product_type as tipo_producto,
    ce.entity_name as fabricante,
    ce.entity_country as pais_fabricante,
    ms.evaluation_process_id,
    CASE 
        WHEN ms.evaluation_process_id IS NULL THEN 'Global'
        ELSE 'Proceso ' || ms.evaluation_process_id::text
    END as tipo_estado,
    ms.evaluation_state as estado_actual,
    ms.start_date as fecha_inicio_estado,
    -- Información del proceso (si aplica)
    ep.id as proceso_id,
    a.application_number as solicitud,
    c.client_name as cliente,
    -- Información del proveedor (si aplica)
    ce_sup.entity_name as proveedor
FROM manufacturer_status ms
JOIN maker_product mp ON mp.id = ms.maker_product_id
JOIN product p ON p.id = mp.product_id
JOIN commercial_entity ce ON ce.id = mp.maker_entity_id
LEFT JOIN evaluation_process ep ON ep.id = ms.evaluation_process_id
LEFT JOIN application a ON a.id = ep.application_id
LEFT JOIN client c ON c.id = a.client_id
LEFT JOIN supply s ON s.id = ep.supply_id
LEFT JOIN commercial_entity ce_sup ON ce_sup.id = s.supplier_entity_id
WHERE ms.end_date IS NULL
ORDER BY ms.start_date DESC;

COMMENT ON VIEW vw_current_manufacturer_status IS 'Muestra el estado actual de todos los fabricantes, diferenciando entre estados globales y por proceso.';


-- Vista del historial completo
CREATE OR REPLACE VIEW vw_manufacturer_status_history AS
SELECT 
    ms.id as registro_id,
    mp.id as maker_product_id,
    p.description as producto,
    ce.entity_name as fabricante,
    ms.evaluation_process_id as proceso_id,
    CASE 
        WHEN ms.evaluation_process_id IS NULL THEN 'Estado Global'
        ELSE 'Proceso ' || ms.evaluation_process_id::text
    END as tipo_estado,
    a.application_number as solicitud,
    c.client_name as cliente,
    ms.evaluation_state as estado,
    ms.start_date as fecha_inicio,
    ms.end_date as fecha_fin,
    -- Calcular duración
    CASE 
        WHEN ms.end_date IS NULL THEN 
            AGE(CURRENT_DATE, ms.start_date)
        ELSE 
            AGE(ms.end_date, ms.start_date)
    END as duracion,
    -- Calcular días exactos
    CASE 
        WHEN ms.end_date IS NULL THEN 
            (CURRENT_DATE - ms.start_date)
        ELSE 
            (ms.end_date - ms.start_date)
    END as dias_duracion,
    -- Información de transición
    LAG(ms.evaluation_state) OVER (
        PARTITION BY ms.maker_product_id, ms.evaluation_process_id 
        ORDER BY ms.start_date
    ) as estado_anterior,
    -- Indicador de estado actual
    CASE WHEN ms.end_date IS NULL THEN 'ACTUAL' ELSE 'HISTÓRICO' END as tipo_registro
FROM manufacturer_status ms
JOIN maker_product mp ON mp.id = ms.maker_product_id
JOIN product p ON p.id = mp.product_id
JOIN commercial_entity ce ON ce.id = mp.maker_entity_id
LEFT JOIN evaluation_process ep ON ep.id = ms.evaluation_process_id
LEFT JOIN application a ON a.id = ep.application_id
LEFT JOIN client c ON c.id = a.client_id
ORDER BY ms.maker_product_id, ms.evaluation_process_id NULLS FIRST, ms.start_date;

COMMENT ON VIEW vw_manufacturer_status_history IS 'Muestra el historial completo de estados de todos los fabricantes, con información de transiciones.';


-- Vista de resumen de estados por fabricante
CREATE OR REPLACE VIEW vw_manufacturer_status_summary AS
SELECT 
    mp.id as maker_product_id,
    p.description as producto,
    ce.entity_name as fabricante,
    -- Estado global
    (SELECT evaluation_state 
     FROM manufacturer_status 
     WHERE maker_product_id = mp.id 
       AND evaluation_process_id IS NULL 
       AND end_date IS NULL) as estado_global,
    -- Conteo de procesos por estado
    COUNT(DISTINCT ep.id) as total_procesos,
    COUNT(DISTINCT CASE 
        WHEN ms.evaluation_state = 'Aprobado' THEN ep.id 
    END) as procesos_aprobados,
    COUNT(DISTINCT CASE 
        WHEN ms.evaluation_state = 'No Aprobado' THEN ep.id 
    END) as procesos_no_aprobados,
    COUNT(DISTINCT CASE 
        WHEN ms.evaluation_state NOT IN ('Aprobado', 'No Aprobado') 
        THEN ep.id 
    END) as procesos_pendientes,
    -- Lista de clientes
    STRING_AGG(DISTINCT c.client_name, ', ') as clientes,
    -- Última actualización
    MAX(ms.start_date) as ultima_actualizacion
FROM maker_product mp
JOIN product p ON p.id = mp.product_id
JOIN commercial_entity ce ON ce.id = mp.maker_entity_id
LEFT JOIN supply s ON s.maker_product_id = mp.id
LEFT JOIN evaluation_process ep ON ep.supply_id = s.id
LEFT JOIN manufacturer_status ms ON ms.maker_product_id = mp.id 
    AND ms.evaluation_process_id = ep.id 
    AND ms.end_date IS NULL
LEFT JOIN application a ON a.id = ep.application_id
LEFT JOIN client c ON c.id = a.client_id
GROUP BY mp.id, p.description, ce.entity_name
ORDER BY ce.entity_name, p.description;

COMMENT ON VIEW vw_manufacturer_status_summary IS 'Resumen del estado de cada fabricante, mostrando conteo de procesos por estado.';


-- Vista para resumen de evaluaciones
CREATE OR REPLACE VIEW evaluation_summary AS
SELECT 
    a.id as application_id,
    a.application_number,
    c.client_name,
    c.client_country,
    a.origin,
    a.receipt_date,
    p.description as product_description,
    p.product_type,
    p.priority as product_priority,
    ce_supplier.entity_name as supplier_name,
    ce_supplier.entity_country as supplier_country,
    ce_maker.entity_name as manufacturer_name,
    ce_maker.entity_country as manufacturer_country,
    ep.id as evaluation_process_id,
    eo.offered_price,
    eo.is_competitive,
    eo.analysis_date as offer_analysis_date,
    -- Para documentos: verificar si hay alguno aprobado
    (SELECT bool_and(is_approved) 
     FROM document_evaluation de 
     JOIN technical_document td ON td.id = de.technical_document_id
     JOIN supply s ON s.id = td.supply_id
     WHERE de.evaluation_process_id = ep.id) as documents_approved,
    -- Para muestras: obtener el último resultado
    (SELECT result 
     FROM sample_evaluation se 
     WHERE se.evaluation_process_id = ep.id 
     ORDER BY se.evaluation_date DESC 
     LIMIT 1) as sample_result,
    -- Para decisión de continuar
    (SELECT decision_continue 
     FROM sample_evaluation se 
     WHERE se.evaluation_process_id = ep.id 
     ORDER BY se.evaluation_date DESC 
     LIMIT 1) as sample_continue,
    ip.purchase_status as industrial_status,
    ie.analysis_result as industrial_result,
    ms.evaluation_state as manufacturer_status
FROM application a
JOIN client c ON c.id = a.client_id
JOIN application_product ap ON ap.application_id = a.id
JOIN product p ON p.id = ap.product_id
JOIN evaluation_process ep ON ep.application_id = a.id
JOIN supply s ON s.id = ep.supply_id
JOIN commercial_entity ce_supplier ON ce_supplier.id = s.supplier_entity_id
JOIN maker_product mp ON mp.id = s.maker_product_id
JOIN commercial_entity ce_maker ON ce_maker.id = mp.maker_entity_id
LEFT JOIN exploratory_offer eo ON eo.evaluation_process_id = ep.id
LEFT JOIN industrial_purchase ip ON ip.evaluation_process_id = ep.id
LEFT JOIN industrial_evaluation ie ON ie.industrial_purchase_id = ip.id
LEFT JOIN manufacturer_status ms ON ms.maker_product_id = mp.id 
    AND ms.evaluation_process_id = ep.id 
    AND ms.end_date IS NULL;

COMMENT ON VIEW evaluation_summary IS 'Resumen completo del proceso de evaluación con todas las relaciones indirectas';


-- Vista para seguimiento de estado
CREATE OR REPLACE VIEW status_tracking AS
SELECT 
    ep.id as process_id,
    a.application_number,
    c.client_name,
    p.description as product,
    ce_supplier.entity_name as supplier,
    CASE 
        WHEN eo.id IS NULL THEN 'Pendiente: Oferta Exploratoria'
        WHEN de.id IS NULL THEN 'Pendiente: Evaluación Documental'
        WHEN se.id IS NULL THEN 'Pendiente: Evaluación de Muestra'
        WHEN ip.id IS NULL THEN 'Pendiente: Compra Industrial'
        WHEN ie.id IS NULL THEN 'Pendiente: Evaluación Industrial'
        ELSE 'Completado'
    END as current_status,
    CASE 
        WHEN eo.is_competitive = false THEN 'No Competitivo'
        WHEN de.is_approved = false THEN 'Documentación Rechazada'
        WHEN se.result = 'No Conforme' THEN 'Muestra No Conforme'
        WHEN se.decision_continue = false THEN 'No Continuar'
        WHEN ie.analysis_result = 'Defectuoso' THEN 'Industrial Defectuoso'
        WHEN ie.analysis_result = 'Buen Desempeño' THEN 'Aprobado Final'
        ELSE 'En Proceso'
    END as result_status
FROM evaluation_process ep
JOIN application a ON a.id = ep.application_id
JOIN client c ON c.id = a.client_id
JOIN supply s ON s.id = ep.supply_id
JOIN maker_product mp ON mp.id = s.maker_product_id
JOIN product p ON p.id = mp.product_id
JOIN commercial_entity ce_supplier ON ce_supplier.id = s.supplier_entity_id
LEFT JOIN exploratory_offer eo ON eo.evaluation_process_id = ep.id
LEFT JOIN document_evaluation de ON de.evaluation_process_id = ep.id
LEFT JOIN sample_evaluation se ON se.evaluation_process_id = ep.id
LEFT JOIN industrial_purchase ip ON ip.evaluation_process_id = ep.id
LEFT JOIN industrial_evaluation ie ON ie.industrial_purchase_id = ip.id;

COMMENT ON VIEW status_tracking IS 'Seguimiento del estado y resultado de cada proceso de evaluación';
