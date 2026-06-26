import { 
  ShieldAlert, 
  LayoutDashboard, 
  Users, 
  Award, 
  FileText, 
  HelpCircle, 
  LogOut,
  Plus,
  LogIn
} from 'lucide-react';
import { ActiveScreen } from '../types';

interface SidebarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  onAddStudentClick: () => void;
  studentCount: number;
}

export default function Sidebar({ 
  activeScreen, 
  setActiveScreen, 
  onAddStudentClick,
  studentCount 
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard' as ActiveScreen, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students' as ActiveScreen, label: 'Students', icon: Users, badge: studentCount },
    { id: 'reports' as ActiveScreen, label: 'Reports', icon: FileText },
    { id: 'portal' as ActiveScreen, label: 'Student Portal', icon: LogIn },
  ];

  return (
    <>
      {/* Mobile Header Banner */}
      <div className="md:hidden w-full bg-surface-container border-b-2 border-primary p-4 flex justify-between items-center z-50 sticky top-0 shadow-[0px_4px_0px_0px_rgba(195,244,0,1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#c3f400] bg-surface-high flex items-center justify-center brutal-shadow-primary transform -rotate-3">
            <ShieldAlert className="w-5 h-5 text-[#f2b2eb]" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg text-[#f2b2eb] leading-tight">Admin Portal</h1>
            <p className="font-mono text-[10px] text-gray-400 italic">Managing Chaos</p>
          </div>
        </div>
        
        {/* Mobile quick action tabs */}
        <div className="flex gap-1 bg-[#131313] p-1 border border-gray-700 rounded font-mono text-xs">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`px-2 py-1 flex items-center gap-1 rounded transition-all ${
                  isActive 
                    ? 'bg-[#c3f400] text-[#131313] font-bold border border-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <nav className="bg-surface-container text-white h-screen w-64 fixed left-0 top-0 border-r-2 border-[#f2b2eb] shadow-[4px_0px_0px_0px_rgba(195,244,0,1)] flex flex-col py-8 px-4 justify-between z-40 hidden md:flex">
        <div>
          {/* Logo container */}
          <div className="mb-12 pl-3">
            <div className="w-16 h-16 rounded-full border-2 border-[#c3f400] bg-[#353535] flex items-center justify-center mb-4 brutal-shadow-primary transform -rotate-6 hover:rotate-3 transition-transform duration-300">
              <ShieldAlert className="w-9 h-9 text-[#f2b2eb]" />
            </div>
            <h1 className="font-display font-bold text-2xl text-[#f2b2eb] leading-tight">Admin Portal</h1>
            <p className="font-mono text-xs text-gray-400 italic">Managing Chaos</p>
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-col gap-4 font-mono text-sm">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              
              if (isActive) {
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveScreen(item.id)}
                      className="w-full flex items-center justify-between p-3 rounded bg-[#c3f400] text-black border-2 border-black -rotate-2 scale-105 font-bold shadow-[4px_4px_0px_0px_rgba(242,178,235,1)] hover:rotate-0 hover:scale-100 transition-all duration-200 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </span>
                      {item.badge !== undefined && (
                        <span className="bg-[#131313] text-white px-2 py-0.5 text-xs rounded border border-gray-600">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveScreen(item.id)}
                    className="w-full flex items-center justify-between p-3 rounded text-gray-300 hover:text-[#f2b2eb] transition-all hover:translate-x-2 hover:bg-surface-high duration-200 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </span>
                    {item.badge !== undefined && (
                      <span className="bg-[#2a2a2a] text-[#c3f400] px-2 py-0.5 text-xs rounded border border-gray-700">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Action Button and Footer */}
        <div>
          <button 
            onClick={onAddStudentClick}
            className="w-full flex items-center justify-center gap-2 bg-[#c3f400] text-[#131313] border-2 border-[#131313] font-display font-extrabold text-sm py-3 px-4 brutal-shadow-primary hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all mb-8 skew-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add Student
          </button>

          <ul className="flex flex-col gap-2 font-mono text-xs border-t-2 border-[#353535] pt-4">
            <li>
              <button 
                onClick={() => setActiveScreen('help')}
                className={`w-full flex items-center gap-3 p-2 rounded transition-colors text-left ${
                  activeScreen === 'help' ? 'text-[#c3f400]' : 'text-gray-400 hover:text-[#f2b2eb]'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                Help Desk
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  if (confirm("Initiate exit from academic chaos?")) {
                    alert("Order restored! Just kidding. Refresh to start over.");
                  }
                }}
                className="w-full flex items-center gap-3 p-2 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Exit Portal
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
