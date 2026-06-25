import { Sparkles, Printer, FileText, FileDown, ShieldAlert, BadgeInfo, BarChart2 } from 'lucide-react';
import { Student } from '../types';
import { calculatePercentile } from '../utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface ReportsViewProps {
  students: Student[];
}

// Custom Tooltip for the Neo-Brutalist look
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#131313] border-2 border-[#f2b2eb] p-3 font-mono text-xs shadow-[3px_3px_0px_0px_#c3f400] text-white">
        <p className="font-bold font-display text-sm text-[#f2b2eb] mb-1">{data.name}</p>
        <p className="text-gray-400">Roll No: #{data.roll}</p>
        <p className="text-[#c3f400] font-bold">Marks: {data.score} / 100</p>
      </div>
    );
  }
  return null;
};

export default function ReportsView({ students }: ReportsViewProps) {
  
  // Custom funny academic evaluations based on score ranges
  const getEvaluationComment = (marks: number, name: string) => {
    if (marks >= 90) {
      return `Outstanding academic capability. ${name} exhibits incredible intellectual power, though they frequently demand to rewrite the exam rules on the grounds of existential freedom. Absolute class mastermind.`;
    }
    if (marks >= 75) {
      return `Very strong performance. ${name} operates at a high level, maintaining a perfect balance between grade optimization and healthy classroom sabotage. Highly trusted inside operations.`;
    }
    if (marks >= 50) {
      return `Passable standing. ${name} understands the curriculum but seems primarily motivated by whatever tea or chaotic event is scheduled for the afternoon. Decent survival tactics.`;
    }
    return `Catastrophic score metrics. ${name} has declared total war on modern scoring frameworks. While their academic metrics are critically low, their capability to organize strategic tea-party walkouts remains unparalleled.`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-10 print:p-8 print:bg-white print:text-black">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b-2 border-[#353535] pb-6 print:border-black print:pb-4">
        <div>
          <h2 className="font-display font-black text-5xl md:text-6xl text-[#f2b2eb] transform -skew-x-6 tracking-tight leading-none print:text-black print:transform-none">
            Academic Slates
          </h2>
          <p className="font-sans text-lg text-gray-400 mt-2 ml-2 print:text-black">
            Individually stamped official evaluations of academic performance.
          </p>
        </div>

        {/* Buttons (Hidden in print) */}
        <div className="flex gap-3 print:hidden">
          <button
            id="print-btn"
            onClick={handlePrint}
            disabled={students.length === 0}
            className="flex items-center gap-2 bg-[#f2b2eb] text-black border-2 border-black px-5 py-3 rounded font-display font-black text-sm uppercase brutal-shadow-dark hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-40 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Slates
          </button>
        </div>
      </header>

      {/* Roster Mark Distribution Chart (Hidden in Print for high contrast simplicity) */}
      {students.length > 0 && (
        <section className="print:hidden bg-surface-container border-2 border-[#f2b2eb] p-6 rounded brutal-shadow-secondary flex flex-col gap-6 transform rotate-0.5">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2.5">
              <BarChart2 className="w-5 h-5 text-[#c3f400]" />
              <h3 className="font-display font-black text-2xl text-white uppercase tracking-wider">
                Academic Curve Matrix
              </h3>
            </div>
            <span className="font-mono text-[10px] text-gray-400">JEE-STYLE COMPARATIVE SPREAD</span>
          </div>

          <div className="w-full h-64 md:h-80 font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[...students].reverse().map(s => ({ name: s.name, score: s.marks, roll: s.roll }))} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9a8d96" 
                  tickLine={false}
                  tick={{ fill: '#e5e2e1', fontSize: 10 }}
                />
                <YAxis 
                  stroke="#9a8d96" 
                  domain={[0, 100]}
                  tickLine={false}
                  tick={{ fill: '#e5e2e1', fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(242, 178, 235, 0.05)' }} />
                <Bar dataKey="score" radius={[2, 2, 0, 0]} barSize={40}>
                  {[...students].reverse().map((entry, index) => {
                    let barColor = '#c3f400'; // Lime
                    if (entry.marks < 50) {
                      barColor = '#ffb4ab'; // Soft red
                    } else if (entry.marks < 75) {
                      barColor = '#ffd6f8'; // Soft pink
                    }
                    return <Cell key={`cell-${index}`} fill={barColor} stroke="#131313" strokeWidth={1} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Roster evaluation summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {students.length === 0 ? (
          <div className="col-span-2 bg-surface-container p-12 border-2 border-dashed border-gray-700 text-center rounded brutal-shadow-primary print:border-black">
            <p className="font-display font-bold text-xl text-[#f2b2eb] mb-2 print:text-black">
              No slates generated.
            </p>
            <p className="font-mono text-xs text-gray-400 print:text-black">
              Add student records in the Roster panel to compile official reports.
            </p>
          </div>
        ) : (
          students.map((student, idx) => {
            const evaluation = getEvaluationComment(student.marks, student.name);
            const isEven = idx % 2 === 0;
            const rotClass = isEven ? 'rotate-1' : '-rotate-1';
            const shadowClass = isEven ? 'brutal-shadow-primary' : 'brutal-shadow-secondary';
            
            let statusLabel = 'Anarchy Class Master';
            let statusColor = 'text-[#c3f400] border-[#c3f400]';
            if (student.marks < 50) {
              statusLabel = 'Critical Non-Conformist';
              statusColor = 'text-red-400 border-red-400';
            } else if (student.marks < 75) {
              statusLabel = 'Ambivalent Scholar';
              statusColor = 'text-[#ffd6f8] border-[#ffd6f8]';
            }

            return (
              <div
                key={student.id}
                className={`bg-surface-container p-6 border-2 border-gray-700 rounded flex flex-col gap-5 justify-between ${rotClass} ${shadowClass} print:rotate-0 print:shadow-none print:border-black print:bg-white`}
              >
                {/* Stamp header */}
                <div className="flex justify-between items-start border-b border-gray-800 pb-3 print:border-black">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-[#f2b2eb] print:text-black" />
                    <div>
                      <h4 className="font-display font-bold text-base text-white print:text-black">
                        CHAOS REPORT
                      </h4>
                      <p className="font-mono text-[9px] text-gray-500 uppercase">
                        Ref: SCHOLAR-#00{student.roll}
                      </p>
                    </div>
                  </div>
                  <div className={`font-mono text-[9px] font-bold px-2 py-0.5 border rounded uppercase ${statusColor} print:text-black print:border-black`}>
                    {statusLabel}
                  </div>
                </div>

                {/* Core student details */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-display font-black text-2xl text-white print:text-black">
                      {student.name}
                    </span>
                    <span className="font-mono text-xs text-gray-500">Roll: {student.roll}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-[#c3f400] print:text-black mt-1">
                    <div className="flex items-center gap-1.5">
                      <span>Performance Rating:</span>
                      <span className="font-bold border border-black bg-black text-[#c3f400] px-1.5 py-0.5 rounded print:border-black print:bg-transparent">
                        {student.marks} / 100
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#f2b2eb] print:text-black">
                      <span>JEE Percentile:</span>
                      <span className="font-bold border border-black bg-black text-[#f2b2eb] px-1.5 py-0.5 rounded print:border-black print:bg-transparent">
                        {calculatePercentile(student.marks, students).toFixed(4)} %ile
                      </span>
                    </div>
                  </div>
                </div>

                {/* Official Commentary */}
                <div className="bg-[#131313] p-4 border border-gray-800 rounded font-sans text-xs leading-relaxed text-gray-300 italic print:bg-white print:border-black print:text-black">
                  "{evaluation}"
                </div>

                {/* Footstamp */}
                <div className="flex justify-between items-center text-[9px] font-mono text-gray-600 print:text-black border-t border-gray-900 pt-3 print:border-black">
                  <span>STAMP: OFFICIAL ANARCHY RECORD</span>
                  <span>VERIFIED: 100% RAW DATA</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Actionable notice card */}
      <div className="bg-surface-high p-5 border-2 border-[#f7511c] rounded brutal-shadow-accent mt-8 print:hidden flex items-start gap-4 transform rotate-1">
        <BadgeInfo className="w-6 h-6 text-[#f7511c] flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <h4 className="font-display font-bold text-[#f7511c] text-base">Legal Subservience &amp; Academic Printing</h4>
          <p className="font-sans text-xs text-gray-400">
            Clicking "Print Slates" utilizes the browser's native viewport print mode. Custom stylesheets will optimize the cards to fit portrait sheets cleanly with pure high contrast black-on-white designs.
          </p>
        </div>
      </div>
    </div>
  );
}
