export enum ComponentType {
  Microcontroller = 'Microcontroller',
  Sensor = 'Sensor',
  PowerIC = 'Power IC',
  Resistor = 'Resistor',
  Capacitor = 'Capacitor',
  Connector = 'Connector',
  Other = 'Other',
}

export interface Component {
  id: string;
  name: string; // This can be a translation key or a direct name if not from preset
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string; // Tailwind bg color class
  locked?: boolean;
  thermalHotspot?: boolean; // For thermal simulation
  rotation?: number; // Optional rotation in degrees
}

export interface PcbLayout {
  name: string; // Translated name
  components: Component[];
  // Potentially add board dimensions, layers, etc.
}

export interface Preset {
  id: string;
  nameKey: string; // Changed from name to nameKey
  descriptionKey: string; // Changed from description to descriptionKey
  components: Component[]; // Component names here are keys, e.g., "component.tinymcu.name"
}

export enum AppMode {
  Optimization = "Optimization",
  SignalAnalysis = "Signal Analysis",
  ThermalSimulation = "Thermal Simulation",
}

export interface ChatMessage {
  id:string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp?: Date;
  metadata?: Record<string, any>; // For grounding chunks, etc.
}


// Web Speech API types
// These interfaces describe the objects involved in the Web Speech API.
// By declaring them globally, they become available throughout the project.
declare global {
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string; 
    readonly message: string;
  }
  
  interface SpeechRecognition extends EventTarget {
    grammars: SpeechGrammarList;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    serviceURI?: string; 

    start(): void;
    stop(): void;
    abort(): void;

    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    
    addEventListener<K extends keyof SpeechRecognitionEventMap>(type: K, listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof SpeechRecognitionEventMap>(type: K, listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  }

  interface SpeechRecognitionStatic {
    new(): SpeechRecognition;
  }
  
  interface SpeechGrammarList {
    readonly length: number;
    item(index: number): SpeechGrammar;
    addFromString(string: string, weight?: number): void;
    addFromURI(src: string, weight?: number): void;
    [index: number]: SpeechGrammar;
  }

  interface SpeechGrammar {
    src: string;
    weight: number;
  }

  interface SpeechRecognitionEventMap {
    "audiostart": Event;
    "audioend": Event;
    "end": Event;
    "error": SpeechRecognitionErrorEvent;
    "nomatch": SpeechRecognitionEvent;
    "result": SpeechRecognitionEvent;
    "soundstart": Event;
    "soundend": Event;
    "speechstart": Event;
    "speechend": Event;
    "start": Event;
  }

  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
}