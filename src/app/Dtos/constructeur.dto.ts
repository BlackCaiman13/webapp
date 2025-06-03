
// src/app/dtos/constructeur.dto.ts
export interface ConstructeurDTO {
    id?: number;
    nomConstructeur: string;
    codeConstructeur: string;
    etatId: number;
    materielsIds?: number[];
    dateCreated?: string;
    lastUpdated?: string;
}

export interface CreateConstructeurDTO extends Omit<ConstructeurDTO, 'id' | 'dateCreated' | 'lastUpdated' | 'materielsIds'> {}
export interface UpdateConstructeurDTO extends Partial<CreateConstructeurDTO> {}