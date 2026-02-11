import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaGamepad } from "react-icons/fa";
import api from "../../utils/api";

const AdminQuizGame = () => {
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
            // Updated endpoint for standard quiz questions
            const res = await api.get("/admin/standard/questions");
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
            const res = await api[method]("/admin/standard/questions", payload);
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
            const res = await api.delete(`/admin/standard/questions/${id}`);
            if (res.data.success) {
                fetchQuestions();
            }
        } catch (err) {
            alert("Error deleting question");
        }
    };

    const handleEdit = (q) => {
        setEditingId(q.id);
        const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
        setFormData({
            question: q.question,
            options: Array.isArray(opts) ? opts : ["", "", "", ""],
            correct_option: q.correct_option,
            category: q.category || "General",
            difficulty: q.difficulty || "Medium"
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div className="p-10 text-center text-indigo-500 font-bold animate-pulse text-2xl">Loading Quiz Data...</div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-500 px-4 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 p-6 rounded-[2rem] border border-indigo-100 backdrop-blur-xl shadow-lg">
                <div>
                    <h2 className="text-3xl font-black text-indigo-600 font-serif italic">Quiz Game Manager</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Manage Trivia Questions</p>
                </div>
                <button
                    onClick={() => { setEditingId(null); setFormData({ question: "", options: ["", "", "", ""], correct_option: 0, category: "General", difficulty: "Medium" }) }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                    <FaPlus /> New Question
                </button>
            </div>

            {/* Form */}
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-indigo-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-800 font-serif italic">{editingId ? "Edit Trivia Question" : "Create New Trivia"}</h3>
                    {editingId && <button onClick={() => setEditingId(null)} className="text-indigo-400 text-xs font-bold uppercase hover:text-indigo-600">Cancel</button>}
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Question</label>
                        <textarea
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="w-full bg-indigo-50/30 border border-indigo-100 rounded-2xl p-4 font-bold text-slate-700 focus:outline-none focus:border-indigo-300 transition-all resize-none"
                            rows="2"
                            placeholder="e.g. What is the speed of light?"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Options (Select Correct Answer)</label>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {formData.options.map((opt, idx) => (
                                <div key={idx} className="relative group">
                                    <span className="absolute left-4 top-3 text-[10px] font-bold text-slate-300 pointer-events-none">OPT {idx + 1}</span>
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                            const newOpts = [...formData.options];
                                            newOpts[idx] = e.target.value;
                                            setFormData({ ...formData, options: newOpts });
                                        }}
                                        className={`w-full bg-white border border-slate-100 rounded-xl pl-12 pr-4 py-3 font-bold text-sm focus:ring-4 transition-all
                                            ${formData.correct_option === idx ? 'border-green-400 ring-4 ring-green-50' : 'focus:border-indigo-300 focus:ring-indigo-50'}`}
                                        placeholder={`Option ${idx + 1}`}
                                    />
                                    <button
                                        onClick={() => setFormData({ ...formData, correct_option: idx })}
                                        className={`absolute right-2 top-2 p-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                                            ${formData.correct_option === idx ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                    >
                                        {formData.correct_option === idx ? 'Correct' : 'Mark'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
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

                    <div className="flex justify-end pt-4">
                        <button onClick={handleSave} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all active:scale-95">
                            {editingId ? "Update Question" : "Create Question"}
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {questions.map((q, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between gap-6 group hover:border-indigo-200 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-5 flex-1">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center font-black text-sm">
                                {idx + 1}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg leading-snug mb-1">{q.question}</h4>
                                <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500 uppercase">
                                    <span className="px-2 py-0.5 bg-slate-100 rounded">{q.category}</span>
                                    <span className={`px-2 py-0.5 rounded ${q.difficulty === 'Hard' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>{q.difficulty}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(q)} className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"><FaEdit /></button>
                            <button onClick={() => handleDelete(q.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><FaTrash /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminQuizGame;
