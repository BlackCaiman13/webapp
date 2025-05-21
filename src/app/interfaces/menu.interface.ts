export interface MenuItem {
    label: string;
    icon?: string;
    routerLink?: string[];
    url?: string;
    items?: MenuItem[];
    visible?: boolean;
    disabled?: boolean;
    class?: string;
    target?: string;
    command?: (event: { originalEvent: Event; item: MenuItem }) => void;
    badge?: string;
    badgeClass?: string;
}