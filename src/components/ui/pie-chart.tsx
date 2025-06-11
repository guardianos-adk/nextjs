import React from 'react';

export type PieChartProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  animate?: boolean;
};

export const PieChart = ({
  width,
  height,
}: PieChartProps) => {
  // Temporarily disabled due to complex @visx type conflicts
  // This chart component will be re-enabled once the type issues are resolved
  return (
    <div 
      style={{ 
        width, 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'linear-gradient(45deg, #ff6b9d, #c44569)',
        borderRadius: '14px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      Pie Chart (Temporarily Disabled)
    </div>
  );
};