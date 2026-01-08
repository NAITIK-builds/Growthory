"use client";
import React from 'react';
import Link from 'next/link';
import { Rocket, Twitter, Linkedin, Github, Globe, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
                {/* Brand Column */}
                <div className="md:col-span-4 space-y-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 olive-gradient rounded-xl flex items-center justify-center">
                            <Rocket className="text-white h-5 w-5" />
                        </div>
                        <span className="text-xl font-black text-slate-900 uppercase tracking-tight">Growthory</span>
                    </Link>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
                        Unified semantic intelligence for the global venture ecosystem. Bridging the gap between vision and capital.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#3d522b] hover:bg-slate-100 transition-all border border-slate-100">
                            <Twitter className="h-4 w-4" />
                        </a>
                        <a href="#" className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#3d522b] hover:bg-slate-100 transition-all border border-slate-100">
                            <Linkedin className="h-4 w-4" />
                        </a>
                        <a href="#" className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#3d522b] hover:bg-slate-100 transition-all border border-slate-100">
                            <Github className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                {/* Links Columns */}
                <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ecosystem</h4>
                        <ul className="space-y-4">
                            <li><Link href="/network" className="text-sm font-bold text-slate-600 hover:text-[#3d522b] transition-colors">Network Map</Link></li>
                            <li><Link href="/analytics" className="text-sm font-bold text-slate-600 hover:text-[#3d522b] transition-colors">Market Intel</Link></li>
                            <li><Link href="/features" className="text-sm font-bold text-slate-600 hover:text-[#3d522b] transition-colors">Capabilities</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-sm font-bold text-slate-600 hover:text-[#3d522b] transition-colors">Our Vision</Link></li>
                            <li><Link href="/pricing" className="text-sm font-bold text-slate-600 hover:text-[#3d522b] transition-colors">Access Tier</Link></li>
                            <li><Link href="/about" className="text-sm font-bold text-slate-600 hover:text-[#3d522b] transition-colors">Team</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-6 col-span-2 md:col-span-1">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Newsletter</h4>
                        <div className="flex bg-slate-50 border border-slate-100 rounded-xl p-1 focus-within:ring-2 focus-within:ring-[#3d522b]/20 transition-all">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-transparent border-none outline-none px-3 text-xs flex-grow font-medium"
                            />
                            <button className="h-8 w-8 olive-gradient rounded-lg flex items-center justify-center text-white shadow-lg">
                                <Mail className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                            JOIN 14K+ SUBSCRIBERS RECEIVING WEEKLY SIGNAL.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-100 flex flex-col md:row justify-between items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#3d522b] uppercase tracking-[0.3em]">
                    <Globe className="h-3 w-3" /> Growthory Global Inc.
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    © 2026 Growthory. All Rights Reserved. Built for the Decentralized Venture Era.
                </p>
            </div>
        </footer>
    );
}

