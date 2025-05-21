export interface Fournisseur {
    id?: number;
    nomFournisseur: string;
    codeFournisseur: string;
    materiels?: number[];
    etat: number;
    livraisons?: number[];
    dateCreated?: string;
    lastUpdated?: string;
}