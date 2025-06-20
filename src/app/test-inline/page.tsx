"use client";

export default function TestInline() {
  return (
    <div className="p-8">
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 700,
        letterSpacing: '-0.025em',
        fontFamily: 'Merriweather, Georgia, serif',
        lineHeight: 1.1,
        color: 'oklch(0.71 0.14 221.71)'
      }}>
        Guardian Heading with Inline Styles
      </h1>
      
      <div style={{
        marginTop: '2rem',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--card)',
        borderRadius: '0.5rem',
        border: '3px solid oklch(0.71 0.14 221.71)',
        boxShadow: '0 10px 15px -3px rgba(79, 172, 254, 0.1), 0 4px 6px -2px rgba(79, 172, 254, 0.05)',
        padding: '1.5rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <h3 className="text-xl font-bold mb-2">Guardian Card with Inline Styles</h3>
        <p>This card has thick blue borders using inline styles</p>
      </div>
      
      <button style={{
        marginTop: '2rem',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontWeight: 600,
        color: 'white',
        backgroundColor: 'oklch(0.71 0.14 221.71)',
        border: '3px solid transparent',
        boxShadow: '0 10px 15px -3px rgba(79, 172, 254, 0.1), 0 4px 6px -2px rgba(79, 172, 254, 0.05)',
        cursor: 'pointer',
        transition: 'all 200ms'
      }}>
        Guardian Primary Button (Inline)
      </button>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Using Tailwind Utilities Directly:</h2>
        <div className="relative overflow-hidden bg-card rounded-lg p-6" 
             style={{border: '3px solid oklch(0.71 0.14 221.71)'}}>
          <h3 className="text-xl font-bold">Mixed Approach</h3>
          <p className="mt-2 text-muted-foreground">Using Tailwind classes with inline border</p>
        </div>
      </div>
    </div>
  );
}