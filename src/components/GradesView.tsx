import { useState } from 'react';
import { Award, Plus, Sparkles, TrendingUp, Sliders, Check, AlertOctagon } from 'lucide-react';
import { Student } from '../types';
import { calculatePercentile } from '../utils';

interface GradesViewProps {
  students: Student[];
  onUpdateMarks: (id: string, marks: number) => void;
  onApplyCurve: (amount: number) => void;
}

export default function GradesView({ students, onUpdateMarks, onApplyCurve }: GradesViewProps) {
  const [filter, setFilter] = useState<'all' | 'pass' | 'fail'>('all');
  const [curveValue, setCurveValue] = useState<number>(5);

  const filteredStudents = students.filter(student => {
    if (filter === 'pass') return student.marks >= 50;
    if (filter === 'fail') return student.marks < 50;
    return true;
  });

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b-2 border-[#353535] pb-6">
        <div>
          <h2 className="font-display font-black text-5xl md:text-6xl text-[#f2b2eb] transform -skew-x-6 tracking-tight leading-none">
            Grade Sheets
          </h2>
          <p className="font-sans text-lg text-gray-400 mt-2 ml-2">
            Fine-tune scores and inject custom curves into the system.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Dynamic Curve Controller */}
        <section className="lg:col-span-4 bg-surface-high p-6 border-2 border-[#f2b2eb] brutal-shadow-secondary transform -rotate-1 flex flex-col gap-6">
          <div>
            <h3 className="font-display font-black text-2xl text-[#f2b2eb] uppercase tracking-wider mb-2">
              Curve Injector
            </h3>
            <p className="font-sans text-xs text-gray-400">
              Increase or decrease scores for the entire roster in a single strike.
            </p>
          </div>

          <div className="flex flex-col gap-4 font-mono text-xs">
            <div className="flex justify-between items-center bg-[#131313] p-3 border border-gray-800 rounded">
              <span>Amount:</span>
              <span className="text-[#c3f400] font-bold text-lg">+{curveValue} Marks</span>
            </div>

            {/* Range slider for curve */}
            <input
              id="curve-range-slider"
              type="range"
              min="1"
              max="20"
              value={curveValue}
              onChange={(e) => setCurveValue(parseInt(e.target.value, 10))}
              className="w-full accent-[#c3f400] bg-gray-800 rounded h-2 cursor-pointer"
            />

            <button
              id="inject-curve-btn"
              onClick={() => onApplyCurve(curveValue)}
              disabled={students.length === 0}
              className="w-full bg-[#c3f400] text-black border-2 border-black font-display font-black text-sm py-3 px-4 uppercase brutal-shadow-dark hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Inject Curve Boost
            </button>
            
            <button
              id="inject-decrement-btn"
              onClick={() => onApplyCurve(-curveValue)}
              disabled={students.length === 0}
              className="w-full bg-transparent border-2 border-red-400 text-red-400 font-display font-black text-sm py-2.5 px-4 uppercase hover:bg-red-950/10 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Impose Chaos Penalty (-{curveValue})
            </button>
          </div>
        </section>

        {/* Right Side: Detailed Table with Range Sliders */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-3 font-mono text-xs">
            <button
              id="filter-all-btn"
              onClick={() => setFilter('all')}
              className={`px-4 py-2 border-2 border-black rounded transition-all ${
                filter === 'all' 
                  ? 'bg-[#f2b2eb] text-black font-bold -translate-y-0.5 shadow-[2px_2px_0px_0px_#c3f400]' 
                  : 'bg-surface-container text-gray-300 hover:text-white'
              }`}
            >
              All Recruits ({students.length})
            </button>
            <button
              id="filter-pass-btn"
              onClick={() => setFilter('pass')}
              className={`px-4 py-2 border-2 border-black rounded transition-all ${
                filter === 'pass' 
                  ? 'bg-[#c3f400] text-black font-bold -translate-y-0.5 shadow-[2px_2px_0px_0px_#f2b2eb]' 
                  : 'bg-surface-container text-gray-300 hover:text-white'
              }`}
            >
              Passing Scores ({students.filter(s => s.marks >= 50).length})
            </button>
            <button
              id="filter-fail-btn"
              onClick={() => setFilter('fail')}
              className={`px-4 py-2 border-2 border-black rounded transition-all ${
                filter === 'fail' 
                  ? 'bg-red-400 text-black font-bold -translate-y-0.5 shadow-[2px_2px_0px_0px_#f2b2eb]' 
                  : 'bg-surface-container text-gray-300 hover:text-white'
              }`}
            >
              Failing Scores ({students.filter(s => s.marks < 50).length})
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-surface-container border-2 border-gray-700 rounded p-6 brutal-shadow-primary transform rotate-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-800 text-gray-400 font-mono text-xs uppercase">
                    <th className="py-3 px-2">Roll</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Adjust Score</th>
                    <th className="py-3 px-4 text-center">Value</th>
                    <th className="py-3 px-4 text-center">JEE %ile</th>
                    <th className="py-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500 font-mono text-xs">
                        No students fit this academic threshold.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const isPassing = student.marks >= 50;
                      return (
                        <tr 
                          key={student.id} 
                          className="border-b border-gray-800/60 hover:bg-surface-high/40 transition-colors"
                        >
                          {/* Roll */}
                          <td className="py-4 px-2 font-mono text-xs text-[#f2b2eb]">
                            #{student.roll}
                          </td>
                          {/* Name */}
                          <td className="py-4 px-4 font-display font-bold text-base text-white">
                            {student.name}
                          </td>
                          {/* Adjust Slider */}
                          <td className="py-4 px-4 min-w-[150px]">
                            <div className="flex items-center gap-3">
                              <Sliders className="w-4 h-4 text-gray-500 hidden sm:block" />
                              <input
                                id={`score-slider-${student.id}`}
                                type="range"
                                min="0"
                                max="100"
                                value={student.marks}
                                onChange={(e) => onUpdateMarks(student.id, parseInt(e.target.value, 10))}
                                className="w-full accent-[#f2b2eb] bg-gray-800 rounded h-1.5 cursor-pointer"
                              />
                            </div>
                          </td>
                          {/* Value Input Box */}
                          <td className="py-4 px-4 text-center">
                            <input
                              id={`score-input-${student.id}`}
                              type="number"
                              min="0"
                              max="100"
                              value={student.marks}
                              onChange={(e) => {
                                const val = Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0));
                                onUpdateMarks(student.id, val);
                              }}
                              className="w-14 bg-[#131313] border border-gray-700 text-[#c3f400] text-center font-mono text-xs font-bold py-1 rounded focus:outline-none focus:border-[#c3f400]"
                            />
                          </td>
                          {/* Real-time Percentile */}
                          <td className="py-4 px-4 text-center font-mono text-xs font-semibold text-[#c3f400]">
                            {calculatePercentile(student.marks, students).toFixed(4)}%
                          </td>
                          {/* Status */}
                          <td className="py-4 px-2 text-right">
                            {isPassing ? (
                              <span className="inline-flex items-center gap-1 bg-[#c3f400]/15 text-[#c3f400] font-mono text-[10px] font-bold px-2 py-0.5 border border-[#c3f400]/40 rounded-full uppercase">
                                <Check className="w-3 h-3" />
                                PASS
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-400 font-mono text-[10px] font-bold px-2 py-0.5 border border-red-500/40 rounded-full uppercase">
                                <AlertOctagon className="w-3 h-3" />
                                FAIL
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
