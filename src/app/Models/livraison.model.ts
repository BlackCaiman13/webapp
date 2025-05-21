export interface Livraison {
    id?: number;
    date: string;
    fournisseur: number;
    materiels?: number[];
    dateCreated?: string;
    lastUpdated?: string;
}