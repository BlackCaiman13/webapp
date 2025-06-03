export interface CreateMaterielDTO {
    nature: string;
    model: string;
    constructeurId: number;
    fournisseurId: number;
    typeId: number;
    statusId: number;
}

export interface CreateLivraisonDTO {
    date: Date;
    fournisseurId: number;
    materiels: CreateMaterielDTO[];
}

export interface LivraisonDTO {
    id?: number;
    dateHeure: string;

}