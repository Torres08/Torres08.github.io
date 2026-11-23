import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import type {
  FeaturedProject,
  SecondaryCategory,
  SecondaryProject,
} from '../types/portfolio';
import { AsciiFieldCanvas } from './AsciiFieldCanvas';
import { AsciiPlayer } from './AsciiPlayer';
import { ScrambleText } from './ScrambleText';
import { SectionHeader } from './SectionHeader';

interface DeploymentsSectionProps {
  motionEnabled: boolean;
  glitchIntensity: number;
  onInspectFeaturedLab: (project: FeaturedProject) => void;
  onInspectSecondaryLab: (project: SecondaryProject) => void;
}

const FILTER_TABS: { key: SecondaryCategory; label: string }[] = [
  { key: 'ALL', label: '[ ALL ]' },
  { key: 'IOT_&_NET', label: '[ IOT_&_NET ]' },
  { key: 'MOBILE_&_APPSEC', label: '[ MOBILE_&_APPSEC ]' },
  { key: 'SIEM_&_INFRA', label: '[ SIEM_&_INFRA ]' },
  { key: 'CRYPTO_&_SYS', label: '[ CRYPTO_&_SYS ]' },
];

const SHORT_CARD_SUMMARIES: Record<string, string> = {
  '0x0F1':
    'Simulated fileless memfd_create malware and blocked runtime execution using stateful eBPF-LSM hooks and Seccomp.',
  '0x0F2':
    'Built a SocketCAN SITL Python IDS fingerprinting ECU clock skew to detect masquerade attacks.',
  '0x0F3':
    'Audited Rogue AP traffic interception on Raspberry Pi and hardened Wi-Fi via FreeRADIUS 802.1X.',
  '0x0F4':
    'Containerized SBOM vulnerability auditor querying GitHub and OSV.dev APIs behind Nginx TLS.',
  '0x0F5':
    'Deployed an OpenShift/Kubernetes HPC cluster and automated JMeter stress tests for LLM workloads.',
};

