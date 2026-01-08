"use client";
import React from 'react';
import { Rocket, Target, Users, Zap, Shield, Globe, Cpu, BarChart3, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#f8faf7] text-slate-800 pt-32 pb-20 selection:bg-[#3d522b]/20">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                    <div className="absolute top-[-10%] right-[10%] w-[50%] h-[50%] bg-[#3d522b]/5 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-[#3d522b] text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-sm">
                        <Globe className="h-3 w-3" /> Our Vision
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] text-slate-900 uppercase">
                        REDEFINING <br />
                        <span className="text-[#3d522b]">CAPITAL.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
                        Growthory is the world's first AI-semantic ecosystem designed to bridge the gap between
                        visionary founders, strategic capital, and expert talent.
                    </p>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[#3d522b]/5 transition-all duration-500 group">
                        <div className="h-16 w-16 bg-[#3d522b] rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-[#3d522b]/20 group-hover:scale-110 transition-transform">
                            <Cpu className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-slate-900">Semantic Intelligence</h3>
                        <p className="text-slate-500 text-base leading-relaxed font-medium">
                            We move beyond keyword matching. Our AI understands the DNA of a venture, mapping it to the
                            exact thesis of compatible investors.
                        </p>
                    </div>

                    <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[#3d522b]/5 transition-all duration-500 group">
                        <div className="h-16 w-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-[#3d522b]/10 transition-colors">
                            <Shield className="h-8 w-8 text-[#3d522b]" />
                        </div>
                        <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-slate-900">Trust Integrity</h3>
                        <p className="text-slate-500 text-base leading-relaxed font-medium">
                            A verified network where every player is vetted. We create a secure environment for
                            high-stakes deals and professional growth.
                        </p>
                    </div>

                    <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[#3d522b]/5 transition-all duration-500 group">
                        <div className="h-16 w-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-[#3d522b]/10 transition-colors">
                            <Globe className="h-8 w-8 text-[#3d522b]" />
                        </div>
                        <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-slate-900">Global Reach</h3>
                        <p className="text-slate-500 text-base leading-relaxed font-medium">
                            Connecting ecosystems across borders. Growthory democratizes access to opportunity,
                            no matter where you are located.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-24 bg-white border-y border-slate-100 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-black mb-16 uppercase tracking-tighter leading-tight text-slate-900">
                            "Our mission is to accelerate human progress by <span className="text-[#3d522b]">eliminating friction</span> in the venture lifecycle."
                        </h2>
                        <div className="flex justify-center flex-wrap gap-16">
                            <div>
                                <div className="text-5xl font-black mb-2 text-[#3d522b]">842+</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Ventures</div>
                            </div>
                            <div>
                                <div className="text-5xl font-black mb-2 text-[#3d522b]">$1.4B+</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Matched Capital</div>
                            </div>
                            <div>
                                <div className="text-5xl font-black mb-2 text-[#3d522b]">450+</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Successful Connections</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-black mb-6 uppercase tracking-tight text-slate-900">Our Core Values</h2>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                        The principles that guide every decision we make and every feature we build.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { title: 'Transparency First', desc: 'Every algorithm, every match, every decision is explainable and auditable.' },
                        { title: 'Quality Over Quantity', desc: 'We curate our network rigorously to ensure every connection has real potential.' },
                        { title: 'Innovation Driven', desc: 'Constantly pushing the boundaries of what AI can do for venture capital.' },
                        { title: 'Community Focused', desc: 'Building tools that serve the entire ecosystem, not just one stakeholder.' }
                    ].map((value, i) => (
                        <div key={i} className="flex gap-6 p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all">
                            <CheckCircle2 className="h-6 w-6 text-[#3d522b] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-3 text-slate-900">{value.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{value.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team Section Placeholder */}
            <section className="py-24 max-w-7xl mx-auto px-6 text-center bg-slate-50 rounded-[4rem] mx-6">
                <Sparkles className="h-12 w-12 text-[#3d522b] mx-auto mb-8" />
                <h2 className="text-4xl font-black mb-6 uppercase tracking-tight text-slate-900">The Minds Behind Growthory</h2>
                <p className="text-slate-500 font-medium max-w-2xl mx-auto mb-16">
                    A diverse team of engineers, investors, and operators united by a singular vision.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="group">
                            <div className="aspect-square rounded-[2rem] bg-white border border-slate-200 mb-6 overflow-hidden relative shadow-sm group-hover:shadow-xl transition-all">
                                <div className="absolute inset-0 bg-[#3d522b]/0 group-hover:bg-[#3d522b]/5 transition-all duration-500"></div>
                            </div>
                            <h4 className="text-lg font-bold uppercase text-slate-900">Executive {i}</h4>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Leadership</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
