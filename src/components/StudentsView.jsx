import React, { useState } from 'react';
import { Trash2, Star, Sparkles, Search, Edit3, X, Check } from 'lucide-react';
import { calculatePercentile } from '../utils';

export default function StudentsView({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  addFormRef,
}) {
  const [rollNo, setRollNo] = useState('');
  const [fullName, setFullName] = useState('');
  const [marks, setMarks] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanRoll = rollNo.trim();
    const cleanName = fullName.trim();
    const cleanMarksStr = marks.trim();

    if (!cleanRoll) {
      setErrorMsg('Roll Number cannot be empty!');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    if (!cleanName) {
      setErrorMsg('Full Name cannot be empty!');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    if (cleanMarksStr === '') {
      setErrorMsg('Marks field cannot be empty!');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    // Validate Marks is a numerical value between 0 and 100
    const parsedMarks = Number(cleanMarksStr);
    if (isNaN(parsedMarks) || !Number.isInteger(parsedMarks) || parsedMarks < 0 || parsedMarks > 100) {
      setErrorMsg('Marks must be a whole number between 0 and 100!');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    // Auto-pad roll number if it consists of digits (e.g. "3" -> "003", "12" -> "012") to match stored format
    let finalRoll = cleanRoll;
    if (/^\d+$/.test(finalRoll)) {
      finalRoll = finalRoll.padStart(3, '0');
    }

    // Prevent duplicate roll numbers based on the stored data (excluding current editing student)
    const duplicateExists = students.some(
      s => (editingStudentId ? s.id !== editingStudentId : true) && s.roll.toLowerCase() === finalRoll.toLowerCase()
    );

    if (duplicateExists) {
      setErrorMsg(`Roll No. #${finalRoll} is already assigned to another student!`);
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    if (editingStudentId) {
      onUpdateStudent(editingStudentId, {
        roll: finalRoll,
        name: cleanName,
        marks: parsedMarks,
      });
      setEditingStudentId(null);
    } else {
      onAddStudent({
        roll: finalRoll,
        name: cleanName,
        marks: parsedMarks,
      });
    }

    // Reset Form
    setRollNo('');
    setFullName('');
    setMarks('');
    setErrorMsg('');
  };

  const handleStartEdit = (student) => {
    setEditingStudentId(student.id);
    setRollNo(student.roll);
    setFullName(student.name);
    setMarks(student.marks.toString());
    setErrorMsg('');
    
    // Focus the roll input
    const rollInput = document.getElementById('student-roll');
    if (rollInput) {
      rollInput.focus();
      rollInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCancelEdit = () => {
    setEditingStudentId(null);
    setRollNo('');
    setFullName('');
    setMarks('');
    setErrorMsg('');
  };

  const handleDeleteWithAnimation = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      onDeleteStudent(id);
      setDeletingId(null);
    }, 400); // Wait for the exit slide animation to complete
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Header Panel */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b-2 border-[#353535] pb-6">
        <div>
          <h2 className="font-display font-black text-5xl md:text-6xl text-[#f2b2eb] transform -skew-x-6 tracking-tight leading-none">
            Student Roster
          </h2>
          <p className="font-sans text-lg text-gray-400 mt-2 ml-2">
            Embrace the academic anarchy.
          </p>
        </div>
        
        {/* Dynamic skewed quotation block */}
        <div className="w-full sm:w-64 bg-surface-high border-2 border-[#c3f400] brutal-shadow-primary flex flex-col justify-center -rotate-3 p-4 transition-transform hover:rotate-1 hover:scale-105 duration-300">
          <span className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">§ Chaotic Maxim</span>
          <span className="font-sans text-sm font-semibold text-white">
            "Organized chaos is still organized."
          </span>
        </div>
      </header>

      {/* Main Form and List Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Hand: New Recruit Form Card */}
        <section className={`lg:col-span-5 bg-surface-high p-8 border-2 transition-all duration-300 ${
          editingStudentId ? 'border-[#c3f400] shadow-[0px_0px_20px_rgba(195,244,0,0.15)]' : 'border-[#f2b2eb]'
        } brutal-shadow-secondary transform rotate-1 relative`}>
          <div className="absolute -top-5 left-4">
            <h3 className="font-display font-black text-3xl text-[#c3f400] bg-[#131313] inline-block px-4 py-1 border-2 border-[#c3f400] transform -skew-x-3 uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(242,178,235,1)]">
              {editingStudentId ? 'Edit Recruit' : 'New Recruit'}
            </h3>
          </div>

          <form 
            ref={addFormRef}
            onSubmit={handleSubmit} 
            className="flex flex-col gap-6 mt-6 relative z-10"
          >
            {/* Pop-up float error tooltip inside container */}
            {errorMsg && (
              <div className="absolute -top-12 left-0 right-0 bg-[#ffd6f8] text-[#340636] font-mono text-xs font-bold px-4 py-2 border-2 border-black bouncy-error z-20 flex items-center gap-2 brutal-shadow-dark">
                <Sparkles className="w-4 h-4 text-[#f7511c]" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Roll No Field */}
            <div className="flex flex-col">
              <label htmlFor="student-roll" className="font-mono text-xs text-gray-400 mb-1 ml-1 select-none">
                Roll No. (Numbers only)
              </label>
              <input
                id="student-roll"
                type="text"
                value={rollNo}
                onChange={(e) => {
                  const filtered = e.target.value.replace(/\D/g, '');
                  setRollNo(filtered);
                }}
                placeholder="e.g. 001"
                className="bg-[#3e103f] border-2 border-[#9a8d96] text-[#f2b2eb] placeholder-purple-300/40 p-3 font-mono text-sm rounded input-wobble focus:border-[#c3f400] focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            {/* Full Name Field */}
            <div className="flex flex-col ml-3">
              <label htmlFor="student-name" className="font-mono text-xs text-gray-400 mb-1 ml-1 select-none">
                Full Name (Letters only)
              </label>
              <input
                id="student-name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setFullName(filtered);
                }}
                placeholder="e.g. Jane Doe"
                className="bg-[#3e103f] border-2 border-[#9a8d96] text-[#f2b2eb] placeholder-purple-300/40 p-3 font-mono text-sm rounded input-wobble focus:border-[#c3f400] focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            {/* Marks Field */}
            <div className="flex flex-col">
              <label htmlFor="student-marks" className="font-mono text-xs text-gray-400 mb-1 ml-1 select-none">
                Marks / 100
              </label>
              <input
                id="student-marks"
                type="text"
                value={marks}
                onChange={(e) => {
                  const filtered = e.target.value.replace(/\D/g, '');
                  if (filtered !== '') {
                    const val = parseInt(filtered, 10);
                    if (val > 100) {
                      setMarks('100');
                    } else {
                      setMarks(filtered);
                    }
                  } else {
                    setMarks('');
                  }
                }}
                placeholder="85"
                className="bg-[#3e103f] border-2 border-[#9a8d96] text-[#f2b2eb] placeholder-purple-300/40 p-3 font-mono text-sm rounded input-wobble focus:border-[#c3f400] focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            {/* Submit & Reset Button block */}
            <div className="flex flex-col gap-3 mt-4">
              <button
                id="inject-student-btn"
                type="submit"
                className={`w-full bg-[#f2b2eb] text-[#340636] border-2 border-[#340636] font-display font-black text-lg py-3.5 rounded transform -skew-x-6 hover:skew-x-0 brutal-shadow-dark hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer ${
                  editingStudentId ? 'bg-[#c3f400] text-[#131313] hover:bg-[#b0dd00]' : 'btn-pulse'
                }`}
              >
                {editingStudentId ? 'Save Changes' : 'Inject Data'}
              </button>

              {editingStudentId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full bg-[#131313] text-red-400 border-2 border-red-400 font-mono text-xs py-2 rounded hover:bg-red-400 hover:text-black hover:border-black transition-all cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {/* Decorative spinning star medallion */}
          <div className="absolute -bottom-6 -right-6 w-14 h-14 bg-[#c3f400] border-2 border-black rounded-full flex items-center justify-center animate-spin z-10 shadow-[3px_3px_0px_0px_rgba(242,178,235,1)]" style={{ animationDuration: '8s' }}>
            <Star className="w-6 h-6 text-black fill-black" />
          </div>
        </section>

        {/* Right Hand: The Roster List Container */}
        <section className="lg:col-span-7 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1 pl-2">
            <h3 className="font-display font-bold text-3xl text-white">The Roster</h3>
            <div className="flex items-center gap-3">
              <span className="bg-[#ffd6f8] text-[#340636] font-mono text-xs font-bold px-3 py-1 border border-black rounded shadow-[2px_2px_0px_0px_#c3f400] transform skew-x-6">
                Total: {students.length}
              </span>
            </div>
          </div>

          {/* Real-time Search Bar */}
          <div className="relative w-full mb-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#f2b2eb]" />
            </div>
            <input
              type="text"
              placeholder="Search by Name or Roll No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e1e1e] border-2 border-[#9a8d96] text-white placeholder-gray-500 py-2.5 pl-10 pr-10 font-mono text-sm rounded focus:border-[#c3f400] focus:outline-none focus:ring-0 transition-colors shadow-[2px_2px_0px_0px_rgba(242,178,235,0.4)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                title="Clear Search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Student Roster Cards */}
          <div className="flex flex-col gap-6" id="studentList">
            {students.length === 0 ? (
              <div className="bg-surface-container p-10 border-2 border-dashed border-[#9a8d96] text-center rounded transform -rotate-1 brutal-shadow-secondary">
                <p className="font-display font-bold text-xl text-[#f2b2eb] mb-2">The roster is empty.</p>
                <p className="font-mono text-xs text-gray-400">Chaos index is critical. Recruit new brains immediately!</p>
              </div>
            ) : (() => {
              const query = searchQuery.toLowerCase().trim();
              const filteredStudents = students.filter(student => 
                student.name.toLowerCase().includes(query) ||
                student.roll.toLowerCase().includes(query)
              );

              if (filteredStudents.length === 0) {
                return (
                  <div className="bg-surface-container p-10 border-2 border-dashed border-red-400 text-center rounded transform rotate-1 brutal-shadow-secondary">
                    <p className="font-display font-bold text-xl text-red-400 mb-2">No matching brains found.</p>
                    <p className="font-mono text-xs text-gray-400">Try searching for a different name or roll number, or click clear!</p>
                  </div>
                );
              }

              return filteredStudents.map((student, index) => {
                const isEven = index % 2 === 0;
                const offsetClass = isEven ? 'md:ml-6' : 'md:mr-6';
                const rotateClass = isEven ? 'rotate-1' : '-rotate-1';
                const shadowClass = isEven ? 'brutal-shadow-primary' : 'brutal-shadow-secondary';
                
                // Color based on marks
                let scoreBadgeColor = 'bg-[#c3f400] text-black';
                if (student.marks < 50) {
                  scoreBadgeColor = 'bg-red-400 text-black';
                } else if (student.marks < 75) {
                  scoreBadgeColor = 'bg-[#ffd6f8] text-[#340636]';
                }

                const isDeleting = deletingId === student.id;

                return (
                  <div
                    key={student.id}
                    id={`student-card-${student.id}`}
                    className={`bg-surface-container p-5 border-2 border-gray-700 flex justify-between items-center ${offsetClass} ${rotateClass} ${shadowClass} transition-all duration-300 hover:bg-[#2a2a2a] hover:-translate-y-1 ${
                      isDeleting ? 'opacity-0 translate-x-[150px] scale-95 duration-400 pointer-events-none' : ''
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold bg-[#131313] text-[#f2b2eb] px-2 py-0.5 border border-gray-700 rounded shadow-[1px_1px_0px_0px_#c3f400]">
                          #{student.roll}
                        </span>
                        <h4 className="font-display font-extrabold text-xl text-white">
                          {student.name}
                        </h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <span>Score:</span>
                          <span className={`px-2 py-0.5 font-bold border border-black rounded inline-block transform skew-x-12 ${scoreBadgeColor}`}>
                            {student.marks}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 sm:ml-2">
                          <span>Percentile:</span>
                          <span className="px-2 py-0.5 font-bold bg-[#131313] text-[#c3f400] border border-gray-700 rounded inline-block transform -skew-x-6 shadow-[1px_1px_0px_0px_rgba(242,178,235,1)]">
                            {calculatePercentile(student.marks, students).toFixed(4)} %ile
                          </span>
                        </div>
                        
                        {/* Progress meter visual */}
                        <div className="w-16 h-2.5 bg-black border border-gray-700 rounded overflow-hidden hidden sm:block">
                          <div 
                            className={`h-full ${student.marks < 50 ? 'bg-red-500' : student.marks < 75 ? 'bg-purple-400' : 'bg-[#c3f400]'}`}
                            style={{ width: `${student.marks}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`edit-student-btn-${student.id}`}
                        onClick={() => handleStartEdit(student)}
                        className={`p-2.5 border-2 rounded transition-colors transform -rotate-3 hover:rotate-0 flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_0px_#c3f400] ${
                          editingStudentId === student.id
                            ? 'bg-[#c3f400] border-black text-black'
                            : 'bg-[#131313] border-[#f2b2eb] text-[#f2b2eb] hover:bg-[#f2b2eb] hover:text-[#340636]'
                        }`}
                        title="Edit Student Record"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>

                      <button
                        id={`delete-student-btn-${student.id}`}
                        onClick={() => handleDeleteWithAnimation(student.id)}
                        className="bg-[#131313] border-2 border-red-400 text-red-400 p-2.5 hover:bg-red-500 hover:text-black hover:border-black rounded transition-colors transform rotate-3 hover:rotate-0 flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_0px_#f2b2eb]"
                        title="Annihilate record"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </section>
      </div>

      {/* Reflections on the Build Section */}
      <section className="mt-12 border-t-4 border-dashed border-[#353535] pt-12">
        <div className="text-center mb-12">
          <h2 className="font-display font-black text-3xl md:text-4xl text-[#f2b2eb] bg-surface-container inline-block px-6 py-2.5 transform -rotate-1 border-2 border-[#f2b2eb] shadow-[4px_4px_0px_0px_#c3f400] uppercase tracking-wider">
            Reflections on the Build
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article className="bg-surface-container p-6 border-l-4 border-[#c3f400] rounded hover:translate-y-1 transition-transform duration-200 shadow-[3px_3px_0px_0px_rgba(242,178,235,0.15)]">
            <h4 className="font-display font-bold text-lg text-[#c3f400] mb-3">
              1. State Consistency &amp; Quirks
            </h4>
            <p className="font-sans text-sm text-gray-300 leading-relaxed">
              Used centralized state (simulated via JS array) and ensured animations don't interfere with DOM availability. The 'pop' and 'slide' classes are added dynamically without breaking the underlying data structure.
            </p>
          </article>

          <article className="bg-surface-container p-6 border-l-4 border-[#f2b2eb] rounded transform translate-y-2 hover:translate-y-3 transition-transform duration-200 shadow-[3px_3px_0px_0px_rgba(195,244,0,0.15)]">
            <h4 className="font-display font-bold text-lg text-[#f2b2eb] mb-3">
              2. Odd Aesthetics vs Usability
            </h4>
            <p className="font-sans text-sm text-gray-300 leading-relaxed">
              Used high contrast (Electric Lime/Burnt Orange on dark surfaces) and clear Space Mono labels. Despite the asymmetrical layouts and wobbly containers, the reading order remains logical.
            </p>
          </article>

          <article className="bg-surface-container p-6 border-l-4 border-[#f7511c] rounded transform -translate-y-1 hover:translate-y-0 transition-transform duration-200 shadow-[3px_3px_0px_0px_rgba(247,81,28,0.15)]">
            <h4 className="font-display font-bold text-lg text-[#f7511c] mb-3">
              3. Validation in Non-Standard Layouts
            </h4>
            <p className="font-sans text-sm text-gray-300 leading-relaxed">
              Used floating bouncy tooltips that don't shift the content flow. By placing absolute positioned error messages, the form retains its specific grid placement without jumping around during validation.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
