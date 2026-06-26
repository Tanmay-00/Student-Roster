import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Award, 
  Percent, 
  Flame, 
  UserCheck, 
  BrainCircuit, 
  Coffee,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { calculatePercentile } from '../utils';

export default function PortalView({ students, onAddStudent, onUpdateStudent }) {
  // Authentication states
  const [isLogin, setIsLogin] = useState(true);
  const [loggedInStudentId, setLoggedInStudentId] = useState(null);

  // Form Inputs
  const [roll, setRoll] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI status messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Funny committee review text state
  const [committeeReview, setCommitteeReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Derive current logged-in student
  const loggedInStudent = students.find(s => s.id === loggedInStudentId);

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanRoll = roll.trim();
    const cleanPassword = password;

    if (!cleanRoll || !cleanPassword) {
      showError('Please fill in both Roll Number and Password!');
      return;
    }

    // Auto-pad roll number to match stored format if it's purely digits
    let finalRoll = cleanRoll;
    if (/^\d+$/.test(finalRoll)) {
      finalRoll = finalRoll.padStart(3, '0');
    }

    // Find student in registry
    const student = students.find(s => s.roll === finalRoll);

    if (!student) {
      showError(`Roll Number #${finalRoll} is not registered in our administration registry.`);
      return;
    }

    // If student exists but does not have a password set (added by admin)
    if (!student.password) {
      showError(`Roll Number #${finalRoll} exists, but has no password set. Please switch to the "Sign Up" tab to claim this record and set a password!`);
      return;
    }

    // Verify password
    if (student.password !== cleanPassword) {
      showError('Incorrect password! The Anarchy Committee denies entry.');
      return;
    }

    // Success!
    setLoggedInStudentId(student.id);
    showSuccess(`Access Granted! Welcome back, ${student.name}.`);
    // Clear form
    setRoll('');
    setPassword('');
  };

  // Handle Signup
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanRoll = roll.trim();
    const cleanName = name.trim();
    const cleanPassword = password;
    const cleanConfirm = confirmPassword;

    if (!cleanRoll || !cleanName || !cleanPassword || !cleanConfirm) {
      showError('Please fill in all the required fields!');
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      showError('Passwords do not match!');
      return;
    }

    if (cleanPassword.length < 4) {
      showError('Password must be at least 4 characters long.');
      return;
    }

    // Auto-pad roll if purely digits
    let finalRoll = cleanRoll;
    if (/^\d+$/.test(finalRoll)) {
      finalRoll = finalRoll.padStart(3, '0');
    }

    // Check if the student with this Roll No already exists
    const existingStudent = students.find(
      s => s.roll.toLowerCase() === finalRoll.toLowerCase()
    );

    if (existingStudent) {
      // If the student exists and already has a password, they cannot re-signup
      if (existingStudent.password) {
        showError(`Roll No. #${finalRoll} is already registered with a password. Please log in instead!`);
        return;
      }

      // If the student exists but has NO password, they can claim the record!
      onUpdateStudent(existingStudent.id, {
        password: cleanPassword,
        name: cleanName // Update name in case they want to adjust spelling
      });

      setLoggedInStudentId(existingStudent.id);
      showSuccess(`Account claimed! Welcome to your student dashboard, ${cleanName}.`);
    } else {
      // Completely new student, let's create a new record
      onAddStudent({
        roll: finalRoll,
        name: cleanName,
        marks: 0,
        password: cleanPassword
      });

      showSuccess(`Account created successfully! Please log in with your credentials.`);
      setIsLogin(true);
    }

    // Clear form inputs
    setRoll('');
    setName('');
    setPassword('');
    setConfirmPassword('');
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Perform "Re-evaluation Request"
  const handleReevaluate = () => {
    if (!loggedInStudent) return;
    setReviewLoading(true);
    setCommitteeReview(null);

    const outcomes = [
      {
        text: "The Anarchy Committee reviewed your grade and decided that numbers are social constructs. Your grade remains unchanged, but your Aura rating went up by 15 points.",
        diff: 0
      },
      {
        text: "After brief arguments involving a PowerPoint presentation and a box of donuts, the committee awarded you a +2 chaos bonus!",
        diff: 2
      },
      {
        text: "A rogue origami paper crane swooped in and edited the ledger. You gained +3 marks!",
        diff: 3
      },
      {
        text: "The committee got distracted playing tic-tac-toe. They randomly deducted -1 mark for insolence, but commended your bravery.",
        diff: -1
      },
      {
        text: "Mad Hatter drank too much tea and misread your score sheet as a recipe. No mark change, but you received a voucher for a free virtual cup of tea.",
        diff: 0
      }
    ];

    setTimeout(() => {
      const selected = outcomes[Math.floor(Math.random() * outcomes.length)];
      setReviewLoading(false);
      setCommitteeReview(selected.text);
      
      if (selected.diff !== 0) {
        const newMarks = Math.max(0, Math.min(100, loggedInStudent.marks + selected.diff));
        onUpdateStudent(loggedInStudent.id, { marks: newMarks });
      }
    }, 1500);
  };

  // Calculate dynamic rank for current student
  const getRank = () => {
    if (!loggedInStudent) return { rank: 0, total: 0 };
    const sorted = [...students].sort((a, b) => b.marks - a.marks);
    const rankIndex = sorted.findIndex(s => s.id === loggedInStudent.id);
    return {
      rank: rankIndex + 1,
      total: students.length
    };
  };

  const { rank, total } = getRank();
  const currentPercentile = loggedInStudent ? calculatePercentile(loggedInStudent.marks, students) : 0;

  // Study Prep advice helper
  const getAcademicAdvice = (score) => {
    if (score < 50) {
      return {
        vibe: "CRITICAL CHAOS ALERT",
        text: "Your academic standing is beautifully chaotic. Attend the Mad Hatter's chemical bunsen zone for immediate logic infusion. Study Alice's spatial tilt formulas before the whiteboard fully collapses.",
        color: "text-red-400 border-red-400 bg-red-950/10"
      };
    } else if (score < 85) {
      return {
        vibe: "VIBRANT ANARCHIST STANDING",
        text: "You are balancing perfectly on the edge of genius and structural rebellion. Engage in chess club marches or PPT presentations on why grades are constructs to boost your standing.",
        color: "text-[#f2b2eb] border-[#f2b2eb] bg-purple-950/10"
      };
    } else {
      return {
        vibe: "CERTIFIED MASTER OF DISORDER",
        text: "Outstanding achievement! You have officially out-calculated the system. The Anarchy Committee is heavily inspired by your scores. Go bribe the administration for a physical star sticker.",
        color: "text-[#c3f400] border-[#c3f400] bg-lime-950/10"
      };
    }
  };

  const advice = loggedInStudent ? getAcademicAdvice(loggedInStudent.marks) : null;

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b-2 border-[#353535] pb-6">
        <div>
          <h2 className="font-display font-black text-5xl md:text-6xl text-[#c3f400] transform -skew-x-6 tracking-tight leading-none">
            {loggedInStudent ? 'Student Console' : 'Secure Portal'}
          </h2>
          <p className="font-sans text-lg text-gray-400 mt-2 ml-2">
            {loggedInStudent 
              ? `Authorized terminal for ${loggedInStudent.name}.` 
              : 'Login or create a secure credential sheet to view your percentile and ratings.'}
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full">
        {/* Error/Success Notifications */}
        {errorMsg && (
          <div className="mb-6 bg-red-950/30 border-2 border-red-400 text-red-200 font-mono text-sm p-4 rounded brutal-shadow-dark flex items-center gap-3 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        
        {successMsg && (
          <div className="mb-6 bg-[#131313] border-2 border-[#c3f400] text-[#c3f400] font-mono text-sm p-4 rounded brutal-shadow-primary flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#c3f400] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {!loggedInStudent ? (
          /* AUTHENTICATION TAB CONTAINER */
          <div className="bg-surface-container border-2 border-[#f2b2eb] rounded brutal-shadow-secondary p-8 transform rotate-0.5 max-w-lg mx-auto">
            {/* Tab selection */}
            <div className="flex border-b-2 border-gray-800 pb-4 mb-6">
              <button
                onClick={() => { setIsLogin(true); setErrorMsg(''); }}
                className={`flex-1 py-2 font-display font-black text-xl text-center rounded transition-all ${
                  isLogin 
                    ? 'bg-[#c3f400] text-black border-2 border-black -skew-x-6' 
                    : 'text-gray-400 hover:text-[#f2b2eb]'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  LOGIN
                </span>
              </button>
              <button
                onClick={() => { setIsLogin(false); setErrorMsg(''); }}
                className={`flex-1 py-2 font-display font-black text-xl text-center rounded transition-all ${
                  !isLogin 
                    ? 'bg-[#f2b2eb] text-[#340636] border-2 border-black skew-x-6' 
                    : 'text-gray-400 hover:text-[#c3f400]'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  SIGN UP
                </span>
              </button>
            </div>

            {/* Render Login Form */}
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <label className="font-mono text-xs text-gray-400 mb-1.5 ml-1">
                    Roll No. (Consists of digits)
                  </label>
                  <input
                    type="text"
                    value={roll}
                    onChange={(e) => setRoll(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 001"
                    className="bg-[#3e103f] border-2 border-[#9a8d96] text-[#f2b2eb] placeholder-purple-300/40 p-3 font-mono text-sm rounded focus:border-[#c3f400] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-mono text-xs text-gray-400 mb-1.5 ml-1">
                    Secret Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-[#3e103f] border-2 border-[#9a8d96] text-[#f2b2eb] placeholder-purple-300/40 p-3 font-mono text-sm rounded focus:border-[#c3f400] focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full bg-[#c3f400] text-black border-2 border-black font-display font-black text-lg py-3 rounded transform hover:-skew-x-6 transition-all brutal-shadow-dark cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5 stroke-[3]" />
                  Enter Portal
                </button>
              </form>
            ) : (
              /* Render Signup Form */
              <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="font-mono text-xs text-gray-400 mb-1 ml-1">
                    Roll No. (Consists of digits)
                  </label>
                  <input
                    type="text"
                    value={roll}
                    onChange={(e) => setRoll(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 003"
                    className="bg-[#3e103f] border-2 border-[#9a8d96] text-[#f2b2eb] placeholder-purple-300/40 p-3 font-mono text-sm rounded focus:border-[#c3f400] focus:outline-none"
                    required
                  />
                  <p className="font-mono text-[9px] text-gray-500 mt-1 ml-1 italic">
                    If your roll was already registered by administration, this will set your password and claim the record!
                  </p>
                </div>

                <div className="flex flex-col">
                  <label className="font-mono text-xs text-gray-400 mb-1 ml-1">
                    Full Name (Letters only)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                    placeholder="e.g. Jane Doe"
                    className="bg-[#3e103f] border-2 border-[#9a8d96] text-[#f2b2eb] placeholder-purple-300/40 p-3 font-mono text-sm rounded focus:border-[#c3f400] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-mono text-xs text-gray-400 mb-1 ml-1">
                    Set Secret Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 4 characters"
                    className="bg-[#3e103f] border-2 border-[#9a8d96] text-[#f2b2eb] placeholder-purple-300/40 p-3 font-mono text-sm rounded focus:border-[#c3f400] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-mono text-xs text-gray-400 mb-1 ml-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="bg-[#3e103f] border-2 border-[#9a8d96] text-[#f2b2eb] placeholder-purple-300/40 p-3 font-mono text-sm rounded focus:border-[#c3f400] focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="mt-3 w-full bg-[#f2b2eb] text-[#340636] border-2 border-black font-display font-black text-lg py-3 rounded transform hover:skew-x-6 transition-all brutal-shadow-dark cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5 stroke-[3]" />
                  Register Credentials
                </button>
              </form>
            )}
          </div>
        ) : (
          /* LOGGED IN STUDENT DASHBOARD VIEW */
          <div className="flex flex-col gap-8">
            {/* Top welcome card banner */}
            <div className="bg-[#1e1e1e] border-2 border-[#c3f400] p-6 rounded brutal-shadow-primary flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transform rotate-0.5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#c3f400] border-2 border-black rounded-full flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(242,178,235,1)]">
                  <UserCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl text-white">
                    {loggedInStudent.name}
                  </h3>
                  <p className="font-mono text-xs text-gray-400">
                    Roll No: #{loggedInStudent.roll} • Identity Verified
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLoggedInStudentId(null)}
                className="bg-[#131313] border-2 border-red-400 text-red-400 px-4 py-2 rounded font-mono text-xs hover:bg-red-400 hover:text-black hover:border-black transition-all flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(242,178,235,0.4)]"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>

            {/* Main Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score card */}
              <div className="bg-[#131313] p-6 border-2 border-gray-700 rounded brutal-shadow-secondary transform -rotate-1 flex flex-col gap-2">
                <div className="flex justify-between items-center text-gray-400 font-mono text-xs uppercase">
                  <span>Score Sheet</span>
                  <Award className="w-4 h-4 text-[#f2b2eb]" />
                </div>
                <h4 className="font-display font-black text-5xl text-[#f2b2eb] my-2">
                  {loggedInStudent.marks} <span className="text-xl font-sans font-normal text-gray-500">/ 100</span>
                </h4>
                <div className="w-full h-3 bg-black border border-gray-800 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-[#f2b2eb] transition-all duration-1000"
                    style={{ width: `${loggedInStudent.marks}%` }}
                  />
                </div>
              </div>

              {/* JEE Percentile Card */}
              <div className="bg-[#131313] p-6 border-2 border-[#c3f400] rounded brutal-shadow-primary transform rotate-1 flex flex-col gap-2">
                <div className="flex justify-between items-center text-gray-400 font-mono text-xs uppercase">
                  <span>JEE percentile</span>
                  <Percent className="w-4 h-4 text-[#c3f400]" />
                </div>
                <h4 className="font-display font-black text-4xl text-[#c3f400] my-2">
                  {currentPercentile.toFixed(4)}
                  <span className="text-lg font-mono font-medium block text-gray-400 mt-1">%ile</span>
                </h4>
                <p className="font-mono text-[10px] text-gray-500 leading-tight">
                  Compared directly to {total} students currently loaded in standard ledger.
                </p>
              </div>

              {/* Class Rank Card */}
              <div className="bg-[#131313] p-6 border-2 border-gray-700 rounded brutal-shadow-secondary transform -rotate-0.5 flex flex-col gap-2">
                <div className="flex justify-between items-center text-gray-400 font-mono text-xs uppercase">
                  <span>Class Rank</span>
                  <Flame className="w-4 h-4 text-[#f7511c]" />
                </div>
                <h4 className="font-display font-black text-5xl text-[#f7511c] my-2">
                  #{rank} <span className="text-xl font-sans font-normal text-gray-500">of {total}</span>
                </h4>
                <p className="font-mono text-[10px] text-gray-500 leading-tight">
                  {rank === 1 
                    ? "Absolute apex anarchist. No higher force detected." 
                    : "Room to trigger further academic disruptions."}
                </p>
              </div>
            </div>

            {/* Academic Evaluation and Action Box */}
            <div className={`border-2 p-6 rounded brutal-shadow-primary transform rotate-0.5 ${advice?.color}`}>
              <div className="flex items-center gap-2 mb-3 border-b border-current pb-2">
                <BrainCircuit className="w-5 h-5" />
                <h4 className="font-display font-black text-xl uppercase tracking-wider">
                  {advice?.vibe}
                </h4>
              </div>
              <p className="font-mono text-sm leading-relaxed text-white">
                {advice?.text}
              </p>
            </div>

            {/* Interactive Section: Anarchy Committee Grade Challenge */}
            <div className="bg-[#131313] p-6 border-2 border-gray-800 rounded brutal-shadow-secondary transform -rotate-0.5 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-[#f2b2eb]" />
                  <h4 className="font-display font-bold text-xl text-white uppercase tracking-wider">
                    Grade Re-evaluation Request
                  </h4>
                </div>
                <span className="bg-[#f2b2eb] text-black font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Instant decision
                </span>
              </div>

              <p className="font-mono text-xs text-gray-400 leading-relaxed">
                Want to challenge your current score of <strong className="text-white">{loggedInStudent.marks}</strong>? Push the red lever to initiate a prompt review by the Mad Hatter and the local Student Anarchy Council. Their decision is unpredictable!
              </p>

              <button
                onClick={handleReevaluate}
                disabled={reviewLoading}
                className={`w-full max-w-sm py-3 px-6 rounded font-display font-black text-sm uppercase border-2 border-black brutal-shadow-dark transition-all cursor-pointer ${
                  reviewLoading
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed animate-pulse shadow-none translate-x-0.5 translate-y-0.5'
                    : 'bg-[#f7511c] text-white hover:bg-orange-600 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
                }`}
              >
                {reviewLoading ? 'Reviewing dossier...' : 'SUBMIT Dossier to Committee'}
              </button>

              {committeeReview && (
                <div className="mt-4 p-4 border-2 border-dashed border-[#f2b2eb] bg-[#1e141e] text-[#f2b2eb] font-mono text-xs rounded animate-fade-in flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#f7511c]">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Committee Findings:</span>
                  </div>
                  <p className="italic leading-relaxed">"{committeeReview}"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
