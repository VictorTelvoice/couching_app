import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainNavigation from '../components/Navigation';
import { useUserStore } from '../store/useUserStore';

// Static Data Helper (Sharing data source concept)
const MENTORS_DATA: Record<number, any> = {
    1: {
        id: 1,
        name: "Sarah Jenkins",
        role: "Coach Senior • Google",
        about: "Especialista en desarrollo de liderazgo ejecutivo y gestión de equipos multiculturales con más de 10 años de experiencia en Silicon Valley.",
        category: "Liderazgo",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkifiEynxWd1EZgG7IJt5OhI1kkt5biZNys2ypwhTxpb30EQAY8EdrkjS7aFxUbAXF1XUzFHn2y3btI7Uv0qV8aazLbV7_73vWyGI2HHzKH6hRA48yzhuowiTscjbDQzcIZfrhDk9nI4CwoP2Xc4LHNrnUivORjeBDUqBFnwoZO9P3iBSuHrvBJAKz9eAJbFe2jHM09hKbhC-Hz5HYqlGYPmx3QuWbfPc9yl_dmfuiqXoSZDTOzec2594ZYDEtTLXv9yWgjpEsVV0",
        online: true
    },
    2: {
        id: 2,
        name: "David Mendoza",
        role: "Tech Lead • Amazon",
        about: "Arquitecto de soluciones Cloud y mentor técnico. Ayudo a ingenieros a transicionar a roles de liderazgo técnico.",
        category: "Técnico",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDomT3saSkLMnp7QcNbkaevCSW-xRK8qk1iRb_cAXjxsf7I3y2FoSLjTc-clIGSzdi4Nw7NUDksUGLgnrWsii7_4Qhj8ZLtBWvyOy6Bm56waMI7rhOcq3WjN2mM9HEXvmljH-hLhO6O38i8OpjMNhtKpEr9EoEoAKdPnFRSKWg6rdjbNX8f5Yl21LaCwLWhfMlqX08-umOeLiwdlVd6aeinzlDNmkf7B-vUhzUw8O4XDgIbuBLbySR6TSheZ3mOqk0pfBq_gbeIpLw",
        online: false
    },
    3: {
        id: 3,
        name: "Elena Rodriguez",
        role: "HR Director • Spotify",
        about: "Experta en cultura organizacional, bienestar y desarrollo de carrera. Enfoque en el equilibrio vida-trabajo.",
        category: "Carrera",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfL4b0NpEn-87yRPSzPP3ZoYLJkh07-KWn-FcNVw5C5d8GXmbtwkc1AxfHzzF0BPxciiM7nGupmh9VOXeivOaH1cm0mJwbZgK0mYARZuo0TrbnxDds5FEwFqTMkfkv2-GGxx3JKMV6vHXuMnoIINjpNmqqzhT4QTxnDy82pj5gI-4kiy8jWLLFO3QIpCTAIuZ66FPSVu4XUMQEXSJ-ni9S1gDwEV2Co5Zu_Qek7SLYhHCW1poQGv85YfU90MNwQ23OtBzSM79zKAs",
        online: true
    }
};

const MentorProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const mentorId = Number(id) || 1;
    const mentor = MENTORS_DATA[mentorId];

    // Store Access
    const { reviews, addReview } = useUserStore();

    // Local State for New Review
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    // Filter reviews for this mentor
    const mentorReviews = useMemo(() => 
        reviews.filter(r => r.mentorId === mentorId), 
    [reviews, mentorId]);

    const averageRating = useMemo(() => {
        if (mentorReviews.length === 0) return 0;
        const sum = mentorReviews.reduce((acc, curr) => acc + curr.rating, 0);
        return (sum / mentorReviews.length).toFixed(1);
    }, [mentorReviews]);

    const ratingCounts = useMemo(() => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        mentorReviews.forEach(r => {
            const rounded = Math.round(r.rating) as 1|2|3|4|5;
            if (counts[rounded] !== undefined) counts[rounded]++;
        });
        return counts;
    }, [mentorReviews]);

    const handleSubmitReview = () => {
        if (rating > 0 && comment.trim()) {
            addReview({
                mentorId,
                rating,
                comment
            });
            setIsReviewModalOpen(false);
            setRating(0);
            setComment("");
        }
    };

    if (!mentor) return <div>Mentor no encontrado</div>;

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden pb-24">
            <header className="fixed top-0 w-full z-20 flex items-center justify-between px-6 py-5 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
                <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-slate-900 dark:text-white text-lg font-bold">Perfil del Mentor</h1>
                <button className="text-slate-500 hover:text-primary">
                    <span className="material-symbols-outlined">share</span>
                </button>
            </header>

            <main className="flex-1 mt-16 overflow-y-auto hide-scrollbar">
                
                {/* Profile Header */}
                <div className="flex flex-col items-center px-6 py-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark rounded-b-[2rem] shadow-sm mb-6">
                    <div className="relative mb-3">
                        <div className="size-24 rounded-full bg-cover bg-center border-4 border-white dark:border-gray-700 shadow-md" style={{backgroundImage: `url("${mentor.image}")`}}></div>
                        <div className={`absolute bottom-1 right-1 size-5 rounded-full border-2 border-white dark:border-gray-700 ${mentor.online ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 text-center">{mentor.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-medium">{mentor.role}</p>
                    <div className="flex gap-2 mb-4">
                         <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wide">{mentor.category}</span>
                         <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-bold">
                            <span className="material-symbols-filled text-[14px]">star</span>
                            {averageRating} ({mentorReviews.length})
                         </div>
                    </div>
                    <button 
                        onClick={() => navigate('/coaching')}
                        className="w-full max-w-xs py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform"
                    >
                        Agendar Sesión
                    </button>
                </div>

                <div className="px-6 flex flex-col gap-6">
                    {/* About */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Acerca de</h3>
                        <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                            {mentor.about}
                        </p>
                    </section>

                    {/* Prominent Reviews Display (Updated) */}
                    <section className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Valoración General</h3>
                        <div className="flex items-center gap-6">
                             <div className="flex flex-col items-center">
                                <span className="text-5xl font-extrabold text-slate-900 dark:text-white leading-none">{averageRating}</span>
                                <div className="flex text-yellow-400 text-[14px] my-2">
                                    {[1,2,3,4,5].map(star => (
                                        <span key={star} className={`material-symbols-outlined ${star <= Math.round(Number(averageRating)) ? 'material-symbols-filled' : ''}`}>star</span>
                                    ))}
                                </div>
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{mentorReviews.length} reseñas</span>
                             </div>
                             
                             <div className="h-20 w-px bg-gray-100 dark:bg-gray-700"></div>
                             
                             <div className="flex-1 flex flex-col justify-center gap-1.5">
                                {[5, 4, 3, 2, 1].map(star => {
                                    const count = ratingCounts[star as 1|2|3|4|5];
                                    const percentage = mentorReviews.length ? (count / mentorReviews.length) * 100 : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-2 text-xs">
                                            <span className="font-bold text-slate-400 w-2">{star}</span>
                                            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-yellow-400 rounded-full" style={{width: `${percentage}%`}}></div>
                                            </div>
                                        </div>
                                    )
                                })}
                             </div>
                        </div>
                    </section>

                    {/* Reviews List */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reseñas</h3>
                            <button 
                                onClick={() => setIsReviewModalOpen(true)}
                                className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors"
                            >
                                Escribir reseña
                            </button>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            {mentorReviews.map(review => (
                                <div key={review.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="size-8 rounded-full bg-cover bg-center" style={{backgroundImage: `url("${review.avatar}")`}}></div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{review.author}</h4>
                                                <span className="text-[10px] text-gray-400">{review.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex text-yellow-400 text-[12px]">
                                             {[1,2,3,4,5].map(star => (
                                                <span key={star} className={`material-symbols-outlined ${star <= review.rating ? 'material-symbols-filled' : ''}`}>star</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-gray-300 leading-snug">{review.comment}</p>
                                </div>
                            ))}
                            {mentorReviews.length === 0 && (
                                <div className="text-center py-4 text-gray-400 text-sm">Sé el primero en calificar a este mentor.</div>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            {/* Add Review Modal */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full sm:max-w-sm bg-white dark:bg-[#1e293b] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Calificar Experiencia</h3>
                            <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-center gap-2 py-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400 scale-110' : 'text-gray-300'}`}
                                    >
                                        <span className={`material-symbols-outlined ${rating >= star ? 'material-symbols-filled' : ''}`} style={{fontSize: '40px'}}>star</span>
                                    </button>
                                ))}
                            </div>
                            <div className="text-center text-sm font-medium text-slate-500 mb-2">
                                {rating === 0 ? 'Toca las estrellas para calificar' : rating === 5 ? '¡Excelente!' : rating === 4 ? 'Muy bueno' : rating === 3 ? 'Regular' : 'Puede mejorar'}
                            </div>

                            <textarea 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Comparte tu experiencia con este mentor..."
                                className="w-full h-24 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none dark:text-white"
                            ></textarea>

                            <button 
                                onClick={handleSubmitReview}
                                disabled={rating === 0 || !comment.trim()}
                                className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Enviar Reseña
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorProfilePage;