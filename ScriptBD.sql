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

CREATE TYPE entity_role_enum AS ENUM 
('Fabricante', 
 'Proveedor');

CREATE TYPE document_type_enum AS ENUM
('COA', 
 'Ficha Técnica', 
 'Permiso Sanitario', 
 'Otro');

CREATE TYPE result_sample_analysis_enum AS ENUM
('Conforme', 
 'No Conforme');

CREATE TYPE state_industrial_purchasing_enum AS ENUM
('Concluida', 
 'Parcialmente Concluida', 
 'Pendiente de Embarque');

CREATE TYPE result_industrial_analysis_enum AS ENUM
('Buen Desempeño', 
 'Defectuoso', 
 'No Informado');

CREATE TYPE final_state_manufacturer_enum AS ENUM
('Aprobado', 
 'No Aprobado', 
 'Pendiente de Documentación',
 'Pendiente de Muestra', 
 'Pendiente de Informe',
 'Contrato a Riesgo (COA o muestras)');

CREATE TYPE user_role_enum AS ENUM
('Administrador', 
 'Observador', 
 'Administrador de Base de Datos',
 'Analista de Precios');


-- ========================================================
-- HABILITAR EXTENSIONES NECESARIAS
-- ========================================================

-- Ejecutar primero como superusuario o con permisos de creación de extensiones:
--CREATE EXTENSION IF NOT EXISTS pg_trgm;
--CREATE EXTENSION IF NOT EXISTS btree_gin; -- Opcional, para índices GIN en múltiples tipos

--COMMENT ON EXTENSION pg_trgm IS 'Soporte para búsqueda de texto usando trigramas (similaridad, índice gin_trgm_ops)';


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

--CREATE INDEX idx_client_name_search ON client USING gin(lower(client_name) gin_trgm_ops);


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

--CREATE INDEX idx_commercial_entity_name ON commercial_entity USING gin(lower(entity_name) gin_trgm_ops);


-- COMMERCIAL ENTITY_ROLE
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

COMMENT ON TABLE public.commercial_entity_role
    IS 'Define los roles que puede asumir una entidad comercial (Fabricante o Proveedor.';

COMMENT ON COLUMN public.commercial_entity_role.commercial_entity
    IS 'FK a commercial_entity. Entidad comercial que cumple con este error';

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

-- CREATE INDEX idx_product_description_search ON product USING gin(lower(description) gin_trgm_ops);


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
    IS 'FK a product. Producto que es fabricado por el Fabricante.';

COMMENT ON COLUMN public.maker_product.maker_entity_id
    IS 'FK a commercial_entity que actúa como Fabricante: empresa que produce materiales o productos farmacéuticos.';

CREATE UNIQUE INDEX uq_maker_product
ON maker_product (product_id, maker_entity_id);

CREATE INDEX idx_maker_product_product ON maker_product (product_id);
CREATE INDEX idx_maker_product_maker ON maker_product (maker_entity_id);


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

CREATE INDEX idx_supply_supplier ON supply (supplier_entity_id);
CREATE INDEX idx_supply_maker_product ON supply (maker_product_id);


--=========================================================
-- APPLICATION & EVALUATION PROCESS
--=========================================================

