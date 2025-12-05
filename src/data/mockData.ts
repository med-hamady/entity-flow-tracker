import { Entity, EntityState, EntityStats } from '@/types/entity';

const states: EntityState[] = ['draft', 'submitted', 'validated', 'rejected', 'archived'];
const authors = ['Alice Martin', 'Bob Johnson', 'Claire Dupont', 'David Chen', 'Emma Wilson'];
const types = ['Document', 'Contrat', 'Facture', 'Rapport', 'Demande'];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateTransitions(createdAt: Date, currentState: EntityState): Entity['transitions'] {
  const transitions: Entity['transitions'] = [];
  const stateOrder: EntityState[] = ['draft', 'submitted'];
  
  if (currentState === 'validated') stateOrder.push('validated');
  else if (currentState === 'rejected') stateOrder.push('rejected');
  else if (currentState === 'archived') stateOrder.push('validated', 'archived');
  
  let lastDate = createdAt;
  for (let i = 1; i < stateOrder.length; i++) {
    const newDate = randomDate(lastDate, new Date());
    transitions.push({
      id: `trans-${i}`,
      fromState: stateOrder[i - 1],
      toState: stateOrder[i],
      timestamp: newDate,
      author: authors[Math.floor(Math.random() * authors.length)],
      reason: i === stateOrder.length - 1 && stateOrder[i] === 'rejected' 
        ? 'Documents incomplets' 
        : undefined,
    });
    lastDate = newDate;
  }
  
  return transitions;
}

function generateVersions(createdAt: Date, numVersions: number): Entity['versions'] {
  const versions: Entity['versions'] = [];
  let lastDate = createdAt;
  
  for (let i = 1; i <= numVersions; i++) {
    const newDate = randomDate(lastDate, new Date());
    versions.push({
      id: `ver-${i}`,
      version: i,
      content: `Version ${i} du document avec les modifications apportées.`,
      createdAt: newDate,
      author: authors[Math.floor(Math.random() * authors.length)],
    });
    lastDate = newDate;
  }
  
  return versions;
}

export const mockEntities: Entity[] = Array.from({ length: 12 }, (_, i) => {
  const createdAt = randomDate(new Date('2024-01-01'), new Date('2024-10-01'));
  const currentState = states[Math.floor(Math.random() * states.length)];
  const numVersions = Math.floor(Math.random() * 5) + 1;
  
  return {
    id: `entity-${i + 1}`,
    name: `${types[i % types.length]} ${1000 + i}`,
    type: types[i % types.length],
    currentState,
    createdAt,
    updatedAt: randomDate(createdAt, new Date()),
    versions: generateVersions(createdAt, numVersions),
    transitions: generateTransitions(createdAt, currentState),
  };
});

export const mockStats: EntityStats = {
  totalEntities: mockEntities.length,
  byState: {
    draft: mockEntities.filter(e => e.currentState === 'draft').length,
    submitted: mockEntities.filter(e => e.currentState === 'submitted').length,
    validated: mockEntities.filter(e => e.currentState === 'validated').length,
    rejected: mockEntities.filter(e => e.currentState === 'rejected').length,
    archived: mockEntities.filter(e => e.currentState === 'archived').length,
  },
  averageTimeInState: {
    draft: 2.5,
    submitted: 1.8,
    validated: 0,
    rejected: 0,
    archived: 0,
  },
  revisionRate: 2.3,
  successRate: 78,
};

export const stateLabels: Record<EntityState, string> = {
  draft: 'Brouillon',
  submitted: 'Soumis',
  validated: 'Validé',
  rejected: 'Rejeté',
  archived: 'Archivé',
};

export const monthlyStats = [
  { month: 'Jan', created: 15, validated: 12, rejected: 3 },
  { month: 'Fév', created: 22, validated: 18, rejected: 4 },
  { month: 'Mar', created: 18, validated: 15, rejected: 2 },
  { month: 'Avr', created: 25, validated: 20, rejected: 5 },
  { month: 'Mai', created: 30, validated: 24, rejected: 4 },
  { month: 'Juin', created: 28, validated: 22, rejected: 6 },
  { month: 'Juil', created: 20, validated: 17, rejected: 2 },
  { month: 'Août', created: 15, validated: 13, rejected: 1 },
  { month: 'Sep', created: 32, validated: 26, rejected: 4 },
  { month: 'Oct', created: 35, validated: 28, rejected: 5 },
  { month: 'Nov', created: 28, validated: 23, rejected: 3 },
  { month: 'Déc', created: 22, validated: 18, rejected: 2 },
];

export const timeInStateData = [
  { state: 'Brouillon', avgDays: 2.5 },
  { state: 'Soumis', avgDays: 1.8 },
  { state: 'En révision', avgDays: 3.2 },
  { state: 'Validé', avgDays: 0 },
  { state: 'Rejeté', avgDays: 0 },
];
