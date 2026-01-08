--=========================================================
-- SCHEMA
--=========================================================

-- CREATE SCHEMA IF NOT EXISTS Sistema Eval. Nuevos Prod y/o Fab;
-- SET search_path TO Sistema Eval. Nuevos Prod y/o Fab;

--=========================================================
-- ENUMS
--=========================================================

CREATE TYPE origin_request_enum AS ENUM
('BioCubaFarma (BCF)', 
 'Cliente', 
 'Proveedor', 
 'NM', 
 'No Procede (NP)',
 'Extraplan', 
 'Cliente (Extraplan)', 
 'Proveedor (Extraplan)');

CREATE TYPE product_type_enum AS ENUM
('Materia Prima (Ingrediente Farmacéutico Activo)',
 'Materia Prima (Excipiente Farmacéutico)',
 'Materia Prima (Cápsula)',
 'Material de Envase',
 'Reactivo',
 'Dispositivo');

CREATE TYPE document_type_enum AS ENUM
('COA', 
 'Ficha Técnica', 
 'Permiso Sanitario', 
 'Otro');

CREATE TYPE final_state_manufacturer_enum AS ENUM
('Aprobado', 
 'No Aprobado', 
 'Pendiente de Documentación',
 'Pendiente de Muestra', 
 'Pendiente de Informe',
 'Contrato a Riesgo (COA o muestras)');

CREATE TYPE result_industrial_analysis_enum AS ENUM
('Buen Desempeño', 
 'Defectuoso', 
 'No Informado');

CREATE TYPE result_sample_analysis_enum AS ENUM
('Conforme', 
 'No Conforme');

CREATE TYPE state_industrial_purchasing_enum AS ENUM
('Concluida', 
 'Parcialmente Concluida', 
 'Pendiente de Embarque');

CREATE TYPE user_role_enum AS ENUM
('Administrador', 
 'Observador', 
 'Administrador de Base de Datos');

--=========================================================
-- CORE TABLES
--========================================================= */

-- CLIENT
CREATE TABLE client (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_country VARCHAR(100) NOT NULL
);

COMMENT ON TABLE public.client
    IS 'Clientes o empresas solicitantes que realizan solicitudes de evaluación.';

COMMENT ON COLUMN public.client.client_name
    IS 'Nombre del cliente o empresa solicitante.';

COMMENT ON COLUMN public.client.client_country
    IS 'País de origen del cliente.';

CREATE UNIQUE INDEX uq_client_ci
ON client (lower(client_name), lower(client_country));


-- COMMERCIAL ENTITY
CREATE TABLE commercial_entity (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entity_name VARCHAR(255) NOT NULL,
    entity_country VARCHAR(100) NOT NULL
);

COMMENT ON TABLE public.commercial_entity
    IS 'Representa empresas con las que FARMACUBA mantiene relaciones (pueden ser fabricantes o proveedores).';

COMMENT ON COLUMN public.commercial_entity.entity_name
    IS 'Nombre de la entidad comercial.';

COMMENT ON COLUMN public.commercial_entity.entity_country
    IS 'País de la entidad comercial.';

CREATE UNIQUE INDEX uq_commercial_entity_ci
ON commercial_entity (lower(entity_name), lower(entity_country));


