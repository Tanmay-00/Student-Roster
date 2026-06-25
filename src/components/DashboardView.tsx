import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Sparkles, 
  Skull, 
  Compass, 
  Plus,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import { Student, ChaosMetric, ChaosLog } from '../types';

interface DashboardViewProps {
  students: Student[];
  setActiveScreen: (screen: 'dashboard' | 'students' | 'grades' | 'reports' | 'help') => void;
}

export default function DashboardView({ students, setActiveScreen }: DashboardViewProps) {
  const [logs, setLogs] = useState<ChaosLog[]>([
    { id: '1', time: '10:42 AM', event: 'Alice questioned the rules of spatial geometry in geometry class, causing the whiteboard to tilt 15 degrees.', severity: 'moderate' },
    { id: '2', time: '09:15 AM', event: 'Mad Hatter started a tea-brewing operation inside the chemistry bunsen burner zone.', severity: 'catastrophic' },
    { id: '3', time: 'Yesterday', event: 'Chess club attempted to march in L-shapes down the main corridor. Minor collision with lunch trays.', severity: 'mild' },
  ]);

  const [average, setAverage] = useState(0);

  useEffect(() => {
    if (students.length === 0) {
      setAverage(0);
      return;
    }
    const sum = students.reduce((acc, curr) => acc + curr.marks, 0);
    setAverage(Math.round(sum / students.length));
  }, [students]);

  const triggerChaosEvent = () => {
    const events = [
      'A clock in the east wing started ticking counter-clockwise, accelerating homework deadlines.',
      'A swarm of origami paper cranes declared autonomy and flew out of the study hall.',
      'The school library rearranged books by "vibe" instead of Dewey Decimal, causing existential searches.',
      'Students successfully negotiated extra credit by presenting a multi-layered PowerPoint on why grades are constructs.',
      'A mysterious fog swept through detention, temporarily turning the blackboard into a portal to wonderland.',
      'Mad Hatter hosted an unscheduled un-birthday party during standard calculus examinations.'
    ];

    const severities: ('mild' | 'moderate' | 'catastrophic')[] = ['mild', 'moderate', 'catastrophic'];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog: ChaosLog = {
      id: Date.now().toString(),
      time: timeStr,
      event: randomEvent,
      severity: randomSeverity,
    };

    setLogs(prev => [newLog, ...prev]);
  };

  // Dynamic Metrics
  const metrics: ChaosMetric[] = [
    {
      title: "Class Average",
      value: `${average}%`,
      subtext: students.length === 0 ? "No recruits recruited" : `Calculated from ${students.length} record(s)`,
      iconName: "TrendingUp",
      color: "border-[#f2b2eb] text-[#f2b2eb]",
    },
    {
      title: "Anarchy Index",
      value: students.length === 0 ? "Low" : `${Math.max(10, Math.min(99, Math.round((100 - average) * 1.2 + students.length * 5)))}%`,
      subtext: average > 80 ? "Subversive but quiet" : "Vibrant educational chaos",
      iconName: "Flame",
      color: "border-[#c3f400] text-[#c3f400]",
    },
    {
      title: "Suspensions Avoided",
      value: 14 + students.length * 3,
      subtext: "Diplomatic solutions deployed",
      iconName: "Compass",
      color: "border-[#f7511c] text-[#f7511c]",
    },
    {
      title: "Active Anarchists",
      value: students.length,
      subtext: "Enrolled in active learning",
      iconName: "Skull",
      color: "border-white text-white",
    }
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b-2 border-[#353535] pb-6">
        <div>
          <h2 className="font-display font-black text-5xl md:text-6xl text-[#f2b2eb] transform -skew-x-6 tracking-tight leading-none">
            Anarchy Dashboard
          </h2>
          <p className="font-sans text-lg text-gray-400 mt-2 ml-2">
            Real-time diagnostics of the educational battlefield.
          </p>
        </div>
        
        {/* Quick actions bar */}
        <button
          id="chaos-incident-btn"
          onClick={triggerChaosEvent}
          className="flex items-center gap-2 bg-[#f7511c] text-white border-2 border-black px-5 py-3 rounded font-display font-black text-sm uppercase brutal-shadow-primary hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
        >
          <Flame className="w-4 h-4 fill-white" />
          Trigger Chaos Event
        </button>
      </header>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={metric.title}
              className={`bg-surface-container p-6 border-2 border-gray-700 rounded ${metric.color} ${
                isEven ? 'rotate-1 brutal-shadow-primary' : '-rotate-1 brutal-shadow-secondary'
              } transition-transform hover:scale-105 duration-200`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-gray-400">
                  {metric.title}
                </span>
                {metric.title === "Class Average" && <TrendingUp className="w-5 h-5" />}
                {metric.title === "Anarchy Index" && <Flame className="w-5 h-5" />}
                {metric.title === "Suspensions Avoided" && <Compass className="w-5 h-5" />}
                {metric.title === "Active Anarchists" && <Skull className="w-5 h-5" />}
              </div>
              <h3 className="font-display font-black text-4xl mb-2 text-white">
                {metric.value}
              </h3>
              <p className="font-sans text-xs text-gray-400">
                {metric.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main content grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Recent Chaos Incidents Logs */}
        <section className="lg:col-span-7 bg-surface-high p-6 border-2 border-[#c3f400] brutal-shadow-primary transform -rotate-1">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
            <h3 className="font-display font-black text-2xl text-[#c3f400] uppercase tracking-wider">
              Anarchy Logs
            </h3>
            <span className="bg-[#c3f400] text-black font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Live Feed
            </span>
          </div>

          <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2">
            {logs.map((log) => {
              let sevColor = 'border-blue-400 text-blue-400 bg-blue-950/10';
              if (log.severity === 'moderate') {
                sevColor = 'border-yellow-400 text-yellow-400 bg-yellow-950/10';
              } else if (log.severity === 'catastrophic') {
                sevColor = 'border-red-400 text-red-400 bg-red-950/10';
              }

              return (
                <div 
                  key={log.id} 
                  className="bg-[#131313] p-4 border border-gray-800 rounded flex flex-col sm:flex-row gap-3 items-start justify-between hover:border-gray-600 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-gray-500">{log.time}</span>
                      <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 border rounded uppercase ${sevColor}`}>
                        {log.severity}
                      </span>
                    </div>
                    <p className="font-sans text-sm text-gray-300">
                      {log.event}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Side: Quick Action Quickboard */}
        <section className="lg:col-span-5 bg-surface-high p-6 border-2 border-[#f2b2eb] brutal-shadow-secondary transform rotate-1 flex flex-col gap-5">
          <h3 className="font-display font-black text-2xl text-[#f2b2eb] uppercase tracking-wider border-b border-gray-700 pb-3">
            Portal Control
          </h3>

          <div className="flex flex-col gap-4 font-mono text-xs">
            <p className="text-gray-400 font-sans text-sm leading-relaxed mb-1">
              Select key tactical targets to influence grades or navigate to appropriate segments.
            </p>

            <button 
              id="goto-students-btn"
              onClick={() => setActiveScreen('students')}
              className="w-full bg-[#3e103f] border-2 border-[#9a8d96] text-[#f2b2eb] hover:border-[#c3f400] hover:text-[#c3f400] text-left p-4 rounded flex justify-between items-center transition-all hover:translate-x-1 cursor-pointer"
            >
              <span>Manage &amp; Recruit Students</span>
              <span className="bg-black/40 text-[#c3f400] px-2 py-0.5 rounded border border-[#c3f400]/40 font-bold">
                GO
              </span>
            </button>

            <button 
              id="goto-grades-btn"
              onClick={() => setActiveScreen('grades')}
              className="w-full bg-[#20201f] border-2 border-gray-700 text-gray-300 hover:border-[#f2b2eb] hover:text-[#f2b2eb] text-left p-4 rounded flex justify-between items-center transition-all hover:translate-x-1 cursor-pointer"
            >
              <span>Evaluate Grade Sheets</span>
              <span className="bg-black/40 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30">
                EDIT
              </span>
            </button>

            <button 
              id="goto-reports-btn"
              onClick={() => setActiveScreen('reports')}
              className="w-full bg-[#20201f] border-2 border-gray-700 text-gray-300 hover:border-[#f7511c] hover:text-[#f7511c] text-left p-4 rounded flex justify-between items-center transition-all hover:translate-x-1 cursor-pointer"
            >
              <span>Generate Academic Slates</span>
              <span className="bg-black/40 text-orange-400 px-2 py-0.5 rounded border border-orange-500/30">
                VIEW
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* Funny Quote Footer Panel */}
      <footer className="bg-surface-container p-6 border-2 border-dashed border-gray-700 text-center rounded transform rotate-1 mt-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          <AlertTriangle className="w-6 h-6 text-[#f7511c] mx-auto animate-bounce" />
          <p className="font-display font-bold text-[#f2b2eb] text-lg">
            "Education is not the filling of a bucket, but the lighting of an incendiary fire."
          </p>
          <p className="font-mono text-xs text-gray-500">— Unofficial Administration Handbook, Ch. 13</p>
        </div>
      </footer>
    </div>
  );
}
