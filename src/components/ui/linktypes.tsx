import React from 'react';


const mainBackground = '#272b4d';

export type TreeChartProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export const TreeChart = ({
  width: totalWidth,
  height: totalHeight,
}: TreeChartProps) => {
  // Temporarily disabled due to complex @visx type conflicts
  // This chart component will be re-enabled once the type issues are resolved
  return (
    <div 
      style={{ 
        width: totalWidth, 
        height: totalHeight, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: mainBackground,
        borderRadius: '14px',
        color: 'white',
        fontSize: '14px'
      }}
    >
      Tree Chart (Temporarily Disabled)
    </div>
  );
};