-- COMMERCIAL ENTITY_ROLE
CREATE TABLE commercial_entity_role (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    commercial_entity INTEGER NOT NULL,
    role_type VARCHAR(20) NOT NULL,
    CONSTRAINT uq_entity_role UNIQUE (commercial_entity, role_type),
    FOREIGN KEY (commercial_entity)
        REFERENCES commercial_entity (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

COMMENT ON TABLE public.commercial_entity_role
    IS 'Define los roles que puede asumir una entidad comercial (Fabricante o Proveedor.';

COMMENT ON COLUMN public.commercial_entity_role.commercial_entity
    IS 'FK a commercial_entity.';

COMMENT ON COLUMN public.commercial_entity_role.role_type
    IS 'Rol desempeñado por la entidad comercial (Fabricante o Proveedor).';


-- PRODUCT
CREATE TABLE product (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    product_type product_type_enum NOT NULL,
    exclusive_use BOOLEAN NOT NULL DEFAULT false,
    priority INTEGER NOT NULL CHECK (priority IN (1,2,3))
);

COMMENT ON TABLE public.product
    IS 'Productos solicitados para evaluación.';

COMMENT ON COLUMN public.product.description
    IS 'Descripción del producto según nomenclador/propuesta del proveedor.';

COMMENT ON COLUMN public.product.product_type
    IS 'Tipo de producto (MP, ME, R, D).';

COMMENT ON COLUMN public.product.exclusive_use
    IS 'Indica si el producto es de uso exclusivo o compartido.';

COMMENT ON COLUMN public.product.priority
    IS 'Nivel de prioridad de atención o evaluación (1,2,3).';

CREATE UNIQUE INDEX uq_product_ci
ON product (lower(description), product_type);


-- MAKER_PRODUCT
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

COMMENT ON TABLE public.maker_product
    IS 'Relaciona productos con sus fabricantes.';

COMMENT ON COLUMN public.maker_product.product_id
    IS 'FK a product.';

COMMENT ON COLUMN public.maker_product.maker_entity_id
    IS 'FK a commercial_entity que actúa como Fabricante: empresa que produce materiales o productos farmacéuticos.';

CREATE UNIQUE INDEX uq_maker_product
ON maker_product (product_id, maker_entity_id);


-- SUPPLY
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

COMMENT ON TABLE public.supply
    IS 'Registro del proveedor que suministra un producto de determinado fabricante.';

COMMENT ON COLUMN public.supply.supplier_entity_id
    IS 'FK a commercial_entity que actúa como Proveedor: empresa o persona encargada de suministrar productos o servicios.';

COMMENT ON COLUMN public.supply.maker_product_id
    IS 'FK a maker_product (producto-fabricante).';

CREATE UNIQUE INDEX uq_supply
ON supply (supplier_entity_id, maker_product_id);


--=========================================================
-- APPLICATION FLOW
--=========================================================

-- APPLICATION
CREATE TABLE application (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    application_number INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    origin origin_request_enum NOT NULL,
    receipt_date DATE NOT NULL,
    is_selected BOOLEAN,
    FOREIGN KEY (client_id)
        REFERENCES client (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (product_id)
        REFERENCES product (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE public.application
    IS 'Solicitud principal del cliente que inicia el proceso de evaluación.';

COMMENT ON COLUMN public.application.application_number
    IS 'Número identificador de la solicitud.';

COMMENT ON COLUMN public.application.client_id
    IS 'FK a client.';

COMMENT ON COLUMN public.application.product_id
    IS 'FK a product.';

COMMENT ON COLUMN public.application.origin
    IS 'Origen de la solicitud (BCF, Cliente, Proveedor, ...).';

COMMENT ON COLUMN public.application.receipt_date
    IS 'Fecha de recepción de la solicitud.';

COMMENT ON COLUMN public.application.is_selected
    IS 'Indica si la solicitud fue seleccionada para tramitarse.';

CREATE UNIQUE INDEX uq_application_number
ON application (application_number);

CREATE UNIQUE INDEX uq_application_client_product
ON application (client_id, product_id, receipt_date);

-- CLIENT_SUPPLY
CREATE TABLE client_supply (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    client_id INTEGER NOT NULL,
    supply_id INTEGER NOT NULL,
    application_id INTEGER NOT NULL,
    FOREIGN KEY (client_id)
        REFERENCES client (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (supply_id)
        REFERENCES supply (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (application_id)
        REFERENCES application (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

COMMENT ON TABLE public.client_supply
    IS 'Indica qué clientes evaluarán cada suministro (varios clientes pueden evaluar el mismo suministro).';

CREATE UNIQUE INDEX uq_client_supply
ON client_supply (client_id, supply_id, application_id);


--=========================================================
-- SUPPLIER PURCHASE & EXPLORATORY OFFER
--=========================================================

-- SUPPLIER_PURCHASE
CREATE TABLE supplier_purchase (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id INTEGER NOT NULL,
    supplier_id INTEGER NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    purchase_date DATE NOT NULL,
    FOREIGN KEY (product_id)
        REFERENCES product (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (supplier_id)
        REFERENCES commercial_entity (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE public.supplier_purchase
    IS 'Compras históricas realizadas a proveedores, usadas como referncia para análisis de ofertas.';

COMMENT ON COLUMN public.supplier_purchase.product_id
    IS 'Producto adquirido.';

COMMENT ON COLUMN public.supplier_purchase.supplier_id
    IS 'Proveedor que realizó la compra.';

COMMENT ON COLUMN public.supplier_purchase.unit_price
    IS 'Precio unitario de compra.';

COMMENT ON COLUMN public.supplier_purchase.purchase_date
    IS 'Fecha de la compra.';


-- EXPLORATORY_OFFER
CREATE TABLE exploratory_offer (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    supply_id INTEGER NOT NULL,
    offered_price NUMERIC(12,2) NOT NULL,
    reference_purchase_id INTEGER NOT NULL,
    is_competitive BOOLEAN NOT NULL,
    price_difference NUMERIC(12,2) NOT NULL,
    percentage_difference NUMERIC(6,2) NOT NULL,
    analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
    FOREIGN KEY (supply_id)
        REFERENCES supply (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (reference_purchase_id)
        REFERENCES supplier_purchase (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE public.exploratory_offer
    IS 'Oferta exploratoria asociada a un suministro (proveedor–fabricante–producto).';

COMMENT ON COLUMN public.exploratory_offer.supply_id
    IS 'FK a supply.';

CREATE UNIQUE INDEX uq_exploratory_offer_supply_date
ON exploratory_offer (supply_id, analysis_date);

--TRIGGER: EXPLORATORY OFFER
CREATE OR REPLACE FUNCTION trg_calculate_exploratory_offer()
RETURNS TRIGGER AS $$
DECLARE
    ref_price NUMERIC(12,2);
BEGIN
    SELECT unit_price
    INTO ref_price

    FROM supplier_purchase
    WHERE id = NEW.reference_purchase_id;

    IF ref_price IS NULL THEN
        RAISE EXCEPTION 'Reference purchase not found';
    END IF;

    NEW.price_difference := NEW.offered_price - ref_price;
    NEW.percentage_difference := (NEW.price_difference / ref_price) * 100;
    NEW.is_competitive := NEW.offered_price < ref_price;

    RETURN NEW;

END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_exploratory_offer
BEFORE INSERT OR UPDATE
ON exploratory_offer
FOR EACH ROW
EXECUTE FUNCTION trg_calculate_exploratory_offer();


--=========================================================
-- REQUEST OFFER
--=========================================================

-- REQUEST_OFFER
CREATE TABLE request_offer (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    application_id INTEGER NOT NULL,
    exploratory_offer_id INTEGER NOT NULL,
    FOREIGN KEY (application_id)
        REFERENCES application (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (exploratory_offer_id)
        REFERENCES exploratory_offer (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE public.request_offer
    IS 'Relaciona solicitudes con las ofertas exploratorias solicitadas a fabricantes/proveedores.';

COMMENT ON COLUMN public.request_offer.application_id
    IS 'Fk a application.';

COMMENT ON COLUMN public.request_offer.exploratory_offer_id
    IS 'Fk a exploratory_offer.';

CREATE UNIQUE INDEX uq_request_offer
ON request_offer (application_id, exploratory_offer_id);


--=========================================================
-- TECHNICAL DOCUMENTS
--========================================================= 

-- TECHNICAL_DOCUMENT
CREATE TABLE technical_document ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
	supply_id INTEGER NOT NULL,
    document_type document_type_enum NOT NULL,
    version VARCHAR(100) NOT NULL,
    request_date DATE,
    receipt_date DATE,
	FOREIGN KEY (supply_id) 
	    REFERENCES supply (id) 
	    ON UPDATE CASCADE 
	    ON DELETE CASCADE 
); 

COMMENT ON TABLE public.technical_document
    IS 'Documentos técnicos asociados a un suministro (COA, ficha técnica, permisos, etc.).';

COMMENT ON COLUMN public.technical_document.supply_id
    IS 'FK a supply.';

COMMENT ON COLUMN public.technical_document.document_type
    IS 'Tipo de documento (COA, Ficha, Permiso...).';

COMMENT ON COLUMN public.technical_document.version
    IS 'Versión o identificación del documento.';

COMMENT ON COLUMN public.technical_document.request_date
    IS 'Fecha en que se solicitó el documento técnico.';

COMMENT ON COLUMN public.technical_document.receipt_date
    IS 'Fecha de recepción del documento técnico.';

CREATE UNIQUE INDEX uq_technical_document
ON technical_document (supply_id, document_type, version);

-- DOCUMENT_EVALUATION
CREATE TABLE document_evaluation ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
	client_id INTEGER NOT NULL,
    technical_document_id INTEGER NOT NULL,
	send_date DATE NOT NULL,
    evaluation_date DATE,
    is_approved BOOLEAN,
	FOREIGN KEY (client_id) 
	    REFERENCES client (id) 
	    ON UPDATE CASCADE 
	    ON DELETE CASCADE,
	FOREIGN KEY (technical_document_id) 
	    REFERENCES technical_document(id) 
	    ON UPDATE CASCADE 
	    ON DELETE CASCADE 
);

COMMENT ON TABLE public.document_evaluation
    IS 'Registra la evaluación individual que realiza cada cliente sobre los documentos técnicos de un suministro.';

COMMENT ON COLUMN public.document_evaluation.client_supply_id
    IS 'Fk a client. Cliente que evalúa el documento.';

COMMENT ON COLUMN public.document_evaluation.technical_document_id
    IS 'Fk a technical_document. Documento Técnico que se evalúa.';

COMMENT ON COLUMN public.document_evaluation.send_date
    IS 'Fecha de envío del documento al cliente.';

COMMENT ON COLUMN public.document_evaluation.evaluation_date
    IS 'Fecha de evaluación del documento.';

COMMENT ON COLUMN public.document_evaluation.is_approved
    IS 'Resultado de la evaluación del documento.';

CREATE UNIQUE INDEX uq_document_evaluation
ON document_evaluation (client_id, technical_document_id);


--=========================================================
-- SAMPLES
--========================================================= 

-- SAMPLE
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
		ON DELETE RESTRICT
); 

COMMENT ON TABLE public.sample
    IS 'Registro de muestras enviadas/recibidas.';

COMMENT ON COLUMN public.sample.supply_id
    IS 'Fk a supply.';

COMMENT ON COLUMN public.sample.request_date
    IS 'Fecha de solicitud de la muestra.';

COMMENT ON COLUMN public.sample.send_date_supplier
    IS 'Fecha de envío de la muestra al proveedor.';

COMMENT ON COLUMN public.sample.date_receipt_warehouse
    IS 'Fecha de recepción en el almacén.';

COMMENT ON COLUMN public.sample.date_receipt_client
    IS 'Fecha de recepción por el cliente.';
	
COMMENT ON COLUMN public.sample.quantity
    IS 'Cantidad de muestra recibida.';

COMMENT ON COLUMN public.sample.qunit
    IS 'Unidad de medida de la muestra.';
	
COMMENT ON COLUMN public.sample.sample_code
    IS 'Código interno asignado a la muestra por FARMACUBA.';

CREATE UNIQUE INDEX uq_sample_code
ON sample (sample_code);

CREATE UNIQUE INDEX uq_sample_logical
ON sample (supply_id, request_date, quantity, unit);


-- SAMPLE_ANALYSIS
CREATE TABLE sample_analysis ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
	sample_id INTEGER NOT NULL,
    performed_by_client INTEGER NOT NULL,
    analysis_date DATE NOT NULL,
	FOREIGN KEY (sample_id) 
	    REFERENCES sample (id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE,
	FOREIGN KEY (performed_by_client) 
	    REFERENCES client (id) 
		ON UPDATE CASCADE 
		ON DELETE RESTRICT
); 

COMMENT ON TABLE public.sample_analysis
    IS 'Análisis realizados sobre una muestra. Puede ser realizado por un cliente.';

COMMENT ON COLUMN public.sample_analysis.sample_id
    IS 'FK a sample: muestra a la que se realizó el análisis.';

COMMENT ON COLUMN public.sample_analysis.performed_by_client
    IS 'FK a client: cliente que realizó el análisis (si aplica).';

COMMENT ON COLUMN public.sample_analysis.analysis_date
    IS 'Fecha en la que se realizó el análisis).';

CREATE UNIQUE INDEX uq_sample_analysis
ON sample_analysis (sample_id, performed_by_client, analysis_date);


-- SAMPLE_EVALUATION
CREATE TABLE sample_evaluation ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	client_id INTEGER,
    sample_analysis_id INTEGER NOT NULL,
	self_perfomed BOOLEAN NOT NULL,
	send_analysis_date DATE,
    evaluation_date DATE,
	result result_sample_analysis_enum,
    decision_continue BOOLEAN,
	FOREIGN KEY (client_id) 
	    REFERENCES client (id) 
		ON UPDATE CASCADE 
		ON DELETE RESTRICT,
	FOREIGN KEY (sample_analysis_id) 
	    REFERENCES sample_analysis (id) 
		ON UPDATE CASCADE 
		ON DELETE RESTRICT,
); 

COMMENT ON TABLE public.sample_evaluation
    IS 'Cada cliente evalúa muestras del suministro; puede usar su propio análisis o adoptar el de otro cliente.';

COMMENT ON COLUMN public.sample_evaluation.client_id
    IS 'Fk a client. Cliente que evalúa el resultado del análisis de la muestra.';

COMMENT ON COLUMN public.sample_evaluation.sample_analysis_id
    IS 'Fk a sample_analysis. Análisis de la muestra a evaluar.';

COMMENT ON COLUMN public.sample_evaluation.self_performed
    IS 'TRUE si el cliente realizó el análisis; FALSE si lo adoptó de otro cliente.';

COMMENT ON COLUMN public.sample_evaluation.send_analysis_date
    IS 'Fecha de envío del análisis de la muestra al cliente, si este no realizó el análisis.';
	
COMMENT ON COLUMN public.sample_evaluation.evaluation_date
    IS 'Fecha de evaluación del análisis de la muestra.';
	
COMMENT ON COLUMN public.sample_evaluation.result
    IS 'Indica si el cliente está conforme o no con el resultado del análisis.';
	
COMMENT ON COLUMN public.sample_evaluation.decision_continue
    IS 'Indica si el cliente decide continuar el proceso.';

CREATE UNIQUE INDEX uq_sample_evaluation
ON sample_evaluation (client_id, sample_analysis_id);


--=========================================================
-- INDUSTRIAL
--=========================================================

-- INDUSTRIAL PURCHASE
CREATE TABLE industrial_purchase ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
	client_id INTEGER NOT NULL,
	supply_id INTEGER NOT NULL,
    request_date DATE NOT NULL,
    purchase_status state_industrial_purchasing_enum NOT NULL,
	FOREIGN KEY (client_id) 
	    REFERENCES client (id) 
	    ON UPDATE CASCADE 
	    ON DELETE RESTRICT,
	FOREIGN KEY (supply_id) 
	    REFERENCES supply (id) 
	    ON UPDATE CASCADE 
	    ON DELETE RESTRICT 
); 

COMMENT ON TABLE public.industrial_purchase
    IS 'Registro de la compra de los tres lotes por parte del cliente par la evalución a escala industrial.';

COMMENT ON COLUMN public.industrial_purchase.client_id
    IS 'Fk a client. Cliente que compra los lotes.';

COMMENT ON COLUMN public.industrial_purchase.supply_id
    IS 'Fk a supply. Suministro al que correponden los 3 lotes.';

COMMENT ON COLUMN public.industrial_purchase.purchase_status
    IS 'Estado de la compra (Concluida, Parcialmente concluida, ...).';

CREATE UNIQUE INDEX uq_industrial_purchase
ON industrial_purchase (client_id, _supply_id);


-- INDUSTRIAL EVALUATION
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

COMMENT ON TABLE public.industrial_evaluation
    IS 'Resultado de la evaluación industrial de los lotes.';

COMMENT ON COLUMN public.industrial_evaluation.industrial_purchase
    IS 'Fk a industrial_purchase. Registro de la compra de los lotes.';

COMMENT ON COLUMN public.industrial_evaluation.send_batch_date
    IS 'Fecha de envío de los lotes.';

COMMENT ON COLUMN public.industrial_evaluation.reception_batch_date
    IS 'Fecha de recepción de lotes por parte del cliente.';

COMMENT ON COLUMN public.industrial_evaluation.analysis_result
    IS 'Resultado: Buen desempeño, Defectuoso, No informado.';

COMMENT ON COLUMN public.industrial_evaluation.report_delivery_date
    IS 'Indica la fecha de entrega del informe, si este campo es vacío, significa que el cliente 
	no ha entregado el informe del resultado final de la evaluación industrial de los 3 lotes.';

CREATE UNIQUE INDEX uq_industrial_evaluation
ON uq_industrial_evaluation (industrial_purchase_id);


--=========================================================
-- MANUFACTURER STATUS
--========================================================= 

-- MANUFACTURER_STATUS
CREATE TABLE manufacturer_status (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    maker_product_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    final_state final_state_manufacturer_enum NOT NULL,
    end_date DATE,
    FOREIGN KEY (maker_product_id)
        REFERENCES maker_product (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

COMMENT ON TABLE public.manufacturer_status
    IS 'Estado de evaluación y aprobación del fabricante para un producto específico.';

COMMENT ON COLUMN public.manufacturer_status.maker_product_id
    IS 'FK a maker_product.';

COMMENT ON COLUMN public.manufacturer_status.start_date
    IS 'Fecha de inicio del estado.';

COMMENT ON COLUMN public.manufacturer_status.final_state
    IS 'Estado final del fabricante: A=aprobado, NA=no aprobado, PD=pendiente documento, etc.';

COMMENT ON COLUMN public.manufacturer_status.end_date
    IS 'Fecha de fin del estado.'

CREATE UNIQUE INDEX uq_manufacturer_status
ON manufacturer_status (maker_product_id, start_date);

CREATE UNIQUE INDEX ux_manufacturer_status_active
ON manufacturer_status (maker_product_id)
WHERE end_date IS NULL;

--=========================================================
-- OBSERVATION
--=========================================================

-- OBSERVATION
CREATE TABLE observation (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    observation_text TEXT NOT NULL,
    observation_date DATE NOT NULL
);

COMMENT ON TABLE public.observation
    IS 'Observaciones textuales que pueden asociarse a solicitudes, ofertas, análisis, etc.';

COMMENT ON COLUMN public.observation.observation_text
    IS 'Texto de la observación.';

COMMENT ON COLUMN public.observation.observation_date
    IS 'Fecha en que se registró la observación.';

-- EXPLORATORY_OFFER_OBSERVATION
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

COMMENT ON TABLE public.exploratory_offer_observation
    IS 'Observaciones aplicadas a las ofertas exploratorias durante su análisis.';

-- INDUSTRIAL_EVALUATION_OBSERVATION
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

COMMENT ON TABLE public.industrial_evaluation_observation
    IS 'Observaciones aplicadas a las evaluaciones industriales de los lotes.';

-- INDUSTRIAL_PURCHASE_OBSERVATION
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

COMMENT ON TABLE public.industrial_purchase_observation
    IS 'Observaciones aplicadas a las compras industriales.';

-- REQUEST_OBSERVATION
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

COMMENT ON TABLE public.request_observation
    IS 'Observaciones asociadas a una solicitud específica.';

-- SAMPLE_ANALYSIS_OBSERVATION
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

COMMENT ON TABLE public.sample_analysis_observation
    IS 'Observaciones aplicadas a los análisis de muestras.';

-- SAMPLE_EVALUATION_OBSERVATION
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

COMMENT ON TABLE public.sample_evaluation_observation
    IS 'Observaciones aplicadas a las evaluaciones de muestras.';

--=========================================================
-- USER ACCOUNT
--=========================================================

-- USER_ACCOUNT
CREATE TABLE user_account (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL
);

COMMENT ON TABLE public.user_account
    IS 'Usuarios del sistema: Administrador u Observador.';

COMMENT ON COLUMN public.user_account.username
    IS 'Nombre de usuario para login.';

COMMENT ON COLUMN public.user_account.role
    IS 'Rol del usuario: Administrador o Observador.';

CREATE UNIQUE INDEX uq_user_account_username
ON user_account (lower(username));
