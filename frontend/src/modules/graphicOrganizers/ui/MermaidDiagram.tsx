import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// La configuración inicial es correcta.
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  fontFamily: '"Inter", sans-serif',
});

interface MermaidDiagramProps {
  chart: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Usamos un estado para el SVG, esto se integra mejor con el ciclo de vida de React
  const [svg, setSvg] = React.useState<string | null>(null);

  useEffect(() => {
    // Si no hay código, no hacemos nada.
    if (!chart) return;

    // Generamos un ID único para cada renderizado para evitar conflictos
    const id = `mermaid-graph-${Math.random().toString(36).substr(2, 9)}`;

    try {
      // 1. Usamos la versión de la API que DEVUELVE una promesa.
      //    Esto nos da un mejor control sobre el timing.
      mermaid.render(id, chart).then(result => {
        // 2. Guardamos el SVG resultante en el estado de React.
        setSvg(result.svg);
      }).catch(error => {
        console.error("Mermaid render error:", error);
        setSvg(`<div class="text-red-500">Error de sintaxis en el diagrama.</div>`);
      });

    } catch (error) {
      console.error("Error preparing Mermaid render:", error);
      setSvg(`<div class="text-red-500">Error irrecuperable al renderizar.</div>`);
    }

  }, [chart]); // El efecto se dispara solo cuando el código del gráfico cambia

  // 3. Renderizamos el SVG usando `dangerouslySetInnerHTML`.
  //    Como el SVG es generado por Mermaid y no por el usuario, esto es seguro.
  //    Esto asegura que React controle cuándo se inserta el contenido en el DOM.
  return (
    <div 
      className="w-full flex justify-center mermaid-container" 
      dangerouslySetInnerHTML={{ __html: svg || '' }} 
    />
  );
};