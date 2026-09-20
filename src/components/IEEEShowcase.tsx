import React from 'react';
import { Award, BookOpen, Globe, Users, ExternalLink, Cpu, Sparkles, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

export const IEEEShowcase: React.FC = () => {
  const resources = [
    {
      title: 'IEEE Transactions on Robotics (T-RO)',
      desc: 'Top-tier journal papers on SLAM, factor graphs, whole-body dynamics, and visual-inertial odometry.',
      badge: 'Peer Reviewed',
      link: 'https://www.ieee-ras.org/publications/t-ro'
    },
    {
      title: 'IEEE Robotics & Automation Magazine (RAM)',
      desc: 'Tutorials and educational deep dives into ROS 2 migration, humanoid balance, and soft robotics.',
      badge: 'Tutorials',
      link: 'https://www.ieee-ras.org/publications/ram'
    },
    {
      title: 'ICRA & IROS Conference Proceedings',
      desc: 'Annual breakthrough robotics papers spanning dexterous manipulation, quadruped locomotion, and sim-to-real.',
      badge: 'Flagship Conf',
      link: 'https://www.ieee-ras.org/conferences-workshops'
    },
    {
      title: 'IEEE RAS Educational Resources Committee',
      desc: 'Open courseware, student competitions, standard datasets, and robotics curriculum frameworks.',
      badge: 'Open Education',
      link: 'https://www.ieee-ras.org/educational-resources'
    }
  ];

  return (
    <section id="ieee-ras" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Container with Red Edge Accents */}
      <div className="rounded-3xl bg-gradient-to-b from-[#101018] to-[#08080c] border border-red-500/30 p-8 sm:p-12 relative overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.8)]">
        
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-red-400 text-xs font-mono">
              <Award className="w-3.5 h-3.5" />
              <span>OFFICIAL IEEE RAS REPOSITORY GROUNDING</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-wide leading-tight">
              Built for the Global Robotics Community
            </h2>

            <p className="text-sm text-gray-300 font-sans leading-relaxed">
              RoboSphere AI is dedicated to advancing robotics education and research. By indexing peer-reviewed literature from the <strong className="text-white">IEEE Robotics and Automation Society</strong> and official open-source frameworks like <strong className="text-white">ROS 2</strong>, it gives students, researchers, and engineers verifiable answers with zero hallucinations.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <div className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-gray-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-400" />
                <span>100% Grounded in Official Literature</span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-gray-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-400" />
                <span>Zero Hallucination Retrieval Filter</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Resource Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((res, idx) => (
              <a
                key={idx}
                href={res.link}
                target="_blank"
                rel="noreferrer"
                onClick={() => sound.playHoverTick()}
                className="p-5 rounded-2xl bg-[#14141e]/90 hover:bg-[#1b1b28] border border-white/10 hover:border-red-500/60 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40">
                      {res.badge}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400 transition-colors" />
                  </div>

                  <h4 className="font-heading font-bold text-white text-sm group-hover:text-red-300 transition-colors">
                    {res.title}
                  </h4>
                  <p className="mt-2 text-xs text-gray-400 font-sans leading-relaxed">
                    {res.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-[11px] font-mono text-red-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Society Corpus →</span>
                </div>
              </a>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
