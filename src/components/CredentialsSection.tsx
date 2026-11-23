import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { AsciiFieldCanvas } from './AsciiFieldCanvas';
import { ScrambleText } from './ScrambleText';
import { SectionHeader } from './SectionHeader';

interface CredentialsSectionProps {
  motionEnabled: boolean;
  glitchIntensity: number;
}

export const CredentialsSection: React.FC<CredentialsSectionProps> = ({
  motionEnabled,
  glitchIntensity,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <section id="credentials" className="scroll-mt-16">
      <SectionHeader
        title="03 // VALIDATED_CREDENTIALS"
        motionEnabled={motionEnabled}
        glitchIntensity={glitchIntensity}
      />

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative overflow-hidden border bg-panel transition-none ${
          isHovered ? 'border-[#9A6CC6]' : 'border-hairline'
        }`}
      >
        <AsciiFieldCanvas
          motionEnabled={motionEnabled}
          density="standard"
          variant="subtle"
          activeOnlyOnHover
          isHovered={isHovered}
        />

        <div className="relative z-10 bg-panel/90 divide-y divide-hairline">
          {/* 03.1 Field Experience */}
          <div className="p-7 sm:p-9 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-label text-[#9A6CC6]">
              // 03.1 FIELD_EXPERIENCE
            </div>

            {PORTFOLIO_DATA.experience.map((exp) => (
              <div key={exp.company} className="space-y-2.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="text-xs font-bold text-primary">
                    <span className="text-[#9A6CC6] mr-2">[+]</span>
                    {exp.role} —{' '}
                    <a
                      href={exp.companyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#9A6CC6] underline underline-offset-4 hover:text-primary"
                    >
                      {exp.company}
                    </a>{' '}
                    <span className="text-muted font-normal">({exp.location})</span>
                  </div>
                  <span className="border border-hairline bg-canvas px-2.5 py-0.5 text-[11px] text-primary shrink-0">
                    {exp.period}
                  </span>
                </div>

                <div className="pl-6 space-y-1 text-xs text-muted">
                  {exp.bullets.map((bullet) => (
                    <div key={bullet}>&gt; {bullet}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 03.2 Academic Timeline */}
          <div className="p-7 sm:p-9 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-label text-[#9A6CC6]">
              // 03.2 ACADEMIC_TIMELINE
            </div>

            <div className="space-y-3 text-xs">
              {PORTFOLIO_DATA.education.map((edu) => (
                <div
                  key={edu.id}
                  className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 border-l border-hairline pl-4 py-0.5"
                >
                  <div className="space-y-0.5">
                    <div>
                      <span className="text-[#9A6CC6] mr-2">[+]</span>
                      {edu.url ? (
                        <a
                          href={edu.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-primary underline underline-offset-4 hover:text-[#9A6CC6]"
                        >
                          {edu.degree}
                        </a>
                      ) : (
                        <span className="font-semibold text-primary">{edu.degree}</span>
                      )}
                    </div>
                    <div className="pl-6 text-[11px] text-muted">{edu.institution}</div>
                  </div>
                  <span className="text-[11px] text-[#9A6CC6] shrink-0 pl-6 sm:pl-0">
                    {edu.period}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 03.3 Certifications, Competitions, Honors & Writing */}
          <div className="p-7 sm:p-9 space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-label text-[#9A6CC6]">
              // 03.3 CERTIFICATIONS_&_RECOGNITION
            </div>

            <div className="divide-y divide-hairline border border-hairline bg-canvas/80">
              {PORTFOLIO_DATA.credentials.map((cred) => (
                <div
                  key={cred.id}
                  className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="text-[#9A6CC6] font-bold">[+]</span>
                    <span className="border border-hairline bg-panel px-1.5 py-0.5 text-[10px] uppercase tracking-label text-muted">
                      {cred.category}
                    </span>
                    <span className="font-semibold text-primary">{cred.title}</span>
                    <span className="text-muted text-[11px]">
                      — {cred.issuerOrContext}
                      {cred.date ? ` · ${cred.date}` : ''}
                    </span>
                  </div>

                  {cred.url && (
                    <a
                      href={cred.url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 self-start sm:self-center border border-hairline bg-panel px-2.5 py-1 text-[11px] uppercase tracking-label text-primary hover:border-[#9A6CC6] hover:bg-[#9A6CC6] hover:text-black"
                    >
                      <ScrambleText
                        text={`[ ${cred.linkLabel ?? 'OPEN_LINK'} ]`}
                        motionEnabled={motionEnabled}
                        glitchIntensity={glitchIntensity}
                      />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
