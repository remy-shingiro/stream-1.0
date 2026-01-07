import { useState, useMemo } from 'react';
import { saveOrUpdateContent, deleteContent } from '../services/githubService';
import toast from 'react-hot-toast';

// --- CONFIGURATION ---
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

const AdminPanel = ({ movies }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    title: '', description: '', poster_url: '', 
    video_url: '', download_url: '', category: 'Action', type: 'movie',
    is_popular: false, interpreter_name: '',
    seasons: [] 
  };
  const [formData, setFormData] = useState(initialForm);

  // State for adding new episodes (Now includes downloadLink)
  const [newEpisodeInput, setNewEpisodeInput] = useState({}); 

  // --- FILTERING LOGIC ---
  const filteredContent = useMemo(() => {
    return movies.filter(item => {
      const matchesTab = activeTab === 'all' ? true : item.type === activeTab;
      const title = item.title || ""; 
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [movies, activeTab, searchTerm]);

  // --- CLOUDINARY UPLOAD LOGIC ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_PRESET) {
      toast.error("Cloudinary keys missing!");
      return;
    }

    setIsUploading(true);
    const uploadToast = toast.loading("Uploading image...");
    
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });
      const fileData = await res.json();
      
      if (fileData.secure_url) {
        setFormData(prev => ({ ...prev, poster_url: fileData.secure_url }));
        toast.success("Image uploaded!");
      } else {
        throw new Error(fileData.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      toast.dismiss(uploadToast);
      setIsUploading(false);
    }
  };

  // --- SERIES & COLLECTION MANAGEMENT LOGIC ---
  const addSeason = () => {
    setFormData(prev => ({
      ...prev,
      seasons: [
        ...prev.seasons,
        { seasonNumber: prev.seasons.length + 1, episodes: [] }
      ]
    }));
  };

  const removeSeason = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      seasons: prev.seasons.filter((_, index) => index !== indexToRemove)
    }));
  };

  const addEpisodeToSeason = (seasonIndex) => {
    const input = newEpisodeInput[seasonIndex];
    if (!input?.title || !input?.link) return toast.error("Content needs title & link");

    setFormData(prev => {
      const updatedSeasons = [...prev.seasons];
      updatedSeasons[seasonIndex].episodes.push({
        episodeNumber: updatedSeasons[seasonIndex].episodes.length + 1,
        title: input.title,
        link: input.link,
        downloadLink: input.downloadLink || ''
      });
      return { ...prev, seasons: updatedSeasons };
    });

    // Clear input
    setNewEpisodeInput(prev => ({ ...prev, [seasonIndex]: { title: '', link: '', downloadLink: '' } }));
  };

  const removeEpisode = (seasonIndex, episodeIndex) => {
    setFormData(prev => {
      const updatedSeasons = [...prev.seasons];
      updatedSeasons[seasonIndex].episodes = updatedSeasons[seasonIndex].episodes.filter((_, idx) => idx !== episodeIndex);
      return { ...prev, seasons: updatedSeasons };
    });
  };

  // --- FORM SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Title is required!");

    // Validation for Series OR Collection
    if ((formData.type === 'series' || formData.type === 'collection') && formData.seasons.length === 0) {
      return toast.error(formData.type === 'collection' ? "Collection must have at least one part!" : "Series must have at least one season!");
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Saving changes to GitHub...");

    const itemToSave = {
      ...formData,
      id: editingId || Date.now().toString(),
      video_url: formData.type === 'movie' ? formData.video_url : null,
      download_url: formData.type === 'movie' ? formData.download_url : null,
      // Both Series and Collections use the seasons array
      seasons: (formData.type === 'series' || formData.type === 'collection') ? formData.seasons : []
    };

    const success = await saveOrUpdateContent(itemToSave, !!editingId);
    
    toast.dismiss(loadingToast);

    if (success) {
      toast.success(editingId ? "Updated Successfully!" : "Added Successfully!");
      if (!editingId) setFormData(initialForm);
      setEditingId(null);
      setTimeout(() => window.location.reload(), 1500); 
    } else {
      toast.error("Save failed. Check console.");
    }
    setIsSaving(false);
  };

  const handleEdit = (item) => {
    setFormData({ ...item, seasons: item.seasons || [] });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast("Editing mode enabled", { icon: '✏️' });
  };

  const handleDelete = async (item) => {
    if(!window.confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    setIsSaving(true);
    const loadingToast = toast.loading("Deleting content...");
    const success = await deleteContent(item);
    toast.dismiss(loadingToast);
    if (success) {
      toast.success("Deleted Successfully");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      toast.error("Delete failed.");
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-800 pb-6 gap-4">
          <h1 className="text-3xl font-bold text-red-600">Admin Dashboard</h1>
          <button onClick={() => window.open('/', '_blank')} className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">View Site</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: EDITOR FORM --- */}
          <div className="lg:col-span-5">
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-800 sticky top-6 max-h-[85vh] overflow-y-auto custom-scrollbar shadow-2xl">
              <h2 className="text-xl font-bold mb-4 text-white flex justify-between items-center sticky top-0 bg-[#1a1a1a] pb-2 z-10">
                {editingId ? 'Edit Content' : 'Add New Content'}
                {editingId && <button onClick={() => {setEditingId(null); setFormData(initialForm)}} className="text-xs text-red-400 underline">Cancel</button>}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. UPDATED TYPE TOGGLE (Movie / Series / Collection) */}
                <div className="flex bg-black p-1 rounded-lg border border-gray-700">
                  {['movie', 'series', 'collection'].map(type => (
                    <button
                      key={type} type="button"
                      onClick={() => {
                         // If switching to collection, ensure we have a container for the movies
                         const newSeasons = type === 'collection' && formData.seasons.length === 0 
                            ? [{ seasonNumber: 1, episodes: [] }] 
                            : formData.seasons;
                         setFormData({...formData, type, seasons: newSeasons})
                      }}
                      className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-md capitalize transition-all ${formData.type === type ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Title (e.g. John Wick Collection)" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none" />
                
                {/* IMAGE UPLOAD */}
                <div className="space-y-2 border border-gray-800 p-3 rounded-lg bg-black/30">
                  <label className="text-xs text-gray-400 uppercase font-bold flex justify-between">Poster Image {isUploading && <span className="text-yellow-500 animate-pulse">Uploading...</span>}</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="w-full text-xs text-gray-400" />
                  <input value={formData.poster_url} onChange={e => setFormData({...formData, poster_url: e.target.value})} placeholder="or paste image URL..." className="w-full bg-black border border-gray-700 rounded p-2 text-xs focus:border-red-600 outline-none text-gray-300" />
                  {formData.poster_url && <img src={formData.poster_url} alt="Preview" className="h-32 object-contain mx-auto mt-2 rounded" />}
                </div>

                <input value={formData.interpreter_name || ''} onChange={e => setFormData({...formData, interpreter_name: e.target.value})} placeholder="Interpreter Name" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none" />
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" placeholder="Plot description..." className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none"></textarea>

                {/* --- CONDITIONAL FIELDS BASED ON TYPE --- */}
                {formData.type === 'movie' ? (
                  <>
                    <input value={formData.video_url || ''} onChange={e => setFormData({...formData, video_url: e.target.value})} placeholder="Movie Streaming URL (hglink/m3u8)" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none" />
                    <input value={formData.download_url || ''} onChange={e => setFormData({...formData, download_url: e.target.value})} placeholder="Movie Download URL" className="w-full bg-black border border-gray-700 rounded p-3 text-sm focus:border-red-600 outline-none" />
                  </>
                ) : (
                  // --- SERIES & COLLECTION BUILDER UI ---
                  <div className="space-y-4 border-t border-gray-700 pt-4">
                      <div className="flex justify-between items-center">
                         <label className="text-sm font-bold text-gray-300">
                           {formData.type === 'collection' ? 'Movies in this Collection' : 'Seasons & Episodes'}
                         </label>
                         
                         {/* Hide Add Season button for Collections */}
                         {formData.type !== 'collection' && (
                           <button type="button" onClick={addSeason} className="text-xs bg-red-600 px-2 py-1 rounded text-white hover:bg-red-700">+ Add Season</button>
                         )}
                      </div>
                      
                      {formData.seasons.map((season, sIndex) => (
                        <div key={sIndex} className="bg-black/50 p-3 rounded border border-gray-700">
                           {/* Hide Season Header for Collections */}
                           {formData.type !== 'collection' && (
                             <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-bold text-white">Season {season.seasonNumber}</h4>
                                <button type="button" onClick={() => removeSeason(sIndex)} className="text-[10px] text-red-500 hover:text-red-400">Remove Season</button>
                             </div>
                           )}

                           {/* Existing List */}
                           <ul className="space-y-1 mb-3">
                              {season.episodes.map((ep, epIndex) => (
                                <li key={epIndex} className="flex flex-col gap-1 text-xs text-gray-400 bg-gray-900 p-2 rounded relative">
                                   <div className="flex justify-between">
                                      <span className="font-bold text-white">
                                        {formData.type === 'collection' ? `Part ${epIndex + 1}:` : `Ep ${ep.episodeNumber}:`} {ep.title}
                                      </span>
                                      <button type="button" onClick={() => removeEpisode(sIndex, epIndex)} className="text-red-500 font-bold px-1">×</button>
                                   </div>
                                   <div className="truncate text-[10px] opacity-60">Stream: {ep.link}</div>
                                   {ep.downloadLink && <div className="truncate text-[10px] opacity-60">DL: {ep.downloadLink}</div>}
                                </li>
                              ))}
                           </ul>

                           {/* Add New Item Inputs */}
                           <div className="flex flex-col gap-2">
                              <input 
                                placeholder={formData.type === 'collection' ? "Movie Title (e.g. John Wick 2)" : "Episode Title"}
                                className="w-full bg-gray-900 text-xs p-2 rounded border border-gray-700"
                                value={newEpisodeInput[sIndex]?.title || ''}
                                onChange={(e) => setNewEpisodeInput({...newEpisodeInput, [sIndex]: {...newEpisodeInput[sIndex], title: e.target.value}})}
                              />
                              <div className="flex gap-2">
                                 <input 
                                   placeholder="Stream URL" 
                                   className="w-1/2 bg-gray-900 text-xs p-2 rounded border border-gray-700"
                                   value={newEpisodeInput[sIndex]?.link || ''}
                                   onChange={(e) => setNewEpisodeInput({...newEpisodeInput, [sIndex]: {...newEpisodeInput[sIndex], link: e.target.value}})}
                                 />
                                 <input 
                                   placeholder="Download URL" 
                                   className="w-1/2 bg-gray-900 text-xs p-2 rounded border border-gray-700"
                                   value={newEpisodeInput[sIndex]?.downloadLink || ''}
                                   onChange={(e) => setNewEpisodeInput({...newEpisodeInput, [sIndex]: {...newEpisodeInput[sIndex], downloadLink: e.target.value}})}
                                 />
                              </div>
                              <button type="button" onClick={() => addEpisodeToSeason(sIndex)} className="w-full bg-gray-700 text-xs py-2 rounded text-white hover:bg-gray-600 font-bold">
                                {formData.type === 'collection' ? "Add Movie to Collection" : "Add Episode"}
                              </button>
                           </div>
                        </div>
                      ))}
                  </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer bg-black p-3 rounded border border-gray-700 hover:border-gray-500 transition-colors">
                  <input type="checkbox" checked={formData.is_popular} onChange={e => setFormData({...formData, is_popular: e.target.checked})} className="accent-red-600 w-4 h-4" />
                  <span className="text-sm text-gray-300">Mark as Trending</span>
                </label>

                <button type="submit" disabled={isSaving || isUploading} className={`w-full py-3 rounded font-bold transition-all ${isSaving || isUploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'}`}>
                  {isSaving ? "Saving..." : (editingId ? "Update Content" : "Publish Content")}
                </button>
              </form>
            </div>
          </div>

          {/* --- RIGHT: LIST --- */}
          <div className="lg:col-span-7">
            <div className="flex gap-2 mb-4">
               {['all', 'movie', 'series', 'collection'].map(tab => (
                 <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-xs font-bold capitalize ${activeTab === tab ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400'}`}>{tab}</button>
               ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredContent.map((item) => (
                <div key={item.id} className="flex gap-3 bg-[#1a1a1a] p-3 rounded-lg border border-gray-800 hover:border-gray-600">
                  <img src={item.poster_url || '/placeholder.jpg'} className="w-14 h-20 object-cover rounded" alt="" />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between">
                       <h4 className="font-bold text-sm truncate">{item.title}</h4>
                       <span className="text-[10px] bg-gray-800 px-1 rounded uppercase">{item.type}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{item.interpreter_name}</p>
                    <div className="mt-2 flex gap-2">
                       <button onClick={() => handleEdit(item)} className="text-[10px] bg-white text-black px-2 py-1 rounded font-bold">EDIT</button>
                       <button onClick={() => handleDelete(item)} className="text-[10px] bg-red-900/30 text-red-500 px-2 py-1 rounded font-bold">DELETE</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;