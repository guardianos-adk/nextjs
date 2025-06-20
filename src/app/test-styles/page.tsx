"use client";

export default function TestStyles() {
  return (
    <div className="p-8">
      <h1 className="guardian-heading-1">Guardian Heading 1</h1>
      <h2 className="guardian-heading-2">Guardian Heading 2</h2>
      <h3 className="guardian-heading-3">Guardian Heading 3</h3>
      <h4 className="guardian-heading-4">Guardian Heading 4</h4>
      
      <div className="mt-8 space-y-4">
        <button className="guardian-button-primary">Primary Button</button>
        <button className="guardian-button-secondary">Secondary Button</button>
      </div>
      
      <div className="mt-8">
        <div className="guardian-card p-6">
          <h3 className="text-xl font-bold mb-2">Guardian Card</h3>
          <p>This is a guardian card with thick blue borders</p>
        </div>
      </div>
      
      <div className="mt-8">
        <span className="guardian-badge">Guardian Badge</span>
      </div>
      
      <div className="mt-8">
        <p className="guardian-body">This is guardian body text with Inter font</p>
        <p className="guardian-body-large">This is large guardian body text</p>
      </div>
      
      <div className="mt-8">
        <p className="guardian-emphasis">This is emphasized text</p>
        <p className="guardian-emphasis-primary">This is primary emphasized text in blue</p>
      </div>
    </div>
  );
}