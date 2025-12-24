import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  BarChart3, 
  Map as MapIcon, 
  Users, 
  Briefcase, 
  Train, 
  Radio, 
  Search, 
  Loader2,
  MapPin,
  RefreshCw,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Download,
  Zap,
  Activity,
  Smartphone
} from 'lucide-react';
// @ts-ignore
import jsPDF from 'jspdf';
// @ts-ignore
import html2canvas from 'html2canvas';
import { generateMarketReport } from './services/geminiService.ts';
import { MarketReport, GenerationState } from './types.ts';
import { StatBox, SectionHeader, Tag, UtilityButton, DemographicBar } from './components/UIComponents.tsx';
import { US_MARKETS } from './data/markets.ts';

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [report, setReport] = useState<MarketReport | null>(null);
  const [status, setStatus] = useState<GenerationState>({
    isLoading: false,
    error: null,
    hasGenerated: false
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Click outside handler to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filtered = US_MARKETS.filter(market => 
        market.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to top 5 suggestions
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (market: string, shouldSubmit = false) => {
    setInputValue(market);
    setShowSuggestions(false);
    if (shouldSubmit) {
      handleGenerate(market);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[activeIndex], true);
      }
    }
  };

  const handleGenerate = useCallback(async (marketToSearch: string) => {
    if (!marketToSearch.trim()) return;

    setStatus({ isLoading: true, error: null, hasGenerated: false });
    setIsExpanded(false); // Reset expansion state on new search
    
    try {
      const data = await generateMarketReport(marketToSearch);
      setReport(data);
      setStatus({ isLoading: false, error: null, hasGenerated: true });
    } catch (err) {
      setStatus({ 
        isLoading: false, 
        error: "Failed to generate report. Please check the market name or zip code.", 
        hasGenerated: false 
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate(inputValue);
  };

  const loadExample = () => {
    setInputValue("Detroit, MI");
    handleGenerate("Detroit, MI");
  };

  const handleDownloadPDF = async () => {
    if (!report) return;
    setIsDownloading(true);

    try {
      // Small delay to ensure render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const element = document.getElementById('pdf-report-template');
      if (!element) {
        throw new Error("Template not found");
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MediaDrive_Report_${report.marketName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      
    } catch (error) {
      console.error("PDF Generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    // 1. Global Layout & Container
    <div className="w-full min-h-screen bg-[#f9fafb] flex flex-col items-center pt-6 pb-12 px-4">
      <div className="w-full max-w-[460px] mx-auto">
        
        {/* 2. Signature Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/10 mb-5 text-white flex items-center justify-center transform -rotate-6 hover:scale-105 duration-300">
            <BarChart3 className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            Local Market Reporter
          </h1>
          <p className="text-[13px] text-gray-500 max-w-[420px] mx-auto font-normal leading-relaxed">
            AI-powered market intelligence. Demographics, household data, and strategic insights for media buyers.
          </p>
        </div>

        {/* 3. Main Toolbox Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-200 p-6 relative overflow-visible transition-all duration-500">
          
          {/* Input Area */}
          <form onSubmit={handleSubmit} className="mb-6 relative">
            <div className="relative group" ref={wrapperRef}>
              <input
                type="text"
                placeholder="City, State, ZIP, or DMA (e.g. Chicago)"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => { if(inputValue) setShowSuggestions(true); }}
                disabled={status.isLoading}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 text-base placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 disabled:opacity-70"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-xl shadow-gray-200/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                  {suggestions.map((market, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectSuggestion(market, true)}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-gray-50 last:border-0 flex items-center gap-2
                        ${index === activeIndex ? 'bg-gray-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}
                      `}
                    >
                      <MapPin className={`w-3.5 h-3.5 ${index === activeIndex ? 'text-blue-500' : 'text-gray-400'}`} />
                      {market}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {!status.hasGenerated && !status.isLoading && (
              <div className="flex justify-center mt-4">
                 <UtilityButton type="button" onClick={loadExample} className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    Load Detroit Example
                 </UtilityButton>
              </div>
            )}
          </form>

          {/* Loading State */}
          {status.isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-sm text-gray-500 font-medium">Analyzing Demographics...</p>
              <p className="text-xs text-gray-400 mt-1">Building report for {inputValue}</p>
            </div>
          )}

          {/* Error State */}
          {status.error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm text-center mb-4">
              {status.error}
            </div>
          )}

          {/* Report Display */}
          {report && !status.isLoading && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{report.marketName}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded uppercase">{report.locationType}</span>
                    <p className="text-[11px] text-gray-400 font-medium tracking-wide">MARKET OVERVIEW</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <UtilityButton onClick={handleDownloadPDF} disabled={isDownloading}>
                    {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  </UtilityButton>
                  <UtilityButton onClick={() => handleGenerate(report.marketName)}>
                    <RefreshCw className="w-3.5 h-3.5" />
                  </UtilityButton>
                </div>
              </div>

              {/* Map Visual */}
              <div className="w-full h-40 bg-gray-100 rounded-2xl overflow-hidden mb-6 border border-gray-200 relative group">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight={0} 
                  marginWidth={0} 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(report.mapView?.keyword || report.marketName)}&t=m&z=${report.mapView?.zoom || 10}&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                  title="Market Map"
                ></iframe>
                <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-gray-500 pointer-events-none">
                  MAP VIEW
                </div>
              </div>

              {/* Primary Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <StatBox label="Population" value={report.population} trend={report.populationTrend} />
                <StatBox label="Households" value={report.households} />
                <StatBox label="Median Age" value={report.medianAge} />
                <StatBox label="Med. HH Income" value={report.householdIncome} />
              </div>

              {/* Top Line Insights */}
              <SectionHeader title="Top Line Insights" icon={Lightbulb} />
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 mb-6">
                <ul className="space-y-2">
                  {report.topLineInsights.map((insight, idx) => (
                    <li key={idx} className="flex gap-2 text-[13px] text-gray-700 leading-relaxed font-medium">
                      <span className="text-amber-500 mt-1">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expand Action */}
              {!isExpanded && (
                 <button 
                  onClick={() => setIsExpanded(true)}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 flex items-center justify-center gap-2 transition-all"
                 >
                   <span>View Full Demographic Report</span>
                   <ChevronDown className="w-3.5 h-3.5" />
                 </button>
              )}

              {/* Expanded Content */}
              {isExpanded && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  
                  {/* Demographics Detail Grid */}
                  <SectionHeader title="Demographic Breakdown" icon={Users} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-4">
                    
                    {/* Age Column */}
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Age Structure</h4>
                      {report.ageBreakdown.map((item, i) => (
                        <DemographicBar key={i} label={item.label} percentage={item.percentage} colorClass="bg-blue-500" />
                      ))}
                    </div>

                    {/* Ethnicity Column */}
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Ethnicity</h4>
                      {report.ethnicityBreakdown.map((item, i) => (
                        <DemographicBar key={i} label={item.label} percentage={item.percentage} colorClass="bg-indigo-500" />
                      ))}
                    </div>
                  </div>

                  <SectionHeader title="Media Consumption" icon={Smartphone} />
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mb-6">
                    <ul className="space-y-2">
                      {report.mediaUsage.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-[13px] text-gray-700 leading-relaxed font-medium">
                          <span className="text-blue-500 mt-1">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <SectionHeader title="Key Territories & Hotspots" icon={MapPin} />
                  <div className="flex flex-wrap mb-4">
                    {report.hotspots.map((place, i) => (
                      <Tag key={i} text={place} />
                    ))}
                  </div>

                  <SectionHeader title="Lifestyle & Psychographics" icon={Activity} />
                  <div className="flex flex-wrap mb-6">
                    {report.psychographics.map((item, i) => (
                      <Tag key={i} text={item} />
                    ))}
                  </div>

                  <SectionHeader title="Top Industries" icon={Briefcase} />
                  <div className="flex flex-wrap mb-4">
                    {report.topIndustries.map((industry, i) => (
                      <Tag key={i} text={industry} />
                    ))}
                  </div>

                  <SectionHeader title="Transit & Mobility" icon={Train} />
                  <p className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-2xl border border-gray-200 mb-6">
                    {report.transitHabits}
                  </p>

                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="w-full py-3 mb-3 bg-blue-600 hover:bg-blue-700 border border-transparent rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    <span>Download PDF Market Report</span>
                  </button>

                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Collapse Report</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* HIDDEN PDF TEMPLATE */}
      {report && (
        <div 
           id="pdf-report-template" 
           className="fixed -left-[9999px] top-0 w-[800px] bg-white p-12 text-gray-900"
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
             <div className="transform -rotate-12 opacity-[0.03] flex flex-col items-center">
                <BarChart3 className="w-96 h-96 text-blue-600" />
                <h1 className="text-8xl font-black text-gray-900 mt-4 whitespace-nowrap">MEDIA DRIVE PRO</h1>
             </div>
          </div>

          <div className="relative z-10">
            {/* PDF Header */}
            <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-5">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <h1 className="text-4xl font-bold text-gray-900">{report.marketName}</h1>
                     <span className="text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded uppercase transform -translate-y-1">{report.locationType}</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Market Intelligence Report</p>
               </div>
               <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <BarChart3 className="w-6 h-6 text-white" />
                   </div>
                   <div className="text-right">
                     <div className="text-lg font-bold text-gray-900 leading-none">Media Drive <span className="text-blue-600">Pro</span></div>
                     <div className="text-[10px] text-gray-400 font-medium">Powered by Gemini AI</div>
                   </div>
               </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-3 mb-6">
               <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Population</div>
                  <div className="text-xl font-bold text-gray-900">{report.population}</div>
                  <div className="text-[9px] text-gray-400 mt-0.5">{report.populationTrend}</div>
               </div>
               <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Households</div>
                  <div className="text-xl font-bold text-gray-900">{report.households}</div>
               </div>
               <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Median Age</div>
                  <div className="text-xl font-bold text-gray-900">{report.medianAge}</div>
               </div>
               <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Med. Income</div>
                  <div className="text-xl font-bold text-gray-900">{report.householdIncome}</div>
               </div>
            </div>

            {/* Top Line Insights */}
            <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 mb-6">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                Strategic Insights
              </h3>
              <ul className="space-y-2">
                  {report.topLineInsights.map((insight, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-gray-800 leading-snug">
                      <span className="text-amber-600 font-bold">•</span>
                      {insight}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Demographics Row */}
            <div className="grid grid-cols-2 gap-6 mb-6">
               <div>
                  <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-100 pb-1">Age Distribution</h3>
                  {report.ageBreakdown.map((item, i) => (
                     <DemographicBar key={i} label={item.label} percentage={item.percentage} colorClass="bg-blue-600" />
                  ))}
               </div>
               <div>
                  <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-3 border-b border-gray-100 pb-1">Ethnicity</h3>
                   {report.ethnicityBreakdown.map((item, i) => (
                     <DemographicBar key={i} label={item.label} percentage={item.percentage} colorClass="bg-gray-600" />
                  ))}
               </div>
            </div>

            {/* New Sections Row: Media & Hotspots */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-100">
                <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-blue-600" /> Media Usage
                </h3>
                <ul className="space-y-1.5">
                  {report.mediaUsage.map((item, idx) => (
                    <li key={idx} className="text-xs text-gray-700 leading-snug flex gap-2">
                      <span className="text-blue-500 font-bold">›</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> High-Traffic Zones
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                   {report.hotspots.map((place, i) => (
                      <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-semibold text-gray-600">
                        {place}
                      </span>
                   ))}
                </div>
                
                <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2 mt-4">
                  <Activity className="w-3.5 h-3.5 text-green-600" /> Psychographics
                </h3>
                <div className="flex flex-wrap gap-1.5">
                   {report.psychographics.map((item, i) => (
                      <span key={i} className="px-2 py-1 bg-green-50 border border-green-100 rounded text-[10px] font-semibold text-green-700">
                        {item}
                      </span>
                   ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Landscape & Industries */}
            <div className="grid grid-cols-2 gap-6">
               <div>
                  <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-gray-500" /> Media Landscape Overview
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">
                    {report.mediaLandscape}
                  </p>
               </div>
               <div>
                   <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-gray-500" /> Top Industries
                   </h3>
                   <div className="flex flex-wrap gap-1.5">
                      {report.topIndustries.map((industry, i) => (
                        <span key={i} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-[10px] font-medium text-gray-600">
                           {industry}
                        </span>
                      ))}
                   </div>
               </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400">
                <span>Generated by Media Drive Pro</span>
                <span>{new Date().toLocaleDateString()}</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default App;