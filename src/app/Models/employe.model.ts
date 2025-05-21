export interface Employe {
    id?: number;
    nomEmploye: string;
    prenomEmploye: string;
    etat: number;
    materiels?: number[];
    dateCreated?: string;
    lastUpdated?: string;
}