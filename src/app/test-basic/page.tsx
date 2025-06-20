"use client";

export default function TestBasic() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-blue-600">Test Basic Tailwind</h1>
      <p className="mt-4 text-gray-600">This tests if basic Tailwind classes work</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Basic Button
      </button>
      
      <div className="mt-8 p-4 border-4 border-blue-500 rounded-lg">
        <p>This has a thick blue border</p>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Testing Guardian Styles:</h2>
        <h3 className="guardian-heading-3">Guardian Heading 3</h3>
        <button className="guardian-button-primary">Guardian Primary</button>
      </div>
    </div>
  );
}