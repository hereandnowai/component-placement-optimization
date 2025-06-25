
import React from 'react';
import { Component as PcbComponentType, PcbLayout } from '../types';
import { DraggableComponent } from './DraggableComponent';
import { useLocalization } from '../contexts/LocalizationContext';

interface PcbViewProps {
  components: PcbComponentType[];
  onUpdateComponentPosition: (id: string, x: number, y: number) => void;
  onLockComponent: (id: string) => void;
  layout: PcbLayout | null; 
  onSensorComponentClick: (component: PcbComponentType) => void;
}

export const PcbView: React.FC<PcbViewProps> = ({ components, onUpdateComponentPosition, onLockComponent, layout, onSensorComponentClick }) => {
  const { t } = useLocalization();
  const pcbWidth = 500;
  const pcbHeight = 350;

  return (
    <div className="flex-grow bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {layout && (
        <h2 className="text-xl font-semibold mb-2 text-secondary dark:text-primary self-start">
          {t('pcbView.currentLayout', { layoutName: layout.name })}
        </h2>
      )}
      {!layout && (
         <h2 className="text-xl font-semibold mb-2 text-secondary dark:text-primary self-start">
          {t('pcbView.designArea')}
        </h2>
      )}
      <div 
        className="bg-green-200 dark:bg-green-900 border-2 border-green-400 dark:border-green-700 rounded relative shadow-inner"
        style={{ width: `${pcbWidth}px`, height: `${pcbHeight}px` }}
      >
        {components.map((component) => (
          <DraggableComponent
            key={component.id}
            component={component}
            onUpdatePosition={onUpdateComponentPosition}
            onLockComponent={onLockComponent}
            boundary={{ top: 0, left: 0, right: pcbWidth - component.width, bottom: pcbHeight - component.height }}
            onClick={component.id === 'ss_sensor' ? onSensorComponentClick : undefined}
          />
        ))}
        {components.some(c => c.thermalHotspot) && (
           <div className="absolute inset-0 pointer-events-none opacity-30">
            {components.filter(c => c.thermalHotspot).map(c => (
              <div
                key={`heat-${c.id}`}
                className="absolute bg-red-500 rounded-full blur-lg"
                style={{
                  left: `${c.x + c.width / 2 - 25}px`,
                  top: `${c.y + c.height / 2 - 25}px`,
                  width: '50px',
                  height: '50px',
                  opacity: 0.8
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
       <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        {t('pcbView.boardDimensions', { width: String(pcbWidth), height: String(pcbHeight) })}
      </div>
    </div>
  );
};
