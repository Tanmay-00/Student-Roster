import { useState } from 'react';
import { ChevronDown, Sparkles, HelpCircle as HelpIcon } from 'lucide-react';

export default function HelpView() {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const faqs = [
    {
      category: "Operations",
      question: "How do I inject students into the system?",
      answer: "Navigate to the 'Students' segment from the sidebar. Under the 'New Recruit' card, fill in the Roll Number (e.g., 001), Full Name, and current academic Marks out of 100. Strike the pink 'Inject Data' button, and observe the recruit pop directly into 'The Roster' live feed!"
    },
    {
      category: "Theory",
      question: "What is the Anarchy Index?",
      answer: "The Anarchy Index is a highly specialized metric calculated in real time. It monitors the class grade average and the total headcount of active recruits. Lower class averages combined with higher headcounts will drive the Anarchy Index up, signaling an absolute triumph of academic liberty."
    },
    {
      category: "Aesthetics",
      question: "Why is the interface tilted, skewed, and wobbly?",
      answer: "This application strictly adheres to the principles of Neo-Brutalist design. Flat high-contrast colors, thick outlines, heavy drop shadows, and deliberate asymmetrical skews represent the natural chaos of human learning. It is visually bold and structurally honest."
    },
    {
      category: "Grades",
      question: "How does the Curve Injector function?",
      answer: "The Curve Injector is located in the 'Grades' tab. Drag the range slider to select a boost factor, and click 'Inject Curve Boost' to immediately raise scores across the entire roster! Alternatively, click 'Chaos Penalty' to impose penalties and simulate academic discipline. Updates reflect across all screens immediately."
    }
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b-2 border-[#353535] pb-6">
        <div>
          <h2 className="font-display font-black text-5xl md:text-6xl text-[#f2b2eb] transform -skew-x-6 tracking-tight leading-none">
            Help Desk
          </h2>
          <p className="font-sans text-lg text-gray-400 mt-2 ml-2">
            Answers to your queries on managing our academic battlefield.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: General Overview */}
        <section className="lg:col-span-4 bg-surface-high p-6 border-2 border-[#c3f400] brutal-shadow-primary transform -rotate-1 flex flex-col gap-5">
          <div className="w-12 h-12 bg-black border-2 border-[#c3f400] rounded-full flex items-center justify-center brutal-shadow-primary mb-2">
            <HelpIcon className="w-6 h-6 text-[#c3f400]" />
          </div>
          <h3 className="font-display font-black text-2xl text-white uppercase tracking-wider">
            Academic Guide
          </h3>
          <p className="font-sans text-sm text-gray-300 leading-relaxed">
            Welcome to the Scholarly Chaos help center. This administration system was designed to assist you in managing classroom rosters without sacrificing the vibrant spirit of educational subversion.
          </p>
          <div className="bg-[#131313] p-4 border border-gray-800 rounded font-mono text-xs text-gray-400">
            <span className="text-[#f2b2eb] font-bold">System Status:</span> Operational<br />
            <span className="text-[#c3f400] font-bold">Chaos Level:</span> Optimal<br />
            <span className="text-[#f7511c] font-bold">Protocol:</span> Active
          </div>
        </section>

        {/* Right Side: Interactive Accordion FAQs */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <h3 className="font-display font-bold text-2xl text-white pl-1 mb-2">Frequently Questions</h3>
          
          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isExpanded = expandedIndex === index;
              const isEven = index % 2 === 0;
              const rotClass = isEven ? 'rotate-0.5' : '-rotate-0.5';
              const borderHighlight = isExpanded ? 'border-[#c3f400]' : 'border-gray-800';

              return (
                <div
                  key={index}
                  className={`bg-surface-container border-2 ${borderHighlight} rounded transition-all duration-300 ${rotClass}`}
                >
                  <button
                    id={`faq-btn-${index}`}
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="w-full flex justify-between items-center p-5 text-left font-display font-extrabold text-base md:text-lg text-white hover:text-[#c3f400] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs bg-[#131313] text-gray-500 px-2.5 py-1 border border-gray-800 rounded uppercase">
                        {faq.category}
                      </span>
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'transform rotate-180 text-[#c3f400]' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-800 pt-4 bg-black/20">
                      <p className="font-sans text-sm text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Retro Alert Banner */}
      <div className="bg-[#3e103f] p-5 border-2 border-[#f2b2eb] rounded brutal-shadow-primary transform rotate-0.5 mt-8 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-[#f2b2eb]" />
        <span className="font-mono text-xs text-purple-200">
          Tip: Use the Curve Injector inside the Grades tab to save a failing class instantly before exams start!
        </span>
      </div>
    </div>
  );
}
