import React, { useState } from 'react';
import {
  GraduationCap,
  Eye,
  Layers,
  AlertTriangle,
  BookOpen,
  Target,
  Volume2,
  VolumeX,
  TrendingUp,
  MapPin,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { CoachDebrief } from '../types';
import { CoachVoice } from '../utils/speech';

interface CoachDebriefCardProps {
  debrief: CoachDebrief;
  fullTextToSpeak?: string;
}

export const CoachDebriefCard: React.FC<CoachDebriefCardProps> = ({
  debrief,
  fullTextToSpeak,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayVoice = () => {
    if (isPlayingAudio) {
      CoachVoice.stop();
      setIsPlayingAudio(false);
    } else {
      let speech = `Débrief de ton coach TRADEMASTER. `;
      if (debrief.trendAndProofs) {
        speech += `1. Tendance et preuves : ${debrief.trendAndProofs}. `;
      } else if (debrief.visualObservations) {
        speech += `Ce que j'ai vu sur ta capture : ${debrief.visualObservations}. `;
      }

      if (debrief.top3Zones) {
        speech += `2. Les 3 zones clés : ${debrief.top3Zones}. `;
      } else if (debrief.zoneImportance) {
        speech += `Pourquoi cette zone est clé : ${debrief.zoneImportance}. `;
      }

      if (debrief.setupStatus) {
        speech += `3. Statut du setup : ${debrief.setupStatus}. `;
      }

      if (debrief.errorCorrection) {
        speech += `4. Correction de tes erreurs : ${debrief.errorCorrection}. `;
      } else if (debrief.beginnerTrap) {
        speech += `Le piège débutant à éviter : ${debrief.beginnerTrap}. `;
      }

      if (debrief.lesson) {
        speech += `5. Ta leçon du jour : ${debrief.lesson}. `;
      }
      if (debrief.exercise) {
        speech += `Ton exercice pour demain : ${debrief.exercise}.`;
      }

      CoachVoice.speak(speech);
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 30000);
    }
  };

  const hasV5CaptureBreakdown = Boolean(
    debrief.trendAndProofs || debrief.top3Zones || debrief.setupStatus || debrief.errorCorrection
  );

  return (
    <div className="luxury-card rounded-2xl border-[#A855F7]/50 p-4 sm:p-5 my-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FFD700]/25 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>👨‍🏫 LE DÉBRIEF DU COACH TRADEMASTER</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                {hasV5CaptureBreakdown ? 'Analyse Capture 5-Points (v5)' : 'Mentor Bienveillant'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Analyse pédagogique en direct pour forger ta discipline et ton indépendance.
            </p>
          </div>
        </div>

        {/* Listen Voice Coach */}
        <button
          onClick={handlePlayVoice}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            isPlayingAudio
              ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          title="Écouter le coach vocaliser ce débrief"
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-3.5 h-3.5" /> Stop Voix
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> Écouter Coach
            </>
          )}
        </button>
      </div>

      {/* Grid of coach points */}
      <div className="flex flex-col gap-2.5 text-xs">
        {/* Point 1: Trend and Proofs (v5) or Visual observation */}
        {debrief.trendAndProofs ? (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
            <TrendingUp className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300 block mb-0.5">
                📈 1. Tendance et preuves (H4 + H1) :
              </span>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{debrief.trendAndProofs}</p>
            </div>
          </div>
        ) : debrief.visualObservations ? (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
            <Eye className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300 block mb-0.5">
                👁️ Ce que j'ai vu sur ta capture :
              </span>
              <p className="text-slate-300 leading-relaxed">{debrief.visualObservations}</p>
            </div>
          </div>
        ) : null}

        {/* Point 2: Top 3 Zones to Draw (v5) or Zone Importance */}
        {debrief.top3Zones ? (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block mb-0.5">
                🎯 2. Les 3 zones les plus importantes à tracer :
              </span>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{debrief.top3Zones}</p>
            </div>
          </div>
        ) : debrief.zoneImportance ? (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
            <Layers className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block mb-0.5">
                🧱 Pourquoi cette zone est clé :
              </span>
              <p className="text-slate-300 leading-relaxed">{debrief.zoneImportance}</p>
            </div>
          </div>
        ) : null}

        {/* Point 3: Setup Status / Exactly what to wait for (v5) */}
        {debrief.setupStatus && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300 block mb-0.5">
                ⚡ 3. Y a-t-il un setup ? (Conditions d'exécution) :
              </span>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">{debrief.setupStatus}</p>
            </div>
          </div>
        )}

        {/* Point 4: Error correction (v5) or Beginner trap */}
        {debrief.errorCorrection ? (
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-300 block mb-0.5">
                ⚠️ 4. Correction de tes erreurs (Ce qui a été mal vu) :
              </span>
              <p className="text-rose-200/90 leading-relaxed whitespace-pre-line">{debrief.errorCorrection}</p>
            </div>
          </div>
        ) : debrief.beginnerTrap ? (
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-300 block mb-0.5">
                ⚠️ Le piège débutant à éviter :
              </span>
              <p className="text-rose-200/90 leading-relaxed">{debrief.beginnerTrap}</p>
            </div>
          </div>
        ) : null}

        {/* Point 5: Lesson + Practical exercise */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {debrief.lesson && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-300 block mb-0.5">
                  📝 1 leçon à retenir :
                </span>
                <p className="text-slate-300 leading-relaxed">{debrief.lesson}</p>
              </div>
            </div>
          )}

          {debrief.exercise && (
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 flex items-start gap-2.5">
              <Target className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-300 block mb-0.5">
                  🎯 1 exercice à faire demain :
                </span>
                <p className="text-indigo-200/90 leading-relaxed">{debrief.exercise}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
