import React, { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolio';
import { AsciiFieldCanvas } from './AsciiFieldCanvas';
import { SectionHeader } from './SectionHeader';

interface IdentitySectionProps {
  motionEnabled: boolean;
  glitchIntensity: number;
}

const VALID_COMMANDS = [
  'ls core_competencies/',
  'whoami',
  'skills',
  'tree',
  'projects',
  'edu',
  'languages',
  'contact',
  'ls',
  'clear',
  'help',
] as const;

const HINT_COMMANDS = [
  'whoami',
  'ls core_competencies/',
  'projects',
  'edu',
  'contact',
  'help',
  'clear',
] as const;

interface TerminalEntry {
  id: number;
  command: string;
  body: React.ReactNode;
}

function renderCompetenciesTree(filterDir?: string): React.ReactNode {
  const groups = filterDir
    ? PORTFOLIO_DATA.skillGroups.filter((g) =>
        g.dirName.toLowerCase().startsWith(filterDir.toLowerCase()),
      )
    : PORTFOLIO_DATA.skillGroups;

  const totalSkills = groups.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="font-mono text-xs space-y-1 leading-relaxed">
      <div className="text-[#9A6CC6] font-bold">core_competencies/</div>
      {groups.map((group, idx) => {
        const isLast = idx === groups.length - 1;
        const branch = isLast ? '└── ' : '├── ';
        const pipe = isLast ? '    ' : '│   ';

        return (
          <div key={group.id} className="space-y-0.5">
            <div className="whitespace-pre">
              <span className="text-muted">{branch}</span>
              <span className="text-[#9A6CC6] font-semibold">{group.dirName}</span>
              <span className="text-muted text-[11px]"> [{group.items.length}]</span>
            </div>
            <div className="flex items-start">
              <span className="text-muted whitespace-pre select-none shrink-0">
                {pipe}└──{' '}
              </span>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-primary">
                {group.items.map((item, i) => (
                  <React.Fragment key={item}>
                    <span>{item}</span>
                    {i < group.items.length - 1 && (
                      <span className="text-muted">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        );
      })}
      <div className="pt-1.5 text-[11px] text-muted">
        {groups.length} {groups.length === 1 ? 'directory' : 'directories'}, {totalSkills}{' '}
        competencies
      </div>
    </div>
  );
}

export const IdentitySection: React.FC<IdentitySectionProps> = ({
  motionEnabled,
  glitchIntensity,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [history, setHistory] = useState<string[]>(['whoami']);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  const nextIdRef = useRef<number>(2);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const renderWhoami = () => (
    <div className="space-y-2.5 text-xs sm:text-sm max-w-3xl">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline pb-2">
        <span className="text-primary font-bold text-sm sm:text-base">
          {PORTFOLIO_DATA.identity.name}
        </span>
        <span className="text-[#9A6CC6] text-xs font-medium">
          {PORTFOLIO_DATA.identity.subtitle}
        </span>
      </div>
      <p className="text-primary leading-relaxed">
        {PORTFOLIO_DATA.identity.bio}
      </p>
    </div>
  );

  const [entries, setEntries] = useState<TerminalEntry[]>(() => [
    {
      id: 1,
      command: 'whoami',
      body: renderWhoami(),
    },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const executeCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const cmd = trimmed.toLowerCase().replace(/\s+/g, ' ');
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);
    setInputValue('');

    if (cmd === 'clear') {
      setEntries([]);
      return;
    }

    let body: React.ReactNode = null;

    if (
      cmd === 'ls core_competencies/' ||
      cmd === 'ls core_competencies' ||
      cmd === 'ls -la core_competencies/' ||
      cmd === 'ls -la core_competencies' ||
      cmd === 'tree' ||
      cmd === 'tree core_competencies/' ||
      cmd === 'tree core_competencies' ||
      cmd === 'skills'
    ) {
      body = renderCompetenciesTree();
    } else if (cmd.startsWith('ls core_competencies/')) {
      const sub = cmd.replace('ls core_competencies/', '').trim();
      body = renderCompetenciesTree(sub);
    } else if (cmd === 'ls' || cmd === 'ls -la') {
      body = (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
          <button
            type="button"
            onClick={() => executeCommand('ls core_competencies/')}
            className="text-[#9A6CC6] font-bold hover:underline underline-offset-4"
          >
            core_competencies/
          </button>
          {(['whoami', 'projects', 'edu', 'languages', 'contact'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => executeCommand(item)}
              className="text-primary hover:text-[#9A6CC6] hover:underline underline-offset-4"
            >
              {item}
            </button>
          ))}
        </div>
      );
    } else if (cmd === 'whoami') {
      body = renderWhoami();
    } else if (cmd === 'edu') {
      body = (
        <div className="space-y-1.5 text-xs">
          {PORTFOLIO_DATA.education.slice(0, 2).map((edu) => (
            <div key={edu.id} className="flex flex-wrap justify-between gap-2">
              <span className="text-primary">
                <span className="text-[#9A6CC6]">├──</span> {edu.degree}{' '}
                <span className="text-muted">— {edu.institution}</span>
              </span>
              <span className="text-[#9A6CC6] shrink-0">{edu.period}</span>
            </div>
          ))}
        </div>
      );
    } else if (cmd === 'languages') {
      body = (
        <div className="text-xs text-primary">
          <span className="text-[#9A6CC6]">└──</span> Spanish (Native) · English (B2 Cert / C1
          rec.) · French (B1 Diploma)
        </div>
      );
    } else if (cmd === 'projects') {
      body = (
        <div className="space-y-1.5 text-xs">
          {PORTFOLIO_DATA.featuredProjects.map((proj, idx) => {
            const branch =
              idx === PORTFOLIO_DATA.featuredProjects.length - 1 ? '└──' : '├──';
            return (
              <div
                key={proj.hexId}
                className="flex flex-wrap items-baseline justify-between gap-2"
              >
                <div>
                  <span className="text-muted mr-2">{branch}</span>
                  <span className="text-[#9A6CC6] mr-2">{proj.hexId}</span>
                  <a
                    href="#deployments"
                    className="text-primary hover:text-[#9A6CC6] underline underline-offset-4"
                  >
                    {proj.title}
                  </a>
                </div>
                <span className="text-muted text-[11px]">{proj.category}</span>
              </div>
            );
          })}
        </div>
      );
    } else if (cmd === 'contact') {
      body = (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs">
          <a
            href={`mailto:${PORTFOLIO_DATA.identity.email}`}
            className="text-[#9A6CC6] underline underline-offset-4 hover:text-primary"
          >
            {PORTFOLIO_DATA.identity.email}
          </a>
          <a
            href={PORTFOLIO_DATA.identity.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-4 hover:text-[#9A6CC6]"
          >
            [ GITHUB ]
          </a>
          <a
            href={PORTFOLIO_DATA.identity.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline underline-offset-4 hover:text-[#9A6CC6]"
          >
            [ LINKEDIN ]
          </a>
          <a
            href={PORTFOLIO_DATA.identity.cvPdfPath}
            download="Juan_Luis_Torres_Ramos_CV.pdf"
            className="text-[#9A6CC6] underline underline-offset-4 hover:text-primary"
          >
            [ DOWNLOAD_CV ]
          </a>
        </div>
      );
    } else if (cmd === 'help') {
      body = (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
          <div>
            <span className="text-[#9A6CC6]">ls core_competencies/</span>{' '}
            <span className="text-muted">— skill tree</span>
          </div>
          <div>
            <span className="text-[#9A6CC6]">whoami</span>{' '}
            <span className="text-muted">— identity profile</span>
          </div>
          <div>
            <span className="text-[#9A6CC6]">projects</span>{' '}
            <span className="text-muted">— jump to deployments</span>
          </div>
          <div>
            <span className="text-[#9A6CC6]">edu</span>{' '}
            <span className="text-muted">— academic timeline</span>
          </div>
          <div>
            <span className="text-[#9A6CC6]">languages</span>{' '}
            <span className="text-muted">— spoken languages</span>
          </div>
          <div>
            <span className="text-[#9A6CC6]">contact</span>{' '}
            <span className="text-muted">— links &amp; CV PDF</span>
          </div>
        </div>
      );
    } else {
      body = (
        <div className="text-xs text-muted">
          zsh: command not found: <span className="text-[#F87171]">{trimmed}</span> — try{' '}
          <button
            type="button"
            onClick={() => executeCommand('help')}
            className="text-[#9A6CC6] underline underline-offset-4"
          >
            help
          </button>
        </div>
      );
    }

    const id = nextIdRef.current++;
    setEntries((prev) => [...prev, { id, command: trimmed, body }]);
  };

  const normalizedInput = inputValue.toLowerCase();
  const suggestion =
    normalizedInput.length > 0
      ? VALID_COMMANDS.find(
          (c) => c.startsWith(normalizedInput) && c !== normalizedInput,
        ) ?? ''
      : '';
  const ghostSuffix = suggestion ? suggestion.slice(inputValue.length) : '';

  const isExactValid =
    normalizedInput.trim().length > 0 &&
    (VALID_COMMANDS.includes(
      normalizedInput.trim() as (typeof VALID_COMMANDS)[number],
    ) ||
      normalizedInput.trim() === 'ls core_competencies' ||
      normalizedInput.trim() === 'ls -la');
  const hasPrefixMatch =
    normalizedInput.length > 0 &&
    VALID_COMMANDS.some((c) => c.startsWith(normalizedInput));
  const inputColorClass =
    normalizedInput.length === 0
      ? 'text-primary'
      : isExactValid || hasPrefixMatch
        ? 'text-[#9A6CC6]'
        : 'text-[#F87171]';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputValue);
      return;
    }

    if (e.key === 'Tab' || e.key === 'ArrowRight') {
      const atEnd =
        inputRef.current &&
        inputRef.current.selectionStart === inputValue.length &&
        inputRef.current.selectionEnd === inputValue.length;
      if (suggestion && (e.key === 'Tab' || atEnd)) {
        e.preventDefault();
        setInputValue(suggestion);
        return;
      }
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx =
        historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputValue(history[nextIdx]);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      if (historyIdx >= history.length - 1) {
        setHistoryIdx(-1);
        setInputValue('');
      } else {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInputValue(history[nextIdx]);
      }
    }
  };

  return (
    <section id="identity" className="scroll-mt-16 space-y-5">
      <SectionHeader
        title="01 // IDENTITY_RECORDS"
        motionEnabled={motionEnabled}
        glitchIntensity={glitchIntensity}
      />

      <div
        onClick={() => inputRef.current?.focus()}
        className="relative overflow-hidden border-2 border-[#9A6CC6] bg-panel cursor-text transition-none"
      >
        <AsciiFieldCanvas
          motionEnabled={motionEnabled}
          density="standard"
          variant="subtle"
        />

        {/* Purple Inverted Terminal Header Bar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 flex items-center justify-between gap-2 border-b border-[#9A6CC6] bg-[#9A6CC6] text-black px-6 py-3 text-xs font-bold cursor-default"
        >
          <div className="flex items-center gap-2.5 uppercase tracking-label">
            <span>●</span>
            <span>TERMINAL // guest@torres08:~</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[11px] font-semibold opacity-80">
              TAB:COMPLETE · ↑↓:HISTORY
            </span>
            {entries.length > 0 && (
              <button
                type="button"
                onClick={() => executeCommand('clear')}
                className="bg-black text-[#9A6CC6] hover:text-white px-2 py-0.5 text-[11px] uppercase tracking-label"
              >
                [ CLEAR ]
              </button>
            )}
          </div>
        </div>

        {/* Larger Scrollable Shell Body */}
        <div className="relative z-10 bg-panel/90 p-8 sm:p-10 space-y-7">
          <div
            ref={scrollRef}
            className="min-h-[260px] sm:min-h-[300px] max-h-[460px] overflow-y-auto space-y-6 pr-1"
          >
            {entries.map((entry) => (
              <div key={entry.id} className="space-y-2.5">
                <div className="text-xs sm:text-sm font-mono flex items-center gap-1.5">
                  <span className="text-[#9A6CC6] font-semibold">guest@torres08</span>
                  <span className="text-muted">:</span>
                  <span className="text-[#9A6CC6]">~</span>
                  <span className="text-muted">$</span>
                  <span className="text-primary font-medium">{entry.command}</span>
                </div>
                <div className="pl-4 border-l-2 border-[#9A6CC6]/50">{entry.body}</div>
              </div>
            ))}

            {/* Live Prompt Line with Kali Syntax Highlight + Ghost Autosuggestion */}
            <div className="flex items-center text-xs sm:text-sm font-mono pt-1">
              <span className="text-[#9A6CC6] font-semibold shrink-0">guest@torres08</span>
              <span className="text-muted shrink-0">:</span>
              <span className="text-[#9A6CC6] shrink-0">~</span>
              <span className="text-muted shrink-0">&nbsp;$&nbsp;</span>
              <div className="relative flex-1 flex items-center min-w-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={entries.length === 0 ? "type a command or click below..." : ""}
                  aria-label="Interactive terminal command input"
                  spellCheck={false}
                  autoCapitalize="none"
                  autoComplete="off"
                  className="w-full bg-transparent text-transparent placeholder:text-[#3A3A3A] caret-transparent outline-none font-mono text-xs sm:text-sm relative z-10"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 flex items-center whitespace-pre text-xs sm:text-sm"
                >
                  <span className={inputColorClass}>{inputValue}</span>
                  <span className="cursor-blink bg-[#9A6CC6] text-black inline-block w-[0.55em] h-[1.15em] align-middle" />
                  {ghostSuffix && <span className="text-[#4A4A4A]">{ghostSuffix}</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Command Launcher Strip */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="pt-5 border-t border-hairline flex flex-wrap items-center gap-2.5 cursor-default"
          >
            <span className="text-[11px] text-[#9A6CC6] font-semibold uppercase tracking-label mr-1">
              EXEC //
            </span>
            {HINT_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('bongo-tap'));
                  executeCommand(cmd);
                }}
                className="border border-[#9A6CC6]/50 bg-canvas px-3 py-1.5 text-xs font-mono text-primary hover:border-[#9A6CC6] hover:bg-[#9A6CC6] hover:text-black transition-none"
              >
                <span className="text-[#9A6CC6] mr-1">$</span>
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
