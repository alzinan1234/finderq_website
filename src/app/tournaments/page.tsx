// @ts-nocheck
'use client'
import { useAppStore } from '@/store/appStore'
import { Tournaments } from '@/components/Tournaments'
import { GuestWall } from '@/components/GuestWall'

export default function TournamentsPage() {
  const { isLoggedIn, pendingTournaments, set } = useAppStore()
  if (!isLoggedIn) return <GuestWall currentPage="tournaments" isLoggedIn={false} onSignUp={() => set({ isSignUpOpen: true })} onLogin={() => set({ isLoginOpen: true })} />
  return (
    <Tournaments
      onCreateTournament={() => set({ isCreateTournamentOpen: true })}
      onViewTournament={(id: number, status?: string) => set({ selectedTournamentId: id, selectedTournamentStatus: status || 'registration', isTournamentDetailsOpen: true })}
    />
  )
}
