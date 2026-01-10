-- ========================================================
-- BLOQUE A: TABLA DE AUDITORÍA GENERAL
-- ========================================================

CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,

  table_name VARCHAR(100) NOT NULL,
  record_id INTEGER,

  action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE','SELECT')),

  performed_by INTEGER,
  performed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),

  old_data JSONB,
  new_data JSONB,
  changed_fields JSONB,

  query_filter TEXT,

  CONSTRAINT fk_audit_user
    FOREIGN KEY (performed_by)
    REFERENCES user_account(id)
    ON DELETE SET NULL
);

COMMENT ON TABLE audit_log IS 'Registro de trazabilidad completa del sistema.';

-- Índices para mejor rendimiento
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_performed_at ON audit_log(performed_at DESC);
CREATE INDEX idx_audit_log_performed_by ON audit_log(performed_by);
CREATE INDEX idx_audit_log_action ON audit_log(action);

-- ========================================================
-- BLOQUE B: FUNCIÓN GENÉRICA DE AUDITORÍA MEJORADA
-- ========================================================

CREATE OR REPLACE FUNCTION audit_trigger_fn()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id INTEGER;
  v_changed JSONB := '{}'::jsonb;
  v_old_json JSONB;
  v_new_json JSONB;
BEGIN
  -- Obtener el ID del usuario desde la configuración de sesión
  BEGIN
    v_user_id := current_setting('app.current_user_id', true)::INTEGER;
  EXCEPTION WHEN OTHERS THEN
    v_user_id := NULL; -- Si no está configurado, usar NULL
  END;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (
      table_name, record_id, action,
      performed_by, new_data
    )
    VALUES (
      TG_TABLE_NAME, NEW.id, 'INSERT',
      v_user_id, row_to_json(NEW)::jsonb
    );
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (
      table_name, record_id, action,
      performed_by, old_data
    )
    VALUES (
      TG_TABLE_NAME, OLD.id, 'DELETE',
      v_user_id, row_to_json(OLD)::jsonb
    );
    RETURN OLD;

  ELSIF TG_OP = 'UPDATE' THEN
    -- Convertir registros a JSONB
    v_old_json := row_to_json(OLD)::jsonb;
    v_new_json := row_to_json(NEW)::jsonb;
    
    -- Calcular campos cambiados
    SELECT jsonb_object_agg(key, jsonb_build_object(
      'old', v_old_json -> key,
      'new', v_new_json -> key
    ))
    INTO v_changed
    FROM jsonb_object_keys(v_new_json) AS key
    WHERE v_old_json -> key IS DISTINCT FROM v_new_json -> key;

    INSERT INTO audit_log (
      table_name, record_id, action,
      performed_by, old_data, new_data, changed_fields
    )
    VALUES (
      TG_TABLE_NAME, NEW.id, 'UPDATE',
      v_user_id, v_old_json, v_new_json, v_changed
    );
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================================
-- BLOQUE C: ACTIVAR TRAZABILIDAD EN LAS TABLAS PRINCIPALES
-- ========================================================

