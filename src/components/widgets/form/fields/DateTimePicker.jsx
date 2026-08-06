import React from 'react';
import FieldLabel from '@/components/widgets/form/fields/FieldLabel'
export default function DateTimePicker({
  mode = 'datetime', // 'date', 'time', ou 'datetime'
  field,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  labelWidth = "w-1/3", // Permet d'aligner parfaitement plusieurs labels si besoin
  className = ""
}) {
  
  const getInputType = () => {
    switch (mode) {
      case 'date': return 'date';
      case 'time': return 'time';
      case 'datetime': return 'datetime-local';
      default: return 'datetime-local';
    }
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {/* Conteneur principal en ligne (Label à gauche, Input à droite) */}
      <div className="flex items-center space-x-4 py-2">
        
        {/* Label à gauche */}
        <FieldLabel id={field.fieldName} label={field.label} required={field.mandatory} />
        {/* Input sans cadre à droite (prend tout le reste de l'espace) */}
        <div className="flex-1 relative group">
          <input
            type={getInputType()}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            disabled={disabled}
            required={required}
            className={`
              w-full py-1 bg-transparent text-gray-800 outline-none
              font-sans text-base transition-all duration-200
              border-b-2
              ${disabled 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed border-dashed' 
                : error 
                  ? 'border-red-400 focus:border-red-600' 
                  : 'border-gray-200 focus:border-blue-600'
              }
            `}
          />
          
          {/* Ligne d'accentuation animée sous l'input */}
          {!disabled && !error && (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-focus-within:w-full" />
          )}
          {!disabled && error && (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-focus-within:w-full" />
          )}
        </div>
      </div>

      {/* Message d'erreur déporté en bas (aligné sur l'input pour rester propre) */}
      {error && (
        <div className="flex">
          <div className={`${labelWidth} space-x-4`} /> {/* Décalage invisible */}
          <p className="text-xs text-red-500 font-medium pl-4 mt-0.5">{error}</p>
        </div>
      )}
    </div>
  );
}