import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { AsciiFieldCanvas } from './AsciiFieldCanvas';
import { ScrambleText } from './ScrambleText';
import { SectionHeader } from './SectionHeader';

interface CommLinkSectionProps {
  motionEnabled: boolean;
  glitchIntensity: number;
  onOpenCvModal: () => void;
}

export const CommLinkSection: React.FC<CommLinkSectionProps> = ({
  motionEnabled,
  glitchIntensity,
  onOpenCvModal,
}) => {
  return (
    <section id="comm-link" className="scroll-mt-16">
      <SectionHeader
        title="04 // ESTABLISH_COMM_LINK"
        motionEnabled={motionEnabled}
        glitchIntensity={glitchIntensity}
      />

      <div className="relative overflow-hidden border border-hairline hover:border-[#9A6CC6] bg-panel transition-none">
        <AsciiFieldCanvas
          motionEnabled={motionEnabled}
          density="standard"
          variant="full"
        />

        <div className="relative z-10 p-7 sm:p-9 space-y-6 bg-panel/85">
          <div className="text-xs font-mono break-all">
            <span className="text-[#9A6CC6]">guest@torres08</span>
            <span className="text-muted"> : </span>
            <span className="text-[#9A6CC6]">~ $</span>
            <span className="text-primary">
              {' '}
              mail -s &quot;INQUIRY&quot; {PORTFOLIO_DATA.identity.email}
            </span>
          </div>

          <div className="space-y-2 max-w-2xl">
            <h3 className="text-base sm:text-lg font-bold text-primary">
              {PORTFOLIO_DATA.contact.headline}
            </h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {PORTFOLIO_DATA.contact.text}
            </p>
          </div>

          {/* Side-by-Side Bracketed CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <a
              href={`mailto:${PORTFOLIO_DATA.identity.email}?subject=INQUIRY%20//%20Cybersecurity%20Portfolio`}
              className="border border-hairline bg-canvas px-4 py-3 text-center text-xs font-bold uppercase tracking-label text-primary hover:border-[#9A6CC6] hover:bg-[#9A6CC6] hover:text-black"
            >
              <ScrambleText
                text="[ SEND_SIGNAL ]"
                motionEnabled={motionEnabled}
                glitchIntensity={glitchIntensity}
              />
            </a>
            <a
              href={PORTFOLIO_DATA.identity.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-hairline bg-canvas px-4 py-3 text-center text-xs font-bold uppercase tracking-label text-primary hover:border-[#9A6CC6] hover:bg-[#9A6CC6] hover:text-black"
            >
              <ScrambleText
                text="[ GITHUB ]"
                motionEnabled={motionEnabled}
                glitchIntensity={glitchIntensity}
              />
            </a>
            <a
              href={PORTFOLIO_DATA.identity.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-hairline bg-canvas px-4 py-3 text-center text-xs font-bold uppercase tracking-label text-primary hover:border-[#9A6CC6] hover:bg-[#9A6CC6] hover:text-black"
            >
              <ScrambleText
                text="[ LINKEDIN ]"
                motionEnabled={motionEnabled}
                glitchIntensity={glitchIntensity}
              />
            </a>
            <a
              href={PORTFOLIO_DATA.identity.cvPdfPath}
              download="Juan_Luis_Torres_Ramos_CV.pdf"
              className="border border-hairline bg-canvas px-4 py-3 text-center text-xs font-bold uppercase tracking-label text-[#9A6CC6] hover:border-[#9A6CC6] hover:bg-[#9A6CC6] hover:text-black"
            >
              <ScrambleText
                text="[ DOWNLOAD_CV ]"
                motionEnabled={motionEnabled}
                glitchIntensity={glitchIntensity}
              />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-4 text-[11px] text-muted">
            <span>DIRECT_ADDR: {PORTFOLIO_DATA.identity.email}</span>
            <button
              type="button"
              onClick={onOpenCvModal}
              className="text-primary underline underline-offset-4 hover:text-[#9A6CC6]"
            >
              [ VIEW_CV_ASCII_SUMMARY ]
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
