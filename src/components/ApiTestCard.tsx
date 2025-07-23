import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Copy, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  parameters?: { name: string; type: string; required: boolean; description?: string }[];
  body?: string;
}

interface ApiTestCardProps {
  title: string;
  description: string;
  endpoint: ApiEndpoint;
  baseUrl?: string;
}

const ApiTestCard = ({ title, description, endpoint, baseUrl = "https://apisandbox.facturama.mx" }: ApiTestCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState(endpoint.body || "");
  const [headers, setHeaders] = useState({
    'Authorization': 'Basic [Base64(username:password)]',
    'Content-Type': 'application/json'
  });
  const { toast } = useToast();

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-success";
      case "POST": return "bg-info";
      case "PUT": return "bg-warning";
      case "DELETE": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const buildUrl = () => {
    let url = `${baseUrl}${endpoint.path}`;
    
    // Replace path parameters
    Object.entries(parameters).forEach(([key, value]) => {
      if (endpoint.path.includes(`{${key}}`)) {
        url = url.replace(`{${key}}`, value);
      }
    });

    // Add query parameters
    const queryParams = Object.entries(parameters)
      .filter(([key]) => !endpoint.path.includes(`{${key}}`))
      .filter(([, value]) => value.trim() !== "")
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    if (queryParams) {
      url += `?${queryParams}`;
    }

    return url;
  };

  const handleTest = async () => {
    setIsLoading(true);
    setResponse("");

    try {
      const url = buildUrl();
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      };

      if (endpoint.method !== "GET" && requestBody.trim()) {
        try {
          JSON.parse(requestBody);
          options.body = requestBody;
        } catch (e) {
          throw new Error("Invalid JSON in request body");
        }
      }

      const result = await fetch(url, options);
      const responseText = await result.text();
      
      let formattedResponse = `Status: ${result.status} ${result.statusText}\n\n`;
      
      try {
        const jsonResponse = JSON.parse(responseText);
        formattedResponse += JSON.stringify(jsonResponse, null, 2);
      } catch {
        formattedResponse += responseText;
      }

      setResponse(formattedResponse);
      
      toast({
        title: "Request completed",
        description: `Status: ${result.status}`,
        variant: result.ok ? "default" : "destructive",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Request failed";
      setResponse(`Error: ${errorMessage}`);
      toast({
        title: "Request failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content copied successfully",
    });
  };

  return (
    <Card className="border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge className={`${getMethodColor(endpoint.method)} text-white`}>
                  {endpoint.method}
                </Badge>
                <div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription className="mt-1">{description}</CardDescription>
                </div>
              </div>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
            <div className="text-sm font-mono bg-muted p-2 rounded mt-2">
              {endpoint.method} {endpoint.path}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Headers */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Headers</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Authorization"
                    value="Authorization"
                    disabled
                  />
                  <Input
                    placeholder="Basic [Base64(username:password)]"
                    value={headers.Authorization}
                    onChange={(e) => setHeaders({ ...headers, Authorization: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Parameters */}
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Parameters</Label>
                <div className="space-y-2">
                  {endpoint.parameters.map((param) => (
                    <div key={param.name} className="grid grid-cols-3 gap-2 items-center">
                      <Label className="text-sm">
                        {param.name}
                        {param.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      <Input
                        placeholder={param.type}
                        value={parameters[param.name] || ""}
                        onChange={(e) => setParameters({ ...parameters, [param.name]: e.target.value })}
                      />
                      <span className="text-xs text-muted-foreground">
                        {param.description || param.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body */}
            {endpoint.method !== "GET" && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Request Body (JSON)</Label>
                <Textarea
                  placeholder="Enter JSON request body..."
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            )}

            {/* URL Preview */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Request URL</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={buildUrl()}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(buildUrl())}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Test Button */}
            <Button
              onClick={handleTest}
              disabled={isLoading}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              {isLoading ? "Testing..." : "Test Request"}
            </Button>

            {/* Response */}
            {response && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Response</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(response)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={response}
                  readOnly
                  rows={12}
                  className="font-mono text-sm bg-muted"
                />
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ApiTestCard;