export const DeploymentsSection: React.FC<DeploymentsSectionProps> = ({
  motionEnabled,
  glitchIntensity,
  onInspectFeaturedLab,
  onInspectSecondaryLab,
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<SecondaryCategory>('ALL');
  const [showSecondary, setShowSecondary] = useState<boolean>(false);

  const filteredSecondary =
    activeFilter === 'ALL'
      ? PORTFOLIO_DATA.secondaryProjects
      : PORTFOLIO_DATA.secondaryProjects.filter((p) => p.filterGroup === activeFilter);

  return (
    <section id="deployments" className="scroll-mt-16">
      <SectionHeader
        title="02 // CLASSIFIED_DEPLOYMENTS"
        motionEnabled={motionEnabled}
        glitchIntensity={glitchIntensity}
      />

      {/* 2-Column Featured Project Card Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {PORTFOLIO_DATA.featuredProjects.map((project, idx) => {
          const isHovered = hoveredCard === project.hexId;
          const isLastOdd =
            PORTFOLIO_DATA.featuredProjects.length % 2 === 1 &&
            idx === PORTFOLIO_DATA.featuredProjects.length - 1;

          return (
            <article
              key={project.hexId}
              onMouseEnter={() => setHoveredCard(project.hexId)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative overflow-hidden border bg-panel flex flex-col justify-between transition-none ${
                isHovered ? 'border-[#9A6CC6]' : 'border-hairline'
              } ${motionEnabled ? 'reveal-stepped' : ''} ${
                isLastOdd ? 'xl:col-span-2' : ''
              }`}
            >
              <AsciiFieldCanvas
                motionEnabled={motionEnabled}
                density="standard"
                variant="subtle"
                activeOnlyOnHover
                isHovered={isHovered}
              />

              <div className="relative z-10">
                {/* Top Header Bar: Inverts to solid #9A6CC6 on card hover */}
                <div
                  className={`flex items-center justify-between gap-2 px-5 py-3 border-b border-hairline text-xs font-bold uppercase tracking-label transition-none ${
                    isHovered
                      ? 'bg-[#9A6CC6] text-black'
                      : 'bg-canvas text-primary'
                  }`}
                >
                  <span className="truncate">PROJECT: {project.shortTitle}</span>
                  <span className="shrink-0 font-mono">{project.hexId}</span>
                </div>

                {/* Tall, Clean Dark Preview Frame (~190px) with Centered Minimal ASCII Object */}
                <div className="h-[190px] border-b border-hairline bg-canvas/95 flex items-center justify-center px-6">
                  <AsciiPlayer
                    animationId={project.asciiId}
                    fps={10}
                    playbackMode="always"
                    motionEnabled={motionEnabled}
                    glitchIntensity={glitchIntensity}
                    isParentHovered={isHovered}
                  />
                </div>

                {/* Right-Aligned CLASS & STACK Rows */}
                <div className="border-b border-hairline text-[11px]">
                  <div className="flex items-baseline justify-between gap-3 px-6 py-2.5 border-b border-hairline">
                    <span className="text-muted shrink-0 uppercase tracking-label">CLASS:</span>
                    <span className="text-primary text-right font-medium">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 px-6 py-2.5">
                    <span className="text-muted shrink-0 uppercase tracking-label">STACK:</span>
                    <span className="text-muted text-right">
                      {project.stack.slice(0, 5).join(' · ')}
                    </span>
                  </div>
                </div>

                {/* Title & 1-2 Short Lines */}
                <div className="p-7 sm:p-8 space-y-2.5">
                  <h3 className="text-sm font-bold text-primary">{project.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {SHORT_CARD_SUMMARIES[project.hexId] ?? project.summary[0]}
                  </p>
                </div>
              </div>

              {/* Full-Width Bracketed CTA Row */}
              <div className="relative z-10 border-t border-hairline flex flex-col sm:flex-row">
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-5 text-center text-xs font-semibold uppercase tracking-label text-primary bg-canvas hover:bg-[#9A6CC6] hover:text-black border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-hairline"
                  >
                    <ScrambleText
                      text="[ VIEW_REPO ]"
                      motionEnabled={motionEnabled}
                      glitchIntensity={glitchIntensity}
                    />
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-5 text-center text-xs font-semibold uppercase tracking-label text-primary bg-canvas hover:bg-[#9A6CC6] hover:text-black border-hairline"
                  >
                    <ScrambleText
                      text="[ WATCH_DEMO ]"
                      motionEnabled={motionEnabled}
                      glitchIntensity={glitchIntensity}
                    />
                  </a>
                )}
                {!project.repoUrl && !project.demoUrl && (
                  <button
                    type="button"
                    onClick={() => onInspectFeaturedLab(project)}
                    className="w-full py-3 px-5 text-center text-xs font-semibold uppercase tracking-label text-primary bg-canvas hover:bg-[#9A6CC6] hover:text-black"
                  >
                    <ScrambleText
                      text={`[ INSPECT_LAB_BRIEF // ${project.labType?.toUpperCase()} ]`}
                      motionEnabled={motionEnabled}
                      glitchIntensity={glitchIntensity}
                    />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Secondary Labs & Archives Directory */}
      <div className="mt-8 border border-hairline bg-panel">
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 border-b border-hairline bg-canvas">
          <div className="text-xs font-bold text-primary uppercase tracking-label">
            // SECONDARY_LABS [{filteredSecondary.length}/
            {PORTFOLIO_DATA.secondaryProjects.length}_RECORDS]
          </div>
          <button
            type="button"
            onClick={() => setShowSecondary((v) => !v)}
            aria-expanded={showSecondary}
            className="border border-hairline bg-panel px-3 py-1 text-[11px] uppercase tracking-label text-primary hover:border-[#9A6CC6] hover:bg-[#9A6CC6] hover:text-black"
          >
            {showSecondary ? '[ COLLAPSE ]' : '[ EXPAND ]'}
          </button>
        </div>

        {showSecondary && (
          <>
            <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-hairline">
              {FILTER_TABS.map((tab) => {
                const active = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key)}
                    className={`border px-2.5 py-1 text-[11px] uppercase tracking-label transition-none ${
                      active
                        ? 'border-[#9A6CC6] bg-[#9A6CC6] text-black font-bold'
                        : 'border-hairline bg-canvas text-muted hover:text-primary hover:border-[#9A6CC6]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="divide-y divide-hairline">
              {filteredSecondary.map((lab) => (
                <div
                  key={lab.hexId}
                  className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-canvas transition-none"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[#9A6CC6] font-mono">{lab.hexId}</span>
                      <span className="font-bold text-primary">{lab.title}</span>
                      <span className="text-[11px] text-muted">· {lab.category}</span>
                    </div>
                    <p className="text-xs text-muted">{lab.summary}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {lab.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-hairline bg-canvas px-3 py-1 text-[11px] uppercase tracking-label text-primary hover:border-[#9A6CC6] hover:bg-[#9A6CC6] hover:text-black"
                      >
                        [ {link.label} ]
                      </a>
                    ))}
                    {lab.academicLab && (
                      <button
                        type="button"
                        onClick={() => onInspectSecondaryLab(lab)}
                        className="border border-hairline bg-canvas px-3 py-1 text-[11px] uppercase tracking-label text-primary hover:border-[#9A6CC6] hover:bg-[#9A6CC6] hover:text-black"
                      >
                        [ LAB_SPEC ]
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
