// @ts-nocheck
'use client'
import React from 'react';

interface RankBadgeProps {
  rank: string;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export function RankBadge({ rank, size = 'small', children }: RankBadgeProps) {
  // Simply return the children without any wrapper
  return <>{children}</>;
}
