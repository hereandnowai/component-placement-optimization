
import { Component, Preset, ComponentType } from './types';

export const PRIMARY_COLOR = '#FFDF00';
export const SECONDARY_COLOR = '#004040';
export const ACCENT_COLOR = '#0D9488';

export const ORGANIZATION_DETAILS = {
  shortNameKey: "org.shortName", // Translation Key
  fullNameKey: "org.fullName",   // Translation Key
  sloganKey: "app.header.orgSlogan", // Translation Key for slogan
  website: "https://hereandnowai.com",
  email: "info@hereandnowai.com",
  mobile: "+91 996 296 1000",
};

// Add these to your locale files e.g. en.json:
// "org.shortName": "HERE AND NOW AI",
// "org.fullName": "HERE AND NOW AI - Artificial Intelligence Research Institute",

export const SOCIAL_LINKS = {
  blog: "https://hereandnowai.com/blog",
  linkedin: "https://www.linkedin.com/company/hereandnowai/",
  instagram: "https://instagram.com/hereandnow_ai",
  github: "https://github.com/hereandnowai",
  twitter: "https://x.com/hereandnow_ai",
  youtube: "https://youtube.com/@hereandnow_ai",
};

export const INITIAL_COMPONENTS: Component[] = [
  // Names will be translated on display or when added if they are dynamic
  { id: 'mcu1', name: 'MCU Alpha', type: ComponentType.Microcontroller, x: 50, y: 50, width: 60, height: 60, color: 'bg-green-600', locked: false, thermalHotspot: false },
  { id: 'sensor1', name: 'Soil Sensor', type: ComponentType.Sensor, x: 150, y: 70, width: 40, height: 30, color: 'bg-blue-600', locked: false, thermalHotspot: false },
  { id: 'power1', name: 'Power Regulator', type: ComponentType.PowerIC, x: 80, y: 150, width: 50, height: 40, color: 'bg-red-600', locked: false, thermalHotspot: true },
];

export const PRESETS: Preset[] = [
  {
    id: 'soil_sensor',
    nameKey: 'preset.soil_sensor.name', // Translation Key
    descriptionKey: 'preset.soil_sensor.description', // Translation Key
    components: [ // Component names within presets could also be keys if they are fixed, or translated when loaded
      { id: 'ss_mcu', name: 'component.tinymcu.name', type: ComponentType.Microcontroller, x: 30, y: 30, width: 40, height: 40, color: 'bg-green-500', thermalHotspot: false },
      { id: 'ss_sensor', name: 'component.moistureprobe.name', type: ComponentType.Sensor, x: 100, y: 35, width: 50, height: 20, color: 'bg-blue-500', thermalHotspot: false },
      { id: 'ss_power', name: 'component.ldo.name', type: ComponentType.PowerIC, x: 35, y: 90, width: 30, height: 30, color: 'bg-red-500', thermalHotspot: false },
    ],
  },
  {
    id: 'irrigation_timer',
    nameKey: 'preset.irrigation_timer.name',
    descriptionKey: 'preset.irrigation_timer.description',
    components: [
      { id: 'it_mcu', name: 'component.maincontroller.name', type: ComponentType.Microcontroller, x: 50, y: 50, width: 60, height: 60, color: 'bg-green-600', thermalHotspot: true },
      { id: 'it_power', name: 'component.smps.name', type: ComponentType.PowerIC, x: 150, y: 60, width: 50, height: 50, color: 'bg-red-600', thermalHotspot: true },
      { id: 'it_conn1', name: 'component.valveoutput1.name', type: ComponentType.Connector, x: 40, y: 150, width: 30, height: 50, color: 'bg-gray-500', thermalHotspot: false },
      { id: 'it_conn2', name: 'component.valveoutput2.name', type: ComponentType.Connector, x: 100, y: 150, width: 30, height: 50, color: 'bg-gray-500', thermalHotspot: false },
    ],
  },
  {
    id: 'drone_monitor',
    nameKey: 'preset.drone_monitor.name',
    descriptionKey: 'preset.drone_monitor.description',
    components: [
      { id: 'dm_mcu', name: 'component.flightctrl.name', type: ComponentType.Microcontroller, x: 80, y: 80, width: 70, height: 70, color: 'bg-green-700', thermalHotspot: true },
      { id: 'dm_sensor_cam', name: 'component.cameraif.name', type: ComponentType.Sensor, x: 30, y: 40, width: 40, height: 30, color: 'bg-blue-700', thermalHotspot: false },
      { id: 'dm_power_esc', name: 'component.escpower.name', type: ComponentType.PowerIC, x: 150, y: 150, width: 60, height: 40, color: 'bg-red-700', thermalHotspot: true },
      { id: 'dm_gps', name: 'component.gpsmodule.name', type: ComponentType.Sensor, x: 180, y: 50, width: 50, height: 50, color: 'bg-purple-600', thermalHotspot: false },
    ],
  },
];
// Note: You'll need to add keys like "component.tinymcu.name": "TinyMCU" to your en.json and its translations.

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

export const CARAMEL_AVATAR_URL = 'https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/caramel.jpeg';
export const CARAMEL_FACE_URL = 'https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/caramel-face.jpeg';
