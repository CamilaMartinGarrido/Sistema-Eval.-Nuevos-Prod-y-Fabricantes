// Origen de la solicitud
export enum OriginRequestEnum {
  BIOCUBAFARMA = 'BioCubaFarma (BCF)',
  CLIENTE = 'Cliente',
  PROVEEDOR = 'Proveedor',
  NM = 'NM',
  NO_PROCEDE = 'No Procede (NP)',
  EXTRAPLAN = 'Extraplan',
  CLIENTE_EXTRAPLAN = 'Cliente (Extraplan)',
  PROVEEDOR_EXTRAPLAN = 'Proveedor (Extraplan)',
}

// Tipo de producto
export enum ProductTypeEnum {
  MP_IFA = 'Materia Prima (Ingrediente Farmacéutico Activo)',
  MP_EF = 'Materia Prima (Excipiente Farmacéutico)',
  MP_C = 'Materia Prima (Cápsula)',
  ME = 'Material de Envase',
  R = 'Reactivo',
  D = 'Dispositivo',
}

// Rol de Entidad Comercial
export enum EntityRoleEnum {
  F = 'Fabricante',
  P = 'Proveedor',
}

// Tipos de documento técnico
export enum DocumentTypeEnum {
  COA = 'COA',
  FICHA_TECNICA = 'Ficha Técnica',
  PERMISO_SANITARIO = 'Permiso Sanitario',
  OTRO = 'Otro',
}

// Resultado de la evaluación de muestra
export enum ResultSampleEvaluationEnum {
  CONFORME = 'Conforme',
  NO_CONFORME = 'No Conforme',
}

// Estado compra industrial
export enum StateIndustrialPurchasingEnum {
  CONCLUIDA = 'Concluida',
  PARCIALMENTE_CONCLUIDA = 'Parcialmente Concluida',
  PENDIENTE_DE_EMBARQUE = 'Pendiente de Embarque',
}

// Resultado evaluación industrial
export enum ResultIndustrialAnalysisEnum {
  BUEN_DESEMPEÑO = 'Buen Desempeño',
  DEFECTUOSO = 'Defectuoso',
  NO_INFORMADO = 'No Informado',
}

// Estado final fabricante
export enum FinalStateManufacturerEnum {
  APROBADO = 'Aprobado',
  NO_APROBADO = 'No Aprobado',
  PENDIENTE_DOCUMENTACION = 'Pendiente de Documentación',
  PENDIENTE_MUESTRA = 'Pendiente de Muestra',
  PENDIENTE_INFORME = 'Pendiente de Informe',
  CONTRATO_A_RIESGO = 'Contrato a Riesgo (COA o muestras)',
}

// Rol de usuario
export enum UserRoleEnum {
  ADMINISTRADOR = 'Administrador',
  OBSERVADOR = 'Observador',
  ADMINISTRADOR_BD = 'Administrador de Base de Datos',
}