-- Tablas principales del sistema (siguiendo tu estructura actual)
DO $$ 
BEGIN
  -- application
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'application') THEN
    DROP TRIGGER IF EXISTS trg_audit_application ON application;
    CREATE TRIGGER trg_audit_application
    AFTER INSERT OR UPDATE OR DELETE
    ON application
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- client
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client') THEN
    DROP TRIGGER IF EXISTS trg_audit_client ON client;
    CREATE TRIGGER trg_audit_client
    AFTER INSERT OR UPDATE OR DELETE
    ON client
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- commercial_entity
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'commercial_entity') THEN
    DROP TRIGGER IF EXISTS trg_audit_commercial_entity ON commercial_entity;
    CREATE TRIGGER trg_audit_commercial_entity
    AFTER INSERT OR UPDATE OR DELETE
    ON commercial_entity
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- commercial_entity_role (NUEVA)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'commercial_entity_role') THEN
    DROP TRIGGER IF EXISTS trg_audit_commercial_entity_role ON commercial_entity_role;
    CREATE TRIGGER trg_audit_commercial_entity_role
    AFTER INSERT OR UPDATE OR DELETE
    ON commercial_entity_role
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- product
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product') THEN
    DROP TRIGGER IF EXISTS trg_audit_product ON product;
    CREATE TRIGGER trg_audit_product
    AFTER INSERT OR UPDATE OR DELETE
    ON product
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- maker_product
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'maker_product') THEN
    DROP TRIGGER IF EXISTS trg_audit_maker_product ON maker_product;
    CREATE TRIGGER trg_audit_maker_product
    AFTER INSERT OR UPDATE OR DELETE
    ON maker_product
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- supply
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'supply') THEN
    DROP TRIGGER IF EXISTS trg_audit_supply ON supply;
    CREATE TRIGGER trg_audit_supply
    AFTER INSERT OR UPDATE OR DELETE
    ON supply
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- application_product (NUEVA)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'application_product') THEN
    DROP TRIGGER IF EXISTS trg_audit_application_product ON application_product;
    CREATE TRIGGER trg_audit_application_product
    AFTER INSERT OR UPDATE OR DELETE
    ON application_product
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- evaluation_process (NUEVA)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'evaluation_process') THEN
    DROP TRIGGER IF EXISTS trg_audit_evaluation_process ON evaluation_process;
    CREATE TRIGGER trg_audit_evaluation_process
    AFTER INSERT OR UPDATE OR DELETE
    ON evaluation_process
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- supplier_purchase (NUEVA)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'supplier_purchase') THEN
    DROP TRIGGER IF EXISTS trg_audit_supplier_purchase ON supplier_purchase;
    CREATE TRIGGER trg_audit_supplier_purchase
    AFTER INSERT OR UPDATE OR DELETE
    ON supplier_purchase
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- exploratory_offer
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'exploratory_offer') THEN
    DROP TRIGGER IF EXISTS trg_audit_exploratory_offer ON exploratory_offer;
    CREATE TRIGGER trg_audit_exploratory_offer
    AFTER INSERT OR UPDATE OR DELETE
    ON exploratory_offer
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- technical_document
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'technical_document') THEN
    DROP TRIGGER IF EXISTS trg_audit_technical_document ON technical_document;
    CREATE TRIGGER trg_audit_technical_document
    AFTER INSERT OR UPDATE OR DELETE
    ON technical_document
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- document_evaluation
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'document_evaluation') THEN
    DROP TRIGGER IF EXISTS trg_audit_document_evaluation ON document_evaluation;
    CREATE TRIGGER trg_audit_document_evaluation
    AFTER INSERT OR UPDATE OR DELETE
    ON document_evaluation
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- sample
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sample') THEN
    DROP TRIGGER IF EXISTS trg_audit_sample ON sample;
    CREATE TRIGGER trg_audit_sample
    AFTER INSERT OR UPDATE OR DELETE
    ON sample
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- sample_analysis
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sample_analysis') THEN
    DROP TRIGGER IF EXISTS trg_audit_sample_analysis ON sample_analysis;
    CREATE TRIGGER trg_audit_sample_analysis
    AFTER INSERT OR UPDATE OR DELETE
    ON sample_analysis
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- sample_evaluation
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sample_evaluation') THEN
    DROP TRIGGER IF EXISTS trg_audit_sample_evaluation ON sample_evaluation;
    CREATE TRIGGER trg_audit_sample_evaluation
    AFTER INSERT OR UPDATE OR DELETE
    ON sample_evaluation
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- industrial_purchase
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'industrial_purchase') THEN
    DROP TRIGGER IF EXISTS trg_audit_industrial_purchase ON industrial_purchase;
    CREATE TRIGGER trg_audit_industrial_purchase
    AFTER INSERT OR UPDATE OR DELETE
    ON industrial_purchase
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- industrial_evaluation
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'industrial_evaluation') THEN
    DROP TRIGGER IF EXISTS trg_audit_industrial_evaluation ON industrial_evaluation;
    CREATE TRIGGER trg_audit_industrial_evaluation
    AFTER INSERT OR UPDATE OR DELETE
    ON industrial_evaluation
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- manufacturer_status
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'manufacturer_status') THEN
    DROP TRIGGER IF EXISTS trg_audit_manufacturer_status ON manufacturer_status;
    CREATE TRIGGER trg_audit_manufacturer_status
    AFTER INSERT OR UPDATE OR DELETE
    ON manufacturer_status
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- observation
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'observation') THEN
    DROP TRIGGER IF EXISTS trg_audit_observation ON observation;
    CREATE TRIGGER trg_audit_observation
    AFTER INSERT OR UPDATE OR DELETE
    ON observation
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- user_account (NUEVA)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_account') THEN
    DROP TRIGGER IF EXISTS trg_audit_user_account ON user_account;
    CREATE TRIGGER trg_audit_user_account
    AFTER INSERT OR UPDATE OR DELETE
    ON user_account
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- Tablas de observaciones (opcional, si las quieres auditar)
  
  -- request_observation
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'request_observation') THEN
    DROP TRIGGER IF EXISTS trg_audit_request_observation ON request_observation;
    CREATE TRIGGER trg_audit_request_observation
    AFTER INSERT OR UPDATE OR DELETE
    ON request_observation
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

  -- exploratory_offer_observation
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'exploratory_offer_observation') THEN
    DROP TRIGGER IF EXISTS trg_audit_exploratory_offer_observation ON exploratory_offer_observation;
    CREATE TRIGGER trg_audit_exploratory_offer_observation
    AFTER INSERT OR UPDATE OR DELETE
    ON exploratory_offer_observation
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger_fn();
  END IF;

