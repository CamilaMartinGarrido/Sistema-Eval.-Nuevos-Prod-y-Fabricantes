export enum OriginRequestEnum {
  BCF = 'BCF',
  CLIENTE = 'Cliente',
  PROVEEDOR = 'Proveedor',
  NM = 'NM',
  NP = 'NP',
  EXTRAPLAN = 'Extraplan',
}

export enum ProductTypeEnum {
  MP = 'MP',
  ME = 'ME',
  R = 'R',
  D = 'D',
}

export enum ResultSampleAnalysisEnum {
  CONFORME = 'Conforme',
  NO_CONFORME = 'No conforme',
}

export enum DocumentTypeEnum {
  COA = 'COA',
  FICHA_TECNICA = 'Ficha Tecnica',
  PERMISO_SANITARIO = 'Permiso Sanitario',
  OTRO = 'Otro',
}

export enum StateIndustrialPurchasingEnum {
  CONCLUIDA = 'Concluida',
  PARCIALMENTE_CONCLUIDA = 'Parcialmente concluida',
  PENDIENTE_DE_EMBARQUE = 'Pendiente de embarque',
}

export enum ResultIndustrialAnalysisEnum {
  BUEN_DESEMPE_O = 'Buen desempeño',
  DEFECTUOSO = 'Defectuoso',
  NO_INFORMADO = 'No informado',
}

export enum FinalStateManufacturerEnum {
  A = 'A',
  NA = 'NA',
  PD = 'PD',
  PM = 'PM',
  PI = 'PI',
  CONTRATO_A_RIESGO = 'Contrato a Riesgo',
}

export enum UserRoleEnum {
  ADMINISTRADOR = 'Administrador',
  OBSERVADOR = 'Observador',
}
