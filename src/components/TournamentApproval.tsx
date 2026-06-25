// @ts-nocheck
'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
export function TournamentApproval(props: any) {
  const list = props.tournaments || props.pendingTournaments || []
  const approve = props.onApprove || props.onApproveTournament || (() => {})
  const reject = props.onReject || props.onRejectTournament || (() => {})
  if (!list.length) return <div className="text-white/50 text-center py-8">No pending tournaments</div>
  return (
    <div className="space-y-3">
      {list.map((t: any) => (
        <div key={t.id} className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/10">
          <div>
            <p className="text-white font-semibold">{t.name}</p>
            <p className="text-white/50 text-sm">by {t.createdBy} • {t.prizePool}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => approve(t.id)} className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 border border-green-500/20">Approve</button>
            <button onClick={() => reject(t.id)} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 border border-red-500/20">Reject</button>
          </div>
        </div>
      ))}
    </div>
  )
}
