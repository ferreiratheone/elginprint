import React, { useState, useRef } from 'react';
import { Upload, Printer, Trash2, Plus, Type, Bold, Image as ImageIcon } from 'lucide-react';

export default function App() {
  // Estados para o editor
  const [text, setText] = useState('DESCARTE DO ARCO\nSUBMERSO');
  const [logo, setLogo] = useState(null);
  const [logoSize, setLogoSize] = useState(30);
  const [fontSize, setFontSize] = useState(24);
  const [isBold, setIsBold] = useState(true);
  
  // Fila de etiquetas para imprimir
  const [labels, setLabels] = useState([]);

  // Lidar com upload de imagem
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Adicionar etiqueta atual à fila
  const addLabel = () => {
    setLabels([...labels, { text, logo, fontSize, isBold, logoSize, id: Date.now() }]);
  };

  // Remover etiqueta específica
  const removeLabel = (id) => {
    setLabels(labels.filter(label => label.id !== id));
  };

  // Limpar todas
  const clearAll = () => {
    setLabels([]);
  };

  // Disparar impressão
  const handlePrint = () => {
    if (labels.length === 0) {
      alert("Adicione pelo menos uma etiqueta na fila antes de imprimir.");
      return;
    }
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 print:bg-white print:text-black subtle-gradient-bg">
      
      {/* ========================================================================
        CSS DE IMPRESSÃO CRÍTICO PARA ELGIN L42 PRO E TÉRMICAS
        ========================================================================
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: 100mm 35mm;
            margin: 0 !important;
          }
          
          /* AJUSTES CRÍTICOS PARA ESCURECER IMPRESSÃO TÉRMICA VIA NAVEGADOR */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            text-rendering: optimizeSpeed !important; /* Desliga suavização complexa */
            -webkit-font-smoothing: none !important;  /* Remove os pixels 'cinzas' das bordas */
            color: #000000 !important;                /* Preto absoluto FORÇADO */
          }
          
          body {
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-family: Arial, sans-serif !important; /* Arial tem o melhor preenchimento térmico */
          }
          /* Esconde tudo que não for etiqueta */
          .no-print {
            display: none !important;
          }
          /* Área de impressão */
          .print-area {
            display: block !important;
            width: 100%;
            height: 100%;
          }
          /* Cada etiqueta força uma quebra de página (GAP da Elgin) */
          .etiqueta-print {
            width: 100mm;
            height: 35mm;
            box-sizing: border-box;
            page-break-after: always;
            page-break-inside: avoid;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            color: black;
            overflow: hidden;
            padding: 2mm;
          }
        }
      `}} />

      {/* DASHBOARD (Escondido na impressão) */}
      <div className="flex flex-col xl:flex-row h-screen p-0 md:p-6 gap-6 no-print max-w-[1920px] mx-auto animate-fade-in relative z-10">
        
        {/* PAINEL ESQUERDO: CONTROLES */}
        <div className="w-full xl:w-[450px] glass-panel rounded-none md:rounded-3xl p-6 flex flex-col z-10 overflow-y-auto custom-scrollbar border-t md:border-t-0 border-[#ffffff10]">
          
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Printer className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                ElginPrint Pro
              </h1>
              <span className="text-xs font-medium text-blue-400 uppercase tracking-widest mt-1 block">Thermal HQ Studio</span>
            </div>
          </div>

          <div className="space-y-8 flex-grow">
            
            {/* Texto Principal */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                <Type className="w-4 h-4 text-blue-400" /> Título ou Texto da Etiqueta
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none resize-none transition-all placeholder-gray-600 font-medium text-lg leading-snug"
                placeholder="Ex: DESCARTE DE MATERIAL..."
              />
            </div>

            {/* Controles de Fonte */}
            <div className="p-5 bg-black/30 rounded-2xl border border-white/5 backdrop-blur-md animate-fade-in" style={{ animationDelay: '0.15s' }}>
               <div className="flex justify-between items-center mb-5">
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-500 font-semibold tracking-wider uppercase mb-1">Tamanho da Fonte</span>
                   <span className="text-lg font-bold text-gray-200">{fontSize}px</span>
                 </div>
                 <button 
                   onClick={() => setIsBold(!isBold)}
                   className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 ${isBold ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                   title="Alternar Negrito"
                 >
                   <Bold className="w-5 h-5" />
                 </button>
               </div>
               
               {/* Custom Range Slider Range UI */}
               <input
                 type="range"
                 min="12"
                 max="60"
                 value={fontSize}
                 onChange={(e) => setFontSize(Number(e.target.value))}
                 className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-blue-500"
               />
            </div>

            {/* Upload Logo */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                <ImageIcon className="w-4 h-4 text-purple-400" /> Logo da Empresa (Opcional)
              </label>
              <div className="flex flex-col gap-4">
                <label className="cursor-pointer bg-gradient-to-br from-white/5 to-white/0 hover:from-white/10 hover:to-white/5 border border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center transition-all group overflow-hidden relative">
                   <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <Upload className="w-8 h-8 text-gray-400 mb-3 group-hover:text-blue-400 transition-colors z-10" />
                   <span className="text-sm font-medium text-gray-300 z-10">Clique para selecionar imagem</span>
                   <span className="text-xs text-gray-500 mt-1 z-10">JPG, PNG (P/B recomendado)</span>
                   <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                
                {logo && (
                   <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl animate-fade-in">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black/50 rounded-lg flex items-center justify-center p-1">
                          <img src={logo} alt="Preview" className="max-w-full max-h-full object-contain filter grayscale" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400">Logo carregada</span>
                      </div>
                      <button onClick={() => setLogo(null)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                )}
              </div>
              
              {logo && (
                <div className="mt-4 p-5 bg-black/30 rounded-2xl border border-white/5 backdrop-blur-md animate-fade-in">
                  <div className="flex flex-col mb-4">
                    <span className="text-xs text-gray-500 font-semibold tracking-wider uppercase mb-1">Tamanho da Logo</span>
                    <span className="text-lg font-bold text-gray-200">{logoSize}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              )}
            </div>
            
          </div>
          
          {/* Add Button - Fixed to bottom of panel */}
          <div className="mt-8 pt-6 border-t border-white/5">
             <button
                onClick={addLabel}
                className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                <Plus className="w-5 h-5" /> Adicionar na Fila
             </button>
          </div>
        </div>


        {/* PAINEL DIREITO: PREVIEW E FILA */}
        <div className="w-full xl:w-[calc(100%-450px)] flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-24 md:pb-0">
          
          {/* Preview em Tempo Real */}
          <div className="glass-panel p-6 md:p-8 rounded-none md:rounded-3xl flex flex-col animate-fade-in">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Printer className="w-5 h-5 text-blue-400" />
              </div>
              Preview Real (Impressão)
            </h2>
            
            <div className="flex-grow flex items-center justify-center bg-black/40 p-10 rounded-2xl border border-white/10 shadow-inner overflow-x-auto">
              
              {/* O Container simulando 100x35mm na tela com efeito card flutuante */}
              <div className="relative group">
                 {/* Borda decorativa extra simulando a margem da impressora */}
                 <div className="absolute -inset-4 border border-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="absolute -top-6 text-[10px] text-blue-400 font-mono tracking-widest uppercase">ÁREA DE QUEIMA DO CABEÇOTE (100x35mm)</span>
                 </div>
                 
                 <div 
                   className="bg-white text-black flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-transform group-hover:scale-[1.01] duration-500 rounded-[2px]"
                   style={{ width: '100mm', height: '35mm', boxSizing: 'border-box' }}
                 >
                   {logo && (
                     <div className="absolute top-[2mm] left-[2mm]" style={{ width: `${logoSize}%` }}>
                       <img src={logo} alt="Logo" className="w-full h-auto object-contain filter grayscale" style={{ WebkitFilter: 'grayscale(100%) brightness(0%)' }} />
                     </div>
                   )}
                   <div className="w-full h-full flex items-center justify-center p-[2mm]">
                     <div 
                       style={{ 
                          fontSize: `${fontSize}px`, 
                          fontWeight: isBold ? 'bold' : 'normal', 
                          lineHeight: '1.1',
                          fontFamily: 'Arial, sans-serif'
                       }}
                       className="text-center text-black whitespace-pre-wrap uppercase break-words w-full"
                     >
                       {text || "TEXTO DA ETIQUETA"}
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Fila de Impressão */}
          <div className="glass-panel p-6 md:p-8 rounded-none md:rounded-3xl flex-grow flex flex-col animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <h2 className="text-xl font-bold flex items-center gap-3">
                 <div className="bg-green-500/20 p-2 rounded-lg">
                    <div className="w-5 h-5 flex items-center justify-center font-bold text-green-400 text-sm">
                      {labels.length}
                    </div>
                 </div>
                 Fila de Impressão
              </h2>
              {labels.length > 0 && (
                <button onClick={clearAll} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors">
                  <Trash2 className="w-4 h-4" /> Limpar Tudo
                </button>
              )}
            </div>

            <div className="flex-grow flex flex-col min-h-[200px]">
              {labels.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-gray-500 gap-4 opacity-60">
                  <Printer className="w-16 h-16 opacity-30 text-gray-400" />
                  <p className="text-lg font-medium">Fila vazia. O layout final está aguardando!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {labels.map((item, index) => (
                    <div key={item.id} className="bg-black/30 p-4 rounded-2xl flex items-center justify-between border border-white/5 group hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-lg hover:bg-white/5">
                      <div className="flex items-center gap-4 truncate">
                        <span className="bg-blue-500/20 text-blue-400 font-mono w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold ring-1 ring-blue-500/30">
                          {index + 1}
                        </span>
                        <div className="flex flex-col truncate">
                           <span className="truncate text-sm font-bold text-gray-200">{item.text.replace(/\n/g, ' ')}</span>
                           <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] text-gray-500 font-medium bg-white/5 px-2 py-0.5 rounded-full">Fonte {item.fontSize}px</span>
                             {item.logo && <ImageIcon className="w-3 h-3 text-purple-400" />}
                           </div>
                        </div>
                      </div>
                      <button onClick={() => removeLabel(item.id)} className="text-gray-500 hover:text-red-400 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 opacity-50 group-hover:opacity-100 transition-all transform hover:scale-110">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ação de Imprimir */}
            <div className="mt-8">
              <button
                onClick={handlePrint}
                disabled={labels.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_40px_rgba(147,51,234,0.4)] text-lg disabled:shadow-none transform hover:scale-[1.01] active:scale-95"
              >
                <Printer className="w-6 h-6" /> 
                {labels.length > 0 ? `ENVIAR PARA IMPRESSORA (${labels.length})` : 'Aguardando Etiquetas...'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
        ÁREA EXCLUSIVA DE IMPRESSÃO (Visível apenas pro driver da impressora)
        ========================================================================
      */}
      <div className="hidden print:block print-area">
        {labels.map((lbl) => (
          <div key={lbl.id} className="etiqueta-print">
            {/* Logo posicionada no canto superior esquerdo */}
            {lbl.logo && (
               <div style={{ position: 'absolute', top: '2mm', left: '2mm', width: `${lbl.logoSize}%` }}>
                  <img src={lbl.logo} alt="Logo" style={{ width: '100%', height: 'auto', objectFit: 'contain', filter: 'grayscale(100%) brightness(0%)' }} />
               </div>
            )}
            
            {/* Área de Texto centralizada */}
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2mm' }}>
               <div style={{ 
                 fontSize: `${lbl.fontSize}px`, 
                 fontWeight: lbl.isBold ? 'bold' : 'normal', 
                 lineHeight: '1.1',
                 textAlign: 'center',
                 whiteSpace: 'pre-wrap',
                 width: '100%',
                 wordBreak: 'break-word',
                 color: 'black'
               }}>
                 {lbl.text}
               </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
