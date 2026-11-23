import React, { useEffect, useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { BongoCat } from './BongoCat';
import { ScrambleText } from './ScrambleText';

interface SidebarProps {
  motionEnabled: boolean;
  onToggleMotion: () => void;
  glitchIntensity: number;
}

const NAV_LINKS = [
  { id: 'identity', label: '[ 01_IDENTITY ]' },
  { id: 'deployments', label: '[ 02_DEPLOYMENTS ]' },
  { id: 'credentials', label: '[ 03_CREDENTIALS ]' },
  { id: 'comm-link', label: '[ 04_COMM_LINK ]' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  motionEnabled,
  onToggleMotion,
  glitchIntensity,
}) => {
  const [visibleLogs, setVisibleLogs] = useState<number>(motionEnabled ? 0 : 4);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const shortLogs = PORTFOLIO_DATA.bootLogs.slice(0, 4);

  useEffect(() => {
    if (!motionEnabled) {
      setVisibleLogs(shortLogs.length);
      return;
    }

    setVisibleLogs(0);
    const timers = shortLogs.map((_, idx) =>
      window.setTimeout(() => {
        setVisibleLogs((prev) => Math.max(prev, idx + 1));
      }, 180 + idx * 140),
    );

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [motionEnabled, shortLogs.length]);

  return (
    <>
      {/* Mobile Sticky Header (<1024px) */}
      <header className="sticky top-0 z-30 border-b border-[#1C1C1C] bg-canvas px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs font-bold tracking-label uppercase text-primary underline underline-offset-4 truncate">
              {PORTFOLIO_DATA.identity.titleLine}
            </div>
            <div className="mt-1 text-[11px] text-muted truncate">
              &gt; {PORTFOLIO_DATA.identity.shortHandle} // STATUS:{' '}
              <span className="text-[#9A6CC6]">ONLINE</span>
              <span className="cursor-blink text-[#9A6CC6]">█</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleMotion}
              className="border border-hairline bg-panel px-2.5 py-1 text-[11px] uppercase tracking-label text-primary hover:border-[#9A6CC6] hover:bg-[#9A6CC6] hover:text-black transition-none"
            >
              [ MOT:{motionEnabled ? 'ON' : 'OFF'} ]
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-expanded={mobileMenuOpen}
              className="border border-hairline bg-panel px-2.5 py-1 text-[11px] uppercase tracking-label text-primary hover:border-[#9A6CC6] hover:bg-[#9A6CC6] hover:text-black transition-none"
            >
              {mobileMenuOpen ? '[ X ]' : '[ NAV ]'}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav
            aria-label="Mobile sections"
            className="mt-3 grid grid-cols-2 gap-2 border-t border-[#1C1C1C] pt-3"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-1 py-1 text-[11px] uppercase tracking-label text-muted hover:text-[#9A6CC6]"
              >
                <ScrambleText
                  text={link.label}
                  motionEnabled={motionEnabled}
                  glitchIntensity={glitchIntensity}
                />
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* De-boxed Desktop Fixed Left Telemetry Sidebar (26% split, single 1px hairline) */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-[26%] lg:min-w-[290px] lg:max-w-[380px] lg:flex-col lg:justify-between lg:border-r lg:border-[#1C1C1C] lg:bg-canvas lg:px-7 lg:py-9 lg:overflow-y-auto">
        <div className="space-y-8">
          {/* Top Interactive ASCII Bongo Cat */}
          <div className="py-1 w-full">
            <BongoCat motionEnabled={motionEnabled} />
          </div>

          {/* Underlined Uppercase Title + Motion Toggle */}
          <div className="space-y-3 text-center">
            <h1 className="text-xs font-bold tracking-label uppercase text-primary underline underline-offset-4">
              {PORTFOLIO_DATA.identity.titleLine}
            </h1>
            <button
              type="button"
              onClick={onToggleMotion}
              title="Toggle animations and scramble effects"
              className="text-[11px] uppercase tracking-label text-muted hover:text-[#9A6CC6] transition-none"
            >
              <ScrambleText
                text={`[ MOTION: ${motionEnabled ? 'ON' : 'OFF'} ]`}
                motionEnabled={motionEnabled}
                glitchIntensity={glitchIntensity}
              />
            </button>
          </div>

          {/* 3 Status Lines */}
          <div className="text-[11px] space-y-1.5">
            <div>
              <span className="text-muted">&gt; IDENTITY: </span>
              <span className="text-primary font-semibold">
                {PORTFOLIO_DATA.identity.name.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-muted">&gt; FOCUS: </span>
              <span className="text-primary">{PORTFOLIO_DATA.identity.focusSummary}</span>
            </div>
            <div>
              <span className="text-muted">&gt; STATUS: </span>
              <span className="text-[#9A6CC6] font-semibold">ONLINE</span>
              <span className="cursor-blink text-[#9A6CC6]">█</span>
            </div>
          </div>

          {/* Section Navigation */}
          <nav aria-label="Console sections" className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="text-[11px] uppercase tracking-label text-muted hover:text-[#9A6CC6] transition-none w-fit"
              >
                <ScrambleText
                  text={link.label}
                  motionEnabled={motionEnabled}
                  glitchIntensity={glitchIntensity}
                />
              </a>
            ))}
          </nav>

          {/* 4 Short Boot-Log Lines */}
          <div className="text-[10.5px] leading-relaxed space-y-1">
            {shortLogs.slice(0, visibleLogs).map((log) => (
              <div key={log.timestamp} className="flex items-center justify-between gap-2">
                <span className="text-muted truncate">
                  {log.timestamp} {log.message}
                </span>
                <span className="text-[#9A6CC6] shrink-0">{log.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 2-Line SYS_OUT Notice */}
        <div className="mt-8 text-[11px] leading-relaxed">
          <div className="text-[#9A6CC6] font-semibold uppercase tracking-label">
            SYS_OUT // ACCESS
          </div>
          <p className="text-muted">
            Open to EU cybersecurity internships &amp; junior roles (relocation ready).
          </p>
        </div>
      </aside>
    </>
  );
};
