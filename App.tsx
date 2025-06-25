
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PcbView } from './components/PcbView';
import { ControlsPanel } from './components/ControlsPanel';
import { Chatbot } from './components/Chatbot';
import { HomePage } from './components/HomePage';
import { SensorDataModal } from './components/SensorDataModal';
import { Component, PcbLayout, Preset, ComponentType, AppMode, ChatMessage } from './types';
import { INITIAL_COMPONENTS, PRESETS } from './constants';
import { geminiService } from './services/geminiService';
import { LocalizationProvider, useLocalization } from './contexts/LocalizationContext'; 

type Theme = 'light' | 'dark';

const AppContent: React.FC = () => {
  const { t, language, getLanguageName, translationsLoaded } = useLocalization();
  
  // Ensure that we don't try to use `t` before translations are loaded if it could cause issues.
  // For initial state based on PRESETS, it's safer to load after `translationsLoaded` is true,
  // or ensure `t` provides robust fallbacks.
  
  const [showHomePage, setShowHomePage] = useState<boolean>(true);
  const [components, setComponents] = useState<Component[]>(INITIAL_COMPONENTS);
  
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(true);
  const [currentLayout, setCurrentLayout] = useState<PcbLayout | null>(null);
  const [_appMode, setAppMode] = useState<AppMode>(AppMode.Optimization);
  const [isLoadingAiResponse, setIsLoadingAiResponse] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme) {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  const [isSensorModalOpen, setIsSensorModalOpen] = useState<boolean>(false);
  const [currentSensorData, setCurrentSensorData] = useState<{ name: string, moisture: number, status: string, id: string } | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('Failed to save theme to localStorage');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // Initialize selectedPreset and components based on it, only when translations are ready
  useEffect(() => {
    if (translationsLoaded && !selectedPreset) { // Initialize only once after translations are loaded
        const firstPreset = PRESETS[0];
        if (firstPreset) {
            setSelectedPreset(firstPreset);
            // Translate component names from the initial preset
            const initialPresetComponents = firstPreset.components.map(c => ({
                ...c,
                name: t(c.name, undefined, c.name) // Use key itself as fallback if not found
            }));
            setComponents(initialPresetComponents);
            setCurrentLayout({
                name: t(firstPreset.nameKey, undefined, firstPreset.nameKey),
                components: initialPresetComponents
            });
        }
    }
  }, [translationsLoaded, selectedPreset, t]);
  
  // Update components and layout when selectedPreset changes (and translations are loaded)
  useEffect(() => {
    if (selectedPreset && translationsLoaded) {
      const presetComponents = selectedPreset.components.map(c => ({
        ...c,
        name: t(c.name, undefined, c.name) 
      }));
      setComponents(presetComponents);
      setCurrentLayout({
        name: t(selectedPreset.nameKey, undefined, selectedPreset.nameKey),
        components: presetComponents
      });
    }
  }, [selectedPreset, translationsLoaded, t]);


  const handleUpdateComponentPosition = useCallback((id: string, x: number, y: number) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, x, y } : c));
  }, []);

  const handleLockComponent = useCallback((id: string) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, locked: !c.locked } : c));
  }, []);
  
  const handleAddComponent = useCallback((type: ComponentType, name: string) => {
    const newComponent: Component = {
      id: `comp-${Date.now()}`,
      name: name || t(`componentType.${type.toLowerCase()}`, undefined, `New ${type}`),
      type: type,
      x: Math.random() * 300 + 50, 
      y: Math.random() * 200 + 50,
      width: type === ComponentType.Microcontroller ? 60 : (type === ComponentType.PowerIC ? 50 : 40),
      height: type === ComponentType.Microcontroller ? 60 : (type === ComponentType.PowerIC ? 40 : 30),
      color: type === ComponentType.Sensor ? 'bg-blue-500' : type === ComponentType.PowerIC ? 'bg-red-500' : 'bg-green-500',
      locked: false,
      thermalHotspot: false,
    };
    setComponents(prev => [...prev, newComponent]);
    return newComponent;
  }, [t]);

  const handlePresetChange = useCallback((presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(preset);
    }
  }, []);

  const addAiMessageToChat = (text: string, metadata?: Record<string, any>) => {
    setChatHistory(prev => [...prev, { sender: 'ai', text, id: `ai-${Date.now()}`, metadata }]);
  };
  
  const addSystemMessageToChat = (text: string) => {
    setChatHistory(prev => [...prev, { sender: 'system', text, id: `system-${Date.now()}`, timestamp: new Date() }]);
  };

  const speakText = useCallback((text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang; 
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported by this browser.");
      addSystemMessageToChat(t("speech.notSupported", undefined, "System: Speech synthesis not supported. Cannot provide voice feedback."));
    }
  }, [t]); // Added t as dependency

  const handleSensorInteraction = useCallback((component: Component) => {
    if (component.id === 'ss_sensor') {
      const moisture = Math.floor(Math.random() * 101);
      let statusKey = "sensorModal.status.optimal";
      let voiceMessageKey = "sensorTest.voice.optimal";

      if (moisture < 30) {
        statusKey = "sensorModal.status.dry";
        voiceMessageKey = "sensorTest.voice.dry";
      } else if (moisture > 70) {
        statusKey = "sensorModal.status.overwatered";
        voiceMessageKey = "sensorTest.voice.overwatered";
      }
      
      const translatedStatus = t(statusKey);
      const translatedVoiceMessage = t(voiceMessageKey);

      setCurrentSensorData({
        id: component.id,
        name: component.name, 
        moisture,
        status: translatedStatus,
      });
      setIsSensorModalOpen(true);
      
      const timestamp = new Date().toLocaleTimeString();
      addSystemMessageToChat(t("sensorTest.triggeredLog", { sensorName: component.name, timestamp, moisture: String(moisture), status: translatedStatus }));
      speakText(translatedVoiceMessage, language);
    }
  }, [speakText, t, language]);

  const handleAiCommand = useCallback(async (command: string, isUserMessage: boolean = true) => {
    if (isUserMessage) {
       setChatHistory(prev => [...prev, { sender: 'user', text: command, id: `user-${Date.now()}` }]);
    }
    setIsLoadingAiResponse(true);

    let aiResponseText = t('chatbot.processing', undefined, `Received command: "${command}". Processing...`);
    const currentComponentsDesc = components.map(c => 
      `ID: ${c.id}, Name: ${c.name}, Type: ${c.type}, X: ${Math.round(c.x)}, Y: ${Math.round(c.y)}, Width: ${c.width}, Height: ${c.height}, Locked: ${c.locked ? 'Yes' : 'No'}`
    ).join('; ');

    const pcbBoundaries = { width: 500, height: 350 };
    const langName = getLanguageName(language);

    // Ensure all command key lookups provide a defaultValue if t() is used
    if (command.toLowerCase().startsWith(t('command.aiAutoPlace', undefined, "ai auto-place").toLowerCase())) {
      addAiMessageToChat(t('airesponse.attemptingAutoPlace', undefined, "Attempting AI auto-placement..."));
      const prompt = `Given these components: [${currentComponentsDesc}] on a ${pcbBoundaries.width}x${pcbBoundaries.height} PCB, suggest an optimal layout. Locked components must not be moved. Prioritize logical groupings. Return a JSON array: [{id: "componentId", x: newX, y: newY}, ...]. Ensure x is between 0 and (PCBWidth - componentWidth) and y is between 0 and (PCBHeight - componentHeight). Respond in ${langName}.`;
      const result = await geminiService.generateStructuredResponse(prompt, language);
      if (result && !result.error && Array.isArray(result)) {
        setComponents(prev => {
          const newComps = [...prev];
          result.forEach((update: {id: string, x: number, y: number}) => {
            const compIndex = newComps.findIndex(c => c.id === update.id);
            if (compIndex !== -1 && !newComps[compIndex].locked) {
              const comp = newComps[compIndex];
              const newX = Math.max(0, Math.min(update.x, pcbBoundaries.width - comp.width));
              const newY = Math.max(0, Math.min(update.y, pcbBoundaries.height - comp.height));
              newComps[compIndex] = { ...comp, x: newX, y: newY };
            }
          });
          return newComps;
        });
        aiResponseText = t('airesponse.autoPlaceSuccess', undefined, "AI has suggested a new layout. Check the PCB view.");
      } else {
        aiResponseText = t('airesponse.autoPlaceFail', {error: result?.error || 'No valid layout received.', details: result?.details || '' }, `AI auto-placement failed. ${result?.error || 'No valid layout received.'} Details: ${result?.details || ''}`);
      }
    } else if (command.toLowerCase().includes(t('command.optimizeThermal', undefined, "optimize for thermal").toLowerCase())) {
      addAiMessageToChat(t('airesponse.analyzingThermal', undefined, "Analyzing thermal properties..."));
      const prompt = `Analyze this PCB layout for thermal management: [${currentComponentsDesc}]. Identify up to 3 components as 'thermalHotspot: true'. Provide concise textual advice. Return JSON: { "hotspots": ["id1", "id2"], "advice": "Your advice..." }. Respond in ${langName}.`;
      const result = await geminiService.generateStructuredResponse(prompt, language);
      if (result && !result.error && result.hotspots && result.advice) {
        setComponents(prev => prev.map(c => ({ ...c, thermalHotspot: result.hotspots.includes(c.id) })));
        aiResponseText = t('airesponse.thermalSuccess', { advice: result.advice, hotspots: result.hotspots.join(', ') || t('status.none', undefined, "None")});
      } else {
        aiResponseText = t('airesponse.thermalFail', { error: result?.error || 'No valid data.', details: result?.details || '' }, `Thermal analysis failed. Error: ${result?.error || 'No valid data.'} Details: ${result?.details || ''}`);
        setComponents(prev => prev.map(c => ({ ...c, thermalHotspot: Math.random() > 0.7 && (c.type === ComponentType.PowerIC || c.type === ComponentType.Microcontroller) })));
        aiResponseText += ` (${t('status.fallbackUsed', undefined, "Used fallback thermal simulation")})`;
      }
    } else if (command.toLowerCase().includes(t('command.runSignalIntegrity', undefined, "run signal integrity").toLowerCase())) {
        addAiMessageToChat(t('airesponse.runningSignalIntegrity', undefined, "Running signal integrity analysis (AI-powered advice)..."));
        const prompt = `Analyze [${currentComponentsDesc}] for signal integrity issues (EMI, crosstalk, impedance). Provide concise advice on 2-3 potential problems and improvements. Respond in ${langName}.`;
        const response = await geminiService.generateText(prompt, language);
        aiResponseText = response.text || t('airesponse.signalIntegrityFail', undefined, "Signal integrity analysis could not be performed by AI.");
    } else if (command.toLowerCase().includes(t('command.analyzePowerPaths', undefined, "analyze power paths").toLowerCase())) {
        addAiMessageToChat(t('airesponse.analyzingPowerPaths', undefined, "Analyzing power paths (AI-powered advice)..."));
        const prompt = `For [${currentComponentsDesc}], advise on power path routing (direct paths, trace widths, noise minimization). 2-3 key points. Respond in ${langName}.`;
        const response = await geminiService.generateText(prompt, language);
        aiResponseText = response.text || t('airesponse.powerPathFail', undefined, "Power path analysis could not be performed by AI.");
    } else if (command.toLowerCase().startsWith(t('command.place', undefined, "place ").toLowerCase())) {
        addAiMessageToChat(t('airesponse.attemptingPlaceComponents', undefined, "Attempting to place components closer..."));
        const placeCmd = t('command.place', undefined, "place ").toLowerCase();
        const nearKeyword = t('command.nearKeyword', undefined, " near ").toLowerCase();
        const parts = command.substring(placeCmd.length).split(nearKeyword);

        if (parts.length === 2) {
            const name1 = parts[0].trim();
            const name2 = parts[1].trim();
            const comp1 = components.find(c => c.name.toLowerCase() === name1.toLowerCase());
            const comp2 = components.find(c => c.name.toLowerCase() === name2.toLowerCase());

            if (comp1 && comp2) {
                 const prompt = `On a ${pcbBoundaries.width}x${pcbBoundaries.height} PCB, component X (ID: ${comp1.id}, Name: ${comp1.name}) needs to be placed near component Y (ID: ${comp2.id}, Name: ${comp2.name}). Other components: [${currentComponentsDesc.replace(comp1.id, '').replace(comp2.id, '')}]. Suggest new (x,y) for non-locked components. Return JSON: [{id: "componentIdToMove", x: newX, y: newY}, ...]. Respond in ${langName}.`;
                 const result = await geminiService.generateStructuredResponse(prompt, language);
                 if (result && !result.error && Array.isArray(result) && result.length > 0) {
                      setComponents(prev => {
                         const newComps = [...prev];
                         result.forEach((update: {id: string, x: number, y: number}) => {
                             const compIndex = newComps.findIndex(c => c.id === update.id);
                             if (compIndex !== -1 && !newComps[compIndex].locked) {
                                  const comp = newComps[compIndex];
                                  const newX = Math.max(0, Math.min(update.x, pcbBoundaries.width - comp.width));
                                  const newY = Math.max(0, Math.min(update.y, pcbBoundaries.height - comp.height));
                                  newComps[compIndex] = { ...comp, x: newX, y: newY };
                             }
                         });
                         return newComps;
                     });
                     aiResponseText = t('airesponse.placeComponentsSuccess', undefined, "AI has attempted to move components. Check layout.");
                 } else {
                     aiResponseText = t('airesponse.placeComponentsFail', { error: result?.error || '', details: result?.details || ''}, `AI component placement failed. Error: ${result?.error || ''} Details: ${result?.details || ''}`);
                 }
            } else {
                aiResponseText = t('airesponse.placeComponentsNotFound', {name1, name2}, `Could not find components '${name1}' or '${name2}'.`);
            }
        } else {
            aiResponseText = t('airesponse.placeComponentsInvalidFormat', undefined, "Invalid format for 'place' command. Use: 'place [comp1] near [comp2]'.");
        }
    }
     else if (command.toLowerCase().includes(t('command.clearPcb', undefined, "clear pcb").toLowerCase())) {
      aiResponseText = t('airesponse.clearingPcb', undefined, "Clearing the PCB components.");
      setComponents([]);
    } else if (command.toLowerCase().startsWith(t('command.addComponentPrefix', undefined, "add component:").toLowerCase())) {
        aiResponseText = t('airesponse.addComponentGeneralFail', undefined, "Failed to add component. Please use the controls panel or a more specific command format.");
    } else if (command.toLowerCase().includes(t('command.testSoilSensor', undefined, 'test soil sensor').toLowerCase())) {
        const soilSensor = components.find(c => c.id === 'ss_sensor');
        if (soilSensor) {
            handleSensorInteraction(soilSensor);
            aiResponseText = t('airesponse.testingSoilSensor', undefined, "Testing the soil sensor now. Check the modal for results.");
        } else {
            aiResponseText = t('airesponse.soilSensorNotFound', undefined, "The 'Moisture Probe' sensor is not currently on the PCB. Please add it or select a preset that includes it.");
        }
    }
    else { 
      const genericPrompt = `As Caramel, an AI assistant specialized in PCB design for ${t('org.shortName', undefined, "HERE AND NOW AI")}, respond to the user query: "${command}" in ${langName}. Keep your response concise and helpful for PCB design context. If the query is unrelated to PCB design or electronics, politely state your specialization in ${langName}.`;
      const response = await geminiService.generateText(genericPrompt, language);
      aiResponseText = response.text || t('airesponse.genericFail', undefined, "Sorry, I couldn't process that generic request.");
    }
    
    addAiMessageToChat(aiResponseText);
    setIsLoadingAiResponse(false);
  }, [components, handleAddComponent, speakText, t, language, getLanguageName, handleSensorInteraction]);

  useEffect(() => {
    if (translationsLoaded && !showHomePage && chatHistory.length === 0) {
        handleAiCommand(t("chatbot.initialGreeting", undefined, "Hello! I'm Caramel, your AI assistant for PCB optimization."), false);
    }
  }, [showHomePage, handleAiCommand, chatHistory.length, t, translationsLoaded]);

  // If translations are not loaded yet, and LocalizationProvider returns null, AppContent won't render.
  // This is handled by LocalizationProvider now.
  if (!translationsLoaded && !showHomePage) { // Still show homepage if translations are loading
    return <div className="flex justify-center items-center min-h-screen">Loading application...</div>; // Or a more sophisticated loader
  }


  if (showHomePage) {
    return <HomePage onStart={() => setShowHomePage(false)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-darkBg text-gray-800 dark:text-lightText">
      <Header currentTheme={theme} onToggleTheme={toggleTheme} />
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        <ControlsPanel
          presets={PRESETS}
          selectedPresetId={selectedPreset?.id || ''}
          onPresetChange={handlePresetChange}
          onAddComponent={handleAddComponent}
          onOptimizeThermal={() => handleAiCommand(t('command.optimizeThermal', undefined, "Optimize for thermal management"))}
          onRunSignalIntegrity={() => handleAiCommand(t('command.runSignalIntegrity', undefined, "Run signal integrity analysis"))}
          onAiAutoPlace={() => handleAiCommand(t('command.aiAutoPlace', undefined, "AI auto-place components"))}
          onAnalyzePowerPaths={() => handleAiCommand(t('command.analyzePowerPaths', undefined, "Analyze power paths"))}
          onExportToEda={() => alert(t("edaExport.alert", undefined, "EDA Export feature is simulated."))}
          onSaveVersion={() => alert(t("saveVersion.alert", undefined, "Save Version feature is simulated."))}
        />
        <PcbView
          components={components}
          onUpdateComponentPosition={handleUpdateComponentPosition}
          onLockComponent={handleLockComponent}
          layout={currentLayout}
          onSensorComponentClick={handleSensorInteraction}
        />
        {isChatbotOpen && (
          <Chatbot
            chatHistory={chatHistory}
            onSendMessage={handleAiCommand}
            onClose={() => setIsChatbotOpen(false)}
            isLoading={isLoadingAiResponse}
          />
        )}
      </main>
      <SensorDataModal
        isOpen={isSensorModalOpen}
        onClose={() => setIsSensorModalOpen(false)}
        sensorData={currentSensorData}
      />
      <Footer />
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-4 right-4 bg-primary hover:bg-yellow-500 text-secondary font-semibold py-3 px-5 rounded-full shadow-lg transition-transform duration-150 hover:scale-105 z-50 flex items-center gap-2"
          aria-label={t('chatbot.openAriaLabel', undefined, "Open Caramel AI Chatbot")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.86 8.25-8.625 8.25S3.75 16.556 3.75 12 .375 3.75 8.625 3.75 21 7.444 21 12z" />
          </svg>
          {t('chatbot.openButton', undefined, "Chat with Caramel AI")}
        </button>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LocalizationProvider>
      <AppContent />
    </LocalizationProvider>
  );
};

export default App;
