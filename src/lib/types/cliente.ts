export interface Cliente {
  codcli: string;           // Código cliente
  nomcli: string;           // Nombre completo
  codcli_s: string;         // Código cliente secundario (nombre del cliente padre)
  plndes: string;           // Descripción del plan
  dircli: string;           // Dirección
  doccli: string;           // DNI
  telcli: string;           // Teléfono
  ruccli: string;           // RUC
  mailcli: string;          // Email
  plnnum: string;           // Número de plan
  estcli: string;           // Estado cliente
  codprom: string;          // Código promoción
  ctcfar: string;           // Cuenta farmacia
}