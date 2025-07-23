import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Globe, Key, Info, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FacturamaLogo from "@/components/FacturamaLogo";
import ApiTestCard from "@/components/ApiTestCard";
import { facturamaApiCategories } from "@/data/facturamaEndpoints";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(facturamaApiCategories[0].name);

  const filteredCategories = facturamaApiCategories.map(category => ({
    ...category,
    endpoints: category.endpoints.filter(endpoint =>
      endpoint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.endpoint.path.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.endpoints.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FacturamaLogo />
              <div>
                <h1 className="text-2xl font-bold text-foreground">API Sandbox</h1>
                <p className="text-muted-foreground">Ambiente de prueba para APIs de Facturama</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Globe className="w-3 h-3 mr-1" />
                Sandbox
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <a href="https://apisandbox.facturama.mx/docs/menu" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentación
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Info Alert */}
        <Alert className="mb-8 border-info/20 bg-info/5">
          <Info className="h-4 w-4 text-info" />
          <AlertTitle className="text-info">Información Importante</AlertTitle>
          <AlertDescription>
            Este es un ambiente de prueba para las APIs de Facturama. Para usar los endpoints, necesitas:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Una cuenta en Facturama (sandbox o producción)</li>
              <li>Credenciales de autenticación (username y password)</li>
              <li>Configurar la autorización Basic Auth en los headers</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar endpoints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Authentication Setup */}
        <Card className="mb-8 border-warning/20 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center text-warning">
              <Key className="w-5 h-5 mr-2" />
              Configuración de Autenticación
            </CardTitle>
            <CardDescription>
              Configura tus credenciales para probar los endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Base URL del Sandbox:</h4>
                <code className="bg-muted px-3 py-1 rounded text-sm">https://apisandbox.facturama.mx</code>
              </div>
              <div>
                <h4 className="font-medium mb-2">Autenticación:</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Usa Basic Authentication con tus credenciales de Facturama:
                </p>
                <code className="bg-muted px-3 py-1 rounded text-sm block">
                  Authorization: Basic {"{"}Base64(username:password){"}"}
                </code>
              </div>
              <div>
                <h4 className="font-medium mb-2">Ejemplo en JavaScript:</h4>
                <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                  <code>{`const credentials = btoa('username:password');
const headers = {
  'Authorization': \`Basic \${credentials}\`,
  'Content-Type': 'application/json'
};`}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Categories */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            {facturamaApiCategories.map((category) => (
              <TabsTrigger
                key={category.name}
                value={category.name}
                className="text-xs lg:text-sm"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredCategories.map((category) => (
            <TabsContent key={category.name} value={category.name}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">{category.name}</h2>
                  <p className="text-muted-foreground text-lg">{category.description}</p>
                </div>

                {category.endpoints.length === 0 ? (
                  <Card>
                    <CardContent className="py-8">
                      <div className="text-center text-muted-foreground">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No se encontraron endpoints que coincidan con tu búsqueda.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {category.endpoints.map((item, index) => (
                      <ApiTestCard
                        key={`${category.name}-${index}`}
                        title={item.title}
                        description={item.description}
                        endpoint={item.endpoint}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">
              Desarrollado para probar las APIs de{" "}
              <a
                href="https://facturama.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Facturama
              </a>
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <a
                href="https://apisandbox.facturama.mx/docs/menu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Documentación API
              </a>
              <a
                href="https://github.com/Facturama/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://facturama.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Sitio Web
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;