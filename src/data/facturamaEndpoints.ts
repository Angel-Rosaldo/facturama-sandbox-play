export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  parameters?: { name: string; type: string; required: boolean; description?: string }[];
  body?: string;
}

export interface ApiCategory {
  name: string;
  description: string;
  endpoints: { title: string; description: string; endpoint: ApiEndpoint }[];
}

export const facturamaApiCategories: ApiCategory[] = [
  {
    name: "Facturas (CFDI)",
    description: "Creación, consulta, cancelación y envío de facturas electrónicas",
    endpoints: [
      {
        title: "Crear Factura",
        description: "Crear una nueva factura electrónica (CFDI)",
        endpoint: {
          method: "POST",
          path: "/api/3/cfdis",
          description: "Crea una nueva factura electrónica",
          body: JSON.stringify({
            "Currency": "MXN",
            "ExpeditionPlace": "78000",
            "PaymentConditions": "CONTADO",
            "CfdiType": "I",
            "PaymentForm": "03",
            "PaymentMethod": "PUE",
            "Receiver": {
              "Rfc": "XAXX010101000",
              "Name": "Cliente de Prueba",
              "CfdiUse": "S01",
              "FiscalRegime": "616",
              "TaxZipCode": "78000"
            },
            "Items": [
              {
                "ProductCode": "01010101",
                "IdentificationNumber": "001",
                "Description": "Producto de prueba",
                "Unit": "H87",
                "UnitCode": "H87",
                "UnitPrice": 100,
                "Quantity": 1,
                "Subtotal": 100,
                "TaxObject": "02",
                "Taxes": [
                  {
                    "Total": 16,
                    "Name": "IVA",
                    "Base": 100,
                    "Rate": 0.16,
                    "IsRetention": false
                  }
                ],
                "Total": 116
              }
            ]
          }, null, 2)
        }
      },
      {
        title: "Consultar Facturas",
        description: "Obtener lista de facturas con filtros",
        endpoint: {
          method: "GET",
          path: "/api/cfdi",
          description: "Obtiene las últimas 2000 facturas",
          parameters: [
            { name: "type", type: "string", required: false, description: "Tipo de CFDI (issued, received)" },
            { name: "keyword", type: "string", required: false, description: "Palabra clave para buscar" },
            { name: "status", type: "string", required: false, description: "Estado de la factura" },
            { name: "invoiceType", type: "string", required: false, description: "Tipo de factura" },
            { name: "page", type: "number", required: false, description: "Número de página" }
          ]
        }
      },
      {
        title: "Obtener Factura por ID",
        description: "Consultar detalles de una factura específica",
        endpoint: {
          method: "GET",
          path: "/api/Cfdi/{id}/{type}",
          description: "Obtiene el detalle de una factura por ID",
          parameters: [
            { name: "id", type: "string", required: true, description: "ID de la factura" },
            { name: "type", type: "string", required: true, description: "Tipo (issued, received)" }
          ]
        }
      },
      {
        title: "Descargar Factura",
        description: "Descargar factura en formato PDF o XML",
        endpoint: {
          method: "GET",
          path: "/api/Cfdi/{format}/{type}/{id}",
          description: "Descarga la factura en el formato especificado",
          parameters: [
            { name: "format", type: "string", required: true, description: "Formato (pdf, xml)" },
            { name: "type", type: "string", required: true, description: "Tipo (issued, received)" },
            { name: "id", type: "string", required: true, description: "ID de la factura" }
          ]
        }
      },
      {
        title: "Cancelar Factura",
        description: "Cancelar una factura electrónica",
        endpoint: {
          method: "DELETE",
          path: "/api/cfdi/{id}/{type}",
          description: "Cancela una factura",
          parameters: [
            { name: "id", type: "string", required: true, description: "ID de la factura" },
            { name: "type", type: "string", required: true, description: "Tipo (issued, received)" },
            { name: "motive", type: "string", required: false, description: "Motivo de cancelación" },
            { name: "uuidReplacement", type: "string", required: false, description: "UUID de reemplazo" }
          ]
        }
      },
      {
        title: "Enviar Factura por Email",
        description: "Enviar factura por correo electrónico",
        endpoint: {
          method: "POST",
          path: "/api/cfdi/{cfdiType}/{cfdiId}/email",
          description: "Envía la factura por email",
          parameters: [
            { name: "cfdiType", type: "string", required: true, description: "Tipo de CFDI" },
            { name: "cfdiId", type: "string", required: true, description: "ID del CFDI" },
            { name: "email", type: "string", required: true, description: "Email del destinatario" },
            { name: "subject", type: "string", required: false, description: "Asunto del email" },
            { name: "comments", type: "string", required: false, description: "Comentarios" }
          ]
        }
      }
    ]
  },
  {
    name: "Clientes",
    description: "Gestión de clientes y receptores de facturas",
    endpoints: [
      {
        title: "Lista de Clientes",
        description: "Obtener lista paginada de clientes",
        endpoint: {
          method: "GET",
          path: "/api/Clients",
          description: "Obtiene la lista de clientes",
          parameters: [
            { name: "start", type: "number", required: false, description: "Inicio de la paginación" },
            { name: "length", type: "number", required: false, description: "Cantidad de registros" },
            { name: "search", type: "string", required: false, description: "Término de búsqueda" },
            { name: "orderBy", type: "string", required: false, description: "Campo para ordenar" },
            { name: "orderAsc", type: "boolean", required: false, description: "Orden ascendente" }
          ]
        }
      },
      {
        title: "Buscar Clientes",
        description: "Buscar clientes por palabra clave",
        endpoint: {
          method: "GET",
          path: "/api/Client",
          description: "Busca clientes por palabra clave",
          parameters: [
            { name: "keyword", type: "string", required: true, description: "Palabra clave para buscar" }
          ]
        }
      },
      {
        title: "Obtener Cliente por ID",
        description: "Consultar datos de un cliente específico",
        endpoint: {
          method: "GET",
          path: "/api/Client/{id}",
          description: "Obtiene un cliente por ID",
          parameters: [
            { name: "id", type: "string", required: true, description: "ID del cliente" }
          ]
        }
      },
      {
        title: "Crear Cliente",
        description: "Agregar un nuevo cliente",
        endpoint: {
          method: "POST",
          path: "/api/Client",
          description: "Crea un nuevo cliente",
          body: JSON.stringify({
            "Name": "Cliente de Prueba S.A. de C.V.",
            "Rfc": "XAXX010101000",
            "Email": "cliente@ejemplo.com",
            "CfdiUse": "G03",
            "Address": {
              "Street": "Calle Principal",
              "ExteriorNumber": "123",
              "InteriorNumber": "A",
              "Neighborhood": "Centro",
              "ZipCode": "78000",
              "Locality": "San Luis Potosí",
              "Municipality": "San Luis Potosí",
              "State": "San Luis Potosí",
              "Country": "México"
            }
          }, null, 2)
        }
      },
      {
        title: "Actualizar Cliente",
        description: "Modificar datos de un cliente existente",
        endpoint: {
          method: "PUT",
          path: "/api/Client/{id}",
          description: "Actualiza un cliente existente",
          parameters: [
            { name: "id", type: "string", required: true, description: "ID del cliente" }
          ],
          body: JSON.stringify({
            "Name": "Cliente Actualizado S.A. de C.V.",
            "Email": "cliente_actualizado@ejemplo.com"
          }, null, 2)
        }
      },
      {
        title: "Eliminar Cliente",
        description: "Eliminar un cliente del sistema",
        endpoint: {
          method: "DELETE",
          path: "/api/Client/{id}",
          description: "Elimina un cliente",
          parameters: [
            { name: "id", type: "string", required: true, description: "ID del cliente" }
          ]
        }
      },
      {
        title: "Validar RFC",
        description: "Verificar estatus de un RFC",
        endpoint: {
          method: "GET",
          path: "/api/Customers/status/{rfc}",
          description: "Verifica el estatus de un RFC",
          parameters: [
            { name: "rfc", type: "string", required: true, description: "RFC a verificar" }
          ]
        }
      }
    ]
  },
  {
    name: "Productos",
    description: "Gestión de productos y servicios para facturación",
    endpoints: [
      {
        title: "Lista de Productos",
        description: "Obtener lista paginada de productos",
        endpoint: {
          method: "GET",
          path: "/api/products",
          description: "Obtiene la lista de productos",
          parameters: [
            { name: "start", type: "number", required: false, description: "Inicio de la paginación" },
            { name: "length", type: "number", required: false, description: "Cantidad de registros" },
            { name: "search", type: "string", required: false, description: "Término de búsqueda" },
            { name: "orderBy", type: "string", required: false, description: "Campo para ordenar" },
            { name: "orderAsc", type: "boolean", required: false, description: "Orden ascendente" }
          ]
        }
      },
      {
        title: "Buscar Productos",
        description: "Buscar productos por palabra clave",
        endpoint: {
          method: "GET",
          path: "/api/Product",
          description: "Busca productos por palabra clave",
          parameters: [
            { name: "keyword", type: "string", required: true, description: "Palabra clave para buscar" }
          ]
        }
      },
      {
        title: "Obtener Producto por ID",
        description: "Consultar datos de un producto específico",
        endpoint: {
          method: "GET",
          path: "/api/Product/{id}",
          description: "Obtiene un producto por ID",
          parameters: [
            { name: "id", type: "string", required: true, description: "ID del producto" }
          ]
        }
      },
      {
        title: "Crear Producto",
        description: "Agregar un nuevo producto",
        endpoint: {
          method: "POST",
          path: "/api/Product",
          description: "Crea un nuevo producto",
          body: JSON.stringify({
            "Name": "Producto de Prueba",
            "Description": "Descripción del producto de prueba",
            "ProductCode": "01010101",
            "IdentificationNumber": "PROD001",
            "Unit": "H87",
            "UnitCode": "H87",
            "Price": 100.00,
            "CodeProdServ": "01010101",
            "CuentaPredial": "",
            "Taxes": [
              {
                "Name": "IVA",
                "Rate": 0.16,
                "IsRetention": false
              }
            ]
          }, null, 2)
        }
      },
      {
        title: "Actualizar Producto",
        description: "Modificar datos de un producto existente",
        endpoint: {
          method: "PUT",
          path: "/api/Product/{id}",
          description: "Actualiza un producto existente",
          parameters: [
            { name: "id", type: "string", required: true, description: "ID del producto" }
          ],
          body: JSON.stringify({
            "Name": "Producto Actualizado",
            "Price": 150.00
          }, null, 2)
        }
      },
      {
        title: "Eliminar Producto",
        description: "Eliminar un producto del catálogo",
        endpoint: {
          method: "DELETE",
          path: "/api/Product/{id}",
          description: "Elimina un producto",
          parameters: [
            { name: "id", type: "string", required: true, description: "ID del producto" }
          ]
        }
      }
    ]
  },
  {
    name: "Mi Cuenta",
    description: "Información de la cuenta y configuración fiscal",
    endpoints: [
      {
        title: "Información de Cuenta",
        description: "Obtener información de la cuenta del usuario",
        endpoint: {
          method: "GET",
          path: "/api/Account/UserInfo",
          description: "Obtiene información de la cuenta y perfil fiscal"
        }
      },
      {
        title: "Información Fiscal",
        description: "Obtener datos de la entidad fiscal",
        endpoint: {
          method: "GET",
          path: "/api/TaxEntity",
          description: "Obtiene la información fiscal de la cuenta"
        }
      },
      {
        title: "Actualizar Entidad Fiscal",
        description: "Modificar datos fiscales de la cuenta",
        endpoint: {
          method: "PUT",
          path: "/api/TaxEntity",
          description: "Actualiza la entidad fiscal",
          body: JSON.stringify({
            "BusinessName": "Mi Empresa S.A. de C.V.",
            "Rfc": "XAXX010101000",
            "TaxRegime": "601",
            "Address": {
              "Street": "Calle Fiscal",
              "ExteriorNumber": "100",
              "ZipCode": "78000",
              "Locality": "San Luis Potosí",
              "Municipality": "San Luis Potosí",
              "State": "San Luis Potosí",
              "Country": "México"
            }
          }, null, 2)
        }
      },
      {
        title: "Subir Logo",
        description: "Cargar logo de la empresa",
        endpoint: {
          method: "PUT",
          path: "/api/TaxEntity/UploadLogo",
          description: "Sube el logo de la empresa"
        }
      },
      {
        title: "Subir CSD",
        description: "Cargar certificados de sello digital",
        endpoint: {
          method: "PUT",
          path: "/api/TaxEntity/UploadCsd",
          description: "Sube los certificados CSD al servidor"
        }
      }
    ]
  },
  {
    name: "Catálogos SAT",
    description: "Consulta de catálogos oficiales del SAT",
    endpoints: [
      {
        title: "Códigos de Productos y Servicios",
        description: "Buscar códigos de productos y servicios",
        endpoint: {
          method: "GET",
          path: "/api/Catalogs/ProductsOrServices",
          description: "Busca códigos de productos y servicios",
          parameters: [
            { name: "keyword", type: "string", required: true, description: "Palabra clave para buscar" }
          ]
        }
      },
      {
        title: "Códigos Postales",
        description: "Buscar códigos postales",
        endpoint: {
          method: "GET",
          path: "/api/Catalogs/PostalCodes",
          description: "Busca códigos postales",
          parameters: [
            { name: "keyword", type: "string", required: true, description: "Código postal a buscar" }
          ]
        }
      },
      {
        title: "Unidades de Medida",
        description: "Consultar catálogo de unidades",
        endpoint: {
          method: "GET",
          path: "/api/Catalogs/Units",
          description: "Obtiene el catálogo de unidades",
          parameters: [
            { name: "keyword", type: "string", required: false, description: "Palabra clave para buscar" }
          ]
        }
      },
      {
        title: "Monedas",
        description: "Consultar catálogo de monedas",
        endpoint: {
          method: "GET",
          path: "/api/Catalogs/Currencies",
          description: "Obtiene el catálogo de monedas",
          parameters: [
            { name: "keyword", type: "string", required: false, description: "Palabra clave para buscar" }
          ]
        }
      },
      {
        title: "Países",
        description: "Consultar catálogo de países",
        endpoint: {
          method: "GET",
          path: "/api/catalogs/Countries",
          description: "Obtiene el catálogo de países",
          parameters: [
            { name: "keyword", type: "string", required: false, description: "Palabra clave para buscar" }
          ]
        }
      },
      {
        title: "Formas de Pago",
        description: "Consultar formas de pago disponibles",
        endpoint: {
          method: "GET",
          path: "/api/catalogs/PaymentForms",
          description: "Obtiene el catálogo de formas de pago"
        }
      },
      {
        title: "Métodos de Pago",
        description: "Consultar métodos de pago disponibles",
        endpoint: {
          method: "GET",
          path: "/api/catalogs/PaymentMethods",
          description: "Obtiene el catálogo de métodos de pago"
        }
      },
      {
        title: "Regímenes Fiscales",
        description: "Consultar regímenes fiscales por RFC",
        endpoint: {
          method: "GET",
          path: "/api/catalogs/FiscalRegimens",
          description: "Obtiene los regímenes fiscales",
          parameters: [
            { name: "rfc", type: "string", required: true, description: "RFC para consultar regímenes" }
          ]
        }
      },
      {
        title: "Tipos de CFDI",
        description: "Consultar tipos de comprobantes fiscales",
        endpoint: {
          method: "GET",
          path: "/api/catalogs/CfdiTypes",
          description: "Obtiene el catálogo de tipos de CFDI"
        }
      },
      {
        title: "Usos de CFDI",
        description: "Consultar usos de comprobantes fiscales",
        endpoint: {
          method: "GET",
          path: "/api/catalogs/CfdiUses",
          description: "Obtiene el catálogo de usos de CFDI",
          parameters: [
            { name: "keyword", type: "string", required: false, description: "Palabra clave para buscar" }
          ]
        }
      }
    ]
  },
  {
    name: "Sucursales",
    description: "Gestión de lugares de expedición",
    endpoints: [
      {
        title: "Lista de Sucursales",
        description: "Obtener todas las sucursales",
        endpoint: {
          method: "GET",
          path: "/api/BranchOffice",
          description: "Obtiene la lista de sucursales"
        }
      },
      {
        title: "Obtener Sucursal por ID",
        description: "Consultar datos de una sucursal específica",
        endpoint: {
          method: "GET",
          path: "/api/BranchOffice/{id}",
          description: "Obtiene una sucursal por ID",
          parameters: [
            { name: "id", type: "string", required: true, description: "ID de la sucursal" }
          ]
        }
      },
      {
        title: "Crear Sucursal",
        description: "Agregar una nueva sucursal",
        endpoint: {
          method: "POST",
          path: "/api/BranchOffice",
          description: "Crea una nueva sucursal",
          body: JSON.stringify({
            "Name": "Sucursal Principal",
            "Description": "Oficina matriz de la empresa",
            "Address": {
              "Street": "Calle Principal",
              "ExteriorNumber": "100",
              "ZipCode": "78000",
              "Locality": "San Luis Potosí",
              "Municipality": "San Luis Potosí",
              "State": "San Luis Potosí",
              "Country": "México"
            }
          }, null, 2)
        }
      },
      {
        title: "Actualizar Sucursal",
        description: "Modificar datos de una sucursal",
        endpoint: {
          method: "PUT",
          path: "/api/BranchOffice/{id}",
          description: "Actualiza una sucursal",
          parameters: [
            { name: "id", type: "string", required: true, description: "ID de la sucursal" }
          ],
          body: JSON.stringify({
            "Name": "Sucursal Actualizada",
            "Description": "Descripción actualizada"
          }, null, 2)
        }
      },
      {
        title: "Eliminar Sucursal",
        description: "Eliminar una sucursal",
        endpoint: {
          method: "DELETE",
          path: "/api/BranchOffice/{id}",
          description: "Elimina una sucursal",
          parameters: [
            { name: "id", type: "string", required: true, description: "ID de la sucursal" }
          ]
        }
      }
    ]
  }
];