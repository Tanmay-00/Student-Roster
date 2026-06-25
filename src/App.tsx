import { useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import StudentsView from './components/StudentsView';
import GradesView from './components/GradesView';
import ReportsView from './components/ReportsView';
import HelpView from './components/HelpView';
import { Student, ActiveScreen } from './types';

export default function App() {
  // Initially seed with the precise data from the screenshot
  const [students, setStudents] = useState<Student[]>([
    { id: '1', roll: '001', name: 'Alice Liddell', marks: 95 },
    { id: '2', roll: '002', name: 'Mad Hatter', marks: 42 }
  ]);

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('students');
  const addFormRef = useRef<HTMLFormElement | null>(null);

  const handleAddStudent = (newStudent: Omit<Student, 'id'>) => {
    const studentWithId: Student = {
      ...newStudent,
      id: Date.now().toString()
    };
    // Unshift to place on top of the list
    setStudents(prev => [studentWithId, ...prev]);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateMarks = (id: string, marks: number) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, marks } : s));
  };

  const handleApplyCurve = (amount: number) => {
    setStudents(prev => prev.map(s => {
      const newMarks = Math.max(0, Math.min(100, s.marks + amount));
      return { ...s, marks: newMarks };
    }));
  };

  const handleAddStudentClick = () => {
    setActiveScreen('students');
    setTimeout(() => {
      // Focus on the first form element (Roll No)
      const rollInput = document.getElementById('student-roll');
      if (rollInput) {
        rollInput.focus();
        rollInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Screen Switcher Selector
  const renderActiveView = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardView students={students} setActiveScreen={setActiveScreen} />;
      case 'students':
        return (
          <StudentsView 
            students={students} 
            onAddStudent={handleAddStudent} 
            onDeleteStudent={handleDeleteStudent}
            addFormRef={addFormRef}
          />
        );
      case 'grades':
        return (
          <GradesView 
            students={students} 
            onUpdateMarks={handleUpdateMarks} 
            onApplyCurve={handleApplyCurve} 
          />
        );
      case 'reports':
        return <ReportsView students={students} />;
      case 'help':
        return <HelpView />;
      default:
        return <StudentsView students={students} onAddStudent={handleAddStudent} onDeleteStudent={handleDeleteStudent} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-[#131313] text-white">
      {/* Sidebar navigation */}
      <Sidebar 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen} 
        onAddStudentClick={handleAddStudentClick}
        studentCount={students.length}
      />

      {/* Main content body panel */}
      <main className="flex-1 md:ml-64 p-6 sm:p-10 flex flex-col gap-8 max-w-7xl mx-auto w-full transition-all duration-300">
        {renderActiveView()}
      </main>
    </div>
  );
}
