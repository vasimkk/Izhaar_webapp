import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaBook } from "react-icons/fa";
import api from "../../utils/api";

const AdminQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        question: "",
        options: ["", "", "", ""],
        correct_option: 0,
        category: "General",
        difficulty: "Medium"
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await api.get("/admin/quiz/questions");
            if (res.data.success) {
                setQuestions(res.data.questions);
            }
        } catch (err) {
            console.error("Error fetching questions:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const method = editingId ? "put" : "post";
            const payload = editingId ? { ...formData, id: editingId } : formData;
            const res = await api[method]("/admin/quiz/questions", payload);
            if (res.data.success) {
                alert(res.data.message);
                setEditingId(null);
                setFormData({
                    question: "",
                    options: ["", "", "", ""],
                    correct_option: 0,
                    category: "General",
                    difficulty: "Medium"
                });
                fetchQuestions();
            }
        } catch (err) {
            alert("Error saving question");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this question?")) return;
        try {
            const res = await api.delete(`/admin/quiz/questions/${id}`);
            if (res.data.success) {
                fetchQuestions();
            }
        } catch (err) {
            alert("Error deleting question");
        }
    };

    const handleEdit = (q) => {
        setEditingId(q.id);
        setFormData({
            question: q.question,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
            correct_option: q.correct_option,
            category: q.category || "General",
            difficulty: q.difficulty || "Medium"
        });
    };

    if (loading) return <div className="p-10 text-center text-rose-500 font-bold animate-pulse font-serif italic text-2xl">Curating questions...</div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-500 px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 p-6 rounded-3xl border border-rose-100 backdrop-blur-xl">
                <div>
                    <h2 className="text-3xl font-black text-rose-600 font-serif italic">Question Library</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Manage Soulmate Quizzes</p>
                </div>
                <button
                    onClick={() => { setEditingId(null); setFormData({ question: "", options: ["", "", "", ""], correct_option: 0, category: "General", difficulty: "Medium" }) }}
                    className="bg-rose-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all flex items-center gap-2"
                >
                    <FaPlus /> New Quest
                </button>
            </div>

            {/* Form */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-rose-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-purple-500"></div>
                <h3 className="text-xl font-black text-slate-800 font-serif italic mb-8">{editingId ? "Edit Question" : "Create New Question"}</h3>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-rose-400 uppercase tracking-widest ml-1">The Question</label>
                        <textarea
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="w-full bg-rose-50/30 border border-rose-100 rounded-2xl p-4 font-bold text-slate-700 focus:outline-none focus:border-rose-300 transition-all"
                            rows="2"
                            placeholder="What would you ask a soulmate?"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {formData.options.map((opt, idx) => (
                            <div key={idx} className="space-y-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Option {idx + 1}</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                            const newOpts = [...formData.options];
                                            newOpts[idx] = e.target.value;
                                            setFormData({ ...formData, options: newOpts });
                                        }}
                                        className={`flex-1 bg-white border rounded-xl px-4 py-2.5 font-bold transition-all ${formData.correct_option === idx ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-100'}`}
                                    />
                                    <button
                                        onClick={() => setFormData({ ...formData, correct_option: idx })}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${formData.correct_option === idx ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}
                                    >
                                        <FaPlus className={formData.correct_option === idx ? 'rotate-45 transition-transform' : ''} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 font-bold"
                            >
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        {editingId && (
                            <button onClick={() => setEditingId(null)} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all text-xs uppercase tracking-widest">Cancel</button>
                        )}
                        <button onClick={handleSave} className="bg-slate-800 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all">
                            {editingId ? "Update Quest" : "Forge Quest"}
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <div key={idx} className="bg-white/70 backdrop-blur-lg p-6 rounded-3xl border border-rose-50 shadow-md flex items-center justify-between gap-6 group hover:border-rose-200 transition-all">
                        <div className="flex items-center gap-5 flex-1">
                            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-400 font-black text-xl font-serif italic">
                                {idx + 1}
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-800 text-lg leading-snug">{q.question}</h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black px-2 py-0.5 bg-rose-100 text-rose-500 rounded-full uppercase">{q.category}</span>
                                    <span className="text-[9px] font-black px-2 py-0.5 bg-purple-100 text-purple-500 rounded-full uppercase">{q.difficulty}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(q)} className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><FaEdit /></button>
                            <button onClick={() => handleDelete(q.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminQuestions;
