export interface Materiel {
    id?: number;
    nature: string;
    model: string;
    constructeur: number;
    fournisseur: number;
    type: number;
    status: number;
    employes?: number[];
    livraisons?: number[];
    dateCreated?: string;
    lastUpdated?: string;
}