import { MaterielDTO } from '../Dtos/materiel.dto';

export interface DashboardData {
    totalMaterielsEnPanne: number;
    totalMaterielsNeufs: number;
    totalMaterielsEnService: number;
    evolutionParMois: EvolutionMensuelle[];
    repartitionParStatus: { [key: string]: number };
    dernieresActivites: MaterielDTO[];
    statsFournisseurs: FournisseurStat[];
}

export interface EvolutionMensuelle {
    mois: string;
    neuf: number;
    enService: number;
    enPanne: number;
}

export interface FournisseurStat {
    id: number;
    nomFournisseur: string;
    codeFournisseur: string;
    totalMateriels: number;
    tauxPanne: number;
    repartitionStatus: { [key: string]: number };
    evolutionLivraisons: { [key: string]: number };
}
