export interface Constructeur {
    id?: number;
    nomConstructeur: string;
    codeConstructeur: string;
    materiels?: number[];
    etat: number;
    dateCreated?: string;
    lastUpdated?: string;
}