END $$;

-- ========================================================
-- BLOQUE D: FUNCIONES DE APOYO PARA LA AUDITORÍA
-- ========================================================

-- Función para establecer el usuario actual en la sesión
CREATE OR REPLACE FUNCTION set_current_user(user_id INTEGER)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_user_id', user_id::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener registros de auditoría por tabla
CREATE OR REPLACE FUNCTION get_audit_by_table(
  p_table_name VARCHAR(100),
  p_start_date TIMESTAMP DEFAULT NULL,
  p_end_date TIMESTAMP DEFAULT NULL
)
RETURNS SETOF audit_log AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM audit_log
  WHERE table_name = p_table_name
    AND (p_start_date IS NULL OR performed_at >= p_start_date)
    AND (p_end_date IS NULL OR performed_at <= p_end_date)
  ORDER BY performed_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener cambios de un registro específico
CREATE OR REPLACE FUNCTION get_record_audit_trail(
  p_table_name VARCHAR(100),
  p_record_id INTEGER
)
RETURNS SETOF audit_log AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM audit_log
  WHERE table_name = p_table_name
    AND record_id = p_record_id
  ORDER BY performed_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Vista para auditoría resumida
CREATE OR REPLACE VIEW audit_summary AS
SELECT 
  al.id,
  al.table_name,
  al.record_id,
  al.action,
  ua.username as performed_by_username,
  ua.full_name as performed_by_name,
  al.performed_at,
  CASE 
    WHEN al.action = 'INSERT' THEN 'Nuevo registro'
    WHEN al.action = 'UPDATE' THEN 
      (SELECT COUNT(*) FROM jsonb_object_keys(al.changed_fields)) || ' campos modificados'
    WHEN al.action = 'DELETE' THEN 'Registro eliminado'
  END as change_summary,
  al.changed_fields
FROM audit_log al
LEFT JOIN user_account ua ON ua.id = al.performed_by;

-- ========================================================
-- BLOQUE E: POLÍTICAS DE RETENCIÓN Y MANTENIMIENTO
-- ========================================================

-- Función para limpiar registros antiguos de auditoría (ejecutar periódicamente)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(
  p_retention_days INTEGER DEFAULT 365
)
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM audit_log
  WHERE performed_at < CURRENT_DATE - p_retention_days;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Crear índice para la limpieza periódica
CREATE INDEX idx_audit_log_retention ON audit_log(performed_at)
WHERE performed_at < CURRENT_DATE - 365;

COMMENT ON FUNCTION cleanup_old_audit_logs IS 
  'Elimina registros de auditoría más antiguos que los días especificados. Ejecutar periódicamente.';