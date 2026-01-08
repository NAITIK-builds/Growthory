"use client";
import React from 'react';
import { Bell, Zap, Rocket, Target, Briefcase, Sparkles, Trash2, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage() {
    const notifications = [
        { id: 1, type: 'match', title: 'High Intensity Match', description: 'Your startup has a 98% match with a new Angel Investor in London.', time: '2m ago', icon: Zap, color: 'text-amber-500' },
        { id: 2, type: 'system', title: 'Vector Analysis Complete', description: 'Your pitch deck semantic analysis is now ready for review.', time: '45m ago', icon: Sparkles, color: 'text-indigo-500' },
        { id: 3, type: 'network', title: 'Signal Received', description: 'Sarah Chen from AI Safety has requested to open a secure channel.', time: '3h ago', icon: Briefcase, color: 'text-teal-500' },
        { id: 4, type: 'update', title: 'System Optimized', description: 'Growthory Engine V2.1 is now live with enhanced vector mapping.', time: '1d ago', icon: Rocket, color: 'text-indigo-500' },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 selection:bg-indigo-500/30">
            <style dangerouslySetInnerHTML={{
                __html: `
                .notif-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    transition: all 0.3s ease;
                }
                .notif-card:hover {
                    border-color: rgba(99, 102, 241, 0.3);
                    background: rgba(255, 255, 255, 0.04);
                }
            `}} />

            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight flex items-center gap-4">
                            Intelligence Stream <Bell className="h-8 w-8 text-indigo-500" />
                        </h1>
                        <p className="text-slate-500 text-lg mt-2">Real-time ecosystem signals and AI matches.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                            Mark all as read
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {notifications.map((n) => (
                        <div key={n.id} className="notif-card rounded-[2rem] p-8 flex gap-6 relative group overflow-hidden">
                            <div className={`h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 ${n.color}`}>
                                <n.icon className="h-7 w-7" />
                            </div>

                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-xl font-bold uppercase tracking-tight">{n.title}</h3>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{n.time}</span>
                                </div>
                                <p className="text-slate-400 font-medium leading-relaxed mb-6 italic">"{n.description}"</p>

                                <div className="flex gap-4">
                                    <button className="px-6 py-2 rounded-full bg-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">
                                        Take Action
                                    </button>
                                    <button className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">
                                        Dismiss
                                    </button>
                                </div>
                            </div>

                            <button className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center p-10 rounded-[2.5rem] bg-white/3 border border-dashed border-white/10">
                    <CheckCircle2 className="h-8 w-8 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">End of Stream</p>
                </div>
            </div>
        </div>
    );
}
