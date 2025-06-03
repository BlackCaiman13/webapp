
export interface FournisseurDTO {
    id?: number;
    nomFournisseur: string;
    codeFournisseur: string;
    etatId: number;
    materielsIds?: number[];
    livraisonsIds?: number[];
    dateCreated?: string;
    lastUpdated?: string;
}

export interface CreateFournisseurDTO extends Omit<FournisseurDTO, 'id' | 'dateCreated' | 'lastUpdated' | 'materielsIds' | 'livraisonsIds'> {}
export interface UpdateFournisseurDTO extends Partial<CreateFournisseurDTO> {}
