import { api } from './api';
import { EntityState, Entity } from '@/types/entity';

// Types for API
export interface EntityApiData {
    id: number;
    name: string;
    type: string;
    content: string;
    author: string;
    current_state: EntityState;
    created_at: string;
    updated_at: string;
    versions: EntityVersion[];
    transitions: EntityTransition[];
}

export interface EntityVersion {
    id: number;
    version_number: number;
    content: string;
    created_at: string;
    created_by: string;
}

export interface EntityTransition {
    id: number;
    from_state: EntityState;
    to_state: EntityState;
    performed_by: string;
    performed_at: string;
    comment?: string;
}

export interface CreateEntityData {
    name: string;
    type: string;
    content: string;
}

export interface UpdateEntityData {
    name?: string;
    type?: string;
    content?: string;
}

export interface TransitionData {
    action: 'submit' | 'validate' | 'reject' | 'archive';
    comment?: string;
}

// Convert API response to frontend Entity format
const mapApiToEntity = (data: EntityApiData): Entity => ({
    id: String(data.id),
    name: data.name,
    type: data.type,
    content: data.content,
    author: data.author,
    currentState: data.current_state,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    versions: data.versions.map(v => ({
        id: String(v.id),
        versionNumber: v.version_number,
        content: v.content,
        createdAt: new Date(v.created_at),
        createdBy: v.created_by,
    })),
    stateTransitions: data.transitions.map(t => ({
        id: String(t.id),
        fromState: t.from_state,
        toState: t.to_state,
        performedBy: t.performed_by,
        performedAt: new Date(t.performed_at),
        comment: t.comment,
    })),
});

// Entities API Service
export const entitiesApi = {
    // Get all entities
    getAll: async (): Promise<Entity[]> => {
        const response = await api.get<EntityApiData[]>('/entities/');
        return response.map(mapApiToEntity);
    },

    // Get single entity
    getById: async (id: string): Promise<Entity> => {
        const response = await api.get<EntityApiData>(`/entities/${id}/`);
        return mapApiToEntity(response);
    },

    // Create entity
    create: async (data: CreateEntityData): Promise<Entity> => {
        const response = await api.post<EntityApiData>('/entities/', data);
        return mapApiToEntity(response);
    },

    // Update entity
    update: async (id: string, data: UpdateEntityData): Promise<Entity> => {
        const response = await api.put<EntityApiData>(`/entities/${id}/`, data);
        return mapApiToEntity(response);
    },

    // Delete entity
    delete: async (id: string): Promise<void> => {
        await api.delete(`/entities/${id}/`);
    },

    // Transition entity state
    transition: async (id: string, data: TransitionData): Promise<Entity> => {
        const response = await api.post<EntityApiData>(`/entities/${id}/transition/`, data);
        return mapApiToEntity(response);
    },

    // Get entity versions
    getVersions: async (id: string): Promise<EntityVersion[]> => {
        return api.get<EntityVersion[]>(`/entities/${id}/versions/`);
    },

    // Get entity transitions
    getTransitions: async (id: string): Promise<EntityTransition[]> => {
        return api.get<EntityTransition[]>(`/entities/${id}/transitions/`);
    },
};
