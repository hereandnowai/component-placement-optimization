import React, { useState } from 'react';
import { Preset, ComponentType } from '../types';
import { Button } from './common/Button';
import { useLocalization } from '../contexts/LocalizationContext';

interface ControlsPanelProps {
  presets: Preset[];
  selectedPresetId: string;
  onPresetChange: (id: string) => void;
  onAddComponent: (type: ComponentType, name: string) => void;
  onOptimizeThermal: () => void;
  onRunSignalIntegrity: () => void;
  onAiAutoPlace: () => void;
  onAnalyzePowerPaths: () => void;
  onExportToEda: () => void;
  onSaveVersion: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  presets,
  selectedPresetId,
  onPresetChange,
  onAddComponent,
  onOptimizeThermal,
  onRunSignalIntegrity,
  onAiAutoPlace,
  onAnalyzePowerPaths,
  onExportToEda,
  onSaveVersion
}) => {
  const { t } = useLocalization();
  const [newComponentName, setNewComponentName] = useState('');
  const [newComponentType, setNewComponentType] = useState<ComponentType>(ComponentType.Microcontroller);

  const handleAddComponentClick = () => {
    if (newComponentType) {
      // Default name is the translated component type if no name is provided
      const defaultName = t(`componentType.${newComponentType.toLowerCase()}`, {defaultValue: `New ${newComponentType}`});
      onAddComponent(newComponentType, newComponentName || defaultName);
      setNewComponentName('');
    }
  };
  
  const selectedPresetDetails = presets.find(p => p.id === selectedPresetId);

  return (
    <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
      <h2 className="text-xl font-semibold text-secondary dark:text-primary border-b border-gray-300 dark:border-gray-700 pb-2">{t('controlsPanel.title')}</h2>

      <div>
        <label htmlFor="preset-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('controlsPanel.presets.title')}</label>
        <select
          id="preset-select"
          value={selectedPresetId}
          onChange={(e) => onPresetChange(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {presets.map(preset => (
            <option key={preset.id} value={preset.id}>{t(preset.nameKey)}</option>
          ))}
        </select>
        {selectedPresetDetails && <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">{t(selectedPresetDetails.descriptionKey)}</p>}
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">{t('controlsPanel.manualAddition.title')}</h3>
        <div>
          <label htmlFor="component-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('controlsPanel.componentType.label')}</label>
          <select
            id="component-type"
            value={newComponentType}
            onChange={(e) => setNewComponentType(e.target.value as ComponentType)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {Object.values(ComponentType).map(type => (
              <option key={type} value={type}>{t(`componentType.${type.toLowerCase()}`, {defaultValue: type})}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="component-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('controlsPanel.componentName.label')}</label>
          <input
            type="text"
            id="component-name"
            value={newComponentName}
            onChange={(e) => setNewComponentName(e.target.value)}
            placeholder={t('controlsPanel.componentName.placeholder', {defaultValue: 'e.g., Main MCU, Temp Sensor'})}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <Button onClick={handleAddComponentClick} variant="secondary" className="w-full">
          {t('controlsPanel.addComponent.button')}
        </Button>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">{t('controlsPanel.aiOptimization.title')}</h3>
        <Button onClick={onAiAutoPlace} className="w-full">{t('controlsPanel.aiAutoPlace.button')}</Button>
        <Button onClick={onOptimizeThermal} className="w-full">{t('controlsPanel.optimizeThermal.button')}</Button>
        <Button onClick={onRunSignalIntegrity} className="w-full">{t('controlsPanel.runSignalIntegrity.button')}</Button>
        <Button onClick={onAnalyzePowerPaths} className="w-full">{t('controlsPanel.analyzePowerPaths.button')}</Button>
      </div>
      
      <div className="space-y-3 pt-4 border-t border-gray-300 dark:border-gray-700">
         <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">{t('controlsPanel.projectActions.title')}</h3>
        <Button onClick={onSaveVersion} variant="outline" className="w-full">{t('controlsPanel.saveVersion.button')}</Button>
        <Button onClick={onExportToEda} variant="outline" className="w-full">{t('controlsPanel.exportToEda.button')}</Button>
      </div>

       <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('controlsPanel.hints.title')}</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
            <li>{t('controlsPanel.hint.autoPlace')}</li>
            <li>{t('controlsPanel.hint.addComponent')}</li>
            <li>{t('controlsPanel.hint.placeNear')}</li>
            <li>{t('controlsPanel.hint.optimizeThermal')}</li>
            <li>{t('controlsPanel.hint.signalIntegrity')}</li>
            <li>{t('controlsPanel.hint.powerPaths')}</li>
            <li>{t('controlsPanel.hint.clearPcb')}</li>
            <li>{t('controlsPanel.hint.askGeneral')}</li>
        </ul>
      </div>
    </div>
  );
};