-- APPLICATION
CREATE TABLE application (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    application_number INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    origin origin_request_enum NOT NULL,
    receipt_date DATE NOT NULL,
    is_selected BOOLEAN,
    FOREIGN KEY (client_id)
        REFERENCES client (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE public.application
    IS 'Solicitud principal del cliente que inicia el proceso de evaluación.';

COMMENT ON COLUMN public.application.application_number
    IS 'Número identificador de la solicitud.';

COMMENT ON COLUMN public.application.client_id
    IS 'FK a client. Cliente que realiza la solicitud del producto.';

COMMENT ON COLUMN public.application.origin
    IS 'Origen de la solicitud (BCF, Cliente, Proveedor, ...).';

COMMENT ON COLUMN public.application.receipt_date
    IS 'Fecha de recepción de la solicitud.';

COMMENT ON COLUMN public.application.is_selected
    IS 'Indica si la solicitud fue seleccionada para tramitarse.';

CREATE UNIQUE INDEX uq_application_number
ON application (application_number);

CREATE UNIQUE INDEX uq_application_client
ON application (client_id, receipt_date);

CREATE INDEX idx_application_client ON application (client_id);
CREATE INDEX idx_application_receipt_date ON application (receipt_date);


-- APPLICATION_PRODUCT
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

COMMENT ON TABLE application_product 
    IS 'Relaciona las solicitudes de los clientes con los productos solicitados.';

COMMENT ON COLUMN public.application_product.application_id
    IS 'FK a application. Solicitud del producto.';

COMMENT ON COLUMN public.application_product.product_id
    IS 'FK a product. Producto solicitado por el cliente.';

CREATE UNIQUE INDEX uq_application_product
ON application_product (application_id, product_id);

CREATE INDEX idx_app_product_app ON application_product (application_id);
CREATE INDEX idx_app_product_product ON application_product (product_id);
CREATE INDEX idx_application_selected ON application (is_selected) WHERE is_selected = true;


-- EVALUATION_PROCESS
CREATE TABLE evaluation_process (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	application_id INTEGER NOT NULL,
    supply_id INTEGER NOT NULL,
    FOREIGN KEY (application_id)
        REFERENCES application (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (supply_id)
        REFERENCES supply (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

COMMENT ON TABLE public.evaluation_process
    IS 'Centraliza el proceso de evaluación para cada combinación solicitud-suminsitro.';

COMMENT ON COLUMN public.evaluation_process.application_id
    IS 'FK a application. Solicitud a la que corresponde esta evaluación.';

COMMENT ON COLUMN public.evaluation_process.supply_id
    IS 'FK a supply. Suministro a evaluar.';

CREATE UNIQUE INDEX uq_evaluation_process
ON evaluation_process (application_id, supply_id);

CREATE INDEX idx_evaluation_process_app ON evaluation_process (application_id);
CREATE INDEX idx_evaluation_process_supply ON evaluation_process (supply_id);

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
        ON DELETE SET NULL,
    FOREIGN KEY (supplier_id)
        REFERENCES commercial_entity (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

COMMENT ON TABLE public.supplier_purchase
    IS 'Compras históricas realizadas a proveedores, usadas como referncia para análisis de ofertas.';

COMMENT ON COLUMN public.supplier_purchase.product_id
    IS 'Fk a product. Producto adquirido.';

COMMENT ON COLUMN public.supplier_purchase.supplier_id
    IS 'Fk a commercial_entity que actúa como Proveedor, del cual es el que vende el producto.';

COMMENT ON COLUMN public.supplier_purchase.unit_price
    IS 'Precio unitario de compra.';

COMMENT ON COLUMN public.supplier_purchase.purchase_date
    IS 'Fecha de la compra.';

CREATE UNIQUE INDEX uq_supplier_purchase
ON supplier_purchase (product_id, supplier_id);

CREATE INDEX idx_supp_purchase_product ON supplier_purchase (product_id);
CREATE INDEX idx_supp_purchase_supplier ON supplier_purchase (supplier_id);
CREATE INDEX idx_supp_purchase_date ON supplier_purchase (purchase_date);


-- EXPLORATORY_OFFER
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

COMMENT ON TABLE public.exploratory_offer
    IS 'Oferta exploratoria asociada a un proceso de evaluación.';

COMMENT ON COLUMN public.exploratory_offer.evaluation_process_id
    IS 'FK a evaluation_process.';

COMMENT ON COLUMN public.exploratory_offer.offered_price
    IS 'Precio que ofrece el proveedor por el producto.';

COMMENT ON COLUMN public.exploratory_offer.reference_purchase_id
    IS 'Fk a supplier_purchase. Última compra realiza del producto en la empresa.';

COMMENT ON COLUMN public.exploratory_offer.price_difference
    IS 'Diferencia entre el precio del nuevo proveedor y el precio de la última compra.';

COMMENT ON COLUMN public.exploratory_offer.percentage_difference
    IS 'Diferencia en porciento.';

COMMENT ON COLUMN public.exploratory_offer.analysis_date
    IS 'Fecha del análisis de la oferta exploratoria.';

COMMENT ON COLUMN public.exploratory_offer.is_competitive
    IS 'Decisión final de evaluar el nuevo suministro o no.';

CREATE UNIQUE INDEX uq_exploratory_offer
ON exploratory_offer (evaluation_process_id);

CREATE INDEX idx_exploratory_eval_process ON exploratory_offer (evaluation_process_id);
CREATE INDEX idx_exploratory_ref_purchase ON exploratory_offer (reference_purchase_id);
CREATE INDEX idx_exploratory_analysis_date ON exploratory_offer (analysis_date);
CREATE INDEX idx_exploratory_competitive ON exploratory_offer (is_competitive) WHERE is_competitive = true;

-- TRIGGER: Función para calcular oferta exploratoria
CREATE OR REPLACE FUNCTION calculate_exploratory_offer()
RETURNS TRIGGER AS $$
DECLARE
    v_reference_price NUMERIC(12,2);
    v_supplier_id INTEGER;
    v_product_id INTEGER;
BEGIN
    -- Obtener supplier_id y product_id del evaluation_process
    SELECT s.supplier_entity_id, mp.product_id 
    INTO v_supplier_id, v_product_id
    FROM evaluation_process ep
    JOIN supply s ON s.id = ep.supply_id
    JOIN maker_product mp ON mp.id = s.maker_product_id
    WHERE ep.id = NEW.evaluation_process_id;
    
    -- Obtener la última compra para este producto y proveedor
    SELECT unit_price INTO v_reference_price
    FROM supplier_purchase
    WHERE product_id = v_product_id
      AND supplier_id = v_supplier_id
    ORDER BY purchase_date DESC
    LIMIT 1;
    
    -- Si no hay compra previa, usar precio ofertado como referencia
    IF v_reference_price IS NULL THEN
        v_reference_price := NEW.offered_price;
        NEW.is_competitive := true;
    ELSE
        NEW.price_difference := NEW.offered_price - v_reference_price;
        NEW.percentage_difference := (NEW.price_difference / v_reference_price) * 100;
        NEW.is_competitive := NEW.offered_price < v_reference_price;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_exploratory_offer
BEFORE INSERT OR UPDATE ON exploratory_offer
FOR EACH ROW
EXECUTE FUNCTION calculate_exploratory_offer();


--=========================================================
-- TECHNICAL DOCUMENTS
--========================================================= 

-- TECHNICAL_DOCUMENT
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

COMMENT ON TABLE public.technical_document
    IS 'Documentos técnicos asociados a un suministro (COA, ficha técnica, permisos, etc.).';

COMMENT ON COLUMN public.technical_document.supply_id
    IS 'FK a supply. Suminstro al que pertenece el documento técnico.';

COMMENT ON COLUMN public.technical_document.document_name 
    IS 'Nombre del documento.';
	
COMMENT ON COLUMN public.technical_document.document_type
    IS 'Tipo de documento (COA, Ficha, Permiso...).';

COMMENT ON COLUMN public.technical_document.version
    IS 'Versión o identificación del documento.';

COMMENT ON COLUMN public.technical_document.file_path 
    IS 'Directorio del documento.';

COMMENT ON COLUMN public.technical_document.request_date
    IS 'Fecha en que se solicitó el documento técnico.';

COMMENT ON COLUMN public.technical_document.receipt_date
    IS 'Fecha de recepción del documento técnico.';

CREATE UNIQUE INDEX uq_technical_document
ON technical_document (supply_id, document_name, document_type, version);

CREATE INDEX idx_tech_doc_supply ON technical_document (supply_id);
CREATE INDEX idx_tech_doc_version ON technical_document (version);


-- DOCUMENT_EVALUATION
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

COMMENT ON TABLE public.document_evaluation
    IS 'Registra la evaluación individual que realiza cada cliente sobre los documentos técnicos de un suministro.';

COMMENT ON COLUMN public.document_evaluation.evaluation_process_id
    IS 'Fk a evaluation_process.';

COMMENT ON COLUMN public.document_evaluation.technical_document_id
    IS 'Fk a technical_document. Documento Técnico que se evalúa.';

COMMENT ON COLUMN public.document_evaluation.send_date
    IS 'Fecha de envío del documento al cliente.';

COMMENT ON COLUMN public.document_evaluation.evaluation_date
    IS 'Fecha de evaluación del documento.';

COMMENT ON COLUMN public.document_evaluation.is_approved
    IS 'Resultado de la evaluación del documento.';

CREATE UNIQUE INDEX uq_document_evaluation
ON document_evaluation (evaluation_process_id, technical_document_id);

CREATE INDEX idx_doc_eval_process ON document_evaluation (evaluation_process_id);
CREATE INDEX idx_doc_eval_tech_doc ON document_evaluation (technical_document_id);
CREATE INDEX idx_doc_eval_approved ON document_evaluation (is_approved) WHERE is_approved = true;


--=========================================================
-- SAMPLES
--========================================================= 

-- SAMPLE
CREATE TABLE sample ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
	evaluation_process_id INTEGER NOT NULL,
    request_date DATE NOT NULL,
    send_date_supplier DATE,
    date_receipt_warehouse DATE,
    date_receipt_client DATE,
    quantity NUMERIC(12, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    sample_code VARCHAR(100) NOT NULL,
	FOREIGN KEY (evaluation_process_id) 
	    REFERENCES evaluation_process (id) 
		ON UPDATE CASCADE 
		ON DELETE CASCADE
); 

COMMENT ON TABLE public.sample
    IS 'Registro de muestras enviadas/recibidas.';

COMMENT ON COLUMN public.sample.evaluation_process_id
    IS 'Fk a evaluation_process.';

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

COMMENT ON COLUMN public.sample.unit
    IS 'Unidad de medida de la muestra.';
	
COMMENT ON COLUMN public.sample.sample_code
    IS 'Código interno asignado a la muestra por FARMACUBA.';

CREATE UNIQUE INDEX uq_sample_code
ON sample (sample_code);

CREATE UNIQUE INDEX uq_sample_logical
ON sample (evaluation_process_id, request_date, quantity, unit);

CREATE INDEX idx_sample_process ON sample (evaluation_process_id);
CREATE INDEX idx_sample_request_date ON sample (request_date);
CREATE INDEX idx_sample_receipt_client ON sample (date_receipt_client);
CREATE INDEX idx_sample_code ON sample (sample_code);


-- SAMPLE_ANALYSIS
CREATE TABLE sample_analysis ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
	sample_id INTEGER NOT NULL,
    performed_by_client INTEGER NOT NULL,
    analysis_date DATE NOT NULL,
	analyst_name VARCHAR(200),
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

CREATE INDEX idx_sample_analysis_sample ON sample_analysis (sample_id);
CREATE INDEX idx_sample_analysis_date ON sample_analysis (analysis_date);


-- SAMPLE_EVALUATION
CREATE TABLE sample_evaluation ( 
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	evaluation_process_id INTEGER NOT NULL,
    sample_analysis_id INTEGER NOT NULL,
	self_performed BOOLEAN NOT NULL,
	send_analysis_date DATE,
    evaluation_date DATE,
	result result_sample_analysis_enum,
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

COMMENT ON TABLE public.sample_evaluation
    IS 'Cada cliente evalúa muestras del suministro; puede usar su propio análisis o adoptar el de otro cliente.';

COMMENT ON COLUMN public.sample_evaluation.evaluation_process_id
    IS 'Fk a evaluation_process.';

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
ON sample_evaluation (evaluation_process_id, sample_analysis_id);

CREATE INDEX idx_sample_eval_process ON sample_evaluation (evaluation_process_id);
CREATE INDEX idx_sample_eval_analysis ON sample_evaluation (sample_analysis_id);
CREATE INDEX idx_sample_eval_conforme ON sample_evaluation (result) WHERE result = 'Conforme';

-- TRIGGER: CALCULAR self_performed AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION calculate_self_performed()
RETURNS TRIGGER AS $$
DECLARE
    v_client_id INTEGER;
    v_analysis_client_id INTEGER;
    v_sample_id INTEGER;
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
    v_sample_id_from_analysis INTEGER;
    v_evaluation_process_sample_id INTEGER;
BEGIN
    -- Obtener cliente del evaluation_process
    SELECT a.client_id INTO v_evaluation_process_client
    FROM evaluation_process ep
    JOIN application a ON a.id = ep.application_id
    WHERE ep.id = NEW.evaluation_process_id;
    
    -- Obtener cliente del análisis y sample_id
    SELECT sa.performed_by_client, sa.sample_id 
    INTO v_sample_analysis_client, v_sample_id_from_analysis
    FROM sample_analysis sa
    WHERE sa.id = NEW.sample_analysis_id;
    
    -- Verificar que el análisis pertenezca a una muestra del mismo evaluation_process
    SELECT s.id INTO v_evaluation_process_sample_id
    FROM sample s
    WHERE s.id = v_sample_id_from_analysis
      AND s.evaluation_process_id = NEW.evaluation_process_id;
    
    IF v_evaluation_process_sample_id IS NULL THEN
        RAISE EXCEPTION 'El análisis de muestra (ID: %) no pertenece a una muestra del proceso de evaluación (ID: %)', 
        NEW.sample_analysis_id, NEW.evaluation_process_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_sample_evaluation
BEFORE INSERT OR UPDATE ON sample_evaluation
FOR EACH ROW
EXECUTE FUNCTION validate_sample_evaluation();


--=========================================================
-- INDUSTRIAL EVALUATION
--=========================================================

-- INDUSTRIAL PURCHASE
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

COMMENT ON TABLE public.industrial_purchase
    IS 'Registro de la compra de los tres lotes por parte del cliente par la evalución a escala industrial.';

COMMENT ON COLUMN public.industrial_purchase.evaluation_process_id
    IS 'Fk a evaluation_process.';

COMMENT ON COLUMN public.industrial_purchase.request_date
    IS 'Fecha de solicitud de la compra de los tres lotes.';

COMMENT ON COLUMN public.industrial_purchase.purchase_status
    IS 'Estado de la compra (Concluida, Parcialmente concluida, ...).';

CREATE UNIQUE INDEX uq_industrial_purchase
ON industrial_purchase (evaluation_process_id);

CREATE INDEX idx_ind_purchase_process ON industrial_purchase (evaluation_process_id);


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

COMMENT ON COLUMN public.industrial_evaluation.industrial_purchase_id
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
ON industrial_evaluation (industrial_purchase_id);

CREATE INDEX idx_ind_eval_purchase ON industrial_evaluation (industrial_purchase_id);
CREATE INDEX idx_ind_eval_send_date ON industrial_evaluation (send_batch_date);
CREATE INDEX idx_ind_eval_report_date ON industrial_evaluation (report_delivery_date);


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
        ON DELETE RESTRICT
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
    IS 'Fecha de fin del estado.';

CREATE UNIQUE INDEX uq_manufacturer_status
ON manufacturer_status (maker_product_id, start_date);

CREATE UNIQUE INDEX ux_manufacturer_status_active
ON manufacturer_status (maker_product_id)
WHERE end_date IS NULL;

CREATE INDEX idx_man_status_maker_product ON manufacturer_status (maker_product_id);

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

COMMENT ON COLUMN public.request_observation.application_id
    IS 'Fk a application.';

COMMENT ON COLUMN public.request_observation.observation_id
    IS 'Fk a observation.';


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

COMMENT ON COLUMN public.exploratory_offer_observation.exploratory_offer_id
    IS 'Fk a exploratory_offer.';

COMMENT ON COLUMN public.exploratory_offer_observation.observation_id
    IS 'Fk a observation.';


-- DOCUMENT_EVALUATION_OBSERVATION
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

COMMENT ON TABLE public.document_evaluation_observation
    IS 'Observaciones aplicadas a las evaluaciones de los documentos.';

COMMENT ON COLUMN public.document_evaluation_observation.document_evaluation_id
    IS 'Fk a document_evaluation.';

COMMENT ON COLUMN public.document_evaluation_observation.observation_id
    IS 'Fk a observation.';
	

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

COMMENT ON COLUMN public.industrial_purchase_observation.industrial_purchase_id
    IS 'Fk a industrial_purchase.';

COMMENT ON COLUMN public.industrial_purchase_observation.observation_id
    IS 'Fk a observation.';
	

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

COMMENT ON COLUMN public.industrial_evaluation_observation.industrial_evaluation_id
    IS 'Fk a industrial_evaluation.';

COMMENT ON COLUMN public.industrial_evaluation_observation.observation_id
    IS 'Fk a observation.';


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

COMMENT ON COLUMN public.sample_analysis_observation.sample_analysis_id
    IS 'Fk a sample_analysis.';

COMMENT ON COLUMN public.sample_analysis_observation.observation_id
    IS 'Fk a observation.';
	

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

COMMENT ON COLUMN public.sample_evaluation_observation.sample_evaluation_id
    IS 'Fk a sample_evaluation.';

COMMENT ON COLUMN public.sample_evaluation_observation.observation_id
    IS 'Fk a observation.';
	

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

COMMENT ON TABLE public.user_account
    IS 'Usuarios del sistema con roles y permisos.';

COMMENT ON COLUMN public.user_account.username
    IS 'Nombre de usuario para login.';

COMMENT ON COLUMN public.user_account.password
    IS 'Contraseña de acceso del usuario.';

COMMENT ON COLUMN public.user_account.role
    IS 'Rol del usuario.';

COMMENT ON COLUMN public.user_account.full_name
    IS 'Nombre completo del usuario.';

COMMENT ON COLUMN public.user_account.is_active
    IS 'Indica si el usuario esta activo o no.';

CREATE UNIQUE INDEX uq_user_account_username
ON user_account (lower(username));


--=========================================================
-- ÍNDICES ADICIONALES PARA RENDIMIENTO
--=========================================================

-- Índices para búsquedas frecuentes
-- CREATE INDEX idx_product_description ON product USING gin(to_tsvector('spanish', description));
-- CREATE INDEX idx_client_name ON client USING gin(to_tsvector('spanish', client_name));

-- Índices para estadísticas
CREATE INDEX idx_exploratory_price ON exploratory_offer (offered_price, is_competitive);
CREATE INDEX idx_sample_status ON sample (request_date, date_receipt_client);

-- Para búsqueda de ofertas por cliente y fecha
CREATE INDEX idx_offers_client_date ON exploratory_offer (evaluation_process_id, analysis_date);

-- Para seguimiento de muestras por proveedor
CREATE INDEX idx_samples_supplier_date ON sample (evaluation_process_id, request_date, date_receipt_client);


--=========================================================
-- FUNCIONES DE REPORTE
--=========================================================

-- Función para obtener estadísticas por cliente
CREATE OR REPLACE FUNCTION get_client_statistics(p_client_id INTEGER)
RETURNS TABLE (
    total_applications BIGINT,
    total_evaluations BIGINT,
    competitive_offers BIGINT,
    approved_documents BIGINT,
    conforming_samples BIGINT,
    successful_industrial BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT a.id) as total_applications,
        COUNT(DISTINCT ep.id) as total_evaluations,
        COUNT(DISTINCT CASE WHEN eo.is_competitive THEN eo.id END) as competitive_offers,
        COUNT(DISTINCT CASE WHEN de.is_approved THEN de.id END) as approved_documents,
        COUNT(DISTINCT CASE WHEN se.result = 'Conforme' THEN se.id END) as conforming_samples,
        COUNT(DISTINCT CASE WHEN ie.analysis_result = 'Buen Desempeño' THEN ie.id END) as successful_industrial
    FROM client c
    LEFT JOIN application a ON a.client_id = c.id
    LEFT JOIN evaluation_process ep ON ep.application_id = a.id
    LEFT JOIN exploratory_offer eo ON eo.evaluation_process_id = ep.id
    LEFT JOIN document_evaluation de ON de.evaluation_process_id = ep.id
    LEFT JOIN sample_evaluation se ON se.evaluation_process_id = ep.id
    LEFT JOIN industrial_purchase ip ON ip.evaluation_process_id = ep.id
    LEFT JOIN industrial_evaluation ie ON ie.industrial_purchase_id = ip.id
    WHERE c.id = p_client_id
    GROUP BY c.id;
END;
$$ LANGUAGE plpgsql;

-- Función para buscar evaluaciones por estado
CREATE OR REPLACE FUNCTION search_evaluations_by_status(
    p_status TEXT DEFAULT NULL,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS SETOF status_tracking AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM status_tracking st
    WHERE 
        (p_status IS NULL OR st.current_status ILIKE '%' || p_status || '%')
        AND (p_start_date IS NULL OR st.created_at >= p_start_date)
        AND (p_end_date IS NULL OR st.created_at <= p_end_date)
    ORDER BY st.created_at DESC;
END;
$$ LANGUAGE plpgsql;


--=========================================================
-- Validación de Fechas Cronológicas
--=========================================================

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


--=========================================================
-- Validación de Precios y Unidades
--=========================================================

-- Función para validar que el precio sea positivo
CREATE OR REPLACE FUNCTION validate_positive_price()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.unit_price <= 0 THEN
        RAISE EXCEPTION 'El precio unitario debe ser mayor que cero';
    END IF;
    
    IF TG_TABLE_NAME = 'exploratory_offer' AND NEW.offered_price <= 0 THEN
        RAISE EXCEPTION 'El precio ofertado debe ser mayor que cero';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_supplier_price
BEFORE INSERT OR UPDATE ON supplier_purchase
FOR EACH ROW EXECUTE FUNCTION validate_positive_price();

CREATE TRIGGER trg_validate_offer_price
BEFORE INSERT OR UPDATE ON exploratory_offer
FOR EACH ROW EXECUTE FUNCTION validate_positive_price();

-- Función para validar unidades de medida en muestras
CREATE OR REPLACE FUNCTION validate_sample_units()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar unidades válidas (puedes expandir esta lista)
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


--=========================================================
-- Validación de Estados y Transiciones
--=========================================================

-- Función para validar transiciones de estado en manufacturer_status
CREATE OR REPLACE FUNCTION validate_manufacturer_status_transition()
RETURNS TRIGGER AS $$
DECLARE
    previous_state final_state_manufacturer_enum;
    current_date DATE := CURRENT_DATE;
BEGIN
    -- Obtener el estado anterior (si existe)
    SELECT final_state INTO previous_state
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
-- Validación de Consistencia de Evaluación
--=========================================================

-- Función para validar que no se evalúe lo mismo dos veces
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


--=========================================================
-- Validación de Completitud de Procesos / ESTA NO VALE
--=========================================================

-- Función para validar que las etapas se completen en orden
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


--=========================================================
-- Validación de Usuarios y Roles
--=========================================================

-- Función para validar formato de usuario
CREATE OR REPLACE FUNCTION validate_user_account()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar formato de username (email o nombre de usuario)
    IF NEW.username !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' 
       AND NEW.username !~ '^[a-z0-9_]{3,50}$' THEN
        RAISE EXCEPTION 'El username debe ser nombre de usuario (3-50 caracteres, solo letras, números y guión bajo)';
    END IF;
    
    -- Validar que la contraseña tenga al menos 8 caracteres
    IF LENGTH(NEW.password) < 8 THEN
        RAISE EXCEPTION 'La contraseña debe tener al menos 8 caracteres';
    END IF;
    
    -- Validar que el nombre completo no esté vacío
    IF TRIM(NEW.full_name) = '' THEN
        RAISE EXCEPTION 'El nombre completo no puede estar vacío';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_user_account
BEFORE INSERT OR UPDATE ON user_account
FOR EACH ROW EXECUTE FUNCTION validate_user_account();


--=========================================================
-- Validación de Referencias Cruzadas
--=========================================================

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


--=========================================================
-- VISTAS PRINCIPALES
--=========================================================

-- Vista para resumen de evaluaciones
CREATE VIEW evaluation_summary AS
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
    de.is_approved as documents_approved,
    se.result as sample_result,
    se.decision_continue as sample_continue,
    ip.purchase_status as industrial_status,
    ie.analysis_result as industrial_result,
    ms.final_state as manufacturer_status
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
LEFT JOIN document_evaluation de ON de.evaluation_process_id = ep.id
LEFT JOIN sample_evaluation se ON se.evaluation_process_id = ep.id
LEFT JOIN industrial_purchase ip ON ip.evaluation_process_id = ep.id
LEFT JOIN industrial_evaluation ie ON ie.industrial_purchase_id = ip.id
LEFT JOIN manufacturer_status ms ON ms.maker_product_id = mp.id AND ms.end_date IS NULL;

-- Vista para seguimiento de estado
CREATE VIEW status_tracking AS
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


--=========================================================
-- VISTAS DE ALERTAS
--=========================================================
detailed_alerts
alerts_dashboard
active_alerts_by_client
weekly_alerts_trend
frontend_alerts
--=========================================================
-- VISTAS DE ANÁLISIS
--=========================================================
process_timeline
price_analysis
documentation_status
manufacturer_evaluation
client_activity
--=========================================================
-- VISTAS DE REPORTES ESPECIALIZADOS
--=========================================================
industrial_evaluation_report
system_kpis
executive_dashboard
--=========================================================
-- VISTAS DE APOYO
--=========================================================
pending_tasks
request_by_origin