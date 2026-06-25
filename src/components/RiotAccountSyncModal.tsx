// @ts-nocheck
'use client'
import { X, ChevronDown } from "lucide-react";

interface RiotAccountSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  riotSummonerName: string;
  setRiotSummonerName: (v: string) => void;
  riotSelectedRegion: "euw" | "eune";
  setRiotSelectedRegion: (v: "euw" | "eune") => void;
  handleRiotSync: () => void;
  loadingRiotData: boolean;
}

export function RiotAccountSyncModal({
  isOpen,
  onClose,
  riotSummonerName,
  setRiotSummonerName,
  riotSelectedRegion,
  setRiotSelectedRegion,
  handleRiotSync,
  loadingRiotData,
}: RiotAccountSyncModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-50 p-3 sm:p-4">
      <div className="bg-[#242836] rounded-2xl max-w-md w-full p-8 relative border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00d4ff] to-[#00b8e6] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-white text-2xl">Connect Riot Account</h2>
              <p className="text-white/60 text-sm">Link your League of Legends account</p>
            </div>
          </div>
        </div>

        <div className="bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-[#00d4ff] text-sm mb-2">
                <span className="font-medium">100% Legal &amp; Safe</span>
              </p>
              <ul className="text-white/70 text-xs space-y-1">
                <li>• Uses official Riot Games API</li>
                <li>• No password required</li>
                <li>• Only public stats displayed</li>
                <li>• Approved by Riot Developer Portal</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-white/80 text-sm mb-2 block">Riot ID (Game Name + Tag)</label>
            <input
              type="text"
              value={riotSummonerName}
              onChange={(e) => setRiotSummonerName(e.target.value)}
              placeholder="Enter your Riot ID: Name#TAG"
              className="w-full px-4 py-3 bg-[#1a1d29] border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
            />
            <p className="text-white/50 text-xs mt-1">
              Example: "Faker#KR1", "xPeke#EUW", "Rekkles#1337"
            </p>
            <p className="text-[#00d4ff]/70 text-xs mt-1">
              ⚠️ Required format: <span className="font-medium">GameName#TAG</span>
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/80 text-sm">Riot Account Region</label>
              <span className="px-2 py-0.5 bg-[#00d4ff]/10 text-[#00d4ff] text-xs rounded border border-[#00d4ff]/20">
                Editable
              </span>
            </div>
            <div className="relative">
              <select
                value={riotSelectedRegion}
                onChange={(e) => setRiotSelectedRegion(e.target.value as "euw" | "eune")}
                className="w-full px-4 py-3 bg-[#1a1d29] border border-white/10 rounded-lg text-white appearance-none cursor-pointer hover:border-[#00d4ff]/30 focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
              >
                <option value="euw">🇪🇺 EUW - Europe West</option>
                <option value="eune">🇪🇺 EUNE - Europe Nordic &amp; East</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
            </div>
            <p className="text-white/50 text-xs mt-1">
              ℹ️ Select the region where your League of Legends account is located
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/70 text-xs mb-2">
            <span className="text-white font-medium">How to find your Riot ID:</span>
          </p>
          <ol className="text-white/60 text-xs space-y-1 ml-4">
            <li>1. Open League of Legends client</li>
            <li>2. Look at the top-left corner</li>
            <li>3. You'll see your name in format: <span className="text-[#00d4ff]">GameName#TAG</span></li>
            <li>4. Copy it exactly with the # and tag (example: "Faker#KR1")</li>
            <li>5. Your tag is usually 3-5 characters after the #</li>
          </ol>
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-white/50 text-xs">
              💡 <span className="text-white/70">Don't have your tag?</span> Check in-game profile or Riot account settings.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleRiotSync}
            disabled={loadingRiotData || !riotSummonerName.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] text-white rounded-lg hover:from-[#00b8e6] hover:to-[#009ac7] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loadingRiotData ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
                <span>Connect Account</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/50 text-xs">
            Need help? Read our{' '}
            <button className="text-[#00d4ff] hover:underline">
              Riot API Setup Guide
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
