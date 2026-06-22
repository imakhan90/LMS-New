import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Bookmark, 
  BookmarkCheck, 
  BookOpen, 
  Plus, 
  Check, 
  Loader2, 
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { LibraryItem, User } from '../types';

interface DigitalLibraryProps {
  user: User;
  initialSearchTerm?: string;
  onClearInitialSearch?: () => void;
}

export default function DigitalLibrary({ user, initialSearchTerm, onClearInitialSearch }: DigitalLibraryProps) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // PDF Preview State
  const [previewingItem, setPreviewingItem] = useState<LibraryItem | null>(null);
  const [previewPages, setPreviewPages] = useState<string[]>([]);
  const [activePreviewPage, setActivePreviewPage] = useState(0);

  // Professor Add document state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formCategory, setFormCategory] = useState('Computer Science');
  const [formSize, setFormSize] = useState('5.4 MB');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLibraryItems();
  }, []);

  // Sync initial unified search triggers
  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
      // Select appropriate category as 'All' or auto search
      setSelectedCategory('All');
      if (onClearInitialSearch) {
        onClearInitialSearch();
      }
    }
  }, [initialSearchTerm]);

  const fetchLibraryItems = () => {
    fetch('/api/library')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Error fetching library catalog', err))
      .finally(() => setLoading(false));
  };

  const handleDownload = (item: LibraryItem) => {
    fetch(`/api/library/${item.id}/download`, { method: 'POST' })
      .then(res => res.json())
      .then((data) => {
        // Update local items array download counts
        setItems(prev => prev.map(current => {
          if (current.id === item.id) {
            return { ...current, downloadsCount: data.downloadsCount };
          }
          return current;
        }));
        
        // Mock actual download file download trigger
        const blob = new Blob([`Content of ${item.title}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${item.title.toLowerCase().replace(/ /g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(err => console.error(err));
  };

  const handlePreview = (item: LibraryItem) => {
    setPreviewingItem(item);
    setActivePreviewPage(0);
    
    // Dynamically generate simulated book chapters based on Category
    if (item.category === 'Quranic Studies') {
      setPreviewPages([
        'SURAH AL-ASR CLASSICAL COMMENTARIES\n\nChapter 1: History and Revelation\nSurah Al-Asr was revealed in Makkah. It outlines the code of success. Life represents a trading commodity where Time itself is the capital.',
        'Chapter 2: Mutual Counsel of Truth\nBelief must translate directly into constructive righteousness. This manifests as advising others to adhere to the core TRUTH under all conditions.'
      ]);
    } else if (item.category === 'Software Engineering' || item.category === 'Computer Science') {
      setPreviewPages([
        'DEVELOPER PARADIGMS MANUAL\n\nChapter 1: The Principle of Least Astonishment\nDesigning software modules implies high cohesiveness. A class should encapsulate one cohesive domain behavior.',
        'Chapter 2: Decoupled Architectural Boundaries\nInject interfaces at logical borders. High-level orchestrators must remain decoupled from specific infrastructure database configurations.'
      ]);
    } else {
      setPreviewPages([
        'ACADEMIC SYLLABUS EXTRACTION NOTES\n\nSection 1: General Core Outline\nThis reference handbook covers terms tested within final assessments. Review diagrams carefully.',
        'Section 2: References Catalog\nPrepare reviews ahead of time.'
      ]);
    }
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formAuthor) return;

    setIsSubmitting(true);
    fetch('/api/library', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formTitle,
        author: formAuthor,
        category: formCategory,
        fileSize: formSize
      })
    })
      .then(res => res.json())
      .then(() => {
        fetchLibraryItems();
        setFormTitle('');
        setFormAuthor('');
        setShowAddForm(false);
      })
      .catch(err => console.error(err))
      .finally(() => setIsSubmitting(false));
  };

  const toggleBookmark = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isBookmarked: !item.isBookmarked };
      }
      return item;
    }));
  };

  const categories = ['All', 'Computer Science', 'Software Engineering', 'Quranic Studies', 'Marketing', 'Educational Technology'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header bar and Add books control */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-linear-to-r from-slate-50 to-white p-6 rounded-3xl border border-slate-200/60 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-xs shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Institute Digital Library Catalog
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Searchable reference textbooks, research papers, and lecture notes
            </p>
          </div>
        </div>

        {(user.role === 'professor' || user.role === 'admin') && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 bg-white/20 rounded-md p-0.5" />
            <span>Add Educational Document</span>
          </button>
        )}
      </div>

      {/* Add Document Expansion form */}
      {showAddForm && (
        <form onSubmit={handleAddDocument} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 max-w-xl">
          <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">Publish New Library Resource</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Document/Book Title</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Structure of Computer Programs"
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Author Name</label>
              <input
                type="text"
                required
                value={formAuthor}
                onChange={(e) => setFormAuthor(e.target.value)}
                placeholder="e.g. Hal Abelson"
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Category Subject</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900 bg-white"
              >
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">File Footprint Size</label>
              <input
                type="text"
                value={formSize}
                onChange={(e) => setFormSize(e.target.value)}
                placeholder="e.g. 14.5 MB"
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-white hover:bg-slate-50 text-slate-500 font-bold px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-sky-600 hover:bg-sky-500 text-white font-extrabold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : 'Publish Book'}
            </button>
          </div>
        </form>
      )}

      {/* Main Catalog View Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Category selector and book cards items listing */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Beautiful Search and Category Filter Deck */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-100/40 space-y-5">
            
            {/* Search Input and active search items pill indicator */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <Search className="h-4.5 w-4.5 text-blue-500" />
              </div>
              <input
                type="text"
                placeholder="Search by title, author names, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-28 py-3.5 bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-100 focus:border-blue-500 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200 shadow-inner"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-16 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-bold bg-slate-200/60 hover:bg-slate-200 px-2 py-1 rounded-md transition"
                >
                  Clear
                </button>
              )}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-100/80 border border-slate-200/60 px-2 py-1 rounded-lg">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </div>
            </div>

            {/* Category horizontal tag scroller with subtle gradient masks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <span>Filter by Category / Subject</span>
                {selectedCategory !== 'All' && (
                  <button 
                    onClick={() => setSelectedCategory('All')} 
                    className="text-blue-500 hover:text-blue-600 font-bold transition lowercase normal-case"
                  >
                    Reset filters
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 -mx-1 px-1">
                {categories.map(cat => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      id={`cat-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100 scale-102 font-bold' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-transparent hover:border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Book Catalog list */}
          {loading ? (
            <div className="animate-pulse text-stone-400 text-xs py-8 text-center">Loading university library indexes...</div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl text-center border text-slate-400 text-xs">
              No matching textbooks or research papers found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map(item => {
                const isZip = item.title.toLowerCase().includes('zip') || item.title.toLowerCase().includes('code');
                const isDoc = item.title.toLowerCase().includes('doc') || item.title.toLowerCase().includes('notes') || item.title.toLowerCase().includes('syllabus');
                const docBg = isZip ? 'bg-amber-100 text-amber-600' : isDoc ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600';
                const docLabel = isZip ? 'ZIP' : isDoc ? 'DOC' : 'PDF';
                
                return (
                  <div 
                    key={item.id} 
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="flex gap-3 items-start relative">
                      <div className={`w-10 h-12 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 select-none ${docBg}`}>
                        {docLabel}
                      </div>
                      
                      <div className="space-y-1 relative flex-1 pr-6 overflow-hidden">
                        <button 
                          type="button" 
                          onClick={() => toggleBookmark(item.id)}
                          className="absolute right-0 top-0 text-slate-400 hover:text-amber-500 transition"
                        >
                          {item.isBookmarked ? <BookmarkCheck className="h-4 w-4 text-amber-500" /> : <Bookmark className="h-4 w-4" />}
                        </button>
                        
                        <span className="text-[9px] bg-slate-50 text-slate-500 font-bold px-2 py-0.5 rounded uppercase border border-slate-100/50">
                          {item.category}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-800 line-clamp-1 pt-1">{item.title}</h4>
                        <p className="text-xxs text-slate-400 font-semibold">{item.author}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xxs text-slate-500">
                      <span className="font-bold">{item.fileSize} &bull; {item.downloadsCount} downloads</span>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handlePreview(item)}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg transition"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleDownload(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-1 rounded-lg transition flex items-center gap-0.5"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Side: Inline Document Readers Previews Widget */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4 min-h-[300px]">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="h-4 w-4 text-sky-600" />
              LMS Book Previewer
            </h3>

            {previewingItem ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{previewingItem.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-none">{previewingItem.author}</p>
                </div>

                {/* Readable Paper Area */}
                <div className="bg-amber-50/20 border border-amber-900/10 rounded-2xl p-4 min-h-[160px] max-h-[220px] overflow-y-auto font-mono text-[11px] leading-relaxed text-stone-700 shadow-inner">
                  {previewPages[activePreviewPage]}
                </div>

                {/* Preview pages switcher */}
                <div className="flex justify-between items-center text-xxs text-slate-400 font-bold border-t border-slate-100 pt-3">
                  <span>Page {activePreviewPage + 1} of {previewPages.length}</span>
                  <div className="flex gap-2">
                    <button
                      disabled={activePreviewPage === 0}
                      onClick={() => setActivePreviewPage(prev => prev - 1)}
                      className="bg-slate-50 hover:bg-slate-150 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md transition disabled:opacity-40"
                    >
                      Back
                    </button>
                    <button
                      disabled={activePreviewPage === previewPages.length - 1}
                      onClick={() => setActivePreviewPage(prev => prev + 1)}
                      className="bg-slate-50 hover:bg-slate-150 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md transition disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-slate-400 py-12 gap-3">
                <FileText className="h-10 w-10 text-slate-300" />
                <p className="text-xxs px-6">
                  Select any book or handout chapter and click "Preview" to inspect contents instantly before downloading.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
