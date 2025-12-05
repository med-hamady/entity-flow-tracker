export type EntityState = 'draft' | 'submitted' | 'validated' | 'rejected' | 'archived';

export interface EntityVersion {
  id: string;
  version: number;
  content: string;
  createdAt: Date;
  author: string;
}

export interface EntityTransition {
  id: string;
  fromState: EntityState;
  toState: EntityState;
  timestamp: Date;
  author: string;
  reason?: string;
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  currentState: EntityState;
  createdAt: Date;
  updatedAt: Date;
  versions: EntityVersion[];
  transitions: EntityTransition[];
  metadata?: Record<string, unknown>;
}

export interface EntityStats {
  totalEntities: number;
  byState: Record<EntityState, number>;
  averageTimeInState: Record<EntityState, number>;
  revisionRate: number;
  successRate: number;
}
