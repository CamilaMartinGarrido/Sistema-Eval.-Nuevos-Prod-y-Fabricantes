-- =========================================================
-- SCRIPT DE PRUEBA COMPLETO PARA ESTADO DEL FABRICANTE
-- =========================================================

-- 1. PRIMERO LIMPIAMOS DATOS EXISTENTES (opcional, solo para testing)
TRUNCATE TABLE 
    observation,
    request_observation,
    exploratory_offer_observation,
    document_evaluation_observation,
    sample_evaluation_observation,
    industrial_purchase_observation,
    industrial_evaluation_observation,
    sample_analysis_observation,
    sample_evaluation,
    sample_analysis,
    sample,
    document_evaluation,
    technical_document,
    industrial_evaluation,
    industrial_purchase,
    exploratory_offer,
    evaluation_process,
    application_product,
    application,
    supply,
    maker_product,
    product,
    commercial_entity_role,
    commercial_entity,
    client,
    manufacturer_status
RESTART IDENTITY CASCADE;

-- =========================================================
-- 2. CREAR DATOS DE PRUEBA
-- =========================================================

-- 2.1. Crear cliente
INSERT INTO client (client_name, client_country) 
VALUES ('Cliente de Prueba', 'Cuba')
RETURNING id AS cliente_id \gset

-- 2.2. Crear fabricante
INSERT INTO commercial_entity (entity_name, entity_country)
VALUES ('Fabricante de Prueba S.A.', 'Alemania')
RETURNING id AS fabricante_id \gset

-- 2.3. Crear proveedor
INSERT INTO commercial_entity (entity_name, entity_country)
VALUES ('Proveedor de Prueba Ltd.', 'España')
RETURNING id AS proveedor_id \gset

-- 2.4. Asignar roles
INSERT INTO commercial_entity_role (commercial_entity, role_type)
VALUES (:fabricante_id, 'Fabricante'),
       (:proveedor_id, 'Proveedor');

-- 2.5. Crear producto
INSERT INTO product (description, product_type, exclusive_use, priority)
VALUES ('Paracetamol 500mg', 'Materia Prima (Ingrediente Farmacéutico Activo)', false, 1)
RETURNING id AS producto_id \gset

-- 2.6. Relacionar producto-fabricante
INSERT INTO maker_product (product_id, maker_entity_id)
VALUES (:producto_id, :fabricante_id)
RETURNING id AS maker_product_id \gset

-- 2.7. Crear suministro
INSERT INTO supply (supplier_entity_id, maker_product_id)
VALUES (:proveedor_id, :maker_product_id)
RETURNING id AS supply_id \gset

-- 2.8. Crear solicitud
INSERT INTO application (application_number, client_id, origin, receipt_date, is_selected, lifecycle_state)
VALUES (1001, :cliente_id, 'Cliente', CURRENT_DATE, true, 'Activo')
RETURNING id AS application_id \gset

-- 2.9. Relacionar solicitud-producto
INSERT INTO application_product (application_id, product_id)
VALUES (:application_id, :producto_id);

-- =========================================================
-- 3. FUNCIÓN PARA MONITOREAR EL ESTADO
-- =========================================================

