import { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'

const CommentSection = ({ movieId }) => {
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FETCH COMMENTS IN REAL-TIME ---
  useEffect(() => {
    if (!movieId) return;

    // 1. Point to the "comments" collection in Firestore, filtered by this specific movie
    const q = query(
      collection(db, 'comments'),
      where('movieId', '==', movieId)
    );

    // 2. Listen for any new comments instantly
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => {
        // Sort newest comments to the top (done in React to avoid Firebase Index errors)
        const dateA = a.createdAt?.toMillis() || Date.now();
        const dateB = b.createdAt?.toMillis() || Date.now();
        return dateB - dateA;
      });

      setComments(commentsData);
    });

    // Cleanup the listener when we leave the page
    return () => unsubscribe();
  }, [movieId]);

  // --- POST A NEW COMMENT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !name.trim()) return;

    setIsSubmitting(true);
    try {
      // Push the data to the Firestore cloud
      await addDoc(collection(db, 'comments'), {
        movieId: movieId,
        name: name.trim(),
        text: newComment.trim(),
        createdAt: serverTimestamp() // Uses Google's official server time
      });
      
      // Clear the input box
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment: ", error);
      alert("Failed to post. Check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to make the timestamp look pretty
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-[#1a1a1a] rounded-lg p-4 sm:p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="text-[#fbbf24]" size={24} />
        <h3 className="text-white text-xl font-bold uppercase">Comments ({comments.length})</h3>
      </div>

      {/* --- COMMENT INPUT FORM --- */}
      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3">
        <input 
          type="text" 
          placeholder="Amazina - Names" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSubmitting}
          className="w-full sm:w-1/3 bg-[#0f0f0f] text-white border border-white/10 rounded-md p-3 focus:outline-none focus:border-[#fbbf24] transition-colors disabled:opacity-50"
        />
        <div className="relative">
          <textarea 
            placeholder="Andika hano comment kuri iyi filime - Usabe filime ushaka" 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            disabled={isSubmitting}
            rows="3"
            className="w-full bg-[#0f0f0f] text-white border border-white/10 rounded-md p-3 pr-12 focus:outline-none focus:border-[#fbbf24] transition-colors resize-none disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="absolute bottom-3 right-3 p-2 bg-[#fbbf24] text-black rounded-md hover:bg-yellow-500 transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </form>

      {/* --- COMMENTS LIST --- */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-[#0f0f0f] p-4 rounded-md border border-white/5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[#fbbf24] font-bold text-sm">{comment.name}</span>
                <span className="text-gray-500 text-xs">{formatTime(comment.createdAt)}</span>
              </div>
              <p className="text-gray-300 text-sm">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;