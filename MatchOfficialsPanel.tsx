import { Shield, Monitor, UserRound } from "lucide-react";
import type { MatchMeta } from "@/lib/match-meta";
import type { Match } from "@/lib/scores/types";

type MatchOfficialsPanelProps = {
  match: Match;
  meta: MatchMeta;
};

export default function MatchOfficialsPanel({ match, meta }: MatchOfficialsPanelProps) {
  const { officials } = meta;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <p className="text-[10px] uppercase tracking-wider text-muted mb-1">Home coach</p>
          <p className="text-sm font-semibold text-white">{meta.home.coach}</p>
          <p className="text-xs text-pitch mt-0.5">{match.home.name}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <p className="text-[10px] uppercase tracking-wider text-muted mb-1">Away coach</p>
          <p className="text-sm font-semibold text-white">{meta.away.coach}</p>
          <p className="text-xs text-pitch mt-0.5">{match.away.name}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-2">
        <div className="bg-navy/60 rounded-xl p-3 border border-gold/20">
          <div className="flex items-center gap-1.5 text-gold mb-1">
            <Shield size={14} />
            <span className="text-[10px] uppercase tracking-wider font-bold">Referee</span>
          </div>
          <p className="text-sm text-white font-medium">{officials.referee}</p>
        </div>
        <div className="bg-navy/60 rounded-xl p-3 border border-pitch/20">
          <div className="flex items-center gap-1.5 text-pitch mb-1">
            <Monitor size={14} />
            <span className="text-[10px] uppercase tracking-wider font-bold">VAR</span>
          </div>
          <p className="text-sm text-white font-medium">{officials.var}</p>
        </div>
        <div className="bg-navy/60 rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-1.5 text-muted mb-1">
            <UserRound size={14} />
            <span className="text-[10px] uppercase tracking-wider font-bold">4th Official</span>
          </div>
          <p className="text-sm text-white font-medium">{officials.fourthOfficial}</p>
        </div>
      </div>

      {officials.assistantReferees && (
        <p className="text-xs text-muted">
          ARs: {officials.assistantReferees.join(" · ")}
        </p>
      )}
    </div>
  );
}