CREATE OR REPLACE FUNCTION mostrar_estado_actual(
    p_maker_product_id INTEGER,
    p_evaluation_process_id INTEGER
)
RETURNS TABLE (
    paso VARCHAR,
    estado evaluation_state_manufacturer_enum,
    fecha_inicio DATE,
    duracion_dias INTEGER,
    observacion TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Mostrar estado actual
    RETURN QUERY
    SELECT 
        'ESTADO ACTUAL'::VARCHAR,
        ms.evaluation_state,
        ms.start_date,
        (CURRENT_DATE - ms.start_date)::INTEGER,
        'Estado actual del proceso ' || p_evaluation_process_id::TEXT
    FROM manufacturer_status ms
    WHERE ms.maker_product_id = p_maker_product_id
      AND ms.evaluation_process_id = p_evaluation_process_id
      AND ms.end_date IS NULL;
    
    -- Mostrar historial
    RETURN QUERY
    SELECT 
        'HISTORIAL - ' || ROW_NUMBER() OVER (ORDER BY ms.start_date)::VARCHAR,
        ms.evaluation_state,
        ms.start_date,
        COALESCE((ms.end_date - ms.start_date), (CURRENT_DATE - ms.start_date))::INTEGER,
        'Estado del ' || ms.start_date::TEXT || 
        CASE WHEN ms.end_date IS NOT NULL THEN ' al ' || ms.end_date::TEXT ELSE ' (actual)' END
    FROM manufacturer_status ms
    WHERE ms.maker_product_id = p_maker_product_id
      AND ms.evaluation_process_id = p_evaluation_process_id
    ORDER BY ms.start_date;
END;
$$;

-- =========================================================
-- 4. EJECUTAR FLUJO COMPLETO DE PRUEBA
-- =========================================================

DO $$
DECLARE
    v_evaluation_process_id INTEGER;
    v_maker_product_id INTEGER;
    v_technical_document_id INTEGER;
    v_sample_id INTEGER;
    v_sample_analysis_id INTEGER;
    v_document_evaluation_id INTEGER;
    v_sample_evaluation_id INTEGER;
    v_industrial_purchase_id INTEGER;
    v_industrial_evaluation_id INTEGER;
    
    -- Variables para resultados
    v_estado_inicial evaluation_state_manufacturer_enum;
    v_estado_despues_oferta evaluation_state_manufacturer_enum;
    v_estado_despues_documentos evaluation_state_manufacturer_enum;
    v_estado_despues_muestras evaluation_state_manufacturer_enum;
    v_estado_despues_decision evaluation_state_manufacturer_enum;
    v_estado_despues_compra evaluation_state_manufacturer_enum;
    v_estado_despues_evaluacion evaluation_state_manufacturer_enum;
    v_estado_final evaluation_state_manufacturer_enum;
BEGIN
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'INICIANDO FLUJO DE PRUEBA COMPLETO';
    RAISE NOTICE '=========================================';
    
    -- =====================================================
    -- PASO 1: CREAR PROCESO DE EVALUACIÓN
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '1. CREANDO PROCESO DE EVALUACIÓN...';
    
    INSERT INTO evaluation_process (application_id, supply_id)
    VALUES (:application_id, :supply_id)
    RETURNING id INTO v_evaluation_process_id;
    
    -- Obtener maker_product_id
    SELECT mp.id INTO v_maker_product_id
    FROM supply s
    JOIN maker_product mp ON mp.id = s.maker_product_id
    WHERE s.id = :supply_id;
    
    -- Verificar estado inicial
    SELECT evaluation_state INTO v_estado_inicial
    FROM manufacturer_status
    WHERE maker_product_id = v_maker_product_id
      AND evaluation_process_id = v_evaluation_process_id
      AND end_date IS NULL;
    
    RAISE NOTICE '   ✅ Proceso creado: ID %', v_evaluation_process_id;
    RAISE NOTICE '   ✅ Estado inicial: %', v_estado_inicial;
    RAISE NOTICE '   ✅ Maker Product ID: %', v_maker_product_id;
    
    -- Mostrar estado actual
    RAISE NOTICE '';
    RAISE NOTICE '   📊 ESTADO ACTUAL:';
    FOR estado IN SELECT * FROM mostrar_estado_actual(v_maker_product_id, v_evaluation_process_id)
    LOOP
        RAISE NOTICE '      %: % (desde %)', estado.paso, estado.estado, estado.fecha_inicio;
    END LOOP;
    
    -- =====================================================
    -- PASO 2: CREAR OFERTA EXPLORATORIA COMPETITIVA
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '2. CREANDO OFERTA EXPLORATORIA COMPETITIVA...';
    
    -- Primero necesitamos una compra de referencia
    INSERT INTO supplier_purchase (product_id, supplier_id, unit_price, purchase_date)
    VALUES (:producto_id, :proveedor_id, 50.00, CURRENT_DATE - INTERVAL '30 days');
    
    -- Crear oferta exploratoria
    INSERT INTO exploratory_offer (evaluation_process_id, offered_price, reference_purchase_id, price_difference, percentage_difference, is_competitive)
    VALUES (v_evaluation_process_id, 45.00, 1, -5.00, -10.00, true);
    
    -- Verificar estado
    SELECT evaluation_state INTO v_estado_despues_oferta
    FROM manufacturer_status
    WHERE maker_product_id = v_maker_product_id
      AND evaluation_process_id = v_evaluation_process_id
      AND end_date IS NULL;
    
    RAISE NOTICE '   ✅ Oferta creada: $45.00 (competitiva)';
    RAISE NOTICE '   ✅ Nuevo estado: %', v_estado_despues_oferta;
    
    -- =====================================================
    -- PASO 3: SOLICITAR DOCUMENTOS TÉCNICOS
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '3. SOLICITANDO DOCUMENTOS TÉCNICOS...';
    
    INSERT INTO technical_document (supply_id, document_name, document_type, version, request_date)
    VALUES (:supply_id, 'COA Paracetamol', 'COA', '1.0', CURRENT_DATE)
    RETURNING id INTO v_technical_document_id;
    
    INSERT INTO technical_document (supply_id, document_name, document_type, version, request_date)
    VALUES (:supply_id, 'Ficha Técnica Paracetamol', 'Ficha Técnica', '2.1', CURRENT_DATE);
    
    -- Verificar estado
    SELECT evaluation_state INTO v_estado_despues_documentos
    FROM manufacturer_status
    WHERE maker_product_id = v_maker_product_id
      AND evaluation_process_id = v_evaluation_process_id
      AND end_date IS NULL;
    
    RAISE NOTICE '   ✅ Documentos solicitados: COA y Ficha Técnica';
    RAISE NOTICE '   ✅ Nuevo estado: %', v_estado_despues_documentos;
    
    -- =====================================================
    -- PASO 4: EVALUAR DOCUMENTOS (APROBAR)
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '4. EVALUANDO DOCUMENTOS (APROBANDO)...';
    
    -- Evaluar primer documento
    INSERT INTO document_evaluation (evaluation_process_id, technical_document_id, send_date, evaluation_date, is_approved)
    VALUES (v_evaluation_process_id, v_technical_document_id, CURRENT_DATE, CURRENT_DATE, true)
    RETURNING id INTO v_document_evaluation_id;
    
    -- Evaluar segundo documento
    INSERT INTO document_evaluation (evaluation_process_id, technical_document_id, send_date, evaluation_date, is_approved)
    SELECT v_evaluation_process_id, id, CURRENT_DATE, CURRENT_DATE, true
    FROM technical_document
    WHERE supply_id = :supply_id AND id != v_technical_document_id;
    
    -- Verificar estado
    SELECT evaluation_state INTO v_estado_despues_documentos
    FROM manufacturer_status
    WHERE maker_product_id = v_maker_product_id
      AND evaluation_process_id = v_evaluation_process_id
      AND end_date IS NULL;
    
    RAISE NOTICE '   ✅ Documentos aprobados: 2/2';
    RAISE NOTICE '   ✅ Nuevo estado: %', v_estado_despues_documentos;
    
    -- =====================================================
    -- PASO 5: SOLICITAR MUESTRA
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '5. SOLICITANDO MUESTRA...';
    
    INSERT INTO sample (supply_id, request_date, send_date_supplier, date_receipt_warehouse, date_receipt_client, quantity, unit, sample_code)
    VALUES (:supply_id, CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '7 days', 100.00, 'g', 'MUE-001')
    RETURNING id INTO v_sample_id;
    
    -- Verificar estado
    SELECT evaluation_state INTO v_estado_despues_muestras
    FROM manufacturer_status
    WHERE maker_product_id = v_maker_product_id
      AND evaluation_process_id = v_evaluation_process_id
      AND end_date IS NULL;
    
    RAISE NOTICE '   ✅ Muestra solicitada: 100g (MUE-001)';
    RAISE NOTICE '   ✅ Nuevo estado: %', v_estado_despues_muestras;
    
    -- =====================================================
    -- PASO 6: ANALIZAR MUESTRA
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '6. ANALIZANDO MUESTRA...';
    
    INSERT INTO sample_analysis (sample_id, performed_by_client, analysis_date, analysis_name, analysis_result_details)
    VALUES (v_sample_id, :cliente_id, CURRENT_DATE + INTERVAL '8 days', 'Análisis de pureza', '{"pureza": "99.8%", "impurezas": "<0.1%"}')
    RETURNING id INTO v_sample_analysis_id;
    
    -- =====================================================
    -- PASO 7: EVALUAR MUESTRA (CONFORME Y CONTINUAR)
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '7. EVALUANDO MUESTRA (CONFORME Y CONTINUAR)...';
    
    INSERT INTO sample_evaluation (evaluation_process_id, sample_analysis_id, self_performed, send_analysis_date, evaluation_date, result, decision_continue)
    VALUES (v_evaluation_process_id, v_sample_analysis_id, true, NULL, CURRENT_DATE + INTERVAL '9 days', 'Conforme', true)
    RETURNING id INTO v_sample_evaluation_id;
    
    -- Verificar estado
    SELECT evaluation_state INTO v_estado_despues_decision
    FROM manufacturer_status
    WHERE maker_product_id = v_maker_product_id
      AND evaluation_process_id = v_evaluation_process_id
      AND end_date IS NULL;
    
    RAISE NOTICE '   ✅ Muestra evaluada: Conforme';
    RAISE NOTICE '   ✅ Decisión: Continuar a escala industrial';
    RAISE NOTICE '   ✅ Nuevo estado: %', v_estado_despues_decision;
    
    -- =====================================================
    -- PASO 8: SOLICITAR COMPRA INDUSTRIAL
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '8. SOLICITANDO COMPRA INDUSTRIAL...';
    
    INSERT INTO industrial_purchase (evaluation_process_id, request_date, purchase_status)
    VALUES (v_evaluation_process_id, CURRENT_DATE + INTERVAL '10 days', 'Pendiente de Embarque')
    RETURNING id INTO v_industrial_purchase_id;
    
    -- Verificar estado
    SELECT evaluation_state INTO v_estado_despues_compra
    FROM manufacturer_status
    WHERE maker_product_id = v_maker_product_id
      AND evaluation_process_id = v_evaluation_process_id
      AND end_date IS NULL;
    
    RAISE NOTICE '   ✅ Compra industrial solicitada';
    RAISE NOTICE '   ✅ Estado compra: Pendiente de Embarque';
    RAISE NOTICE '   ✅ Nuevo estado fabricante: %', v_estado_despues_compra;
    
    -- =====================================================
    -- PASO 9: COMPLETAR COMPRA INDUSTRIAL
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '9. COMPLETANDO COMPRA INDUSTRIAL...';
    
    UPDATE industrial_purchase
    SET purchase_status = 'Concluida'
    WHERE id = v_industrial_purchase_id;
    
    -- Verificar estado
    SELECT evaluation_state INTO v_estado_despues_compra
    FROM manufacturer_status
    WHERE maker_product_id = v_maker_product_id
      AND evaluation_process_id = v_evaluation_process_id
      AND end_date IS NULL;
    
    RAISE NOTICE '   ✅ Compra industrial completada';
    RAISE NOTICE '   ✅ Nuevo estado: %', v_estado_despues_compra;
    
    -- =====================================================
    -- PASO 10: EVALUACIÓN INDUSTRIAL
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '10. REALIZANDO EVALUACIÓN INDUSTRIAL...';
    
    INSERT INTO industrial_evaluation (industrial_purchase_id, send_batch_date, reception_batch_date, analysis_result)
    VALUES (v_industrial_purchase_id, CURRENT_DATE + INTERVAL '15 days', CURRENT_DATE + INTERVAL '20 days', 'Buen Desempeño')
    RETURNING id INTO v_industrial_evaluation_id;
    
    -- Verificar estado
    SELECT evaluation_state INTO v_estado_despues_evaluacion
    FROM manufacturer_status
    WHERE maker_product_id = v_maker_product_id
      AND evaluation_process_id = v_evaluation_process_id
      AND end_date IS NULL;
    
    RAISE NOTICE '   ✅ Evaluación industrial realizada';
    RAISE NOTICE '   ✅ Resultado: Buen Desempeño';
    RAISE NOTICE '   ✅ Nuevo estado: %', v_estado_despues_evaluacion;
    
    -- =====================================================
    -- PASO 11: ENTREGAR INFORME FINAL
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '11. ENTREGANDO INFORME FINAL...';
    
    UPDATE industrial_evaluation
    SET report_delivery_date = CURRENT_DATE + INTERVAL '25 days'
    WHERE id = v_industrial_evaluation_id;
    
    -- Verificar estado final
    SELECT evaluation_state INTO v_estado_final
    FROM manufacturer_status
    WHERE maker_product_id = v_maker_product_id
      AND evaluation_process_id = v_evaluation_process_id
      AND end_date IS NULL;
    
    RAISE NOTICE '   ✅ Informe entregado';
    RAISE NOTICE '   ✅ ESTADO FINAL: %', v_estado_final;
    
    -- =====================================================
    -- RESUMEN DEL FLUJO
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'RESUMEN DEL FLUJO DE PRUEBA';
    RAISE NOTICE '=========================================';
    RAISE NOTICE '1. Estado inicial: %', v_estado_inicial;
    RAISE NOTICE '2. Después oferta: %', v_estado_despues_oferta;
    RAISE NOTICE '3. Después documentos: %', v_estado_despues_documentos;
    RAISE NOTICE '4. Después muestra: %', v_estado_despues_muestras;
    RAISE NOTICE '5. Después decisión: %', v_estado_despues_decision;
    RAISE NOTICE '6. Después compra: %', v_estado_despues_compra;
    RAISE NOTICE '7. Después evaluación: %', v_estado_despues_evaluacion;
    RAISE NOTICE '8. Estado final: %', v_estado_final;
    RAISE NOTICE '';
    
    -- =====================================================
    -- MOSTRAR HISTORIAL COMPLETO
    -- =====================================================
    RAISE NOTICE '📊 HISTORIAL COMPLETO DEL FABRICANTE:';
    RAISE NOTICE '-----------------------------------------';
    
    FOR hist IN 
        SELECT 
            '   ' || ROW_NUMBER() OVER (ORDER BY ms.start_date) || '. ' ||
            ms.evaluation_state || 
            ' (desde ' || ms.start_date || 
            CASE 
                WHEN ms.end_date IS NOT NULL THEN ' hasta ' || ms.end_date || 
                     ' - ' || (ms.end_date - ms.start_date) || ' días'
                ELSE ' - aún activo)'
            END as historial
        FROM manufacturer_status ms
        WHERE ms.maker_product_id = v_maker_product_id
          AND ms.evaluation_process_id = v_evaluation_process_id
        ORDER BY ms.start_date
    LOOP
        RAISE NOTICE '%', hist.historial;
    END LOOP;
    
    -- =====================================================
    -- VERIFICAR ESTADO GLOBAL
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '🌍 ESTADO GLOBAL DEL FABRICANTE:';
    
    DECLARE
        v_estado_global evaluation_state_manufacturer_enum;
    BEGIN
        v_estado_global := determine_global_manufacturer_status(v_maker_product_id);
        RAISE NOTICE '   Estado global: %', v_estado_global;
        
        -- Verificar si existe estado global en la tabla
        SELECT evaluation_state INTO v_estado_global
        FROM manufacturer_status
        WHERE maker_product_id = v_maker_product_id
          AND evaluation_process_id IS NULL
          AND end_date IS NULL;
        
        IF FOUND THEN
            RAISE NOTICE '   Estado global en BD: %', v_estado_global;
        ELSE
            RAISE NOTICE '   ⚠️ No hay estado global registrado en BD';
        END IF;
    END;
    
    RAISE NOTICE '';
    RAISE NOTICE '=========================================';
    RAISE NOTICE '✅ FLUJO DE PRUEBA COMPLETADO EXITOSAMENTE';
    RAISE NOTICE '=========================================';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION '❌ Error en el flujo de prueba: %', SQLERRM;
END $$;

-- =========================================================
-- 5. CONSULTAS ADICIONALES PARA VERIFICACIÓN
-- =========================================================

-- 5.1. Ver todos los estados del fabricante
SELECT '=== TODOS LOS ESTADOS DEL FABRICANTE ===' as consulta;
SELECT * FROM vw_manufacturer_status_history 
WHERE maker_product_id = :maker_product_id
ORDER BY fecha_inicio;

-- 5.2. Ver estado actual
SELECT '=== ESTADO ACTUAL ===' as consulta;
SELECT * FROM vw_current_manufacturer_status 
WHERE maker_product_id = :maker_product_id;

-- 5.3. Ver resumen
SELECT '=== RESUMEN ===' as consulta;
SELECT * FROM vw_manufacturer_status_summary 
WHERE maker_product_id = :maker_product_id;

-- 5.4. Verificar consistencia
SELECT '=== VERIFICACIÓN DE CONSISTENCIA ===' as consulta;
SELECT * FROM verify_manufacturer_status_consistency();

-- 5.5. Usar función de reporte
SELECT '=== REPORTE COMPLETO ===' as consulta;
SELECT * FROM get_manufacturer_status_report(
    p_fabricante_id => :fabricante_id,
    p_estado => NULL,
    p_tipo_estado => 'TODOS'
);

-- =========================================================
-- 6. PRUEBAS ADICIONALES (ESCENARIOS DE ERROR)
-- =========================================================

DO $$
DECLARE
    v_nuevo_proceso_id INTEGER;
    v_nuevo_maker_product_id INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'PRUEBAS ADICIONALES - ESCENARIOS DE ERROR';
    RAISE NOTICE '=========================================';
    
    -- =====================================================
    -- ESCENARIO 1: OFERTA NO COMPETITIVA
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '1. Probando oferta NO competitiva...';
    
    -- Crear nuevo proceso
    INSERT INTO evaluation_process (application_id, supply_id)
    VALUES (:application_id, :supply_id)
    RETURNING id INTO v_nuevo_proceso_id;
    
    -- Oferta NO competitiva
    INSERT INTO exploratory_offer (evaluation_process_id, offered_price, reference_purchase_id, price_difference, percentage_difference, is_competitive)
    VALUES (v_nuevo_proceso_id, 60.00, 1, 10.00, 20.00, false);
    
    -- Verificar estado
    SELECT evaluation_state INTO v_estado_final
    FROM manufacturer_status
    WHERE evaluation_process_id = v_nuevo_proceso_id
      AND end_date IS NULL;
    
    RAISE NOTICE '   ✅ Estado con oferta no competitiva: %', v_estado_final;
    
    -- =====================================================
    -- ESCENARIO 2: DOCUMENTOS RECHAZADOS
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '2. Probando documentos rechazados...';
    
    -- Crear otro proceso
    INSERT INTO evaluation_process (application_id, supply_id)
    VALUES (:application_id, :supply_id)
    RETURNING id INTO v_nuevo_proceso_id;
    
    -- Oferta competitiva
    INSERT INTO exploratory_offer (evaluation_process_id, offered_price, reference_purchase_id, price_difference, percentage_difference, is_competitive)
    VALUES (v_nuevo_proceso_id, 44.00, 1, -6.00, -12.00, true);
    
    -- Solicitar documento
    INSERT INTO technical_document (supply_id, document_name, document_type, version, request_date)
    VALUES (:supply_id, 'Documento Rechazado', 'COA', '1.0', CURRENT_DATE)
    RETURNING id INTO v_technical_document_id;
    
    -- Rechazar documento
    INSERT INTO document_evaluation (evaluation_process_id, technical_document_id, send_date, evaluation_date, is_approved)
    VALUES (v_nuevo_proceso_id, v_technical_document_id, CURRENT_DATE, CURRENT_DATE, false);
    
    -- Verificar estado
    SELECT evaluation_state INTO v_estado_final
    FROM manufacturer_status
    WHERE evaluation_process_id = v_nuevo_proceso_id
      AND end_date IS NULL;
    
    RAISE NOTICE '   ✅ Estado con documentos rechazados: %', v_estado_final;
    
    -- =====================================================
    -- ESCENARIO 3: MUESTRA NO CONFORME
    -- =====================================================
    RAISE NOTICE '';
    RAISE NOTICE '3. Probando muestra NO conforme...';
    
    -- Crear otro proceso
    INSERT INTO evaluation_process (application_id, supply_id)
    VALUES (:application_id, :supply_id)
    RETURNING id INTO v_nuevo_proceso_id;
    
    -- Oferta competitiva
    INSERT INTO exploratory_offer (evaluation_process_id, offered_price, reference_purchase_id, price_difference, percentage_difference, is_competitive)
    VALUES (v_nuevo_proceso_id, 43.00, 1, -7.00, -14.00, true);
    
    -- Documentos aprobados
    INSERT INTO technical_document (supply_id, document_name, document_type, version, request_date)
    VALUES (:supply_id, 'Documento Aprobado', 'COA', '1.0', CURRENT_DATE)
    RETURNING id INTO v_technical_document_id;
    
    INSERT INTO document_evaluation (evaluation_process_id, technical_document_id, send_date, evaluation_date, is_approved)
    VALUES (v_nuevo_proceso_id, v_technical_document_id, CURRENT_DATE, CURRENT_DATE, true);
    
    -- Solicitar muestra
    INSERT INTO sample (supply_id, request_date, quantity, unit, sample_code)
    VALUES (:supply_id, CURRENT_DATE, 50.00, 'g', 'MUE-002')
    RETURNING id INTO v_sample_id;
    
    -- Analizar muestra
    INSERT INTO sample_analysis (sample_id, performed_by_client, analysis_date, analysis_name, analysis_result_details)
    VALUES (v_sample_id, :cliente_id, CURRENT_DATE, 'Análisis', '{"resultado": "no conforme"}')
    RETURNING id INTO v_sample_analysis_id;
    
    -- Evaluar muestra como NO conforme
    INSERT INTO sample_evaluation (evaluation_process_id, sample_analysis_id, self_performed, evaluation_date, result, decision_continue)
    VALUES (v_nuevo_proceso_id, v_sample_analysis_id, true, CURRENT_DATE, 'No Conforme', false);
    
    -- Verificar estado
    SELECT evaluation_state INTO v_estado_final
    FROM manufacturer_status
    WHERE evaluation_process_id = v_nuevo_proceso_id
      AND end_date IS NULL;
    
    RAISE NOTICE '   ✅ Estado con muestra no conforme: %', v_estado_final;
    
    RAISE NOTICE '';
    RAISE NOTICE '=========================================';
    RAISE NOTICE '✅ PRUEBAS ADICIONALES COMPLETADAS';
    RAISE NOTICE '=========================================';
    
END $$;