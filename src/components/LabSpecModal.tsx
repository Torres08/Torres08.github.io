import React, { useEffect } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import type { FeaturedProject, SecondaryProject } from '../types/portfolio';

export type ModalTarget =
  | { kind: 'featured'; project: FeaturedProject }
  | { kind: 'secondary'; project: SecondaryProject }
  | { kind: 'cv' }
  | null;

interface LabSpecModalProps {
  target: ModalTarget;
  onClose: () => void;
}

export const LabSpecModal: React.FC<LabSpecModalProps> = ({ target, onClose }) => {
  useEffect(() => {
    if (!target) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [target, onClose]);

  if (!target) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-hairline bg-panel p-4 sm:p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 border-b border-hairline pb-3">
          <div className="text-xs font-bold text-primary tracking-wider">
            {target.kind === 'cv'
              ? '// CV_EN_ASCII_DIGEST'
              : `// LAB_BRIEF :: ${target.project.hexId}`}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-hairline bg-canvas px-2 py-0.5 text-xs text-primary hover:bg-invertBg hover:text-invertFg"
          >
            [ ESC / CLOSE ]
          </button>
        </div>

        {target.kind === 'featured' && (
          <div className="space-y-3 text-xs">
            <h3 className="text-base font-bold text-primary">{target.project.title}</h3>
            <div className="text-muted">
              STATUS: <span className="text-promptPath">{target.project.labType}</span> (No
              public repository linked)
            </div>
            <div className="border border-hairline bg-canvas p-3 space-y-1">
              <div className="text-[11px] text-muted">// REAL_WORLD_USE_CASE</div>
              <p className="text-primary">{target.project.realWorldUseCase}</p>
            </div>
            <div className="space-y-1">
              <div className="text-[11px] text-muted">// EXECUTION_SUMMARY</div>
              {target.project.summary.map((s) => (
                <p key={s} className="text-primary">
                  &gt; {s}
                </p>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {target.project.stack.map((tech) => (
                <span
                  key={tech}
                  className="border border-hairline bg-canvas px-2 py-0.5 text-[11px] text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {target.kind === 'secondary' && (
          <div className="space-y-3 text-xs">
            <h3 className="text-base font-bold text-primary">{target.project.title}</h3>
            <div className="text-muted">
              CLASS: <span className="text-promptPath">{target.project.category}</span> —
              Academic Lab Record
            </div>
            <p className="text-primary leading-relaxed">{target.project.summary}</p>
            <div className="flex flex-wrap gap-1.5">
              {target.project.stack.map((tech) => (
                <span
                  key={tech}
                  className="border border-hairline bg-canvas px-2 py-0.5 text-[11px] text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {target.kind === 'cv' && (
          <div className="space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border border-hairline bg-canvas p-3">
              <div>
                <div className="font-bold text-primary">{PORTFOLIO_DATA.identity.name}</div>
                <div className="text-muted">{PORTFOLIO_DATA.identity.subtitle}</div>
              </div>
              <a
                href={PORTFOLIO_DATA.identity.cvPdfPath}
                download="Juan_Luis_Torres_Ramos_CV.pdf"
                className="border border-hairline bg-panel px-3 py-1.5 font-bold text-promptUser hover:bg-invertBg hover:text-invertFg"
              >
                [ DOWNLOAD_CV.PDF ]
              </a>
            </div>
            <pre className="whitespace-pre-wrap border border-hairline bg-canvas p-3 text-[11px] leading-relaxed text-primary">
              {[
                `CONTACT  : ${PORTFOLIO_DATA.identity.email}`,
                `GITHUB   : ${PORTFOLIO_DATA.identity.githubUrl}`,
                `LINKEDIN : ${PORTFOLIO_DATA.identity.linkedinUrl}`,
                ``,
                `ABOUT ME`,
                PORTFOLIO_DATA.identity.bio,
                ``,
                `EXPERIENCE`,
                ...PORTFOLIO_DATA.experience.flatMap((e) => [
                  `- ${e.role} @ ${e.company} (${e.location} | ${e.period})`,
                  ...e.bullets.map((b) => `  * ${b}`),
                ]),
                ``,
                `EDUCATION`,
                ...PORTFOLIO_DATA.education.map(
                  (ed) => `- ${ed.degree} — ${ed.institution} (${ed.period})`,
                ),
                ``,
                `CERTIFICATIONS & HONORS`,
                ...PORTFOLIO_DATA.credentials
                  .slice(0, 4)
                  .map((c) => `- ${c.title}${c.detail ? ` (${c.detail})` : ''}`),
              ].join('\n')}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
