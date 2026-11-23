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

        <div className="relative z-10 bg-panel/90 p-7 sm:p-9 space-y-8">
          {/* Field Experience */}
          {PORTFOLIO_DATA.experience.map((exp) => (
            <div key={exp.company} className="space-y-3 border-b border-hairline pb-7">
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
                <span className="text-[11px] text-muted shrink-0">{exp.period}</span>
              </div>

              <div className="pl-6 space-y-1 text-xs text-muted">
                {exp.bullets.map((bullet) => (
                  <div key={bullet}>&gt; {bullet}</div>
                ))}
              </div>

              <blockquote className="ml-6 border-l border-[#9A6CC6] pl-4 py-1 text-xs text-primary/90 italic">
                &ldquo;{exp.recommendation.quote}&rdquo; —{' '}
                <span className="not-italic text-muted">
                  {exp.recommendation.author}, {exp.recommendation.title}
                </span>
              </blockquote>
            </div>
          ))}

          {/* Education */}
          <div className="space-y-2.5 border-b border-hairline pb-7 text-xs">
            {PORTFOLIO_DATA.education.map((edu) => (
              <div
                key={edu.id}
                className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
              >
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
                  <span className="text-muted"> — {edu.institution}</span>
                </div>
                <span className="text-[11px] text-muted shrink-0 pl-6 sm:pl-0">
                  {edu.period}
                </span>
              </div>
            ))}
          </div>

          {/* Certifications, Competitions, Honors & Writing */}
          <div className="space-y-2.5 text-xs">
            {PORTFOLIO_DATA.credentials.map((cred) => (
              <div
                key={cred.id}
                className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2"
              >
                <div>
                  <span className="text-[#9A6CC6] mr-2">[+]</span>
                  <span className="font-semibold text-primary">{cred.title}</span>
                  <span className="text-muted">
                    {' '}
                    — {cred.issuerOrContext}
                    {cred.date ? ` · ${cred.date}` : ''}
                  </span>
                </div>

                {cred.url && (
                  <a
                    href={cred.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 pl-6 sm:pl-0 text-[11px] uppercase tracking-label text-[#9A6CC6] underline underline-offset-4 hover:text-primary"
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
    </section>
  );
};
