
export interface MaterielDTO {
    id?: number;
    nature: string;
    model: string;
    constructeur: number;
    fournisseur: number;
    type: number; 
    status: number;
    employe: number;
    livraison: number;
}

export interface CreateMaterielDTO extends Omit<MaterielDTO, 'id' | 'dateCreated' | 'lastUpdated'> {}
export interface UpdateMaterielDTO extends Partial<CreateMaterielDTO> {}

