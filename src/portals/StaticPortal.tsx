import React, { useState, useEffect } from 'react';
import { 
  Shield, FileText, Settings, Compass, Award, Target, TrendingUp, Users, Info,
  Briefcase, MapPin, Coins, ChevronRight, CheckSquare, Scale, HelpCircle, 
  Search, MessageSquare, PhoneCall, AlertTriangle, Heart, Globe, Play, Server, Clock, Lock
} from 'lucide-react';

interface StaticPortalProps {
  activeView: string;
  onChangeView: (view: string) => void;
}

export default function StaticPortal({ activeView, onChangeView }: StaticPortalProps) {
  // Local states for interactivity
  // Careers apply modal state
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [careerForm, setCareerForm] = useState({ name: '', email: '', linkedin: '', resumeName: '' });
  const [jobApplied, setJobApplied] = useState(false);

  // Corporate calculator state
  const [corpPackage, setCorpPackage] = useState<'standard' | 'elite' | 'custom'>('standard');
  const [contractDuration, setContractDuration] = useState<1 | 3 | 12>(3);
  const [corpSubmitted, setCorpSubmitted] = useState(false);
  const [corpEmail, setCorpEmail] = useState('');

  // Cookies toggles state
  const [cookiesSelected, setCookiesSelected] = useState(() => {
    const saved = localStorage.getItem('rentigo_cookies_preference');
    return saved ? JSON.parse(saved) : { essential: true, performance: true, marketing: false };
  });
  const [cookiesSaved, setCookiesSaved] = useState(false);

  // Terms Search parameter
  const [termsSearch, setTermsSearch] = useState('');

  // FAQ accordion open index
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [faqForm, setFaqForm] = useState({ email: '', category: 'General billing', message: '' });
  const [faqFormSubmitted, setFaqFormSubmitted] = useState(false);

  // SOS state
  const [sosActive, setSosActive] = useState(false);
  const [sosTimer, setSosTimer] = useState(15);

  // Hub spotlight address calculation
  const [selectedHub, setSelectedHub] = useState<string>('Surat');

  const handleApplyJob = (e: React.FormEvent) => {
    e.preventDefault();
    setJobApplied(true);
    setTimeout(() => {
      setSelectedJob(null);
      setJobApplied(false);
      setCareerForm({ name: '', email: '', linkedin: '', resumeName: '' });
      alert("Application Registered Safely: Our HR talent acquisition node has logged your candidate metadata!");
    }, 1500);
  };

  const handleSaveCookies = () => {
    localStorage.setItem('rentigo_cookies_preference', JSON.stringify(cookiesSelected));
    setCookiesSaved(true);
    setTimeout(() => setCookiesSaved(false), 2500);
  };

  const handleFAQFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFaqFormSubmitted(true);
    setTimeout(() => {
      setFaqFormSubmitted(false);
      setFaqForm({ email: '', category: 'General billing', message: '' });
      alert("Ticket Dispatched: Your customer support inquiry is queued. Reference code: RTG-" + Math.floor(100000 + Math.random() * 900000));
    }, 1200);
  };

  const handleTriggerSOS = () => {
    setSosActive(true);
    setSosTimer(15);
  };

  useEffect(() => {
    let interval: any;
    if (sosActive && sosTimer > 0) {
      interval = setInterval(() => {
        setSosTimer((prev) => prev - 1);
      }, 1000);
    } else if (sosTimer === 0) {
      setSosActive(false);
    }
    return () => clearInterval(interval);
  }, [sosActive, sosTimer]);

  const calculateCorpPrice = () => {
    let base = 0;
    if (corpPackage === 'standard') base = 4800; // 5 cars
    else if (corpPackage === 'elite') base = 12500; // 15 cars
    else base = 28000; // custom fleet

    // apply discount based on contract length
    let discount = 1;
    if (contractDuration === 3) discount = 0.90; // 10% off
    else if (contractDuration === 12) discount = 0.80; // 20% off

    return Math.floor(base * discount * contractDuration);
  };

  // Pre-compiled policy array for search filters
  const legalPolicies = [
    { category: 'Eligibility', title: 'Age Criteria & License Verification', text: 'Customers must possess a valid, non-expired driving license matching the selected vehicle category. For 2-Wheeler fleet classifications, the passenger node must be at least 18 years old. For larger 4-Wheeler luxury and sedan vehicles, the minimum primary age threshold is 21 years.' },
    { category: 'Financial', title: 'Security Deposits & Holds', text: 'A transient authorization lock is placed on your primary credit card at the start of the reservation. For standard vehicles, the amount is $100. This is automatically dispatched back to your account within 24 hours of returning the vehicle in nominal condition.' },
    { category: 'Damage', title: 'Collision Damage Protection Plan', text: 'All rental contracts include third-party legal liability assurance. You can optionally purchase the Complete Peace waiver for full zero-deductible coverage. Pre-existing scratches are meticulously documented by partners at terminal checkpoints.' },
    { category: 'Fueling', title: 'Fuel & EV Charging Charge Match', text: 'Vehicles must be returned with the equivalent propulsion fuel bounds as identified at release. EV listings include complimentary charging nodes at any designated RentiGo hub terminal. Underfilled tanks face static processing costs.' },
    { category: 'Incidents', title: 'Traffic Penalties and Fines Policy', text: 'Registered renters are strictly liable for infractions logged on municipal surveillance cameras during active contract timestamps. This includes speeding tickets, illegal terminal parking, or lane violations.' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20">
      
      {/* Sub Header for Navigation / Breadcrumb context */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => onChangeView('home')}>Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold capitalize">
              {activeView === 'about' ? 'Story & Leadership' : activeView.replace('_', ' ')} Page
            </span>
          </div>
          <button 
            onClick={() => onChangeView('home')}
            className="text-blue-600 hover:text-blue-800 font-bold uppercase tracking-wider text-[11px]"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* 1. OPERATIONAL STORY / CUSTOM ABOUT VIEW */}
      {(activeView === 'about' || activeView === 'story') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16 animate-fade-in">
          
          <section className="text-center max-w-4xl mx-auto space-y-4">
            <span className="bg-blue-50 text-blue-700 font-black text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-blue-200">
              Rentigo Corporate History
            </span>
            <h1 className="font-extrabold text-4xl sm:text-5xl text-slate-900 tracking-tight leading-none mt-2">
              Our Operational Journey
            </h1>
            <p className="text-slate-500 text-lg sm:text-xl leading-relaxed">
              Founded with the goal of substituting error-prone handwritten registries with a transparent, fully synchronized platform, Rentigo pioneers fluid travel options and verified fleet logistics across Tier 1 and Tier 2 hubs in India.
            </p>
          </section>

          {/* Core Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-slate-200 rounded-3xl space-y-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 leading-none">Total Transparency</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                No hidden processing parameters, surprise cleaning bills, or unallocated delays. Renters see detailed price breakdowns before locking reservation intervals.
              </p>
            </div>
            
            <div className="bg-white p-8 border border-slate-200 rounded-3xl space-y-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 leading-none">Security Assurance</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                Rigorous multi-point inspection queues managed by vetted regional partner agencies. Every transaction is encapsulated safely within local browser integrity.
              </p>
            </div>

            <div className="bg-white p-8 border border-slate-200 rounded-3xl space-y-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 leading-none">Localized Hub Handover</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                Strategic transport terminals based dynamically near train junctions, airports, and major highways for zero-commute physical pickups.
              </p>
            </div>
          </div>

          {/* Timeline Milestones */}
          <section className="bg-white rounded-3xl border p-8 sm:p-12 space-y-10 shadow-sm">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="font-extrabold text-2xl text-slate-900">Evolution Roadmap &amp; Growth</h3>
              <p className="text-slate-400 text-sm mt-1">Tracing our expansion metrics over the last five years of operation.</p>
            </div>

            <div className="relative border-l border-blue-200 pl-6 sm:pl-10 space-y-10 ml-4 max-w-4xl">
              <div className="relative">
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-white text-[10px] shadow" />
                <span className="font-black text-blue-600 text-sm font-mono uppercase tracking-widest">Year 2021 &bull; Surat Genesis</span>
                <h4 className="font-bold text-lg text-slate-900 mt-1">Platform Inception</h4>
                <p className="text-slate-500 text-sm leading-relaxed mt-2">
                  Started operations with an initial pilot testing fleet of 15 two-wheelers in Surat, establishing standard booking practices and manual verification pipelines.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-indigo-600 border-4 border-white flex items-center justify-center text-white text-[10px] shadow" />
                <span className="font-black text-indigo-600 text-sm font-mono uppercase tracking-widest">Year 2023 &bull; Expanded Operations</span>
                <h4 className="font-bold text-lg text-slate-900 mt-1">Four Major Transport Cities Onboarded</h4>
                <p className="text-slate-500 text-sm leading-relaxed mt-2">
                  Expanded regional operational hubs across Ahmedabad, Vadodara, and Rajkot. Formulated dynamic pricing algorithms and optimized client dashboard nodes.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-violet-600 border-4 border-white flex items-center justify-center text-white text-[10px] shadow" />
                <span className="font-black text-violet-600 text-sm font-mono uppercase tracking-widest">Year 2025 &bull; Keyless Sync</span>
                <h4 className="font-bold text-lg text-slate-900 mt-1">Automated Rental Agency Self-Service</h4>
                <p className="text-slate-500 text-sm leading-relaxed mt-2">
                  Launched native agency portals allowing regional dealers to upload and update vehicles independently, reducing human processing latencies by 80%.
                </p>
              </div>
            </div>
          </section>

          {/* Leadership Section */}
          <section className="space-y-12 bg-white rounded-3xl p-8 border border-slate-200/50 shadow-sm">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">Executive Leadership Team</h2>
              <p className="text-slate-500 text-sm">Our directors managing daily network compliance guidelines.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center space-y-3 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-slate-200/60 shadow-md">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBdFw_6S8E8ASNCatYfYmvJ3wmqp5WESQjg4jOxQ-5emkb8dPWcWp1wImthD5IF8CjIGQVPd9k3d_gtJ_TusPnNf2YZq5e7jQ6fm1tj_UnLuYmvHhlFxsv_qbApnI6k35BGzawq6lsnqjBVXV-ZYboftYnXU8wiOJwEugu7F3pa_SfE15JOmVLsNwbFRp7EvQG9cahMRSMOvwD7_XztFjTBNPjbnUf1mP3ubz2hkErFLM9qcj1d0xPp4DNz5xfJTYZC3GZORqZdW21" alt="Keshav Manek" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Keshav Manek</h4>
                  <p className="text-xs uppercase font-extrabold text-blue-600 tracking-wider">Founder &amp; Chief Executive</p>
                </div>
              </div>
              <div className="text-center space-y-3 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-slate-200/60 shadow-md">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9W2bgrRMuHK8gDFs3hiNqLKhKxPxZv4D8RLUsOfPakMvzpow53phwVonfBMN29LWJ8pQUu6GofeoGfhJf1r8PX1rN3XXlmZWrycSGPPacFU5Y9TzwPFCa9bP_tBltxWPVsREcAlN_RRUu49OAQbB4xgOlxtjYlybimismLHc4DIxEGUiLwHvoTGMmtpBgc5IVWWurGQA--So90TIqOzZOPx2tgCtRyqDkV13WYLDYCK6bqBX3i3U6ZYN4SvAfarkIFCfGu31Mp3Tu" alt="Nihu Roshiya" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Nihu Roshiya</h4>
                  <p className="text-xs uppercase font-extrabold text-blue-600 tracking-wider">Operations Director</p>
                </div>
              </div>
              <div className="text-center space-y-3 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-slate-200/60 shadow-md">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIu43fRakJIKhZSbvPIkaU01XdhdiNeojWVaqgIpnQuEzPTjQeJlvmjmfqzN1XjVYjJUI66_2vdtZufApAovCoWWmBEs5i1dduE-3UWisjtYo-qs2PK_XeEQLU6uWP89Ox4zYhjtGEjx34d38RfoG-8xT8AGNR6RnEFG4pVvksG_o1684qmJGIHQBoAjyg-dnoQx90R32CMvFC_GfQXzFWh2YyqMcH1wSe-zdNl7wW4Qa4QoR27KwSytm8k49Mv752FAUO5nNtExMQ" alt="Sagar Manek" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Sagar Manek</h4>
                  <p className="text-xs uppercase font-extrabold text-blue-600 tracking-wider">Head of Tech Support</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 2. CAREERS NETWORK (`careers`) */}
      {activeView === 'careers' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16 animate-fade-in">
          
          <section className="text-center max-w-3xl mx-auto space-y-4">
            <span className="bg-orange-50 text-orange-700 font-bold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-orange-200">
              JOIN THE FUTURE OF MOBILITY
            </span>
            <h1 className="font-extrabold text-4xl sm:text-5xl text-slate-900 tracking-tight leading-none mt-2">
              Careers Network
            </h1>
            <p className="text-slate-500 text-lg">
              Explore dynamic workspaces, high-growth compensation scales, and robust professional autonomy with India's vanguard transportation rental platform.
            </p>
          </section>

          {/* Perks Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm text-center">
              <span className="text-3xl block mb-3">💵</span>
              <h4 className="font-bold text-slate-900">Highly Competitive CTC</h4>
              <p className="text-slate-400 text-xs mt-1.5">Top-of-market salary packages + performance-driven equity scales.</p>
            </div>
            <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm text-center">
              <span className="text-3xl block mb-3">🏥</span>
              <h4 className="font-bold text-slate-900">Comprehensive Health Assurance</h4>
              <p className="text-slate-400 text-xs mt-1.5">Family medical premium waivers and mental wellness coverage.</p>
            </div>
            <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm text-center">
              <span className="text-3xl block mb-3">💻</span>
              <h4 className="font-bold text-slate-900">Latest Tech Infrastructure</h4>
              <p className="text-slate-400 text-xs mt-1.5">Premium workstations, Apple equipment, and learning stipend pools.</p>
            </div>
            <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm text-center">
              <span className="text-3xl block mb-3">🌴</span>
              <h4 className="font-bold text-slate-900">Flexible Hybrid Timings</h4>
              <p className="text-slate-400 text-xs mt-1.5">Work matching your clock node. Complete remote access options.</p>
            </div>
          </div>

          {/* Jobs Listing Matrix */}
          <div className="space-y-6">
            <h3 className="font-extrabold text-2xl text-slate-900 pb-2 border-b">Active Opportunities (3)</h3>

            {[
              { id: 'job_1', title: 'Regional Fleet Operations Director', loc: 'Surat Office HQ', salary: '₹12L - ₹18L CTC', type: 'Full-Time', desc: 'Direct regional fleet allocations audit nodes, and synchronize partner verification workflows across Gujarat regions.' },
              { id: 'job_2', title: 'Senior Full Stack Engineer (React/TypeScript)', loc: 'Remote & Ahmedabad Portal', salary: '₹15L - ₹22L CTC', type: 'Full-Time', desc: 'Own client interfaces, construct safe Local Storage database caching wrappers, and integrate automated API route validations.' },
              { id: 'job_3', title: 'Partner Agency Onboarding Executive', loc: 'Vadodara Hub Terminal', salary: '₹6L - ₹9L CTC', type: 'Full-Time', desc: 'Perform physical audits on partner fleets, align brand guidelines, and review compliance parameters for local dealer accounts.' }
            ].map(job => (
              <div key={job.id} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded tracking-wide uppercase font-mono">{job.type}</span>
                    <span className="text-slate-400 text-sm font-semibold flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.loc}</span>
                  </div>
                  <h4 className="font-extrabold text-xl text-slate-900">{job.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{job.desc}</p>
                </div>
                <div className="text-right flex flex-col sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0">
                  <span className="text-emerald-700 font-extrabold text-lg block">{job.salary}</span>
                  <button 
                    onClick={() => setSelectedJob(job.title)}
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow"
                  >
                    Apply for Role
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Job Application Modal Dialog */}
          {selectedJob && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base">Application Submission</h3>
                    <p className="text-xs text-slate-400 mt-1">Applying for: {selectedJob}</p>
                  </div>
                  <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>
                
                <form onSubmit={handleApplyJob} className="p-6 space-y-4 text-sm font-semibold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400 block font-bold">Candidate Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Marcus Thompson" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-blue-600 text-sm"
                      value={careerForm.name}
                      onChange={e => setCareerForm({...careerForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400 block font-bold">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. marcus@demo.com" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-blue-600 text-sm"
                      value={careerForm.email}
                      onChange={e => setCareerForm({...careerForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400 block font-bold">LinkedIn URL / Portfolio link</label>
                    <input 
                      type="url" 
                      placeholder="https://linkedin.com/in/username" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-blue-600 text-sm"
                      value={careerForm.linkedin}
                      onChange={e => setCareerForm({...careerForm, linkedin: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-slate-400 block font-bold">Upload Resume File</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                      <input 
                        type="file" 
                        id="resume-file"
                        className="hidden" 
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) setCareerForm({...careerForm, resumeName: file.name});
                        }}
                      />
                      <label htmlFor="resume-file" className="cursor-pointer">
                        <span className="text-xs text-blue-600 font-bold block">
                          {careerForm.resumeName ? `✓ Selected: ${careerForm.resumeName}` : 'Click to Upload Resume Document'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Accepts PDF, DOCX up to 5MB</span>
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={jobApplied}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs shadow mt-6"
                  >
                    {jobApplied ? 'Registering Application...' : 'Submit Application Metrics'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CORPORATE ACCOUNTS (`corporate`) */}
      {activeView === 'corporate' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16 animate-fade-in">
          
          <section className="text-center max-w-3xl mx-auto space-y-4">
            <span className="bg-indigo-50 text-indigo-700 font-bold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-indigo-200">
              Enterprise &amp; Corporate Networks
            </span>
            <h1 className="font-extrabold text-4xl sm:text-5xl text-slate-900 tracking-tight leading-none mt-2">
              Rentigo for Businesses
            </h1>
            <p className="text-slate-500 text-lg">
              Streamline physical commute nodes. Deploy dedicated premium fleet operations for staff transportation, client handovers, and corporate account management.
            </p>
          </section>

          {/* Enterprise value cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border rounded-2xl shadow-sm space-y-3">
              <span className="text-3xl">🗓️</span>
              <h4 className="font-bold text-slate-900">Consolidated Monthly Bills</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">One single master invoice allocated automatically with direct Corporate Account reporting.</p>
            </div>
            <div className="p-6 bg-white border rounded-2xl shadow-sm space-y-3">
              <span className="text-3xl">🛡️</span>
              <h4 className="font-bold text-slate-900">Zero Liability Waiver</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">100% full protection coverage included for zero downtime of corporate travelers.</p>
            </div>
            <div className="p-6 bg-white border rounded-2xl shadow-sm space-y-3">
              <span className="text-3xl">👔</span>
              <h4 className="font-bold text-slate-900">VIP Terminal Releases</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">Curbside airport and rapid terminal handovers, skipping any line queues or verification checkpoints.</p>
            </div>
            <div className="p-6 bg-white border rounded-2xl shadow-sm space-y-3">
              <span className="text-3xl">🧩</span>
              <h4 className="font-bold text-slate-900">Custom Fleet Sizing</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">Scale allocated cars from 5 up to 40+ dynamic units based on team projects.</p>
            </div>
          </div>

          {/* Interactive Calculator Bento layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-8">
              <h3 className="font-extrabold text-2xl text-slate-900">Configure Bulk Fleet Valuation</h3>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                Choose a pre-defined corporate bundle size and duration period to instantly evaluate estimated expenditures.
              </p>

              {/* Slider / Select options */}
              <div className="space-y-6 text-sm font-bold text-slate-700">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Select Portfolio Bundle</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => setCorpPackage('standard')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        corpPackage === 'standard' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <h4 className="font-extrabold text-sm text-slate-900">Standard Pack</h4>
                      <p className="text-[10px] text-slate-400 mt-1">5 Vehicles (4W/2W)</p>
                    </button>
                    <button 
                      onClick={() => setCorpPackage('elite')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        corpPackage === 'elite' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <h4 className="font-extrabold text-sm text-slate-900">Business Elite</h4>
                      <p className="text-[10px] text-slate-400 mt-1">15 Premium Units</p>
                    </button>
                    <button 
                      onClick={() => setCorpPackage('custom')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        corpPackage === 'custom' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <h4 className="font-extrabold text-sm text-slate-900">Custom Fleet</h4>
                      <p className="text-[10px] text-slate-400 mt-1">30+ Enterprise Units</p>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Contract Duration limits</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 3, 12].map(dur => (
                      <button 
                        key={dur}
                        onClick={() => setContractDuration(dur as any)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          contractDuration === dur ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {dur} {dur === 1 ? 'Month' : dur === 3 ? 'Months' : 'Year Contract'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Summary Result */}
            <div className="lg:col-span-5 bg-slate-950 text-white p-8 sm:p-10 flex flex-col justify-between border-l border-slate-900">
              <div className="space-y-6">
                <span className="bg-blue-600/90 text-white font-bold text-[10px] uppercase tracking-widest px-3.5 py-1 rounded-full inline-block">Estimated Billing Node</span>
                
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-black">Consolidated Total Cost</p>
                  <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">${calculateCorpPrice().toLocaleString()}.00</h2>
                  <p className="text-xs text-emerald-400">Includes discounted corporate scaling limits.</p>
                </div>

                <div className="border-t border-slate-800 pt-5 space-y-3 text-xs font-medium text-slate-300">
                  <p className="flex justify-between"><span>Base Monthly Valuation:</span> <span className="font-mono text-white">${corpPackage === 'standard' ? '4,800' : corpPackage === 'elite' ? '12,500' : '28,000'}/mo</span></p>
                  <p className="flex justify-between"><span>Duration Factor:</span> <span className="font-mono text-white">{contractDuration} Months</span></p>
                  <p className="flex justify-between"><span>Contract Discount Multiplier:</span> <span className="font-mono text-emerald-400">{contractDuration === 1 ? '0%' : contractDuration === 3 ? '-10%' : '-20%'} Saving</span></p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800 space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">Enter your corporate email address to request custom service level agreements.</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="e.g. logistics@company.com" 
                    className="flex-grow bg-slate-900 border border-slate-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-white"
                    value={corpEmail}
                    onChange={e => setCorpEmail(e.target.value)}
                  />
                  <button 
                    onClick={() => {
                      if (!corpEmail) return alert("Please enter email address field.");
                      setCorpSubmitted(true);
                      setTimeout(() => {
                        setCorpSubmitted(false);
                        setCorpEmail('');
                        alert("Enterprise Request Dispatched: Corporate sales representatives will email custom fleet contracts safely within 12 hours.");
                      }, 1000);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors"
                  >
                    Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRIVACY CHARTER (`privacy`) */}
      {activeView === 'privacy' && (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 animate-fade-in">
          
          <header className="border-b pb-6 space-y-3">
            <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest border">
              GDPR &amp; LOCAL COMPLIANCE
            </span>
            <h1 className="font-extrabold text-4xl text-slate-900 tracking-tight leading-none">Privacy &amp; Encryption Charter</h1>
            <p className="text-slate-500 text-sm">Effective calendar revision node: October 2026. We treat personal files with structural dignity.</p>
          </header>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-8 font-semibold text-slate-600 text-sm leading-relaxed">
            
            <section className="space-y-3">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600 shrink-0" /> 1. Metadata Collection Limits
              </h3>
              <p>
                RentiGo limits data harvesting strictly to essential active variables needed to verify driver authority and configure checkout billing lines. We operate on a need-to-know framework:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-500 font-medium my-3">
                <li>**Identity variables**: Full Name, mobile number node, and physical residential coordinates.</li>
                <li>**Registry documents**: Government Driver License hashes (verified manually and purged afterward).</li>
                <li>**Transient variables**: Browser local storage preferences, session roles, and basic navigation indicators.</li>
              </ul>
            </section>

            <section className="space-y-3 border-t pt-8">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600 shrink-0" /> 2. Secure Local State Caching
              </h3>
              <p>
                All session inputs are handled client-side and saved transparently within your localized browser cache (i.e. browser `localStorage`). This ensures zero transmission of personal trip metadata or coordinates to centralized cloud profiling nodes without explicit consent.
              </p>
            </section>

            <section className="space-y-3 border-t pt-8">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-600 shrink-0" /> 3. Third-Party Payments Integrations
              </h3>
              <p>
                Credit card and processing parameters are proxy-dispatched securely to commercial operators (such as Stripe systems). RentiGo never caches raw credit numbers, PIN matrix codes, or visual identification details inside platform registers.
              </p>
            </section>

            <section className="space-y-3 border-t pt-8">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600 shrink-0" /> 4. GDPR &amp; Privacy Purge Options
              </h3>
              <p>
                You have the absolute right to purge your entire digital footprint from our platform records. Simply navigate to Account Settings and clear local storage, or dispatch a purge ticket in the FAQ center. Your metadata files will be completely deleted.
              </p>
            </section>

            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-6 rounded-2xl">
              <div>
                <p className="font-bold text-slate-900 text-sm">Download Printed PDF Privacy Document</p>
                <p className="text-xs text-slate-400 font-medium">Platform version: 4.8.2 (Secure Release)</p>
              </div>
              <button 
                onClick={() => alert("PDF Dispatch: File rendering successful. Saving document 'rentigo_privacy_charter.pdf' safely.")}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors"
              >
                Save PDF Charter
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. TERMS OF SERVICE (`terms`) */}
      {activeView === 'terms' && (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 animate-fade-in">
          
          <header className="border-b pb-6 space-y-3">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest border">
              LEGAL TERMS AGREEMENT
            </span>
            <h1 className="font-extrabold text-4xl text-slate-900 tracking-tight leading-none">Terms of Service</h1>
            <p className="text-slate-500 text-sm">Effective calendar revision node: October 2026. Review our standard mobility contract terms safely.</p>
          </header>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6">
            
            {/* Direct Policy Search Filter */}
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search terms policies (e.g. age, deposit, fuel)..." 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-indigo-600 font-semibold"
                value={termsSearch}
                onChange={e => setTermsSearch(e.target.value)}
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="divide-y space-y-6">
              {legalPolicies
                .filter(p => !termsSearch || p.title.toLowerCase().includes(termsSearch.toLowerCase()) || p.text.toLowerCase().includes(termsSearch.toLowerCase()) || p.category.toLowerCase().includes(termsSearch.toLowerCase()))
                .map((policy, idx) => (
                  <div key={idx} className="pt-6 first:pt-0 space-y-3">
                    <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider block w-fit font-mono">{policy.category} Clause</span>
                    <h3 className="font-extrabold text-lg text-slate-900">{policy.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-semibold">{policy.text}</p>
                  </div>
              ))}
            </div>

            {legalPolicies.filter(p => !termsSearch || p.title.toLowerCase().includes(termsSearch.toLowerCase()) || p.text.toLowerCase().includes(termsSearch.toLowerCase())).length === 0 && (
              <div className="text-center py-12 text-slate-400 font-bold">
                No policy matches found for keyword "{termsSearch}". Let's clear search parameter node.
              </div>
            )}

          </div>
        </div>
      )}

      {/* 6. COOKIE PREFERENCES (`cookies`) */}
      {activeView === 'cookies' && (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12 animate-fade-in">
          
          <header className="border-b pb-6 space-y-3">
            <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider border">
              USER META PREFERENCES
            </span>
            <h1 className="font-extrabold text-4xl text-slate-900 tracking-tight leading-none">Cookie Settings Tracker</h1>
            <p className="text-slate-500 text-sm">Control browser caching parameters to determine how local files are processed.</p>
          </header>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-8 font-semibold text-slate-700">
            
            <p className="text-sm leading-relaxed">
              Rentigo utilizes cookie files solely to maintain seamless role navigation, save custom search parameters, and retain filter ranges. We do not transmit tracking metrics to third-party commercial databases.
            </p>

            <div className="space-y-4">
              
              {/* Essential Switches */}
              <div className="flex justify-between items-center p-5 bg-slate-50 border rounded-2xl">
                <div className="max-w-lg space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">Essential System Cookies</h4>
                  <p className="text-xs text-slate-400 font-medium">Saves local session IDs and role identities (Customer, Partner Agency, Admin). Required for core operations.</p>
                </div>
                <span className="bg-blue-100 text-blue-700 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full">always active</span>
              </div>

              {/* Performance Switches */}
              <div className="flex justify-between items-center p-5 border rounded-2xl hover:bg-slate-50/50 transition-colors">
                <div className="max-w-lg space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">Performance &amp; Cache Optimization</h4>
                  <p className="text-xs text-slate-400 font-medium">Stores local search keyword memories, pricing range boundaries, and filter selections inside localStorage.</p>
                </div>
                <button 
                  onClick={() => setCookiesSelected({...cookiesSelected, performance: !cookiesSelected.performance})}
                  className={`w-12 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none shrink-0 ${
                    cookiesSelected.performance ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    cookiesSelected.performance ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              {/* Marketing Switches */}
              <div className="flex justify-between items-center p-5 border rounded-2xl hover:bg-slate-50/50 transition-colors">
                <div className="max-w-lg space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">Marketing &amp; Personalization Pixels</h4>
                  <p className="text-xs text-slate-400 font-medium">Logs anonymous system sorting logs to tailor dashboard notifications regarding discounts and seasonal surges.</p>
                </div>
                <button 
                  onClick={() => setCookiesSelected({...cookiesSelected, marketing: !cookiesSelected.marketing})}
                  className={`w-12 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none shrink-0 ${
                    cookiesSelected.marketing ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    cookiesSelected.marketing ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

            </div>

            <div className="pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
              {cookiesSaved ? (
                <span className="text-emerald-600 text-xs font-bold animate-pulse">✓ Preferences saved successfully inside localStorage.</span>
              ) : (
                <span className="text-slate-400 text-xs font-medium">Modify inputs to update tracking matrix boundaries.</span>
              )}
              <button 
                onClick={handleSaveCookies}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow transition-colors"
              >
                Save Meta Preferences
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 7. HELP DESK (`help`) */}
      {activeView === 'help' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16 animate-fade-in">
          
          <header className="text-center max-w-2xl mx-auto space-y-4">
            <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-blue-200">
              RENTIGO CENTRAL HELP DESK
            </span>
            <h1 className="font-extrabold text-4xl text-slate-900 tracking-tight leading-none mt-2">Support Desk &amp; FAQs</h1>
            <p className="text-slate-500 text-sm">Find instant solutions regarding active reservations, billing variables, or dispatch support.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* FAQ Accordions */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-extrabold text-xl text-slate-900 pb-2 border-b">Standard Client Inquiries</h3>
              
              {/* FAQ search input */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Filter FAQ entries by keyword..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm outline-none font-semibold focus:ring-1 focus:ring-blue-600"
                  value={faqSearch}
                  onChange={e => setFaqSearch(e.target.value)}
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {[
                { q: "How do I physically pick up the vehicle?", a: "Once your booking moves to 'Approved' state inside the portal, travel to the designated regional physical Hub terminal matching your contract. Show your active verified customer ID and license parameters to physical attendants to unlock vehicle keys." },
                { q: "What constitutes the fuel / propulsion battery policy?", a: "Borrowers are expected to return the vehicle matching nominal fuel boundaries documented during key handover. For EV listings, you are free to charge for free at any RentiGo specialized charger node inside major terminals." },
                { q: "Are security deposit holds refundable?", a: "Absolutely. Security holds ($100 standard block) placed transiently on credit cards are dispatched back instantly upon checking the car model back with zero damage factors. Credit channels clear bounds in 24 hours." },
                { q: "Can I prolong or extend active bookings?", a: "Yes. From your 'My Bookings' tab, active approved reservations display an 'Extend Rental' option. If the vehicle is not pre-reserved, you can scale the contract limits by processing premium daily charges through card ending in 4242." }
              ].filter(item => !faqSearch || item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase()))
               .map((faq, idx) => (
                <div key={idx} className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                    className="w-full text-left p-5 flex justify-between items-center font-bold text-slate-900 focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="text-blue-500 font-mono text-lg">{faqOpenIndex === idx ? '−' : '+'}</span>
                  </button>
                  {faqOpenIndex === idx && (
                    <div className="px-5 pb-5 pt-1 text-slate-500 text-sm leading-relaxed border-t border-slate-50 font-semibold">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Support Request Form */}
            <div className="lg:col-span-5 bg-white border rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="font-extrabold text-lg text-slate-900 border-b pb-3 mb-5">Open Technical Support Ticket</h3>
              
              <form onSubmit={handleFAQFormSubmit} className="space-y-4 text-sm font-semibold text-slate-700">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block font-bold">Email Identification</label>
                  <input 
                    type="email" 
                    placeholder="demo@rentigo.com" 
                    className="w-full bg-slate-50 border rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-blue-600 text-sm"
                    value={faqForm.email}
                    onChange={e => setFaqForm({...faqForm, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block font-bold">Inquiry Category Tag</label>
                  <select 
                    className="w-full bg-slate-50 border rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-blue-600 text-sm font-semibold cursor-pointer"
                    value={faqForm.category}
                    onChange={e => setFaqForm({...faqForm, category: e.target.value})}
                  >
                    <option>General billing &amp; refunds</option>
                    <option>Physical key handovers</option>
                    <option>Accident / SOS assistance</option>
                    <option>Agency partnership queries</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-slate-400 block font-bold">Inquiry Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Enter details about your platform logs or requested changes..." 
                    className="w-full bg-slate-50 border rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-blue-600 text-sm font-semibold resize-none"
                    value={faqForm.message}
                    onChange={e => setFaqForm({...faqForm, message: e.target.value})}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow"
                >
                  Dispatch Support Ticket
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 8. EMERGENCY HELPLINE (`emergency`) */}
      {activeView === 'emergency' && (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 animate-fade-in">
          
          <div className="bg-red-600 rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden">
            <div className="space-y-2 z-10 max-w-xl">
              <span className="bg-white/20 uppercase tracking-widest text-[9px] font-black px-3 py-1 rounded-full text-white inline-block">critical dispatch node</span>
              <h1 className="font-extrabold text-3xl sm:text-4xl tracking-tight leading-none mt-2">Emergency Hotline</h1>
              <p className="text-red-100 text-sm sm:text-base leading-relaxed font-semibold">Your health, vehicular welfare, and mechanical safety parameters remain our utmost concern.</p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm z-10 text-center uppercase tracking-widest text-[10px] font-mono shrink-0 font-bold border border-white/25">
              Available 24 / 7 / 365
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {/* Immediate SOS dialing contacts */}
            <div className="bg-white rounded-3xl border border-red-100 p-8 space-y-6 shadow-sm">
              <h3 className="font-extrabold text-xl text-slate-900 border-b pb-3 flex items-center gap-2"><PhoneCall className="w-5 h-5 text-red-600" /> Direct Assistance Numbers</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-xs text-rose-800 uppercase font-black">Roadside Towing Help</p>
                    <p className="font-extrabold text-lg text-slate-800 mt-1">1800-419-RENT</p>
                  </div>
                  <a href="tel:18004197368" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-center">📞</a>
                </div>

                <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-xs text-rose-800 uppercase font-black">Accident Response</p>
                    <p className="font-extrabold text-lg text-slate-800 mt-1">1800-112-9111</p>
                  </div>
                  <a href="tel:18001129111" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-center">📞</a>
                </div>

                <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-xs text-rose-800 uppercase font-black">Surat Executive Command Center</p>
                    <p className="font-extrabold text-lg text-slate-800 mt-1">+91 261-244000</p>
                  </div>
                  <a href="tel:+91261244000" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-center">📞</a>
                </div>
              </div>
            </div>

            {/* Instruction Timeline Checklist */}
            <div className="bg-white rounded-3xl border p-8 space-y-6 shadow-sm font-semibold text-slate-600 text-sm">
              <h3 className="font-extrabold text-xl text-slate-900 border-b pb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Immediate Protocols</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-slate-100 border text-slate-700 flex items-center justify-center font-mono font-bold shrink-0">1</span>
                  <p>Park safely on city margins, turn on vehicular hazard lights, and secure passenger health status metrics.</p>
                </div>
                <div className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-slate-100 border text-slate-700 flex items-center justify-center font-mono font-bold shrink-0">2</span>
                  <p>Gather physical GPS coordinates, road identifiers, or regional crossroads parameters to relay to dispatchers.</p>
                </div>
                <div className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-slate-100 border text-slate-700 flex items-center justify-center font-mono font-bold shrink-0">3</span>
                  <p>Dial roadside support above. Attendant operators will coordinate dispatch trucks from partner agencies instantly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* SOS Beacon Stimulation widget */}
          <div className="bg-slate-900 border text-white p-6 sm:p-8 rounded-3xl text-center space-y-5 relative overflow-hidden">
            <span className="text-4xl block animate-pulse">📡</span>
            <div className="space-y-2 max-w-sm mx-auto">
              <h4 className="font-extrabold text-lg">Distress SOS Beacon</h4>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed">Simulate regional location broadcast to transmit active terminal support units locally.</p>
            </div>
            
            {sosActive ? (
              <div className="bg-red-950/80 border border-red-500 rounded-2xl p-4 max-w-md mx-auto animate-pulse">
                <p className="text-red-400 font-extrabold text-sm uppercase tracking-wider">📡 ACTIVE BEACON DISPATCHED</p>
                <p className="text-slate-300 text-xs font-semibold mt-1">Regional Surat operators are syncing diagnostics. Stand by for contact in {sosTimer}s.</p>
              </div>
            ) : (
              <button 
                onClick={handleTriggerSOS}
                className="bg-red-650 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg hover:shadow-red-500/20 active:scale-95 transition-all text-center"
              >
                ★ Trigger SOS Beacon (Simulated)
              </button>
            )}
          </div>
        </div>
      )}

      {/* 9. HUB TERMINALS (`hubs`) */}
      {activeView === 'hubs' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12 animate-fade-in">
          
          <header className="text-center max-w-2xl mx-auto space-y-4">
            <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-blue-200">
              PHYSICAL HANDOVER TERMINALS
            </span>
            <h1 className="font-extrabold text-4xl text-slate-900 tracking-tight leading-none mt-2">Hub Terminals</h1>
            <p className="text-slate-500 text-sm">Strategic physical collection centers. Attendants verify reservations and release keys instantly.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Hub list Cards */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="font-extrabold text-xl text-slate-900 pb-2 border-b">Active Locations in India (4)</h3>

              {[
                { id: 'Surat', name: 'Surat Central HQ Hub', addr: 'Circle Ring Road, Terminal Block 2, Surat, Gujarat', units: 48, times: '06:00 AM - 11:30 PM', amen: ['EV Rapid Chargers', ' helmet sanitizers', ' luggage lockers'] },
                { id: 'Ahmedabad', name: 'Ahmedabad Airport Bypass', addr: 'Domestic Arrivals Gate Ground, Ahmedabad, Gujarat', units: 36, times: '24/7 Operations', amen: ['24/7 drop-boxes', ' complimentary refreshments', ' mechanical bay'] },
                { id: 'Vadodara', name: 'Vadodara Junction West Terminal', addr: 'Main Station Gate Crossway, Vadodara, Gujarat', units: 28, times: '07:00 AM - 10:00 PM', amen: ['Helmet sanitation nodes', ' quick wash blocks', ' lounge seating'] },
                { id: 'Rajkot', name: 'Rajkot Kalawad Road Node', addr: 'Kalawad Road Bypass Crossing, Rajkot, Gujarat', units: 36, times: '08:00 AM - 11:00 PM', amen: ['EV Charging slots', ' premium mechanical detailing', ' tea counters'] }
              ].map(hub => (
                <div 
                  key={hub.id}
                  onClick={() => setSelectedHub(hub.id)}
                  className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer text-sm font-semibold text-slate-600 flex flex-col sm:flex-row justify-between items-start gap-4 ${
                    selectedHub === hub.id ? 'border-blue-600 ring-2 ring-blue-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <h4 className="font-extrabold text-base text-slate-900">{hub.name}</h4>
                    </div>
                    <p className="text-slate-500 font-medium text-xs flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {hub.addr}</p>
                    <p className="text-xs text-slate-400 font-mono">Timings: {hub.times}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {hub.amen.map((am, i) => (
                        <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded px-2 py-0.5">⚙ {am}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right sm:items-end flex sm:flex-col justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 shrink-0">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded tracking-wide uppercase font-mono">{hub.units} Available Fleet Units</span>
                    <button className="text-xs font-bold text-blue-600 hover:underline mt-2 inline-block">Spotlight on Map →</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Spotlight Sidebar Map preview */}
            <div className="lg:col-span-5 bg-slate-900 rounded-3xl relative overflow-hidden flex flex-col justify-between border shadow-inner text-white h-[560px]">
              {/* Styled Interactive Live Map background */}
              <div className="absolute inset-0 z-0 opacity-40">
                <iframe
                  title="Terminal Location Map"
                  src={{
                    Surat: 'https://www.openstreetmap.org/export/embed.html?bbox=72.78,21.14,72.88,21.20&layer=mapnik&marker=21.1702,72.8311',
                    Ahmedabad: 'https://www.openstreetmap.org/export/embed.html?bbox=72.52,22.99,72.62,23.05&layer=mapnik&marker=23.0225,72.5714',
                    Vadodara: 'https://www.openstreetmap.org/export/embed.html?bbox=73.13,22.27,73.23,22.34&layer=mapnik&marker=22.3072,73.1812',
                    Vadodra: 'https://www.openstreetmap.org/export/embed.html?bbox=73.13,22.27,73.23,22.34&layer=mapnik&marker=22.3072,73.1812',
                    Rajkot: 'https://www.openstreetmap.org/export/embed.html?bbox=70.75,22.27,70.85,22.33&layer=mapnik&marker=22.3039,70.8022'
                  }[selectedHub] || 'https://www.openstreetmap.org/export/embed.html?bbox=72.78,21.14,72.88,21.20&layer=mapnik'}
                  className="w-full h-full border-0 pointer-events-auto"
                  scrolling="no"
                ></iframe>
                {/* Dark slate tint overlay */}
                <div className="absolute inset-0 bg-slate-950/20 mix-blend-multiply pointer-events-none"></div>
              </div>

              {/* Spotlight description */}
              <div className="p-4 bg-slate-950/80 backdrop-blur-sm flex justify-between items-center z-10 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-xs font-black tracking-widest text-emerald-400">
                  ● ACTIVE SPOTLIGHT PIN
                </span>
                <span className="text-xs font-mono text-slate-300">Terminal Code: HUB-{selectedHub.toUpperCase()}</span>
              </div>

              {/* Pin bouncing animation */}
              <div className="absolute inset-0 flex items-center justify-center z-10 flex-col">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow-2xl animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="mt-2 bg-slate-950/85 text-white text-[10px] font-black px-3 py-1 rounded shadow-lg border border-slate-800 uppercase tracking-widest">
                  {selectedHub} ACTIVE STATION
                </span>
              </div>

              <div className="p-6 bg-slate-950/85 backdrop-blur-md z-10 border-t border-slate-800 space-y-4">
                <h4 className="font-bold text-base text-blue-400">Handover Directions Node</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  Attendants at {selectedHub === 'Surat' ? 'Surat Central' : selectedHub === 'Ahmedabad' ? 'Ahmedabad Airport' : selectedHub === 'Vadodara' ? 'Vadodara Station' : 'Rajkot'} are on standby to hand keys in five minutes after manual terminal checkin.
                </p>
                <div className="grid grid-cols-2 gap-3 text-center text-xs pt-2">
                  <button 
                    onClick={() => alert(`Directions calculated successfully: 2.4 km from selected city landmarks. GPS coordinate logged.`)}
                    className="bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg font-bold text-white transition-colors"
                  >
                    View Directions
                  </button>
                  <button 
                    onClick={() => { onChangeView('search'); }}
                    className="bg-slate-800 hover:bg-slate-700 py-2.5 rounded-lg font-bold text-slate-200 transition-colors"
                  >
                    Find Fleet matching
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
