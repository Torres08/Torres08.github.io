import React, { useCallback, useState } from 'react';
import { AsciiLoader } from './components/AsciiLoader';
import { CommLinkSection } from './components/CommLinkSection';
import { CredentialsSection } from './components/CredentialsSection';
import { DeploymentsSection } from './components/DeploymentsSection';
import { IdentitySection } from './components/IdentitySection';
import { LabSpecModal, type ModalTarget } from './components/LabSpecModal';
import { Sidebar } from './components/Sidebar';
import { prefersReducedMotion } from './utils/scramble';

const LOCKED_GLITCH_INTENSITY = 100;

export const App: React.FC = () => {
  const [motionEnabled, setMotionEnabled] = useState<boolean>(() => !prefersReducedMotion());
  const [showLoader, setShowLoader] = useState<boolean>(() => !prefersReducedMotion());
  const [modalTarget, setModalTarget] = useState<ModalTarget>(null);

  const handleToggleMotion = useCallback(() => {
    setMotionEnabled((prev) => !prev);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setShowLoader(false);
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-primary">
      {showLoader && (
        <AsciiLoader
          motionEnabled={motionEnabled}
          glitchIntensity={LOCKED_GLITCH_INTENSITY}
          onComplete={handleLoaderComplete}
        />
      )}

      <div className="min-h-screen lg:flex">
        <Sidebar
          motionEnabled={motionEnabled}
          onToggleMotion={handleToggleMotion}
          glitchIntensity={LOCKED_GLITCH_INTENSITY}
        />

        {/* Right Console (~74% width on desktop) */}
        <main className="flex-1 lg:ml-[max(26%,290px)] xl:ml-[min(26%,380px)] min-w-0">
          <div className="mx-auto max-w-5xl px-5 py-10 sm:px-10 sm:py-14 space-y-20 sm:space-y-24">
            <IdentitySection
              motionEnabled={motionEnabled}
              glitchIntensity={LOCKED_GLITCH_INTENSITY}
            />

            <DeploymentsSection
              motionEnabled={motionEnabled}
              glitchIntensity={LOCKED_GLITCH_INTENSITY}
              onInspectFeaturedLab={(project) =>
                setModalTarget({ kind: 'featured', project })
              }
              onInspectSecondaryLab={(project) =>
                setModalTarget({ kind: 'secondary', project })
              }
            />

            <CredentialsSection
              motionEnabled={motionEnabled}
              glitchIntensity={LOCKED_GLITCH_INTENSITY}
            />

            <CommLinkSection
              motionEnabled={motionEnabled}
              glitchIntensity={LOCKED_GLITCH_INTENSITY}
              onOpenCvModal={() => setModalTarget({ kind: 'cv' })}
            />

            <footer className="border-t border-hairline pt-6 pb-8 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
              <span>EOF // JUAN LUIS TORRES RAMOS — CYBERSECURITY_PORTFOLIO</span>
              <span>MOTION: {motionEnabled ? 'ON' : 'OFF'}</span>
            </footer>
          </div>
        </main>
      </div>

      <LabSpecModal target={modalTarget} onClose={() => setModalTarget(null)} />
    </div>
  );
};

export default App;
