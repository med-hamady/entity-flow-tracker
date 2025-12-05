import { useState, useEffect, useCallback } from 'react';
import { Entity, EntityState } from '@/types/entity';
import { mockEntities } from '@/data/mockData';

const STORAGE_KEY = 'entity-flow-tracker-entities';

function loadEntities(): Entity[] {
  if (typeof window === 'undefined') return mockEntities;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((e: Entity) => ({
        ...e,
        createdAt: new Date(e.createdAt),
        updatedAt: new Date(e.updatedAt),
        versions: e.versions.map(v => ({ ...v, createdAt: new Date(v.createdAt) })),
        transitions: e.transitions.map(t => ({ ...t, timestamp: new Date(t.timestamp) })),
      }));
    } catch {
      return mockEntities;
    }
  }
  // Initialize with mock data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEntities));
  return mockEntities;
}

function saveEntities(entities: Entity[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entities));
}

export function useEntityStore() {
  const [entities, setEntities] = useState<Entity[]>(() => loadEntities());

  useEffect(() => {
    saveEntities(entities);
  }, [entities]);

  const addEntity = useCallback((data: {
    name: string;
    type: string;
    content: string;
    author: string;
  }) => {
    const now = new Date();
    const newEntity: Entity = {
      id: `entity-${Date.now()}`,
      name: data.name,
      type: data.type,
      currentState: 'draft',
      createdAt: now,
      updatedAt: now,
      versions: [
        {
          id: `ver-1`,
          version: 1,
          content: data.content,
          createdAt: now,
          author: data.author,
        },
      ],
      transitions: [],
    };
    setEntities(prev => [newEntity, ...prev]);
    return newEntity;
  }, []);

  const updateEntityState = useCallback((
    entityId: string,
    newState: EntityState,
    author: string,
    reason?: string
  ) => {
    setEntities(prev => prev.map(entity => {
      if (entity.id !== entityId) return entity;

      const transition = {
        id: `trans-${Date.now()}`,
        fromState: entity.currentState,
        toState: newState,
        timestamp: new Date(),
        author,
        reason,
      };

      return {
        ...entity,
        currentState: newState,
        updatedAt: new Date(),
        transitions: [...entity.transitions, transition],
      };
    }));
  }, []);

  const deleteEntity = useCallback((entityId: string) => {
    setEntities(prev => prev.filter(e => e.id !== entityId));
  }, []);

  const getEntity = useCallback((entityId: string) => {
    return entities.find(e => e.id === entityId);
  }, [entities]);

  const updateEntity = useCallback((
    entityId: string,
    updates: { name?: string; type?: string }
  ) => {
    setEntities(prev => prev.map(entity => {
      if (entity.id !== entityId) return entity;
      return {
        ...entity,
        ...updates,
        updatedAt: new Date(),
      };
    }));
  }, []);

  return {
    entities,
    addEntity,
    updateEntityState,
    updateEntity,
    deleteEntity,
    getEntity,
  };
}
