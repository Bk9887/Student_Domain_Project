import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaArrowRight, FaRobot, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import BentoCard from "./BentoCard";
import axios from "axios";

const questions = [
    {
        id: 1,
        question: "Which activity sounds most interesting to you?",
        options: [
            { id: "a", text: "Designing websites and user interfaces", value: "Web Design/Development" },
            { id: "b", text: "Analyzing large datasets and finding patterns", value: "Data Science/Analytics" },
            { id: "c", text: "Finding vulnerabilities and securing systems", value: "Cyber Security" },
            { id: "d", text: "Building applications for mobile devices", value: "Mobile Development" }
        ]
    },
    {
        id: 2,
        question: "What type of problem do you enjoy solving?",
        options: [
            { id: "a", text: "Visual and design challenges", value: "UI/UX & Frontend" },
            { id: "b", text: "Logical and data-driven puzzles", value: "Backend & Data" },
            { id: "c", text: "Complex security and networking issues", value: "Security & Infrastructure" },
            { id: "d", text: "Creating portable, high-performance apps", value: "Mobile & App Dev" }
        ]
    },
    {
        id: 3,
        question: "Do you prefer working with visual elements or hidden logic?",
        options: [
            { id: "a", text: "I love making things look beautiful and interactive", value: "Frontend/UI" },
            { id: "b", text: "I prefer working behind the scenes on the data flow", value: "Backend/Systems" },
            { id: "c", text: "I like a bit of both equally", value: "Full Stack" }
        ]
    },
    {
        id: 4,
        question: "Are you interested in how data is stored and managed?",
        options: [
            { id: "a", text: "Yes, I'm fascinated by databases and big data", value: "Data Engineering/Science" },
            { id: "b", text: "No, I'd rather focus on the user experience", value: "Frontend/Design" }
        ]
    },
    {
        id: 5,
        question: "Do you enjoy finding gaps and protecting digital assets?",
        options: [
            { id: "a", text: "Yes, security and ethical hacking sound exciting", value: "Cyber Security" },
            { id: "b", text: "I'd rather build new features than test for gaps", value: "Software Engineering" }
        ]
    },
    {
        id: 6,
        question: "Which platform excites you the most?",
        options: [
            { id: "a", text: "Web Browsers (Chrome, Safari, etc.)", value: "Web Development" },
            { id: "b", text: "Mobile Devices (iOS, Android)", value: "Mobile Development" },
            { id: "c", text: "Cloud Infrastructures (AWS, Azure)", value: "Cloud Computing" }
        ]
    },
    {
        id: 7,
        question: "How do you feel about working with AI and Machine Learning?",
        options: [
            { id: "a", text: "I want to build intelligent systems", value: "AI/ML" },
            { id: "b", text: "I prefer traditional software development", value: "General Software Dev" }
        ]
    },
    {
        id: 8,
        question: "What's your primary motivation for learning technology?",
        options: [
            { id: "a", text: "Creating something people can see and use", value: "Frontend/Web" },
            { id: "b", text: "Solving complex automated problems", value: "AI/Analytics" },
            { id: "c", text: "Ensuring the safety of the digital world", value: "Cyber Security" }
        ]
    }
];

export default function InterestTestModal({ isOpen, onClose, onSelectDomain }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleSelectOption = (option) => {
        const newAnswers = [...answers];
        newAnswers[currentStep] = { question: questions[currentStep].question, answer: option.value };
        setAnswers(newAnswers);

        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit(newAnswers);
        }
    };

    const handleSubmit = async (finalAnswers) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post("http://localhost:5000/api/ai/interest-test", { answers: finalAnswers });
            setResults(res.data.recommendations);
        } catch (err) {
            console.error(err);
            setError("The AI could not process your results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setAnswers([]);
        setResults(null);
        setError(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-2xl bg-[#0a0b14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                            <FaRobot size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">AI Domain Advisor</h2>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">Interest Analysis Quiz</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 min-h-[400px] flex flex-col">
                    {!results && !loading && !error && (
                        <>
                            {/* Progress */}
                            <div className="mb-8">
                                <div className="flex justify-between text-xs text-zinc-500 mb-2 uppercase tracking-widest font-bold">
                                    <span>Question {currentStep + 1} of {questions.length}</span>
                                    <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-indigo-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Question */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex-1"
                                >
                                    <h3 className="text-2xl font-bold text-white mb-8 leading-tight">
                                        {questions[currentStep].question}
                                    </h3>
                                    <div className="grid gap-3">
                                        {questions[currentStep].options.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleSelectOption(option)}
                                                className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all group flex items-center justify-between"
                                            >
                                                <span className="text-lg text-zinc-300 group-hover:text-white transition-colors">{option.text}</span>
                                                <FaArrowRight className="text-zinc-600 group-hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-transform" />
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </>
                    )}

                    {loading && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="relative w-20 h-20 mb-6">
                                <motion.div
                                    className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"
                                    style={{ borderTopColor: "rgb(99, 102, 241)" }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                                    <FaRobot size={30} className="animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Consulting the Matrix...</h3>
                            <p className="text-zinc-500 text-sm max-w-xs mx-auto">Analyzing your interests and matching them with global technology trends.</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-6">
                                <FaExclamationTriangle size={30} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{error}</h3>
                            <button onClick={resetQuiz} className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors">
                                Try Again
                            </button>
                        </div>
                    )}

                    {results && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1"
                        >
                            <h3 className="text-center text-2xl font-bold text-white mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                Your AI-Recommended Paths
                            </h3>
                            <div className="grid gap-4">
                                {results.map((res, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <BentoCard className="p-5 relative overflow-hidden group" magnetic={false} accentColor="indigo">
                                            <div className="absolute top-0 right-0 p-3">
                                                <div className="text-2xl font-black text-indigo-500/20 group-hover:text-indigo-400/40 transition-colors">
                                                    {res.percentage}%
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                                {res.domain}
                                                <FaCheckCircle className="text-indigo-400" size={14} />
                                            </h4>
                                            <p className="text-sm text-zinc-400 mb-4 leading-relaxed pr-12">
                                                {res.reason}
                                            </p>
                                            <button
                                                onClick={() => onSelectDomain(res.domain)}
                                                className="text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2 group/btn"
                                            >
                                                Select this path <FaArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </BentoCard>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-8 text-center">
                                <button onClick={resetQuiz} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-4">
                                    Retake the quiz
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
